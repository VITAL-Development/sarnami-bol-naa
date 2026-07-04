# Deployment

This document used to describe how this repo's own frontend/backend got
deployed. As of issue #64, this repo has no app of its own to deploy — it's
content and branding, consumed by two separate generic-engine repos. This
doc now just points at where each piece's deployment story actually lives.

## Frontend (`rarelang-pwa`)

The app previously built/FTPS-deployed from this repo (`.github/workflows/deploy.yml`)
no longer exists here — it's the generic engine now maintained in
[`rarelang-pwa`](https://github.com/VITAL-Development/rarelang-pwa). That
repo's own README/CI is authoritative for its build/deploy story; nothing
in this repo triggers a frontend build or deploy anymore.

## Backend (`rarelang-server`)

The backend lives in [`rarelang-server`](https://github.com/VITAL-Development/rarelang-server),
which:

- publishes a Docker image via its own CI (`rarelang-server` issue #2),
- supports mounting per-language content/settings via `CONTENT_DIR`/
  `SETTINGS_DIR` env vars, reading fresh per-request rather than caching at
  process start (`rarelang-server` issue #5), and
- is meant to source **this repo's** `content/sarnami/`/`settings/sarnami/`
  live via a git-sync sidecar + named Docker volume — no copy baked into
  the server's image, no host-level cron (`rarelang-server` issue #7,
  closed) — with this repo's side of that wiring tracked in issue #76.

See `rarelang-server`'s own README for the current, authoritative
`docker run`/`docker compose` instructions.

## What this repo still owns

Just making sure content changes here (`content/sarnami/`, `settings/sarnami/`)
actually reach a running `rarelang-server` instance — that's issue #76,
still open. Until it lands, picking up a content change in this repo
requires manually re-syncing/restarting whatever `rarelang-server`
deployment you're running against.
