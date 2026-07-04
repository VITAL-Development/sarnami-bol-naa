# Sarnami Bol Naa

Content and branding package for **Sarnami** — a Hindi-derived language
spoken in Suriname — as taught by the [rarelang](https://github.com/VITAL-Development/rarelang-pwa)
platform's generic learning engine.

## What this repo is (and isn't)

This repo used to be the whole app: a React/TypeScript PWA plus its
content. As of issue #64 (part of the [rarelang rebrand roadmap](https://github.com/VITAL-Development/sarnami-bol-naa/issues/52)),
the generic engine code has been extracted into two standalone repos:

- **[`rarelang-pwa`](https://github.com/VITAL-Development/rarelang-pwa)** — the generic frontend engine (routing, exercise components, spaced repetition, gamification). No content or branding of its own.
- **[`rarelang-server`](https://github.com/VITAL-Development/rarelang-server)** — the generic backend engine (serves content/settings/progress over HTTP).

This repo is what's left: the actual Sarnami vocabulary, lessons, and
per-language settings (`content/`, `settings/`), the app's branding (colors,
icons, app name — via `settings/sarnami/language-settings.json`'s
`branding` field), and the grammar-reference material the content was
authored from (`docs/byakaran/`). There is no build here, no `npm run dev`
serving an app, and no deploy pipeline — those all now live with the
generic engines.

## Layout

```
content/sarnami/
├── vocab/*.json      # VocabItem[] — any filename, looked up by id
├── units/*.json      # Unit objects (id/title/order/lessons/exercises)
└── lessons/*.json    # Lesson-adjacent content (example sentences, grammar
                       # notes, exercise prompts/options), keyed by contentRef
settings/sarnami/
└── language-settings.json   # Romanization rules, alphabet, audio config,
                              # and the `branding` object (colors/appName/icons)
public/
├── favicon.svg
└── icons/            # PWA icon set (192/512/maskable-512)
docs/
├── byakaran/         # Image-verified transcription of the grammar reference
│                     # (Sarnami Byäkaran, Marhé 1985) content was authored from
├── api-contract.md   # HTTP contract rarelang-server implements / rarelang-pwa consumes
├── deployment.md     # Current deployment story (see below)
└── sarnamibhasa-vocab.md
scripts/
└── generate-icons.mjs   # Regenerates public/favicon.svg + public/icons/*.png
                          # from a hand-authored SVG design (needs `npm install`
                          # for its one `sharp` devDependency, then
                          # `npm run generate-icons`)
```

The on-disk shape under `content/`/`settings/` exactly mirrors what
`rarelang-server` expects to mount via its `CONTENT_DIR`/`SETTINGS_DIR` env
vars — see [rarelang-server's README](https://github.com/VITAL-Development/rarelang-server#content)
and [issue #76](https://github.com/VITAL-Development/sarnami-bol-naa/issues/76)
for how this repo gets wired up as a live content source (a git-sync
sidecar, not a copy baked into the server's Docker image).

## Content authoring

Sarnami romanization uses diacritics (ā/ī/ū macrons, ṭ/ḍ/ṇ underdots, ñ/ṅ)
that `pdftotext` and similar raw text extraction commonly corrupt or drop
(e.g. ā → ä, or the diacritic vanishing entirely). Don't trust extracted
text from book-source PDFs directly — verify spellings against rendered
page images. See `docs/byakaran/01-sounds.md` for the full sound inventory.

Vocab entries carry `tags` for traceability — e.g. `book-pNN` tags cite the
page in Marhé's grammar an entry was verified against; `needs-verification`
marks entries not yet cross-checked against a second source.

## Branding

Colors are derived from the Suriname flag; see `settings/sarnami/language-settings.json`'s
`branding.colors` for the actual RGB-triplet values consumed at runtime by
`rarelang-pwa`'s theming (`useBranding.ts`). Regenerate the PWA icon set
after any design change with:

```bash
npm install
npm run generate-icons
```

## History

This repo's git history predates the rebrand — it includes the original
app's full development (content authoring, the frontend/backend split,
the `rarelang-pwa`/`rarelang-server` extractions) even though that engine
code no longer lives here. `git log` on any now-removed path (e.g. `src/`)
still resolves to its original history.
