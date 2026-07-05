# Sarnami Bol Naa

Content and branding package for **Sarnami** — a Bhojpuri-derived language
spoken in Suriname — as taught by a generic language-learning engine. This
repo holds only the Sarnami content, per-language settings, and branding; the
application code and build pipeline live elsewhere.

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
authored_docs/
├── byakaran/         # Image-verified transcription of the grammar reference
│                     # (Sarnami Byäkaran, Marhé 1985) content was authored from
└── sarnamibhasa-vocab.md
scripts/
└── generate-icons.mjs   # Regenerates public/favicon.svg + public/icons/*.png
                          # from a hand-authored SVG design (needs `npm install`
                          # for its one `sharp` devDependency, then
                          # `npm run generate-icons`)
```

The on-disk shape under `content/`/`settings/` exactly mirrors what the
consuming server expects to mount via its `CONTENT_DIR`/`SETTINGS_DIR` env
vars — see [issue #76](https://github.com/VITAL-Development/sarnami-bol-naa/issues/76)
for how this repo gets wired up as a live content source (a git-sync
sidecar, not a copy baked into the server's Docker image).

## Content authoring

Sarnami romanization uses diacritics (ā/ī/ū macrons, ṭ/ḍ/ṇ underdots, ñ/ṅ)
that `pdftotext` and similar raw text extraction commonly corrupt or drop
(e.g. ā → ä, or the diacritic vanishing entirely). Don't trust extracted
text from book-source PDFs directly — verify spellings against rendered
page images. See `authored_docs/byakaran/01-sounds.md` for the full sound inventory.

Vocab entries carry `tags` for traceability — e.g. `book-pNN` tags cite the
page in Marhé's grammar an entry was verified against; `needs-verification`
marks entries not yet cross-checked against a second source.

## Branding

Colors are derived from the Suriname flag; see `settings/sarnami/language-settings.json`'s
`branding.colors` for the actual RGB-triplet values consumed at runtime by
the frontend app's theming. Regenerate the PWA icon set
after any design change with:

```bash
npm install
npm run generate-icons
```

## Versioning

Releases are marked with SemVer git tags (`vX.Y.Z`) cut on `main`; the tag —
not any file — is the source of truth for "what version is this". See
[`docs/versioning.md`](docs/versioning.md) for the scheme, the precise
definition of a **breaking** vs additive content/schema change, and how a
git-sync deployment pins to a tag instead of tracking
`main`. Content/schema changes per release are recorded in
[`CHANGELOG.md`](CHANGELOG.md).

## History

This repo's git history predates the rebrand — it includes the original
app's full development (content authoring, the frontend/backend split,
and the extraction of the generic engine into separate repos) even though
that engine code no longer lives here. `git log` on any now-removed path
(e.g. `src/`) still resolves to its original history.
