import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { parseArgs, parseDraft, toExampleSentence, validateCandidate } from "./extract-verified-sentences.mjs";

const execFileAsync = promisify(execFile);
const SCRIPT_PATH = fileURLToPath(new URL("./extract-verified-sentences.mjs", import.meta.url));

// --- parseArgs ---------------------------------------------------------

test("parseArgs requires --unit", () => {
  assert.throws(() => parseArgs([]), /Usage:/);
});

test("parseArgs reads --unit and --dry-run", () => {
  assert.deepEqual(parseArgs(["--unit", "unit-08-verbs", "--dry-run"]), {
    unit: "unit-08-verbs",
    dryRun: true,
  });
});

test("parseArgs rejects unknown flags", () => {
  assert.throws(() => parseArgs(["--bogus"]), /Unrecognized argument/);
});

// --- parseDraft ----------------------------------------------------------

const SAMPLE_DRAFT = `# unit-08-verbs — candidates

## lesson: unit-08-verbs-present  (grammar point: present tense, §9.7.1)

- [x] id: ex-pres-4
      sarnami: Ham ghoṛā dekhilā.
      nl: Ik zie een paard.
      vocabRefs: verb-dekhe, noun-ghora
      rule: 1sg present -ilā ending
      verify: PASS — matches §9.7.1 table row for ham

- [ ] id: ex-pres-5
      sarnami: Ū sac bole hai.
      nl: Hij spreekt de waarheid.
      vocabRefs: verb-bole
      rule: 3sg present
      verify: FAIL — "sac" is not sourced from vocab

## lesson: unit-08-verbs-past  (grammar point: past tense, §9.7.2)

- [x] id: ex-past-4
      sarnami: Tū ghar dekhle.
      nl: Je zag een huis.
      vocabRefs: verb-dekhe, noun-ghar
      rule: 2sg past -le ending
      verify: PASS — matches §9.7.2
`;

test("parseDraft extracts candidates grouped by lesson heading", () => {
  const candidates = parseDraft(SAMPLE_DRAFT);
  assert.equal(candidates.length, 3);
  assert.equal(candidates[0].lessonId, "unit-08-verbs-present");
  assert.equal(candidates[0].checked, true);
  assert.equal(candidates[0].fields.id, "ex-pres-4");
  assert.equal(candidates[0].fields.sarnami, "Ham ghoṛā dekhilā.");
  assert.equal(candidates[0].fields.nl, "Ik zie een paard.");
  assert.equal(candidates[0].fields.vocabrefs, "verb-dekhe, noun-ghora");
  assert.match(candidates[0].fields.verify, /^PASS/);

  assert.equal(candidates[1].checked, false);
  assert.match(candidates[1].fields.verify, /^FAIL/);

  assert.equal(candidates[2].lessonId, "unit-08-verbs-past");
  assert.equal(candidates[2].fields.id, "ex-past-4");
});

test("parseDraft joins wrapped continuation lines onto the last field", () => {
  const candidates = parseDraft(SAMPLE_DRAFT);
  // the FAIL reason line is a single logical line in the fixture, but this checks that a
  // multi-line verify reason (as /verify-sentences would write) is still captured whole.
  const wrapped = `## lesson: x\n\n- [ ] id: ex-x-1\n      sarnami: A.\n      nl: B.\n      verify: FAIL — first part\n        of the reason continues here\n`;
  const [c] = parseDraft(wrapped);
  assert.equal(c.fields.verify, "FAIL — first part of the reason continues here");
});

// --- toExampleSentence / validateCandidate --------------------------------

test("toExampleSentence maps checklist fields to the content JSON shape", () => {
  const result = toExampleSentence({
    id: "ex-pres-4",
    sarnami: "Ham ghoṛā dekhilā.",
    nl: "Ik zie een paard.",
    en: "I see a horse.",
    vocabrefs: "verb-dekhe, noun-ghora",
  });
  assert.deepEqual(result, {
    id: "ex-pres-4",
    word: "Ham ghoṛā dekhilā.",
    translations: { nl: "Ik zie een paard.", en: "I see a horse." },
    vocabRefs: ["verb-dekhe", "noun-ghora"],
  });
});

