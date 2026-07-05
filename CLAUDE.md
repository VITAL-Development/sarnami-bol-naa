# Sarnami Bol Naa — Claude guidance

## What this repo is

As of issue #64, this repo is **content and branding only** — Sarnami's
knowledge base (`content/sarnami/`, `settings/sarnami/`) — not an app. The
generic engine that used to live here was extracted to two standalone
repos as part of the
[rarelang rebrand roadmap](https://github.com/VITAL-Development/sarnami-bol-naa/issues/52):

- **[`rarelang-pwa`](https://github.com/VITAL-Development/rarelang-pwa)** — generic frontend engine (React/TS/Vite PWA, no content of its own)
- **[`rarelang-server`](https://github.com/VITAL-Development/rarelang-server)** — generic backend engine (serves content/settings/progress over HTTP)

**There is no `npm run dev`/`npm run build`/`npm test`/`package.json` here
anymore.** Don't look for `src/`, `vite.config.ts`, or a deploy pipeline —
they're gone, moved to the repos above. PWA icon generation moved to
`rarelang-pwa` too (issue #81) — `branding.icons` paths returned by
`GET /settings` are relative and resolve against that app's own origin, so
the generated files need to live in its `public/`, not here. `git log
<removed-path>` still resolves to that path's original history in this
repo, if you need it.

## Layout

```
content/sarnami/{vocab,units,lessons}/*.json   # authored knowledge base
settings/sarnami/language-settings.json        # romanization/alphabet/audio + branding
docs/byakaran/*.md                             # grammar reference content was authored from
docs/api-contract.md                           # HTTP contract rarelang-server implements
docs/deployment.md                             # current deployment story (see that file)
docs/versioning.md                             # release/versioning policy (see below)
CHANGELOG.md                                   # content/schema changes per release
```

## Versioning

Releases are SemVer git tags (`vX.Y.Z`) cut on `main`; the git tag is the
source of truth (there is no `package.json`/`VERSION` file to bump). Before
making a schema/shape change to `content/`/`settings/`, read
`docs/versioning.md` — it defines what counts as a **breaking** (MAJOR)
change vs additive content (MINOR) vs a fix (PATCH), and how a git-sync
consumer (issue #76) pins to a tag instead of tracking `main`. Record
content/schema-relevant changes under `## [Unreleased]` in `CHANGELOG.md`.

The on-disk shape under `content/`/`settings/` is not arbitrary — it
exactly mirrors what `rarelang-server`'s `content.mjs`/`stub-data.mjs`
expect when mounted via `CONTENT_DIR`/`SETTINGS_DIR`. Don't rename/restructure
these directories without checking `rarelang-server`'s expectations first
(see its README's "Content ownership" section).

## Content authoring

Sarnami romanization uses diacritics (ā/ī/ū macrons, ṭ/ḍ/ṇ underdots, ñ/ṅ)
that `pdftotext` and similar raw text extraction commonly corrupt or drop
(e.g. ā → ä, or the diacritic vanishing entirely). Don't trust extracted
text from book-source PDFs directly — verify spellings against rendered
page images. See `docs/byakaran/01-sounds.md` for the full sound inventory.

Vocab entries sourced from the book carry `book-pNN` tags for traceability;
entries not yet cross-checked against a second source carry
`needs-verification` (see `content/sarnami/vocab/greetings.json`).

`content/sarnami/units/*.json` reference vocab/lesson-content by id
(`vocabRef`, `contentRef`) rather than embedding literal text — the actual
prompt/example-sentence/grammar-note text lives in
`content/sarnami/lessons/*.json`, keyed by `contentRef`.

## Branding

Colors are derived from the Suriname flag; the canonical values live in
`settings/sarnami/language-settings.json`'s `branding.colors` (RGB-triplet
strings, consumed at runtime by `rarelang-pwa`'s `useBranding.ts` — not
hardcoded Tailwind config anywhere in this repo, since there's no frontend
build here). The PWA icon set (favicon + `icons/*.png`) is generated and
owned by `rarelang-pwa` (`scripts/generate-icons.mjs` there, migrated from
this repo in issue #81) — regenerate/redesign it there, not here.

## Deployment

There's no build/deploy pipeline in this repo. See `docs/deployment.md` for
the current story: `rarelang-pwa` is built/deployed independently, and this
repo's content reaches `rarelang-server` via a git-sync sidecar (see
issue #76 and rarelang-server's own docs), not a copy baked into any image.
