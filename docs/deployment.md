# Deployment

This document describes how the frontend and backend (`/server`) actually
get deployed today. See issue #38 for the history of this doc.

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

## Backend (`/server`)

**There is no automated backend deploy.** This is intentional, not an
oversight: `/server` is still under active development (issues #29–#34 and
follow-ons) and, per issue #52, is planned to be extracted into its own
standalone repository once it stabilizes. Building real deploy automation
for a codebase that's about to move — and whose packaging story isn't
decided yet — would mostly be thrown away.

Today, running the backend means:

```bash
cd server
npm install
npm start        # http://localhost:8787 (override with PORT=xxxx)
```

on any host reachable from the frontend over Tailscale. Someone (currently
the repo owner) runs this manually and keeps the process alive themselves —
there's no process supervisor, container, or restart-on-crash story yet.
`server/README.md` documents the day-to-day of running it locally; this
section is only about how it reaches its deployed home.

### Path to automation

- **Issue #49** — package `/server` as a Docker image (published to a
  registry such as `ghcr.io`) so the Tailscale host can `docker pull` +
  `docker run` a known tag instead of manually managing a bare Node
  process. This is the next concrete step toward automated backend
  deployment, and a natural place to add a CI job that builds/pushes the
  image on changes to `server/**`.
- **Issue #52** — once the backend is functional and its in-flight issues
  have landed, extract `/server`'s history into its own standalone repo
  (`git subtree split` / `git filter-repo`, preserving history). At that
  point `/server` gets its own independent CI/deploy pipeline, and this
  document should be updated to reflect whatever replaces the in-repo
  `server/**` path (a git submodule, a separate deploy step referencing the
  new repo, or nothing at all if the outer repo no longer needs to know
  about it).

Until #49 lands, do not add real deploy automation for `/server` to
`deploy.yml` — see issue #38.
