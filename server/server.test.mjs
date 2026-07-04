// Basic happy-path/404 coverage for the four language-scoped read routes
// (issue #33). Uses Node's built-in test runner (`node --test`, no
// dependency added) against a real `http.Server` instance bound to an
// ephemeral port, so requests exercise the actual routing/CORS/error-shape
// code in server.mjs, not a mocked handler.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { server } from "./server.mjs";
import { loadProgress, saveProgress } from "./progress-store.mjs";

let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function get(path) {
  const res = await fetch(`${baseUrl}${path}`);
  const body = await res.json();
  return { status: res.status, body };
}

test("GET /languages returns learning and UI language lists", async () => {
  const { status, body } = await get("/languages");
  assert.equal(status, 200);
  assert.ok(Array.isArray(body.learningLanguages));
  assert.ok(Array.isArray(body.uiLanguages));

  const sarnami = body.learningLanguages.find((l) => l.code === "sarnami");
  assert.deepStrictEqual(sarnami, { code: "sarnami", displayName: "Sarnami Hindoestani", status: "available" });

  // Sranantongo gained real unit/lesson structure in issue #37 (the
  // language-split architecture's end-to-end smoke test), so it now reports
  // "available" just like sarnami, rather than "stub".
  const sranantongo = body.learningLanguages.find((l) => l.code === "sranantongo");
  assert.deepStrictEqual(sranantongo, { code: "sranantongo", displayName: "Sranan Tongo", status: "available" });

  const nl = body.uiLanguages.find((l) => l.code === "nl");
  assert.deepStrictEqual(nl, { code: "nl", displayName: "Nederlands" });
});

test("GET /content?lang=sarnami returns the real content bundle", async () => {
  const { status, body } = await get("/content?lang=sarnami");
  assert.equal(status, 200);
  assert.ok(body.units.length > 0, "expected non-empty units");
  assert.ok(body.vocab.length > 0, "expected non-empty vocab");
  assert.ok(Object.keys(body.lessonContent.exerciseContent).length > 0, "expected exercise content");

  const unit = body.units.find((u) => u.id === "unit-01-basics");
  assert.ok(unit, "unit-01-basics should be present");
  const lesson = unit.lessons.find((l) => l.id === "lesson-1-greetings");
  assert.ok(lesson, "lesson-1-greetings should be present");

  const vocabItem = body.vocab.find((v) => v.id === "vocab-ram-ram" || v.id === "greet-ram-ram");
  assert.ok(vocabItem, "a Rām Rām vocab entry should be present");
});

test("GET /content?lang=sranantongo returns a real bundle (issue #37)", async () => {
  const { status, body } = await get("/content?lang=sranantongo");
  assert.equal(status, 200);
  assert.ok(body.units.length > 0, "expected non-empty units");
  assert.ok(body.vocab.length > 0, "expected non-empty vocab");
  assert.ok(Object.keys(body.lessonContent.exerciseContent).length > 0, "expected exercise content");

  const unit = body.units.find((u) => u.id === "unit-01-srn-greetings");
  assert.ok(unit, "unit-01-srn-greetings should be present");
  const lesson = unit.lessons.find((l) => l.id === "lesson-1-srn-greetings");
  assert.ok(lesson, "lesson-1-srn-greetings should be present");

  const vocabItem = body.vocab.find((v) => v.id === "srn-greet-odi");
  assert.ok(vocabItem, "the Odi vocab entry should be present");
});

test("GET /content?lang=bogus returns 404", async () => {
  const { status, body } = await get("/content?lang=bogus");
  assert.equal(status, 404);
  assert.match(body.error, /Unknown learning language/);
});

test("GET /content with no lang returns 400", async () => {
  const { status, body } = await get("/content");
  assert.equal(status, 400);
  assert.match(body.error, /Missing required query parameter/);
});

test("GET /settings?lang=sarnami returns real settings", async () => {
  const { status, body } = await get("/settings?lang=sarnami");
  assert.equal(status, 200);
  assert.equal(body.code, "sarnami");
  assert.equal(body.scriptDirection, "ltr");
  assert.ok(body.romanization.diacritics.length > 0);
});

test("GET /settings?lang=sranantongo returns real settings with no diacritics", async () => {
  const { status, body } = await get("/settings?lang=sranantongo");
  assert.equal(status, 200);
  assert.equal(body.code, "sranantongo");
  // Sranan Tongo genuinely has no macron/underdot diacritics (plain
  // Dutch-derived Latin orthography) — an empty list here is a confirmed
  // fact about the language, not a stub awaiting authoring (issue #37).
  assert.deepStrictEqual(body.romanization.diacritics, []);
});

test("GET /settings?lang=bogus returns 404", async () => {
  const { status, body } = await get("/settings?lang=bogus");
  assert.equal(status, 404);
  assert.match(body.error, /Unknown learning language/);
});

