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
- sources **this repo's** `content/sarnami/`/`settings/sarnami/` live via a
  git-sync sidecar + named Docker volume, defined in
  [`rarelang-server`'s `docker-compose.yml`](https://github.com/VITAL-Development/rarelang-server/blob/main/docker-compose.yml) —
  no copy baked into the server's image, no host-level cron/systemd unit
  anywhere (`rarelang-server` issue #7). See that repo's README section
  [Volume-mount content/settings](https://github.com/VITAL-Development/rarelang-server#volume-mount-contentsettings-issue-5)
  for the full mechanism and both supported approaches (the recommended
  git-sync sidecar, and a plain host bind-mount alternative).

This repo's `content/sarnami/`/`settings/sarnami/` layout (repo root, per
issue #64) is confirmed compatible with that compose setup with **zero
path translation**: `docker-compose.yml`'s `GITSYNC_LINK: repo` plus
`CONTENT_DIR: /data/repo/content`/`SETTINGS_DIR: /data/repo/settings`
resolve directly to this repo's own `content/`/`settings/` once git-sync
clones `main` into the shared volume — no repo-specific renaming or
directory shuffling needed on either side (issue #76). This was verified
end-to-end with a real `docker compose` run (git-sync sidecar syncing a
local checkout of this repo's current `main` into a named volume,
`rarelang-server` reading from it read-only): `GET /languages` and
`GET /content?lang=sarnami` returned this repo's real unit/vocab data, and
a follow-up commit synced by the sidecar (container restart only, not
`rarelang-server`) was reflected on the next request with no
`rarelang-server` restart.

## What this repo still owns

Nothing beyond being a normal, publicly syncable git repo with the right
on-disk shape (`content/sarnami/`, `settings/sarnami/`) — the sync
mechanism itself (git-sync sidecar, named volume, compose config) lives
entirely in `rarelang-server` (issue #76, closed). A content change here
reaches a running `rarelang-server` instance automatically on the sidecar's
sync interval (`GITSYNC_PERIOD`, 5 minutes in the reference compose file)
once `main` is updated — no manual re-sync, no `rarelang-server` rebuild or
restart.
