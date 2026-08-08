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
//   node scripts/generate-devanagari-table.mjs           # write the review table (unchanged)
//   node scripts/generate-devanagari-table.mjs --write    # merge `devanagari` AND `ttsText`
//                                                          # into every content/sarnami/vocab/*.json
//                                                          # item (same computed value, two fields
//                                                          # -- see writeDevanagariField()'s comment
//                                                          # for why they're kept separate)
//   node scripts/generate-devanagari-table.mjs --check    # exit non-zero if any vocab
//                                                          # item's committed `devanagari` or
//                                                          # `ttsText` doesn't match
//                                                          # toDevanagari(word)
//
// --write/--check exist for issue #300 (the /dev/transliteration review page needs a
// committed baseline to display before PR-B spends ElevenLabs tokens). Unlike the
// review-table output above, `devanagari`/`ttsText` here are real, served content fields
// (content/sarnami/vocab -> rarelang-server's GET /content, verbatim passthrough) --
// --check is meant to run in CI (validate-content.yml) so neither field can ever silently
// drift from what toDevanagari() actually computes. `ttsText` is also the field the
// generic backend engine reads verbatim and hands to TTS synthesis (no per-language
// transformation on the engine side) -- see devanagari-transliterate.mjs's header for
// the sole-ownership statement this depends on.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { toDevanagari } from "./devanagari-transliterate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const VOCAB_DIR = path.join(REPO_ROOT, "content", "sarnami", "vocab");
const OUTPUT_PATH = path.join(__dirname, "devanagari-vocab-table.review.json");

function readVocabFiles(vocabDir = VOCAB_DIR) {
  return readdirSync(vocabDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => ({
      file,
      fullPath: path.join(vocabDir, file),
      items: JSON.parse(readFileSync(path.join(vocabDir, file), "utf-8")),
    }));
}

// Merges the mechanically-computed `devanagari` into every vocab item and writes
// each file back with `JSON.stringify(items, null, 2) + "\n"`. Only safe to run on
// vocab files that already round-trip that formatting exactly (verified separately,
// see the sibling reformat commit) -- this does not attempt to preserve any other
// hand-authored formatting.
// Writes both `devanagari` and `ttsText` with the same computed value. The
// two fields are byte-identical today but mean different things: `devanagari`
// is the human-facing value rendered on rarelang-pwa's /dev/transliteration
// review page, while `ttsText` is the machine-facing value the generic
// backend engine reads verbatim and hands to TTS synthesis (it applies no
// per-language text transformation of its own -- see this repo's sole
// ownership of Sarnami-to-Devanagari transliteration, documented in
// devanagari-transliterate.mjs's header). Keeping them as two separate keys
// (rather than one field serving both purposes) leaves room for them to
// diverge later without a breaking rename, e.g. if the review page ever
// wants annotations ttsText shouldn't carry.
export function writeDevanagariField(vocabDir = VOCAB_DIR) {
  const errors = [];
  let written = 0;
  for (const { file, fullPath, items } of readVocabFiles(vocabDir)) {
    const next = items.map((item) => {
      if (typeof item.word !== "string") return item;
      try {
        const value = toDevanagari(item.word);
        return { ...item, devanagari: value, ttsText: value };
      } catch (e) {
        errors.push({ id: item.id, word: item.word, file, error: e.message });
        return item;
      }
    });
    writeFileSync(fullPath, JSON.stringify(next, null, 2) + "\n");
    written++;
  }
  return { filesWritten: written, errors };
}

// Recomputes `devanagari`/`ttsText` for every vocab item and reports any
// mismatch against the committed value (including items missing either field
// entirely). Does not write. This is the sole remaining drift guard for both
// fields now that the cross-repo devanagari-drift-check CI job is gone --
// see scripts/devanagari-transliterate.mjs's header for why that job was
// removed.
export function checkDevanagariField(vocabDir = VOCAB_DIR) {
  const mismatches = [];
  const errors = [];
  let checked = 0;
  for (const { file, items } of readVocabFiles(vocabDir)) {
    for (const item of items) {
      if (typeof item.word !== "string") continue;
      checked++;
      let expected;
      try {
        expected = toDevanagari(item.word);
      } catch (e) {
        errors.push({ id: item.id, word: item.word, file, error: e.message });
        continue;
      }
      if (item.devanagari !== expected) {
        mismatches.push({
          id: item.id,
          word: item.word,
          file,
          field: "devanagari",
          expected,
          actual: item.devanagari ?? null,
        });
      }
      if (item.ttsText !== expected) {
        mismatches.push({
          id: item.id,
          word: item.word,
          file,
          field: "ttsText",
          expected,
          actual: item.ttsText ?? null,
        });
      }
    }
  }
  return { checked, mismatches, errors };
}

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
  const args = process.argv.slice(2);

  if (args.includes("--write")) {
    const { filesWritten, errors } = writeDevanagariField();
    if (errors.length > 0) {
      console.error(`toDevanagari() failed for ${errors.length} item(s):`);
      for (const e of errors) console.error(`  ${e.file} ${e.id} ("${e.word}"): ${e.error}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Wrote devanagari into ${filesWritten} vocab file(s).`);
    return;
  }

  if (args.includes("--check")) {
    const { checked, mismatches, errors } = checkDevanagariField();
    if (errors.length > 0) {
      console.error(`toDevanagari() failed for ${errors.length} item(s):`);
      for (const e of errors) console.error(`  ${e.file} ${e.id} ("${e.word}"): ${e.error}`);
    }
    if (mismatches.length > 0) {
      console.error(`${mismatches.length} vocab item field(s) are stale/missing:`);
      for (const m of mismatches) {
        console.error(`  ${m.file} ${m.id} ("${m.word}") [${m.field}]: committed=${JSON.stringify(m.actual)} expected=${JSON.stringify(m.expected)}`);
      }
    }
    if (errors.length > 0 || mismatches.length > 0) {
      process.exitCode = 1;
      return;
    }
    console.log(`devanagari field is current for all ${checked} vocab items.`);
    return;
  }

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