test("toExampleSentence omits en when not provided and handles no vocabRefs", () => {
  const result = toExampleSentence({ id: "ex-imp-5", sarnami: "Sun!", nl: "Luister!" });
  assert.deepEqual(result, {
    id: "ex-imp-5",
    word: "Sun!",
    translations: { nl: "Luister!" },
    vocabRefs: [],
  });
});

test("validateCandidate rejects a malformed id", () => {
  const errors = validateCandidate(
    { id: "pres-4", sarnami: "X.", nl: "Y." },
    new Set(),
    new Set(),
  );
  assert.ok(errors.some((e) => e.includes('must be present and start with "ex-"')));
});

test("validateCandidate rejects an id that already exists", () => {
  const errors = validateCandidate(
    { id: "ex-pres-1", sarnami: "X.", nl: "Y." },
    new Set(),
    new Set(["ex-pres-1"]),
  );
  assert.ok(errors.some((e) => e.includes("already exists")));
});

test("validateCandidate rejects missing sarnami/nl", () => {
  const errors = validateCandidate({ id: "ex-pres-9" }, new Set(), new Set());
  assert.ok(errors.some((e) => e.includes("missing required field: sarnami")));
  assert.ok(errors.some((e) => e.includes("missing required field: nl")));
});

test("validateCandidate rejects an unknown vocabRefs id", () => {
  const errors = validateCandidate(
    { id: "ex-pres-9", sarnami: "X.", nl: "Y.", vocabrefs: "verb-made-up" },
    new Set(["verb-dekhe"]),
    new Set(),
  );
  assert.ok(errors.some((e) => e.includes('unknown vocab id "verb-made-up"')));
});

test("validateCandidate accepts a well-formed candidate", () => {
  const errors = validateCandidate(
    { id: "ex-pres-9", sarnami: "X.", nl: "Y.", vocabrefs: "verb-dekhe, noun-ghar" },
    new Set(["verb-dekhe", "noun-ghar"]),
    new Set(["ex-pres-1"]),
  );
  assert.deepEqual(errors, []);
});

// --- end-to-end CLI, against a throwaway fixture repo layout --------------

async function makeFixtureRepo() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "extract-verified-sentences-"));
  await mkdir(path.join(dir, "sentence-drafts"), { recursive: true });
  await mkdir(path.join(dir, "content", "sarnami", "vocab"), { recursive: true });
  await mkdir(path.join(dir, "content", "sarnami", "lessons"), { recursive: true });
  await mkdir(path.join(dir, "content", "sarnami", "units"), { recursive: true });

  await writeFile(
    path.join(dir, "content", "sarnami", "vocab", "verbs.json"),
    JSON.stringify([{ id: "verb-dekhe", word: "dekhe", translations: { nl: "kijken" }, tags: ["verb"] }]),
  );
  await writeFile(
    path.join(dir, "content", "sarnami", "vocab", "nouns.json"),
    JSON.stringify([{ id: "noun-ghora", word: "ghoṛā", translations: { nl: "paard" }, tags: ["noun"] }]),
  );
  await writeFile(
    path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"),
    JSON.stringify([
      { lessonId: "unit-test-verbs-present", exampleSentences: [{ id: "ex-pres-1", word: "X.", translations: { nl: "Y." }, vocabRefs: [] }] },
    ]),
  );
  await writeFile(
    path.join(dir, "content", "sarnami", "units", "unit-test-verbs.json"),
    JSON.stringify({
      id: "unit-test-verbs",
      lessons: [{ id: "unit-test-verbs-present", exampleSentenceRefs: ["ex-pres-1"] }],
    }),
  );
  return dir;
}

function runCli(cwd, args) {
  return execFileAsync(process.execPath, [SCRIPT_PATH, ...args], { cwd });
}

