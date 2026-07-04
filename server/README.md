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

## Transitional state (issue #29)

This server implements the routes in `../docs/api-contract.md`, but content
ownership hasn't fully moved into `/server` yet (that's tracked by issues
#30/#31/#32). Until then:

- **`GET /content?lang=sarnami`** is real: `build-content.mjs` uses esbuild
  to bundle `content-entry.ts`, which re-exports the frontend's
  `../src/data` (units/lessons/vocab) and the pure gamification/Leitner/badge
  functions from `../src/domain` and `../src/data/badges.ts` — reusing them
  as-is rather than re-implementing spaced-repetition or XP logic here. The
  bundle is built once at server startup and cached in memory.
- **`GET /content?lang=sranantongo`** is a stub: `{ units: [], vocab: [] }`,
  matching the contract's "stub" status for that learning language.
- **`GET /languages`, `GET /settings`, `GET /ui-strings`** are stubbed with
  placeholder data in `stub-data.mjs` (`sarnami` settings are the real
  romanization/alphabet data from the contract doc; `sranantongo` settings
  and the `en` UI-strings table are minimal placeholders, since the frontend
  has no `strings.en.ts` yet).
- **Progress (`/progress`, `/progress/lesson-completion`,
  `/progress/review-result`)** is held in memory for the process's lifetime,
  single-user, no persistence — matching the contract's documented
  no-auth/single-user scope. A real datastore is out of scope for this
  porting task.

Once content migrates fully into `/server`, `build-content.mjs` and
`content-entry.ts` (the only files that reach outside this nested repo, into
the outer repo's `../src`) should be deleted in favor of content authored
directly here.

## Files

| File | Purpose |
|---|---|
| `server.mjs` | HTTP server (routing, CORS, request/response handling) |
| `build-content.mjs` | esbuild bundler that loads `content-entry.ts` into an importable module |
| `content-entry.ts` | Re-exports frontend content + gamification/Leitner/badge functions |
| `stub-data.mjs` | Placeholder data for `/languages`, `/settings`, `/ui-strings` |

## CORS

Fully open (`Access-Control-Allow-Origin: *`) on every response, including a
204 `OPTIONS` preflight response, per `../docs/api-contract.md` — the
frontend is a statically-hosted PWA served from a different origin than this
backend.
