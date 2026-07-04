# Sarnami Bol Naa — Claude guidance

## What this repo is

As of issue #64, this repo is **content and branding only** — Sarnami's
knowledge base (`content/sarnami/`, `settings/sarnami/`) plus branding
assets (`public/`) — not an app. The generic engine that used to live here
was extracted to two standalone repos as part of the
[rarelang rebrand roadmap](https://github.com/VITAL-Development/sarnami-bol-naa/issues/52):

- **[`rarelang-pwa`](https://github.com/VITAL-Development/rarelang-pwa)** — generic frontend engine (React/TS/Vite PWA, no content of its own)
- **[`rarelang-server`](https://github.com/VITAL-Development/rarelang-server)** — generic backend engine (serves content/settings/progress over HTTP)

**There is no `npm run dev`/`npm run build`/`npm test` app here anymore.**
The only script is icon regeneration (see "Branding" below). Don't look for
`src/`, `vite.config.ts`, or a deploy pipeline — they're gone, moved to the
repos above. `git log <removed-path>` still resolves to that path's
original history in this repo, if you need it.

## Layout

```
content/sarnami/{vocab,units,lessons}/*.json   # authored knowledge base
settings/sarnami/language-settings.json        # romanization/alphabet/audio + branding
public/{favicon.svg,icons/*.png}               # PWA icon set
docs/byakaran/*.md                             # grammar reference content was authored from
docs/api-contract.md                           # HTTP contract rarelang-server implements
docs/deployment.md                             # current deployment story (see that file)
scripts/generate-icons.mjs                     # regenerates public/ from a hand-authored SVG
```

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
build here). Regenerate the PWA icon set after any design change:

```bash
npm install       # one devDependency: sharp, for scripts/generate-icons.mjs
npm run generate-icons
```

## Deployment

There's no build/deploy pipeline in this repo. See `docs/deployment.md` for
the current story: `rarelang-pwa` is built/deployed independently, and this
repo's content reaches `rarelang-server` via a git-sync sidecar (see
issue #76 and rarelang-server's own docs), not a copy baked into any image.
