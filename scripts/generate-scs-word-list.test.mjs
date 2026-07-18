import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import { tokenizeWord, buildWordList, readVocabEntries, generate } from "./generate-scs-word-list.mjs";

// --- tokenizeWord ----------------------------------------------------------

test("tokenizeWord splits multi-word phrases and lowercases", () => {
  assert.deepEqual(tokenizeWord("Kaise hai?"), ["kaise", "hai"]);
});

test("tokenizeWord strips surrounding punctuation but keeps diacritics", () => {
  assert.deepEqual(tokenizeWord("Rām Rām"), ["rām", "rām"]);
});

test("tokenizeWord drops tokens that are pure punctuation", () => {
  assert.deepEqual(tokenizeWord("hai - hai"), ["hai", "hai"]);
});

test("tokenizeWord returns empty array for an empty/whitespace-only word", () => {
  assert.deepEqual(tokenizeWord("   "), []);
});

// --- buildWordList -----------------------------------------------------

test("buildWordList maps a single unambiguous word to one canonical entry", () => {
  const entries = buildWordList([{ id: "noun-ghar", word: "ghar" }]);
  assert.deepEqual(entries, [
    { scs: "ghar", canonical: ["ghar"], ambiguous: false, sourceIds: ["noun-ghar"] },
  ]);
});

test("buildWordList strips diacritics via the shared toScs mapping", () => {
  const entries = buildWordList([{ id: "adj-thik", word: "ṭhīk" }]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].scs, "thik");
  assert.deepEqual(entries[0].canonical, ["ṭhīk"]);
});

test("buildWordList flags a collision between distinct canonical spellings as ambiguous", () => {
  const entries = buildWordList([
    { id: "verb-mare-hit", word: "mare" },
    { id: "verb-mare-die", word: "māre" },
  ]);
  assert.equal(entries.length, 1);
  const [entry] = entries;
  assert.equal(entry.scs, "mare");
  assert.equal(entry.ambiguous, true);
  assert.deepEqual(entry.canonical, ["mare", "māre"]);
  assert.deepEqual(entry.sourceIds, ["verb-mare-hit", "verb-mare-die"]);
});

test("buildWordList does not flag the same canonical word repeated across entries", () => {
  const entries = buildWordList([
    { id: "greet-a", word: "hai" },
    { id: "greet-b", word: "Kaise hai?" },
  ]);
  const hai = entries.find((e) => e.scs === "hai");
  assert.ok(hai);
  assert.equal(hai.ambiguous, false);
  assert.deepEqual(hai.canonical, ["hai"]);
  // First-seen id is retained, not overwritten by the later duplicate.
  assert.deepEqual(hai.sourceIds, ["greet-a"]);
});

test("buildWordList is case-independent (capitalized and lowercase tokens merge)", () => {
  const entries = buildWordList([
    { id: "a", word: "Rām Rām" },
    { id: "b", word: "rām" },
  ]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].ambiguous, false);
});

// --- readVocabEntries / generate (filesystem fixture) -----------------------

async function withFixtureVocabDir(files, run) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "scs-word-list-test-"));
  try {
    for (const [name, contents] of Object.entries(files)) {
      await writeFile(path.join(dir, name), JSON.stringify(contents), "utf-8");
    }
    return await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("readVocabEntries reads and flattens all *.json files in a vocab dir", async () => {
  await withFixtureVocabDir(
    {
      "a.json": [{ id: "x", word: "ghar", extra: "ignored" }],
      "b.json": [{ id: "y", word: "pānī" }, { id: "z", notWord: true }],
    },
    async (dir) => {
      const entries = readVocabEntries(dir);
      assert.deepEqual(
        entries.sort((a, b) => a.id.localeCompare(b.id)),
        [
          { id: "x", word: "ghar" },
          { id: "y", word: "pānī" },
        ],
      );
    },
  );
});

test("generate() output is sorted by scs spelling and reports accurate stats", async () => {
  await withFixtureVocabDir(
    {
      "vocab.json": [
        { id: "noun-pani", word: "pānī" },
        { id: "noun-ghar", word: "ghar" },
        { id: "verb-mare-hit", word: "mare" },
        { id: "verb-mare-die", word: "māre" },
      ],
    },
    async (dir) => {
      const output = generate(dir);
      assert.equal(output.language, "sarnami");
      assert.equal(output.stats.totalEntries, 3);
      assert.equal(output.stats.ambiguousEntries, 1);
      const spellings = output.entries.map((e) => e.scs);
      assert.deepEqual(spellings, [...spellings].sort());
    },
  );
});
