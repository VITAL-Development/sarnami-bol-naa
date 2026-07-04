// Dependency-free Node server implementing the routes documented in
// docs/api-contract.md (outer repo, issue #26/#46). See README.md for how
// content/settings are sourced (issues #29-#33).
//
// No auth: progress is a single user's state. It's held in memory while the
// process is running (for speed — every route reads/mutates the in-memory
// `progress` object, never disk directly), but every mutation is also
// persisted to a JSON file on disk (see progress-store.mjs, issue #69) so a
// process restart (crash, deploy, host reboot) doesn't silently wipe it —
// this was the one gap left by the prototype's documented no-auth/
// single-user scope (issue #29), not a new design decision otherwise.
import http from "node:http";
import { URL } from "node:url";
import {
  LEARNING_LANGUAGES,
  UI_LANGUAGES,
  SETTINGS_BY_LANGUAGE,
  UI_STRINGS_BY_LANGUAGE,
} from "./stub-data.mjs";
import { getContentBundle, listLearningLanguageCodes } from "./content.mjs";
import {
  createInitialProgress,
  computeXpReward,
  updateStreak,
  todayDateString,
  createLeitnerCard,
  reviewLeitnerCard,
  evaluateBadges,
} from "./gamification.mjs";
import { loadProgress, saveProgress } from "./progress-store.mjs";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

const LEARNING_LANGUAGE_CODES = new Set(LEARNING_LANGUAGES.map((l) => l.code));
const UI_LANGUAGE_CODES = new Set(UI_LANGUAGES.map((l) => l.code));

// In-memory single-user progress store, backed by progress-store.mjs on
// disk. `progress` is `null` until `ensureProgressLoaded()` has resolved
// once (see below); every route that touches progress is only reached after
// the main request handler awaits that.
let progress = null;
let progressReadyPromise = null;

/**
 * Loads persisted progress from disk exactly once per process lifetime (the
 * promise is cached so concurrent/later requests just await the same
 * in-flight or settled load rather than re-reading the file). Falls back to
 * a fresh `createInitialProgress()` if there's no file yet (first run) or it
 * couldn't be read (see progress-store.mjs's `loadProgress`).
 */
