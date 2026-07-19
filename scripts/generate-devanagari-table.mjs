#!/usr/bin/env node
// Builds scripts/devanagari-vocab-table.review.json — a REVIEW ARTIFACT for
// issue #280's Piper-TTS migration (part 1 of 2), not something any server
// or consumer reads. It runs toDevanagari() (devanagari-transliterate.mjs)
// across every content/sarnami/vocab/*.json entry's `word` field and
// records the result per vocab id, plus a flat list of words this repo
// already knows need human review before part 2 spends real audio
// generation time on them (see devanagari-transliterate.mjs's header
// comment for why each category is flagged).
//
// This is deliberately NOT modeled on generate-scs-word-list.mjs's
// "generated artifact checked by CI for staleness" pattern — that script
// produces a settings/ file an actual consumer reads. This one produces a
// one-time review table for a human (with more Sarnami context than this
// agent) to read before part 2 proceeds; nothing depends on it being
// regenerated on every content change (yet).
//
// Usage:
//   node scripts/generate-devanagari-table.mjs

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { toDevanagari } from "./devanagari-transliterate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const VOCAB_DIR = path.join(REPO_ROOT, "content", "sarnami", "vocab");
const OUTPUT_PATH = path.join(__dirname, "devanagari-vocab-table.review.json");

function readVocabEntries(vocabDir = VOCAB_DIR) {
  const files = readdirSync(vocabDir).filter((f) => f.endsWith(".json")).sort();
  const entries = [];
  for (const file of files) {
    const items = JSON.parse(readFileSync(path.join(vocabDir, file), "utf-8"));
    for (const item of items) {
      if (typeof item.id !== "string" || typeof item.word !== "string") continue;
      entries.push({ id: item.id, word: item.word, file });
    }
  }
  return entries;
}

export function generate(vocabDir = VOCAB_DIR) {
  const entries = readVocabEntries(vocabDir);
  const rows = [];
  const errors = [];
  for (const { id, word, file } of entries) {
    try {
      rows.push({ id, word, devanagari: toDevanagari(word) });
    } catch (e) {
      errors.push({ id, word, file, error: e.message });
    }
  }

  const loanwordIds = entries
    .filter((e) => e.file === "loanwords.json")
    .map((e) => e.id);
  const breveVowelIds = entries
    .filter((e) => /[ĕŏ]/.test(e.word))
    .map((e) => e.id);
  const anusvaraIds = entries
    .filter((e) => /[ṁṃ]/.test(e.word))
    .map((e) => e.id);

  return {
    generated: true,
    generatedBy: "scripts/generate-devanagari-table.mjs",
    purpose:
      "Review artifact for sarnami-bol-naa issue #280 part 1/2 (Piper TTS " +
      "migration off facebook/mms-tts-hns). NOT consumed by any server or " +
      "app. toDevanagari() output for every content/sarnami/vocab/*.json " +
      "entry, for a human reviewer to check before part 2 spends real " +
      "audio-generation time on it.",
    stats: { totalEntries: rows.length, errors: errors.length },
    needsReview: {
      loanwordDutchOrthography: {
        note:
          "content/sarnami/vocab/loanwords.json words are spelled with Dutch " +
          "digraphs (oo/ui/eu/...), not this repo's Sarnami diacritic scheme " +
          "-- toDevanagari() has no Dutch-digraph handling and produces " +
          "very likely wrong output for these (e.g. 'mooi' -> मोओइ). Needs " +
          "a Sarnami speaker's judgment on whether these are pronounced " +
          "with Dutch or nativized phonology.",
        ids: loanwordIds,
      },
      breveVowelNasalizationAmbiguous: {
        note:
          "ĕ/ŏ words: source doc defines the breve as marking a nasalized " +
          "vowel, but corpus usage (lohar/sonar, ordinary non-nasal Hindi-" +
          "cognate words) contradicts that. Currently mapped to plain e/o " +
          "(no nasal mark) -- see devanagari-transliterate.mjs VOWELS comment.",
        ids: breveVowelIds,
      },
      anusvaraVsCandrabindu: {
        note:
          "ṁ/ṃ words: standardized on anusvara (ं) everywhere rather than " +
          "the historically-conventional chandrabindu (ँ) some of these " +
          "(hāṁ, kahāṁ, ...) would take in a dictionary. Not a pronunciation " +
          "difference for TTS, just a spelling-convention simplification.",
        ids: anusvaraIds,
      },
      midWordVirama: {
        note:
          "Every word is transliterated phonemically-literally: a consonant " +
          "directly followed by another consonant in the source romanization " +
          "always gets an explicit virama, even where canonical Hindi " +
          "spelling would omit it and rely on a reader's own mid-word " +
          "schwa-deletion (e.g. sound-larka 'laṛkā' -> लड़्का, not the " +
          "canonical लड़का). Very likely phonemically equivalent through " +
          "Piper's phonemizer, but flagged since it looks non-standard. See " +
          "devanagari-transliterate.mjs header comment.",
        ids: [],
      },
    },
    errors,
    entries: rows,
  };
}

function toMarkdownTable(rows) {
  const header = "| id | word | devanagari |\n|---|---|---|\n";
  const body = rows
    .map((r) => `| ${r.id} | ${r.word} | ${r.devanagari} |`)
    .join("\n");
  return header + body + "\n";
}

function main() {
  const output = generate();
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  const mdPath = OUTPUT_PATH.replace(/\.json$/, ".md");
  writeFileSync(mdPath, toMarkdownTable(output.entries));
  console.log(
    `Wrote ${path.relative(REPO_ROOT, OUTPUT_PATH)} and ${path.relative(REPO_ROOT, mdPath)}: ` +
      `${output.stats.totalEntries} entries (${output.stats.errors} errors).`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
