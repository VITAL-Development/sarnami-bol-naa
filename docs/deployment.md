# Deployment

This document describes how the frontend and backend actually get deployed
today. See issue #38 for the history of this doc, and issue #52 for the
backend's extraction into its own repo.

## Frontend

The frontend is a static PWA built by Vite (`npm run build` → `dist/`).

- **Pipeline**: `.github/workflows/deploy.yml`, triggered on every push to
  `main` (i.e. every merge).
- **Build**: `npm ci && npm run build`, with `VITE_API_BASE_URL` baked into
  the build from the `TAILSCALE_BACKEND_URL` repo secret. Because Vite env
  vars are inlined at build time, the deployed bundle always points at
  whatever backend URL that secret holds at merge time — there is no runtime
  config for this.
- **Deploy**: the built `dist/` artifact is uploaded, then shipped via FTPS
  to a Hetzner webspace (`SamKirkland/FTP-Deploy-Action@v4.3.4`) at
  `/public_html/sarnami_bol/`, with `dangerous-clean-slate: true` (the target
  directory is fully replaced on every deploy, not merged).
- **Required secrets**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`,
  `TAILSCALE_BACKEND_URL`.

There is no staging environment — every merge to `main` is a production
deploy.

## Backend

The backend now lives in its own repo, **[`VITAL-Development/rarelang-server`](https://github.com/VITAL-Development/rarelang-server)**
(extracted from this repo's `/server` via `git subtree split`, preserving
history — issue #52). This repo no longer contains any backend code.

**There is still no automated backend deploy.** Running the backend means:

```bash
git clone git@github.com:VITAL-Development/rarelang-server.git
cd rarelang-server
npm install
npm start        # http://localhost:8787 (override with PORT=xxxx)
```

on any host reachable from the frontend over Tailscale. Someone (currently
the repo owner) runs this manually and keeps the process alive themselves —
there's no process supervisor, container, or restart-on-crash story yet, and
the Docker image built by issue #49 has not yet been repointed at the new
repo's own CI (that image was previously published from this repo's
`.github/workflows/server-image.yml`, which was removed as part of #52 —
`rarelang-server` needs its own equivalent workflow as a follow-up).
`rarelang-server`'s own README documents the day-to-day of running it
locally; this section is only about how it reaches its deployed home.

Until that follow-up lands, do not add real deploy automation for the
backend to `deploy.yml` — see issue #38.