function ensureProgressLoaded() {
  if (!progressReadyPromise) {
    progressReadyPromise = loadProgress().then((loaded) => {
      progress = loaded ?? createInitialProgress();
    });
  }
  return progressReadyPromise;
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(payload);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function sendNoContent(res) {
  res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
  res.end();
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return undefined;
  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
}

function requireLangParam(url, res, validCodes, unknownLabel) {
  const lang = url.searchParams.get("lang");
  if (!lang) {
    sendError(res, 400, "Missing required query parameter: lang");
    return null;
  }
  if (!validCodes.has(lang)) {
    sendError(res, 404, `Unknown ${unknownLabel}: ${lang}`);
    return null;
  }
  return lang;
}

function handleContent(url, res) {
  const lang = requireLangParam(url, res, LEARNING_LANGUAGE_CODES, "learning language");
  if (!lang) return;

  // getContentBundle always resolves here since `lang` was just validated
  // against the same server/content/ directory listing it reads from — a
  // stub learning language (no units/ or lessons/ authored yet) still gets
  // a real bundle back, just with empty units/lessonContent (see contract's
  // "status": "stub" note on GET /languages). Every currently-registered
  // learning language has real content (sranantongo since issue #37), but
  // this path stays generic for whatever's added next.
  sendJson(res, 200, getContentBundle(lang));
}

function handleSettings(url, res) {
  const lang = requireLangParam(url, res, LEARNING_LANGUAGE_CODES, "learning language");
  if (!lang) return;
  sendJson(res, 200, SETTINGS_BY_LANGUAGE[lang]);
}

function handleUiStrings(url, res) {
  const lang = requireLangParam(url, res, UI_LANGUAGE_CODES, "UI language");
  if (!lang) return;
  sendJson(res, 200, UI_STRINGS_BY_LANGUAGE[lang]);
}

function handleLanguages(res) {
  sendJson(res, 200, {
    learningLanguages: LEARNING_LANGUAGES,
    uiLanguages: UI_LANGUAGES,
  });
}

function getOrInitProgress() {
  if (!progress) {
    progress = createInitialProgress();
  }
  return progress;
}

function handleGetProgress(res) {
  sendJson(res, 200, getOrInitProgress());
}

async function handlePutProgress(req, res) {
  const body = await readJsonBody(req);
  progress = body;
  await saveProgress(progress);
  sendNoContent(res);
}

/**
 * Finds a lesson's xpReward by id across every learning language's content
 * bundle. Progress isn't lang-scoped (see api-contract.md's "Progress
 * routes" section) and `LessonResult` carries no learning-language code, so
 * this can't just resolve against a single hardcoded bundle now that more
 * than one learning language has real lesson structure (issue #37 added
 * Sranantongo's) — lesson ids are expected to be unique across languages.
 */
function findLessonXpReward(lessonId) {
  for (const langCode of listLearningLanguageCodes()) {
    const contentBundle = getContentBundle(langCode);
    for (const unit of contentBundle.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson.xpReward;
    }
  }
  return undefined;
}

async function handleLessonCompletion(req, res) {
  const result = await readJsonBody(req);
  const current = getOrInitProgress();

  if (!result.passed) {
    sendJson(res, 200, current);
    return;
  }

  const today = todayDateString();
  const baseXp = findLessonXpReward(result.lessonId) ?? 10;
  const xpEarned = computeXpReward(baseXp, result.mistakeCount);

  const leitnerBoxes = { ...current.leitnerBoxes };
  for (const vocabId of result.vocabIntroduced ?? []) {
    if (!leitnerBoxes[vocabId]) {
      leitnerBoxes[vocabId] = createLeitnerCard(today);
    }
  }

  const next = {
    ...current,
    xp: current.xp + xpEarned,
    streak: updateStreak(current.streak, today),
    completedLessons: {
      ...current.completedLessons,
      [result.lessonId]: {
        stars: result.mistakeCount === 0 ? 3 : result.mistakeCount <= 2 ? 2 : 1,
        completedAt: today,
      },
    },
    leitnerBoxes,
  };
  next.earnedBadges = evaluateBadges(next);
  progress = next;
  await saveProgress(progress);
  sendJson(res, 200, next);
}

async function handleReviewResult(req, res) {
  const { vocabId, correct } = await readJsonBody(req);
  const current = getOrInitProgress();

  const today = todayDateString();
  const existing = current.leitnerBoxes[vocabId] ?? createLeitnerCard(today);
  const next = {
    ...current,
    leitnerBoxes: {
      ...current.leitnerBoxes,
      [vocabId]: reviewLeitnerCard(existing, correct, today),
    },
  };
  next.earnedBadges = evaluateBadges(next);
  progress = next;
  await saveProgress(progress);
  sendJson(res, 200, next);
}

const server = http.createServer(async (req, res) => {
  try {
    await ensureProgressLoaded();

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/languages") {
      handleLanguages(res);
    } else if (req.method === "GET" && url.pathname === "/content") {
      handleContent(url, res);
    } else if (req.method === "GET" && url.pathname === "/settings") {
      handleSettings(url, res);
    } else if (req.method === "GET" && url.pathname === "/ui-strings") {
      handleUiStrings(url, res);
    } else if (req.method === "GET" && url.pathname === "/progress") {
      handleGetProgress(res);
    } else if (req.method === "PUT" && url.pathname === "/progress") {
      await handlePutProgress(req, res);
    } else if (req.method === "POST" && url.pathname === "/progress/lesson-completion") {
      await handleLessonCompletion(req, res);
    } else if (req.method === "POST" && url.pathname === "/progress/review-result") {
      await handleReviewResult(req, res);
    } else {
      sendError(res, 404, "Not found");
    }
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Internal server error");
  }
});

// Only auto-listen when run directly (`node server.mjs` / `npm start`), not
// when imported by the test suite (`server.test.mjs`), which starts its own
// listener on an ephemeral port per test file.
if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`Sarnami Bol Naa backend listening on http://localhost:${PORT}`);
  });
}

export { server };
