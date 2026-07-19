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
  // Round 2: etymology research resolved wf-lohar/wf-sonar (confirmed
  // non-nasal) and pron-tomhar (confirmed nasal, already correctly audible
  // via its own explicit ṁ token) -- see devanagari-transliterate.mjs's
  // VOWELS comment. Only these three remain genuinely unresolved by
  // etymology (recent loanword-derived coinages with no inherited
  // Bhojpuri/Sanskrit etymon to appeal to).
  const breveVowelUnresolvedIds = ["loan-riwors", "loan-lesiyai", "loan-setiyave"];
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
          "Round 2: content/sarnami/vocab/loanwords.json's 8 loan-dutch " +
          "entries were reviewed word-by-word. mooi/uitleg/wachti/bekeur " +
          "now go through a targeted RAW_WORD_OVERRIDES fix (mooi is the " +
          "owner's own direct correction; uitleg/wachti are phoneme-" +
          "verified against espeak-ng; bekeur is a LOW-CONFIDENCE candidate " +
          "still needing a Dutch-speaker audio A/B on its eu-vowel nucleus). " +
          "bel/klop/help have no Dutch digraph and are left mechanical. " +
          "beledig's word-final/medial 'g' (Dutch has no [ɡ] stop phoneme; " +
          "phoneme-verified as [x], same as wachti's ch) is flagged as a " +
          "candidate substitution but deliberately NOT applied -- see " +
          "devanagari-transliterate.mjs's RAW_WORD_OVERRIDES comment for why.",
        ids: loanwordIds,
      },
      breveVowelNasalizationAmbiguous: {
        note:
          "Round 2: etymology research resolved most of this category. " +
          "wf-lohar/wf-sonar are CONFIRMED non-nasal (Sanskrit -kāra " +
          "agentive suffix has no nasal in its NIA history) -- current " +
          "plain-e/o mapping is correct, not a guess. pron-tomhar is " +
          "CONFIRMED nasal (tumhārā's genuine historical -mh- cluster) and " +
          "already renders audibly nasal via its own explicit ṁ->anusvara " +
          "token, unrelated to the breve itself. Only the three loanword-" +
          "derived coinages below remain genuinely unresolved -- recent " +
          "borrowings have no inherited Bhojpuri/Sanskrit etymon for the " +
          "breve to reflect, so etymology can't settle them; left at the " +
          "non-nasal default pending an empirical Piper-audio decision.",
        ids: breveVowelUnresolvedIds,
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
          "Round 2: empirically verified via espeak-ng phonemization + " +
          "multi-sample Piper/ASR round-trips (see devanagari-" +
          "transliterate.mjs's mid-word-virama header comment for the full " +
          "breakdown). The mechanical 'always virama between consonants' " +
          "default is CONFIRMED correct for geminates and for ordinary " +
          "non-place-mismatched clusters (e.g. sound-larka 'laṛkā' -> " +
          "लड़्का, not canonical लड़का, is very likely phonemically " +
          "equivalent through Piper's phonemizer). Two narrow overrides " +
          "were added: (a) a plain nasal before a heterorganic stop (न् " +
          "before velar ग, e.g. reading-jangal) now uses anusvara instead, " +
          "matching how Piper's phonemizer place-assimilates the " +
          "conventional spelling; (b) an unstressed word-initial CV-schwa " +
          "syllable containing र्+consonant (सर्- in about-sarnami/about-" +
          "sarnam) is fragile in Piper audio even though espeak assigns it " +
          "a real phoneme -- fixed via the owner's own direct " +
          "RAW_WORD_OVERRIDES for those two words; not mechanized further " +
          "since only 2 confirmed instances exist in the current vocab.",
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