test("CLI end-to-end: promotes only checked+PASS rows, skips checked+FAIL and unchecked+PASS", async () => {
  const dir = await makeFixtureRepo();
  try {
    const draft = `## lesson: unit-test-verbs-present  (grammar point: present, §9.7.1)

- [x] id: ex-pres-4
      sarnami: Ham ghoṛā dekhilā.
      nl: Ik zie een paard.
      vocabRefs: verb-dekhe, noun-ghora
      verify: PASS — ok

- [ ] id: ex-pres-5
      sarnami: Ham ghoṛā dekhilā.
      nl: unchecked but PASS
      vocabRefs: verb-dekhe
      verify: PASS — ok

- [x] id: ex-pres-6
      sarnami: Ham ghoṛā dekhilā.
      nl: checked but FAIL
      vocabRefs: verb-dekhe
      verify: FAIL — nope
`;
    await writeFile(path.join(dir, "sentence-drafts", "unit-test-verbs.review.md"), draft);

    await runCli(dir, ["--unit", "unit-test-verbs"]);

    const lessons = JSON.parse(await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8"));
    const ids = lessons[0].exampleSentences.map((e) => e.id);
    assert.deepEqual(ids, ["ex-pres-1", "ex-pres-4"]);

    const unitData = JSON.parse(await readFile(path.join(dir, "content", "sarnami", "units", "unit-test-verbs.json"), "utf-8"));
    assert.deepEqual(unitData.lessons[0].exampleSentenceRefs, ["ex-pres-1", "ex-pres-4"]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("CLI --dry-run does not write files", async () => {
  const dir = await makeFixtureRepo();
  try {
    const draft = `## lesson: unit-test-verbs-present  (grammar point: present, §9.7.1)

- [x] id: ex-pres-4
      sarnami: Ham ghoṛā dekhilā.
      nl: Ik zie een paard.
      vocabRefs: verb-dekhe, noun-ghora
      verify: PASS — ok
`;
    await writeFile(path.join(dir, "sentence-drafts", "unit-test-verbs.review.md"), draft);
    const before = await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8");

    const { stdout } = await runCli(dir, ["--unit", "unit-test-verbs", "--dry-run"]);
    assert.match(stdout, /--dry-run: not writing files/);

    const after = await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8");
    assert.equal(before, after);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("CLI is idempotent: re-running after a real write adds nothing new", async () => {
  const dir = await makeFixtureRepo();
  try {
    const draft = `## lesson: unit-test-verbs-present  (grammar point: present, §9.7.1)

- [x] id: ex-pres-4
      sarnami: Ham ghoṛā dekhilā.
      nl: Ik zie een paard.
      vocabRefs: verb-dekhe, noun-ghora
      verify: PASS — ok
`;
    await writeFile(path.join(dir, "sentence-drafts", "unit-test-verbs.review.md"), draft);
    await runCli(dir, ["--unit", "unit-test-verbs"]);
    const afterFirst = await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8");

    const { stdout } = await runCli(dir, ["--unit", "unit-test-verbs"]);
    assert.match(stdout, /nothing new to promote/);

    const afterSecond = await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8");
    assert.equal(afterFirst, afterSecond);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("CLI rejects an unknown vocabRefs id and writes nothing", async () => {
  const dir = await makeFixtureRepo();
  try {
    const draft = `## lesson: unit-test-verbs-present  (grammar point: present, §9.7.1)

- [x] id: ex-pres-4
      sarnami: Ham ghoṛā dekhilā.
      nl: Ik zie een paard.
      vocabRefs: verb-made-up
      verify: PASS — ok
`;
    await writeFile(path.join(dir, "sentence-drafts", "unit-test-verbs.review.md"), draft);
    const before = await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8");

    await assert.rejects(runCli(dir, ["--unit", "unit-test-verbs"]));

    const after = await readFile(path.join(dir, "content", "sarnami", "lessons", "unit-test-verbs.json"), "utf-8");
    assert.equal(before, after, "a validation failure must not partially write content files");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
