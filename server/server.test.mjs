// Basic happy-path/404 coverage for the four language-scoped read routes
// (issue #33). Uses Node's built-in test runner (`node --test`, no
// dependency added) against a real `http.Server` instance bound to an
// ephemeral port, so requests exercise the actual routing/CORS/error-shape
// code in server.mjs, not a mocked handler.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { server } from "./server.mjs";

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
