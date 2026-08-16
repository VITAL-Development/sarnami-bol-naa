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
//   node scripts/generate-devanagari-table.mjs --write-sentences  # same as --write, but for every
//                                                          # content/sarnami/lessons/*.json
//                                                          # exampleSentences[].word (issue #307)
//   node scripts/generate-devanagari-table.mjs --check-sentences  # same as --check, for exampleSentences
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

const LESSONS_DIR = path.join(REPO_ROOT, "content", "sarnami", "lessons");

function readLessonFiles(lessonsDir = LESSONS_DIR) {
  return readdirSync(lessonsDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => ({
      file,
      fullPath: path.join(lessonsDir, file),
      lessons: JSON.parse(readFileSync(path.join(lessonsDir, file), "utf-8")),
    }));
}

// Unlike vocab (writeDevanagariField() above), content/sarnami/lessons/*.json
// is NOT written via a full JSON.stringify(..., null, 2) round-trip -- these
// files use a denser hand-authored/editor-formatted style (short arrays and
// single-translation objects collapsed onto one line, e.g.
// `"vocabRefs": ["greet-ram-ram", "greet-kaise-hai"]`) that JSON.stringify's
// uniform one-key-per-line output does NOT reproduce. A parse+full-rewrite
// here would touch every line of every lesson file (verified: reformatting
// unit-01-basics.json alone produced a 600+ line diff) purely as
// pretty-printer noise unrelated to this change. So this instead surgically
// inserts/updates just the two new fields as raw text, leaving every other
// byte of the file untouched -- see insertOrUpdateSentenceFields() below.
function escapeJsonString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Inserts (or, if already present -- e.g. re-running --write-sentences after
// a `word` edit -- replaces) a "devanagari"/"ttsText" field pair into the
// exampleSentences[] object identified by `id`, as raw text. Relies on this
// repo's consistent 2-space-per-depth-level formatting: the target object's
// own closing `}` is the first line after the `"id"` line that starts with
// exactly 6 spaces then `}` (any more-nested closing brace, e.g. a
// multi-line "translations" object, is indented 8+ spaces and so doesn't
// match) -- see the sibling comment above for why we can't just re-serialize
// the whole object instead.
function insertOrUpdateSentenceFields(text, id, value) {
  const lines = text.split("\n");
  const idNeedle = `"id": "${id}"`;
  const idLineIdx = lines.findIndex((l) => l.includes(idNeedle));
  if (idLineIdx === -1) {
    throw new Error(`insertOrUpdateSentenceFields: id "${id}" not found`);
  }
  let closeLineIdx = -1;
  for (let i = idLineIdx + 1; i < lines.length; i++) {
    if (/^ {6}\}/.test(lines[i])) {
      closeLineIdx = i;
      break;
    }
  }
  if (closeLineIdx === -1) {
    throw new Error(`insertOrUpdateSentenceFields: closing brace for "${id}" not found`);
  }
  // Drop any existing devanagari/ttsText lines for this object first, so
  // re-running is idempotent instead of accumulating duplicate fields.
  for (let i = closeLineIdx - 1; i > idLineIdx; i--) {
    if (/^ {8}"(devanagari|ttsText)":/.test(lines[i])) {
      lines.splice(i, 1);
      closeLineIdx--;
    }
  }
  const lastFieldIdx = closeLineIdx - 1;
  if (!lines[lastFieldIdx].trimEnd().endsWith(",")) {
    lines[lastFieldIdx] = lines[lastFieldIdx].replace(/\s+$/, "") + ",";
  }
  const escaped = escapeJsonString(value);
  lines.splice(
    closeLineIdx,
    0,
    `        "devanagari": "${escaped}",`,
    `        "ttsText": "${escaped}"`,
  );
  return lines.join("\n");
}

