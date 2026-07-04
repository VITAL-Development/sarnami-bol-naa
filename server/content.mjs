// Reads the on-disk content knowledge base (issue #30/#31) directly and
// assembles the `ContentBundle` shape documented in `../docs/api-contract.md`
// and `../src/domain/types.ts`. Replaces the transitional esbuild-bundling
// trick (`build-content.mjs`/`content-entry.ts`, removed in issue #33) that
// used to read `../src/data` at runtime — `/server` now owns its content
// data outright, same pattern `stub-data.mjs` already used for
// `/settings`/`/ui-strings` since issue #32.
//
// On-disk layout per learning language, under `./content/<code>/`:
//   vocab/*.json   — VocabItem[] (issue #30), any filename, order-independent
//                    (vocab is always looked up by id, never by array order)
//   units/*.json   — one Unit object per file (id/title/description/order/
//                     lessons, incl. exercise `kind`/`contentRef`/`vocabRef`
//                     structure) — sorted by `order` when assembled, so
//                     filename doesn't need to encode ordering
//   lessons/*.json — LessonContentFile[] per file (issue #31): example
//                    sentences, grammar notes, and a `contentRef`-keyed
//                    exercises map. Each exercise entry also carries a `kind`
//                    tag for authors' bookkeeping; that tag is stripped when
//                    assembled into `lessonContent.exerciseContent`, since
//                    `ExerciseContent` (the type resolved against) carries no
//                    `kind` field — `kind` already lives on the matching
//                    `LessonExercise` in `units/*.json`.
//
// A learning language with no `units/` directory would be a documented stub:
// its bundle is `{ units: [], vocab: <its own vocab>, lessonContent: <empty>
// }`, matching the contract's "stub" status. `sranantongo` was this shape
// until issue #37 added its first real unit/lesson (the language-split
// architecture's end-to-end smoke test) — every registered learning
// language currently has real content, but the stub shape is still
// supported for whatever the next one is.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "content");

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function listJsonFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => path.join(dir, name));
}

/** Learning language codes registered on disk, e.g. ["sarnami", "sranantongo"]. */
export function listLearningLanguageCodes() {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** True if a learning language has real authored lesson structure (not just stub vocab). */
export function hasRealContent(langCode) {
  return listJsonFiles(path.join(CONTENT_DIR, langCode, "units")).length > 0;
}

function loadVocab(langCode) {
  return listJsonFiles(path.join(CONTENT_DIR, langCode, "vocab")).flatMap((file) => readJsonFile(file));
}

function loadUnits(langCode) {
  const units = listJsonFiles(path.join(CONTENT_DIR, langCode, "units")).map((file) => readJsonFile(file));
  return units.sort((a, b) => a.order - b.order);
}

function loadLessonContent(langCode) {
  const exampleSentences = [];
  const grammarNotes = [];
  const exerciseContent = {};

  for (const file of listJsonFiles(path.join(CONTENT_DIR, langCode, "lessons"))) {
    for (const lessonFile of readJsonFile(file)) {
      exampleSentences.push(...(lessonFile.exampleSentences ?? []));
      grammarNotes.push(...(lessonFile.grammarNotes ?? []));
      for (const [contentRef, { kind: _kind, ...content }] of Object.entries(lessonFile.exercises ?? {})) {
        exerciseContent[contentRef] = content;
      }
    }
  }

  return { exampleSentences, grammarNotes, exerciseContent };
}

/**
 * Assembles the full `ContentBundle` for a learning language code, or
 * `undefined` if that code isn't registered on disk at all (caller should
 * 404 in that case — distinct from a registered-but-stub language, which
 * returns a real, mostly-empty bundle).
 */
export function getContentBundle(langCode) {
  if (!existsSync(path.join(CONTENT_DIR, langCode))) return undefined;
  return {
    units: loadUnits(langCode),
    vocab: loadVocab(langCode),
    lessonContent: loadLessonContent(langCode),
  };
}