test("GET /ui-strings?lang=nl returns the Dutch string table", async () => {
  const { status, body } = await get("/ui-strings?lang=nl");
  assert.equal(status, 200);
  assert.equal(body.appName, "Sarnami Bol Naa");
  assert.ok(body.nav && body.path && body.lesson && body.review && body.profile);
});

test("GET /ui-strings?lang=en returns the English string table with matching keys", async () => {
  const [{ body: nl }, { body: en }] = await Promise.all([get("/ui-strings?lang=nl"), get("/ui-strings?lang=en")]);
  assert.deepStrictEqual(Object.keys(en).sort(), Object.keys(nl).sort());
  for (const section of ["nav", "path", "lesson", "review", "profile"]) {
    assert.deepStrictEqual(Object.keys(en[section]).sort(), Object.keys(nl[section]).sort());
  }
});

test("GET /ui-strings?lang=bogus returns 404", async () => {
  const { status, body } = await get("/ui-strings?lang=bogus");
  assert.equal(status, 404);
  assert.match(body.error, /Unknown UI language/);
});

test("GET /unknown-route returns 404", async () => {
  const { status, body } = await get("/unknown-route");
  assert.equal(status, 404);
  assert.deepStrictEqual(body, { error: "Not found" });
});

async function put(path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status };
}

// Progress persistence (issue #69) — server.mjs's HTTP routes actually write
// through to progress-store.mjs's default on-disk location (server/data/
// progress.json) on every mutation, so this exercises that end-to-end,
// cleaning up the written file/directory afterwards so `npm test` doesn't
// leave runtime state behind in a dev checkout.
test("PUT /progress persists to the on-disk progress store", async () => {
  const sampleProgress = {
    xp: 42,
    streak: { count: 3, lastCompletedDate: "2026-07-01" },
    hearts: { current: 4, max: 5 },
    completedLessons: { "lesson-1-greetings": { stars: 3, completedAt: "2026-07-01" } },
    leitnerBoxes: {},
    earnedBadges: [],
  };

  const { status } = await put("/progress", sampleProgress);
  assert.equal(status, 204);

  const { status: getStatus, body: getBody } = await get("/progress");
  assert.equal(getStatus, 200);
  assert.deepStrictEqual(getBody, sampleProgress);

  // Read the file directly (not through the HTTP layer) to confirm the
  // mutation was actually written to disk, not just held in memory.
  const onDisk = await loadProgress();
  assert.deepStrictEqual(onDisk, sampleProgress);
});

// progress-store.mjs in isolation, using a scratch directory rather than the
// server's real default path — this is the "simulated restart" the issue
// asks for: save, then load again as a fresh call (standing in for a new
// process starting up and reading the same file) and confirm the data is
// still there.
test("progress-store: progress survives a simulated restart", async () => {
  const scratchDir = await mkdtemp(join(tmpdir(), "sarnami-progress-test-"));
  const filePath = join(scratchDir, "progress.json");
  try {
    // No file yet: loadProgress should signal "nothing to load" rather than
    // throwing, so the caller can fall back to createInitialProgress().
    assert.equal(await loadProgress(filePath), undefined);

    const savedProgress = {
      xp: 100,
      streak: { count: 5, lastCompletedDate: "2026-07-04" },
      hearts: { current: 5, max: 5 },
      completedLessons: {},
      leitnerBoxes: { "vocab-ram-ram": { box: 2, dueDate: "2026-07-10" } },
      earnedBadges: ["first-lesson"],
    };
    await saveProgress(savedProgress, filePath);

    // "Restart": load again from the same path, as a fresh process would.
    const reloaded = await loadProgress(filePath);
    assert.deepStrictEqual(reloaded, savedProgress);
  } finally {
    await rm(scratchDir, { recursive: true, force: true });
  }
});

test("progress-store: creates the containing directory if missing", async () => {
  const scratchDir = await mkdtemp(join(tmpdir(), "sarnami-progress-test-"));
  const nestedFilePath = join(scratchDir, "nested", "does", "not", "exist", "progress.json");
  try {
    await saveProgress({ xp: 1 }, nestedFilePath);
    const contents = await readFile(nestedFilePath, "utf-8");
    assert.deepStrictEqual(JSON.parse(contents), { xp: 1 });
  } finally {
    await rm(scratchDir, { recursive: true, force: true });
  }
});

after(async () => {
  // Clean up the real on-disk progress file/directory written by the
  // "PUT /progress persists" test above, so a local `npm test` run doesn't
  // leave stray runtime state in the checkout (it's gitignored, but tidy is
  // still nicer than not).
  await rm(new URL("./data", import.meta.url), { recursive: true, force: true });
});
