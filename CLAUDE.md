# Sarnami Bol Naa — Claude guidance

## What this repo is

This repo is **content and branding only** — Sarnami's
knowledge base (`content/sarnami/`, `settings/sarnami/`) — not an app. The
generic engine that used to live here was extracted into separate standalone
repos (a frontend app and a backend server) as part of the platform's rebrand.

**There is no `npm run dev`/`npm run build`/`npm test`/`package.json` here
anymore.** Don't look for `src/`, `vite.config.ts`, or a deploy pipeline —
they're gone, moved to those repos. PWA icon generation moved to
the frontend app too — `branding.icons` paths returned by
`GET /settings` are relative and resolve against that app's own origin, so
the generated files need to live in its `public/`, not here. `git log
<removed-path>` still resolves to that path's original history in this
repo, if you need it.

## Layout

```
content/sarnami/{vocab,units,lessons}/*.json   # authored knowledge base
content/sarnami/grammar/grammar.json           # standalone GET /grammar reference (topic notes, distinct
                                                # from per-lesson grammar notes in lessons/*.json)
settings/sarnami/language-settings.json        # romanization/alphabet/audio + branding + defaultUiLanguage
settings/sarnami/ui/{en,nl}/strings.json       # static UI chrome strings (nav/buttons/labels) — not content
authored_docs/byakaran/*.md                    # grammar reference content was authored from
authored_docs/sarnamibhasa-vocab.md            # sarnamibhasa.nl second-source vocab (cross-check)
authored_docs/lesson-plan.md                   # unit sequencing, incl. CEFR tiers (Beginner/Intermediate/Advanced)
docs/versioning.md                             # release/versioning policy (see below)
CHANGELOG.md                                   # content/schema changes per release
```

The HTTP API contract and deployment topology are **not** in this public
content repo — they're integration internals of the private stack,
maintained with the backend server.

## Versioning

Releases are SemVer git tags (`vX.Y.Z`) cut on `main`; the git tag is the
source of truth (there is no `package.json`/`VERSION` file to bump). Before
making a schema/shape change to `content/`/`settings/`, read
`docs/versioning.md` — it defines what counts as a **breaking** (MAJOR)
change vs additive content (MINOR) vs a fix (PATCH), and how a git-sync
consumer pins to a tag instead of tracking `main`. Record
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
extracted from sarnamibhasa.nl; where its spelling disagrees
with the book, prefer the book's diacritic-correct form.

`content/sarnami/units/*.json` reference vocab/lesson-content by id
(`vocabRef`, `contentRef`) rather than embedding literal text — the actual
prompt/example-sentence/grammar-note text lives in
`content/sarnami/lessons/*.json`, keyed by `contentRef`.

An `ExampleSentence`/`fill-blank` exercise may carry an optional
`tokenVocabRefs: (string | null)[]` sibling to its sentence text (`word` /
`sentenceTemplate`), one entry per `sentence.trim().split(/\s+/)` token,
pointing at the matching `VocabItem.id` (or `null` for a word with no direct
vocab entry — see api-contract.md's "Optional per-word translation refs"
section, issue #67). It's authored incrementally, unit by unit (issue #229)
— only map a token to a vocab id already listed in that sentence's own
`vocabRefs`, don't introduce a new implicit vocab association a human
author hasn't curated. Two things that look odd but are correct:
- The same vocab id can repeat across consecutive entries — a multi-word
  vocab entry (e.g. `"Rām Rām"`) spans multiple whitespace tokens, and each
  of *those* tokens points back at that one vocab id.
- `null` means "no tooltip for this token" (function word, inflected form,
  punctuation-only, ...), not an error or a placeholder to fill in later.
  If every token in a sentence would be `null`, omit `tokenVocabRefs`
  entirely instead of authoring an all-`null` array — it conveys nothing a
  reader/consumer can't already infer from the field being absent.

## Localization (nl/en)

Content is authored Dutch-first — `defaultUiLanguage` in
`settings/sarnami/language-settings.json` is `"nl"`, since the audience is
Dutch-speaking. Dutch-facing strings carry a parallel `en` gloss via
`{nl, en}` translation maps: `VocabItem.translations`,
`Unit.titleTranslations`, `Lesson.titleTranslations`, and per-exercise
`promptTranslations`/`optionTranslations`/`leftTranslations`/
`rightTranslations` in `content/sarnami/lessons/*.json`. Legacy bare-string
fields (`prompt`, `options`, etc.) are kept alongside the `*Translations`
map for old consumers — this was an additive/MINOR migration (see
`docs/versioning.md`), not a replacement. Never touch a Sarnami
target-language token (`correctTargetTokens`, `distractorTokens`,
`sentenceTemplate`, `correctAnswer`, matching left-side Sarnami words) when
adding/editing an `en` gloss — those aren't translated, only the nl/en
prose around them is.

This completes the per-unit English-authoring side of the "English UI shows
Dutch content" epic. The other half — propagating `defaultUiLanguage` across
the frontend/backend repos, and a fallback for any string this repo hasn't
authored an `en` gloss for — is implemented there, not in this content repo.

`settings/sarnami/ui/{en,nl}/strings.json` is a separate concern from the
`*Translations` maps above: it's static app-chrome text (nav labels, button
text, empty-states) keyed by UI language, not per-item content translation.
Don't conflate the two when adding a language-facing string — chrome text
goes in `settings/sarnami/ui/`, authored content glosses go in the
`*Translations` fields on the relevant `content/sarnami/` item.

## CI content validation

Every PR and manual dispatch runs `.github/workflows/validate-content.yml`,
which clones `rarelang-server` (private; auths via `RARELANG_SERVER_TOKEN`)
and runs its `validate-content` CLI against `content/sarnami/` +
`settings/sarnami/` — the same content-repository contract the backend
server's loader expects, checked here instead of only surfacing downstream
after a tag is cut. `contracts.lock.json` pins the sha256 of the upstream
contract docs last reviewed; a `contracts-discovery` job flags when
rarelang-server changes one of those docs so a human/agentic follow-up can
assess drift (a deliberate, non-automatic gate — like bumping a dependency
lockfile). A separate `advisory-contract-review` job runs a cost-bounded
Claude Code pass (only on diffs touching `content/`/`authored_docs`, capped
turns, non-blocking) for the two judgment-shaped contracts that aren't
schema-checkable: CEFR-tier correctness and the A2 Dutch-readability
ceiling.

## Branding

Colors are derived from the Suriname flag; the canonical values live in
`settings/sarnami/language-settings.json`'s `branding.colors` (RGB-triplet
strings, consumed at runtime by the frontend app's theming — not
hardcoded Tailwind config anywhere in this repo, since there's no frontend
build here). The PWA icon set (favicon + `icons/*.png`) is generated and
owned by the frontend app (migrated from
this repo) — regenerate/redesign it there, not here.

## Deployment

There's no build/deploy pipeline in this repo. The frontend app is
built/deployed independently, and this repo's content reaches
the backend server via a git-sync sidecar, not a copy baked
into any image. The full deployment topology lives with the backend server,
not here.
