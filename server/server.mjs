// Dependency-free (at the HTTP layer) Node server implementing the routes
// documented in docs/api-contract.md (outer repo, issue #26/#46). See
// README.md for the transitional state this server is in re: content
// sourcing, and issue #29 for the porting task this file was written for.
//
// No auth: progress is a single user's state, held in memory for this
// process's lifetime (see README.md — this is carried over from the
// prototype's documented scope, not a new design decision).
import http from "node:http";
import { URL } from "node:url";
import {
  LEARNING_LANGUAGES,
  UI_LANGUAGES,
  SETTINGS_BY_LANGUAGE,
  UI_STRINGS_BY_LANGUAGE,
} from "./stub-data.mjs";
import { loadContentModule } from "./build-content.mjs";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

const LEARNING_LANGUAGE_CODES = new Set(LEARNING_LANGUAGES.map((l) => l.code));
const UI_LANGUAGE_CODES = new Set(UI_LANGUAGES.map((l) => l.code));

// In-memory single-user progress store. Not persisted across restarts —
// acceptable per the contract's "no authentication in this contract's
// scope" note; a real datastore is out of scope for this porting task.
let progress = null;

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

async function handleContent(url, res) {
  const lang = requireLangParam(url, res, LEARNING_LANGUAGE_CODES, "learning language");
  if (!lang) return;

  if (lang === "sranantongo") {
    // Stub learning language: route resolves, bundle is empty (see contract's
    // "status": "stub" note on GET /languages).
    sendJson(res, 200, { units: [], vocab: [] });
    return;
  }

  const { contentBundle } = await loadContentModule();
  sendJson(res, 200, contentBundle);
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

async function getOrInitProgress() {
  if (!progress) {
    const { createInitialProgress } = await loadContentModule();
    progress = createInitialProgress();
  }
  return progress;
}

async function handleGetProgress(res) {
  sendJson(res, 200, await getOrInitProgress());
}

async function handlePutProgress(req, res) {
  const body = await readJsonBody(req);
  progress = body;
  sendNoContent(res);
}

/** Finds a lesson's xpReward across all units in the real content bundle, if any. */
function findLessonXpReward(contentBundle, lessonId) {
  for (const unit of contentBundle.units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson.xpReward;
  }
  return undefined;
}

async function handleLessonCompletion(req, res) {
  const result = await readJsonBody(req);
  const current = await getOrInitProgress();
  const { contentBundle, computeXpReward, updateStreak, todayDateString, createLeitnerCard, evaluateBadges } =
    await loadContentModule();

  if (!result.passed) {
    sendJson(res, 200, current);
    return;
  }

  const today = todayDateString();
  const baseXp = findLessonXpReward(contentBundle, result.lessonId) ?? 10;
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
  sendJson(res, 200, next);
}

async function handleReviewResult(req, res) {
  const { vocabId, correct } = await readJsonBody(req);
  const current = await getOrInitProgress();
  const { todayDateString, createLeitnerCard, reviewLeitnerCard, evaluateBadges } = await loadContentModule();

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
  sendJson(res, 200, next);
}

const server = http.createServer(async (req, res) => {
  try {
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
      await handleContent(url, res);
    } else if (req.method === "GET" && url.pathname === "/settings") {
      handleSettings(url, res);
    } else if (req.method === "GET" && url.pathname === "/ui-strings") {
      handleUiStrings(url, res);
    } else if (req.method === "GET" && url.pathname === "/progress") {
      await handleGetProgress(res);
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

server.listen(PORT, () => {
  console.log(`Sarnami Bol Naa backend listening on http://localhost:${PORT}`);
});
