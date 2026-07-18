#!/usr/bin/env node
// Builds settings/sarnami/scs-word-list.json — the SCS-plain-Latin →
// canonical-diacritical word-level dictionary called for by
// sarnami-bol-naa#244 ("Build the SCS → canonical-diacritical word-list
// lookup" / "Source/seed the initial SCS ↔ canonical word list"), the first
// pass of the issue's combined input flow (dictionary lookup, falling back
// to the digraph rule table in settings/sarnami/transliteration-rules.json
// only when a word isn't found here).
//
// Deliberately reuses `toScs` from scs-transliterate.mjs (already the
// authoritative, native-speaker-sourced diacritic → SCS mapping used for
// TTS input, itself derived from authored_docs/byakaran/01-sounds.md's
// "Aangepaste SCS-spelling" column) rather than inventing a second,
// possibly-inconsistent stripping rule here — see the "standard libs over
// custom code" precedent this repo already follows. SCS is lossy
// (multiple canonical words can collapse to the same SCS spelling, e.g.
// ñ/ṅ/ṁ/n all fold to "n"), so this generator flags those collisions as
// `ambiguous: true` with every canonical candidate listed, rather than
// silently picking one — per the issue's step 3 ("don't silently guess").
//
// The word list is a *generated* artifact (like a lockfile): it is
// mechanically derived from content/sarnami/vocab/**'s `word` fields, so it
// is always committed alongside the vocab that produced it and CI (see
// validate-content.yml's `validate-scs-word-list` job) fails a PR whose
// committed file has drifted from what this script would regenerate.
//
// Usage:
//   node scripts/generate-scs-word-list.mjs           # (re)writes the file
//   node scripts/generate-scs-word-list.mjs --check    # exits 1 if stale

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { toScs } from "./scs-transliterate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const VOCAB_DIR = path.join(REPO_ROOT, "content", "sarnami", "vocab");
const OUTPUT_PATH = path.join(REPO_ROOT, "settings", "sarnami", "scs-word-list.json");

/**
 * Splits a VocabItem's `word` field into individual word-level tokens,
 * matching the rule table's per-word (not per-phrase) granularity — a
 * multi-word entry like "Kaise hai?" contributes "kaise" and "hai"
 * separately, since the widget's dictionary lookup fires on word
 * boundaries (space/punctuation/enter) while a contributor is typing one
 * word at a time, not on whole phrases.
 *
 * Case-independent per the issue's rule table design (sentence-initial
 * capitals shouldn't fragment the dictionary), so every token is
 * lowercased. Leading/trailing punctuation is stripped; a token that is
 * pure punctuation (or empty after stripping) is dropped.
 */
export function tokenizeWord(word) {
  return word
    .split(/\s+/)
    .map((raw) => raw.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").toLowerCase())
    .filter((token) => token.length > 0);
}

/**
 * Builds the SCS -> canonical-diacritical dictionary from a flat list of
 * `{ id, word }` vocab entries (already read from content/sarnami/vocab/**).
 * Returns the entries array (unsorted); callers sort for stable output.
 */
export function buildWordList(vocabEntries) {
  // scs spelling -> canonical token -> first vocab id it was seen on
  // (Map preserves insertion order, which keeps output deterministic given
  // a fixed file-read order.)
  const bySpelling = new Map();

  for (const { id, word } of vocabEntries) {
    for (const token of tokenizeWord(word)) {
      const scs = toScs(token);
      if (!bySpelling.has(scs)) bySpelling.set(scs, new Map());
      const canonicalMap = bySpelling.get(scs);
      if (!canonicalMap.has(token)) canonicalMap.set(token, id);
    }
  }

  const entries = [];
  for (const [scs, canonicalMap] of bySpelling) {
    const canonical = [...canonicalMap.keys()].sort();
    entries.push({
      scs,
      canonical,
      ambiguous: canonical.length > 1,
      sourceIds: [...canonicalMap.values()],
    });
  }
  return entries;
}

/** Reads every content/sarnami/vocab/*.json file into a flat `{id, word}[]`. */
export function readVocabEntries(vocabDir = VOCAB_DIR) {
  const files = readdirSync(vocabDir).filter((f) => f.endsWith(".json")).sort();
  const entries = [];
  for (const file of files) {
    const items = JSON.parse(readFileSync(path.join(vocabDir, file), "utf-8"));
    for (const item of items) {
      if (typeof item.id !== "string" || typeof item.word !== "string") continue;
      entries.push({ id: item.id, word: item.word });
    }
  }
  return entries;
}

export function generate(vocabDir = VOCAB_DIR) {
  const entries = buildWordList(readVocabEntries(vocabDir)).sort((a, b) =>
    a.scs.localeCompare(b.scs),
  );
  const ambiguousCount = entries.filter((e) => e.ambiguous).length;
  return {
    language: "sarnami",
    generated: true,
    generatedBy: "scripts/generate-scs-word-list.mjs",
    source:
      "content/sarnami/vocab/*.json (word tokens, mechanically transliterated to SCS via scripts/scs-transliterate.mjs)",
    notes:
      "Word-level SCS-plain-Latin -> canonical-diacritical dictionary for the " +
      "first pass of sarnami-bol-naa#244's combined input flow (dictionary " +
      "lookup first, settings/sarnami/transliteration-rules.json digraph " +
      "rule table as fallback for anything not listed here). `ambiguous: " +
      "true` means more than one canonical spelling collapses to the same " +
      "SCS spelling (e.g. n/ṇ/ñ/ṅ/ṁ all fold to plain \"n\") — a consuming " +
      "widget must surface these as an inline choice, never silently pick " +
      "one, per the issue's step 3. `sourceIds` cites a content/sarnami/vocab " +
      "id per canonical spelling for traceability, not a scoring signal. " +
      "This file's coverage is bounded to today's vocab bank — new " +
      "coinages/names fall through to the rule table until vocab grows.",
    stats: { totalEntries: entries.length, ambiguousEntries: ambiguousCount },
    entries,
  };
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");
  const unknown = args.filter((a) => a !== "--check");
  if (unknown.length > 0) {
    console.error(`Unrecognized argument(s): ${unknown.join(", ")}`);
    process.exit(2);
  }

  const output = generate();
  const serialized = JSON.stringify(output, null, 2) + "\n";

  if (checkOnly) {
    let existing;
    try {
      existing = readFileSync(OUTPUT_PATH, "utf-8");
    } catch {
      existing = null;
    }
    if (existing !== serialized) {
      console.error(
        `${path.relative(REPO_ROOT, OUTPUT_PATH)} is stale — run ` +
          `\`node scripts/generate-scs-word-list.mjs\` and commit the result.`,
      );
      process.exit(1);
    }
    console.log(`${path.relative(REPO_ROOT, OUTPUT_PATH)} is up to date.`);
    return;
  }

  writeFileSync(OUTPUT_PATH, serialized);
  console.log(
    `Wrote ${path.relative(REPO_ROOT, OUTPUT_PATH)}: ${output.stats.totalEntries} entries ` +
      `(${output.stats.ambiguousEntries} ambiguous).`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
