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

## Docker (issue #49)

`/server` is dependency-free, so its image is a straightforward single-stage
build (`server/Dockerfile`) on `node:22-slim` — no `npm ci`/`node_modules`
step, no other build stage. Only `server.mjs`, `content.mjs`,
`gamification.mjs`, `stub-data.mjs`, `content/`, `settings/`, `package.json`
and `package-lock.json` are copied into the image (`server/.dockerignore`
excludes `server.test.mjs`, the Dockerfile itself, etc).

**Exposed port:** `8787` (matches the `PORT` default in `server.mjs`).

**Env vars:**

| Var | Default | Notes |
|---|---|---|
| `PORT` | `8787` | Override to change the port the process listens on inside the container — remember to update the `-p`/`EXPOSE` mapping to match. |

There's no CORS-origin override — the server always responds with
`Access-Control-Allow-Origin: *` (see "CORS" below), so no env var is
needed for that.

### Building locally

```bash
docker build -t sarnami-bol-naa-server ./server
docker run --rm -p 8787:8787 sarnami-bol-naa-server
curl http://localhost:8787/languages
```

### Published image

On every push to `main` that touches `server/**`,
`.github/workflows/server-image.yml` builds and pushes the image to GitHub
Container Registry as `ghcr.io/vital-development/sarnami-bol-naa-server`,
tagged with both the short commit SHA and `latest`. Pull a specific SHA to
pin a known-good build, or `latest` to track `main`.

### Running on a Tailscale-network host

```bash
docker pull ghcr.io/vital-development/sarnami-bol-naa-server:latest
docker run -d \
  --name sarnami-bol-naa-server \
  --restart unless-stopped \
  -p 8787:8787 \
  ghcr.io/vital-development/sarnami-bol-naa-server:latest
```

The host's Tailscale IP/hostname on port `8787` is then the value to set as
`TAILSCALE_BACKEND_URL` (the frontend's `VITE_API_BASE_URL` at build time —
see the outer repo's `deploy.yml`). Auto-restart/process supervision beyond
Docker's own `--restart` flag (systemd units, orchestration, etc.) is out of
scope for this image — see issue #49.

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
  output (see PR description for issue #33 for how). A learning language
  with no `units/`/`lessons/` directory resolves to `{ units: [], vocab:
  <its vocab>, lessonContent: <empty> }` — a real bundle, not a hardcoded
  special case, matching the "stub" status from `GET /languages`.
  `sranantongo` was this shape until issue #37 added its first real
  greetings unit as an end-to-end smoke test of the whole language-split
  architecture; it now reports `"available"` too.
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
  comment). Progress is held in memory for the process's lifetime for fast
  reads/writes, and persisted to disk on every mutation (see "Progress
  persistence" below, issue #69) so a process restart doesn't lose it —
  still single-user/no-auth, matching the contract's documented scope; a
  real datastore (SQLite, an external DB) remains out of scope for now.

## Progress persistence (issue #69)

Progress (`GET/PUT /progress`, `POST /progress/lesson-completion`, `POST
/progress/review-result`) is backed by a single JSON file on disk,
`server/data/progress.json`, written by `progress-store.mjs`. This replaces
the original prototype's in-memory-only store (issue #29), which lost all
progress on every restart.

**Mechanism:**

- **Load on startup**: the first request the server handles after starting
  triggers a one-time read of `data/progress.json`. If the file exists, its
  contents become the initial in-memory `progress` state; if it doesn't
  exist (first run) or fails to parse (corrupt file), the server falls back
  to the same empty default (`createInitialProgress()`) it always used
  pre-#69, and logs a warning in the corrupt-file case rather than crashing.
- **Save on every mutation**: `PUT /progress`, `POST
  /progress/lesson-completion`, and `POST /progress/review-result` each
  write the *entire* updated progress object back to `data/progress.json`
  before responding. There's no partial-write/diffing logic — the whole
  file is rewritten every time, which is simple and correct for a
  single-user store of this size.
- **Atomic writes**: each save writes to a temp file
  (`data/progress.json.<pid>.<timestamp>.tmp`) in the same directory, then
  `rename()`s it over `data/progress.json`. `rename` is atomic on POSIX
  filesystems, so a crash mid-write leaves the *previous* `progress.json`
  intact rather than a half-written/corrupt one — you lose at most the
  in-flight mutation, never the whole file.
- **Directory creation**: `data/` is created (`mkdir -p` equivalent) on the
  first save if it doesn't exist yet — no manual setup needed before first
  run.
- **Gitignored**: `server/.gitignore` excludes `data/` — this is runtime
  user state, not authored/committed content.

**Guarantees, stated plainly:**

- Survives a graceful restart (`npm run dev`'s `--watch` reload, a deploy,
  `docker restart`, a host reboot) — the next startup reads back whatever
  was last saved.
- Survives a crash *after* a save has completed — the atomic rename means
  the on-disk file is never left in a state older than "last completed
  write", and never a torn/partial write.
- Does **not** protect against: disk corruption/hardware failure, concurrent
  writers (this server assumes a single process instance — running two
  instances against the same `data/` directory has no locking and will race
  each other), or losing an in-flight mutation that was interrupted before
  its `rename()` completed (the previous save is retained instead, so at
  worst you lose the most recent single request's update, not the whole
  history).
- This is still a plain-file, single-user store, not a real datastore with
  transactions/concurrency control — matching `docs/api-contract.md`'s
  documented no-auth/single-user scope. SQLite or an external DB remain
  options if that scope changes.

### `server/content/` (issues #30/#31/#33)

- `server/content/<learningLanguage>/vocab/*.json` — authored vocab
  (`VocabItem[]`), any filename, read in filename order but assembled
  order-independently (vocab is always looked up by id).
- `server/content/<learningLanguage>/units/*.json` — one authored `Unit`
  object per file (id/title/description/order/`bookChapterRef`/lessons,
  including each lesson's exercises with their `kind` + `contentRef`/
  `vocabRef`/`promptVocabRef`/`direction` structure). Assembled units are
  sorted by their `order` field, not filename. A learning language with no
  `units/` directory is a stub — none currently are; `sranantongo` gained
  its first real unit in issue #37.
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
| `progress-store.mjs` | JSON-file load/save for the progress store, with atomic (temp-file + rename) writes (issue #69) |
| `stub-data.mjs` | `/languages` list derivation (from `content.mjs` + `server/settings/ui/*`) plus loaders for `/settings` and `/ui-strings` data from `./settings/**` |
| `server.test.mjs` | `node:test` coverage of each route's happy path + 404 path |
| `settings/{lang}/language-settings.json` | Per-learning-language romanization/alphabet/audio settings (`GET /settings`) |
| `settings/ui/{lang}/strings.json` | Per-UI-language string table (`GET /ui-strings`) |
| `content/<lang>/vocab/*.json` | Authored vocab content per learning language (issue #30) |
| `content/<lang>/units/*.json` | Authored unit/lesson structure per learning language (issue #33) |
| `content/<lang>/lessons/<unitId>.json` | Authored exercise/example-sentence/grammar-note content per learning language, per unit (issue #31) |
| `data/progress.json` | Persisted progress store (issue #69) — gitignored runtime state, not authored content; created on first save |

## CORS

Fully open (`Access-Control-Allow-Origin: *`) on every response, including a
204 `OPTIONS` preflight response, per `../docs/api-contract.md` — the
frontend is a statically-hosted PWA served from a different origin than this
backend.