// Same idea as writeDevanagariField()/checkDevanagariField() above, but for
// `content/sarnami/lessons/*.json` `exampleSentences[].word` instead of
// vocab `word` (issue #307 -- sentence-level ttsText was deferred out of the
// #306 extraction epic pending the two devanagari-transliterate.mjs fixes
// above). Mirrors the same `devanagari`/`ttsText` two-field convention, but
// see insertOrUpdateSentenceFields()'s comment for why the write path is a
// surgical text patch rather than a JSON.stringify round-trip.
export function writeSentenceDevanagariField(lessonsDir = LESSONS_DIR) {
  const errors = [];
  let written = 0;
  let sentences = 0;
  for (const { file, fullPath, lessons } of readLessonFiles(lessonsDir)) {
    let text = readFileSync(fullPath, "utf-8");
    let fileChanged = false;
    for (const lesson of lessons) {
      if (!Array.isArray(lesson.exampleSentences)) continue;
      for (const ex of lesson.exampleSentences) {
        if (typeof ex.word !== "string") continue;
        sentences++;
        let value;
        try {
          value = toDevanagari(ex.word);
        } catch (e) {
          errors.push({ id: ex.id, word: ex.word, file, error: e.message });
          continue;
        }
        if (ex.devanagari === value && ex.ttsText === value) continue;
        text = insertOrUpdateSentenceFields(text, ex.id, value);
        fileChanged = true;
      }
    }
    if (fileChanged) {
      writeFileSync(fullPath, text);
      written++;
    }
  }
  return { filesWritten: written, sentences, errors };
}

export function checkSentenceDevanagariField(lessonsDir = LESSONS_DIR) {
  const mismatches = [];
  const errors = [];
  let checked = 0;
  for (const { file, lessons } of readLessonFiles(lessonsDir)) {
    for (const lesson of lessons) {
      if (!Array.isArray(lesson.exampleSentences)) continue;
      for (const ex of lesson.exampleSentences) {
        if (typeof ex.word !== "string") continue;
        checked++;
        let expected;
        try {
          expected = toDevanagari(ex.word);
        } catch (e) {
          errors.push({ id: ex.id, word: ex.word, file, error: e.message });
          continue;
        }
        if (ex.devanagari !== expected) {
          mismatches.push({
            id: ex.id,
            word: ex.word,
            file,
            field: "devanagari",
            expected,
            actual: ex.devanagari ?? null,
          });
        }
        if (ex.ttsText !== expected) {
          mismatches.push({
            id: ex.id,
            word: ex.word,
            file,
            field: "ttsText",
            expected,
            actual: ex.ttsText ?? null,
          });
        }
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

  if (args.includes("--write-sentences")) {
    const { filesWritten, sentences, errors } = writeSentenceDevanagariField();
    if (errors.length > 0) {
      console.error(`toDevanagari() failed for ${errors.length} sentence(s):`);
      for (const e of errors) console.error(`  ${e.file} ${e.id} ("${e.word}"): ${e.error}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Wrote devanagari into ${sentences} example sentence(s) across ${filesWritten} lesson file(s).`);
    return;
  }

  if (args.includes("--check-sentences")) {
    const { checked, mismatches, errors } = checkSentenceDevanagariField();
    if (errors.length > 0) {
      console.error(`toDevanagari() failed for ${errors.length} sentence(s):`);
      for (const e of errors) console.error(`  ${e.file} ${e.id} ("${e.word}"): ${e.error}`);
    }
    if (mismatches.length > 0) {
      console.error(`${mismatches.length} example sentence field(s) are stale/missing:`);
      for (const m of mismatches) {
        console.error(`  ${m.file} ${m.id} ("${m.word}") [${m.field}]: committed=${JSON.stringify(m.actual)} expected=${JSON.stringify(m.expected)}`);
      }
    }
    if (errors.length > 0 || mismatches.length > 0) {
      process.exitCode = 1;
      return;
    }
    console.log(`devanagari field is current for all ${checked} example sentences.`);
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
