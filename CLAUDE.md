# Sarnami Bol Naa — Claude guidance

## What this repo is

As of issue #64, this repo is **content and branding only** — Sarnami's
knowledge base (`content/sarnami/`, `settings/sarnami/`) — not an app. The
generic engine that used to live here was extracted into separate standalone
repos (a frontend app and a backend server) as part of the
[rebrand roadmap](https://github.com/VITAL-Development/sarnami-bol-naa/issues/52).

**There is no `npm run dev`/`npm run build`/`npm test`/`package.json` here
anymore.** Don't look for `src/`, `vite.config.ts`, or a deploy pipeline —
they're gone, moved to those repos. PWA icon generation moved to
the frontend app too (issue #81) — `branding.icons` paths returned by
`GET /settings` are relative and resolve against that app's own origin, so
the generated files need to live in its `public/`, not here. `git log
<removed-path>` still resolves to that path's original history in this
repo, if you need it.

## Layout

```
content/sarnami/{vocab,units,lessons}/*.json   # authored knowledge base
settings/sarnami/language-settings.json        # romanization/alphabet/audio + branding
authored_docs/byakaran/*.md                    # grammar reference content was authored from
authored_docs/sarnamibhasa-vocab.md            # sarnamibhasa.nl second-source vocab (cross-check)
docs/versioning.md                             # release/versioning policy (see below)
CHANGELOG.md                                   # content/schema changes per release
```

The HTTP API contract and deployment topology are **not** in this public
content repo — they're integration internals of the private stack,
maintained with the backend server (issue #83).

## Versioning

Releases are SemVer git tags (`vX.Y.Z`) cut on `main`; the git tag is the
source of truth (there is no `package.json`/`VERSION` file to bump). Before
making a schema/shape change to `content/`/`settings/`, read
`docs/versioning.md` — it defines what counts as a **breaking** (MAJOR)
change vs additive content (MINOR) vs a fix (PATCH), and how a git-sync
consumer (issue #76) pins to a tag instead of tracking `main`. Record
content/schema-relevant changes under `## [Unreleased]` in `CHANGELOG.md`.

The on-disk shape under `content/`/`settings/` is not arbitrary — it
exactly mirrors what the consuming server's content loader expects when
mounted via `CONTENT_DIR`/`SETTINGS_DIR`. Don't rename/restructure
these directories without checking the server's expectations first.

## Content authoring

Sarnami romanization uses diacritics (ā/ī/ū macrons, ṭ/ḍ/ṇ underdots, ñ/ṅ)
that `pdftotext` and similar raw text extraction commonly corrupt or drop
(e.g. ā → ä, or the diacritic vanishing entirely). Don't trust extracted
text from book-source PDFs directly — verify spellings against rendered
page images. See `authored_docs/byakaran/01-sounds.md` for the full sound inventory.

Vocab entries sourced from the book carry `book-pNN` tags for traceability;
entries not yet cross-checked against a second source carry
`needs-verification` (see `content/sarnami/vocab/greetings.json`). The
canonical second source for clearing `needs-verification` is
`authored_docs/sarnamibhasa-vocab.md` — a Dutch→Sarnami function-word list
extracted from sarnamibhasa.nl (issue #20); where its spelling disagrees
with the book, prefer the book's diacritic-correct form.

`content/sarnami/units/*.json` reference vocab/lesson-content by id
(`vocabRef`, `contentRef`) rather than embedding literal text — the actual
prompt/example-sentence/grammar-note text lives in
`content/sarnami/lessons/*.json`, keyed by `contentRef`.

## Branding

Colors are derived from the Suriname flag; the canonical values live in
`settings/sarnami/language-settings.json`'s `branding.colors` (RGB-triplet
strings, consumed at runtime by the frontend app's theming — not
hardcoded Tailwind config anywhere in this repo, since there's no frontend
build here). The PWA icon set (favicon + `icons/*.png`) is generated and
owned by the frontend app (migrated from
this repo in issue #81) — regenerate/redesign it there, not here.

## Deployment

There's no build/deploy pipeline in this repo. The frontend app is
built/deployed independently, and this repo's content reaches
the backend server via a git-sync sidecar (see issue #76), not a copy baked
into any image. The full deployment topology lives with the backend server
(issue #83), not here.
