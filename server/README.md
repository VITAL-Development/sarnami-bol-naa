# Sarnami Bol Naa — server

Backend for Sarnami Bol Naa.

## Tracked in the outer repo (for now)

`/server` is tracked directly in the outer `sarnami-bol-naa` repo — plain
files, no nested `.git`. An earlier version of this scaffold (issue #25)
used an independently-versioned nested git repo, fully gitignored by the
outer repo, so it could be extracted to its own GitHub repo later without
history rewriting. That approach meant PRs touching `/server` showed an
empty diff on GitHub and the nested history had no remote, so it only
existed in whichever local worktree ran `git init` — not reviewable, and at
risk of being lost. We reversed that (see PR #51) in favor of plain tracking
here while the backend is actively being built out.

`/server` will still be split into its own standalone repo eventually, once
the backend is functional and the in-flight `/server` issues have settled —
see issue #52, which uses `git subtree split`/`git filter-repo` to preserve
this history rather than starting over.

## Running locally

```bash
cd server
npm install
npm run start        # http://localhost:8787 (override with PORT=xxxx)
```

`npm run dev` runs the same thing with `node --watch` for auto-restart on
file changes.

## Testing

```bash
cd server
npm test              # node --test, covers each route's happy path + 404 path
```

No dependencies (dev or runtime) are required — `/server` is dependency-free
at every layer, including tests (`node:test` + `node:assert` + the built-in
`fetch`, all from the Node standard library).

## Content ownership (issues #29-#33)

As of issue #33, `/server` owns and serves all of its content/settings data
directly from files on disk under `/server` — it no longer reaches into the
outer repo's `../src` at runtime. This replaced an earlier transitional
esbuild-bundling trick (`build-content.mjs`/`content-entry.ts`, from issue
#29) that re-exported the frontend's `../src/data` and `../src/domain`
modules; both files were deleted once `server/content/**` (issues #30/#31)
and `server/settings/**` (issue #32) held real, on-disk copies of everything
`/server` needs:

- **`GET /content?lang={code}`** (`content.mjs`) assembles the full
  `ContentBundle` (units, vocab, lesson-adjacent content) by reading
  `server/content/<code>/{vocab,units,lessons}/*.json` at request time. For
  `sarnami` this was verified equivalent to the old `../src/data`-bundled
  output (see PR description for issue #33 for how). `sranantongo` has no
  `units/` or `lessons/` directory yet, so its bundle resolves to
  `{ units: [], vocab: <stub vocab>, lessonContent: <empty> }` — a real
  bundle, not a hardcoded special case, matching the "stub" status from
  `GET /languages`.
- **`GET /languages`** (`stub-data.mjs`) derives its `learningLanguages` list
  from the `server/content/*` directory listing (`displayName` comes from
  that language's own `server/settings/{code}/language-settings.json`;
  `status` is `"available"` if `content/<code>/units/*.json` exists,
  `"stub"` otherwise) and its `uiLanguages` list from the
  `server/settings/ui/*` directory listing.
- **`GET /settings`** and **`GET /ui-strings`** (`stub-data.mjs`, issue #32)
  read `server/settings/{lang}/language-settings.json` and
  `server/settings/ui/{lang}/strings.json` respectively, unchanged from
  #32's implementation.
- **Progress (`/progress`, `/progress/lesson-completion`,
  `/progress/review-result`)** uses pure gamification/Leitner/badge
  functions ported to plain JS in `gamification.mjs` (previously re-exported
  as-is from `../src/domain`/`../src/data/badges.ts` via the esbuild trick;
  now a small, dependency-free, hand-synced copy — see that file's header
  comment). Progress itself is held in memory for the process's lifetime,
  single-user, no persistence — matching the contract's documented
  no-auth/single-user scope. A real datastore is out of scope for this
  porting task.

### `server/content/` (issues #30/#31/#33)

- `server/content/<learningLanguage>/vocab/*.json` — authored vocab
  (`VocabItem[]`), any filename, read in filename order but assembled
  order-independently (vocab is always looked up by id).
- `server/content/<learningLanguage>/units/*.json` — one authored `Unit`
  object per file (id/title/description/order/`bookChapterRef`/lessons,
  including each lesson's exercises with their `kind` + `contentRef`/
  `vocabRef`/`promptVocabRef`/`direction` structure). Assembled units are
  sorted by their `order` field, not filename. A learning language with no
  `units/` directory is a stub (currently `sranantongo`).
- `server/content/<learningLanguage>/lessons/<unitId>.json` — authored
  lesson-adjacent content (issue #31): an array of
  `{ lessonId, exampleSentences, grammarNotes, exercises }`, where
  `exercises` is a map keyed by `contentRef`. Each exercise entry also
  carries a `kind` tag for authors' bookkeeping, which `content.mjs` strips
  when assembling `lessonContent.exerciseContent` (the `ExerciseContent`
  type it's resolved against has no `kind` field — that already lives on
  the matching `LessonExercise` in `units/*.json`).

The frontend keeps its own hand-synced local/offline fallback copies of this
same data (`src/data/vocab/*.ts`, `src/data/units/*.ts`,
`src/data/lessonContent/*.ts`), used by `LocalJsonContentRepository` when
`VITE_API_BASE_URL` isn't set (see `src/services/index.ts`) — this is no
longer a transitional duplicate kept for backend-bundling purposes, just the
frontend's own local dev/offline path, same as `server/content/**` is
`/server`'s own copy. Keep the two in sync by hand when content changes.

## Files

| File | Purpose |
|---|---|
| `server.mjs` | HTTP server (routing, CORS, request/response handling) |
| `content.mjs` | Reads `server/content/**` and assembles the `ContentBundle` per learning language |
| `gamification.mjs` | Plain-JS port of the frontend's pure XP/streak/Leitner/badge functions, used by the progress routes |
| `stub-data.mjs` | `/languages` list derivation (from `content.mjs` + `server/settings/ui/*`) plus loaders for `/settings` and `/ui-strings` data from `./settings/**` |
| `server.test.mjs` | `node:test` coverage of each route's happy path + 404 path |
| `settings/{lang}/language-settings.json` | Per-learning-language romanization/alphabet/audio settings (`GET /settings`) |
| `settings/ui/{lang}/strings.json` | Per-UI-language string table (`GET /ui-strings`) |
| `content/<lang>/vocab/*.json` | Authored vocab content per learning language (issue #30) |
| `content/<lang>/units/*.json` | Authored unit/lesson structure per learning language (issue #33) |
| `content/<lang>/lessons/<unitId>.json` | Authored exercise/example-sentence/grammar-note content per learning language, per unit (issue #31) |

## CORS

Fully open (`Access-Control-Allow-Origin: *`) on every response, including a
204 `OPTIONS` preflight response, per `../docs/api-contract.md` — the
frontend is a statically-hosted PWA served from a different origin than this
backend.
