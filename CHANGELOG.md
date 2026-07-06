# Changelog

All notable changes to this repo's **published content and settings**
(`content/sarnami/`, `settings/sarnami/`) are recorded here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
repo follows [Semantic Versioning](https://semver.org/) via annotated git
tags — see [`docs/versioning.md`](docs/versioning.md) for the scheme and the
precise definition of what counts as a **breaking** (MAJOR) vs additive
(MINOR) vs fix (PATCH) change.

This log tracks **content and schema-relevant** changes — anything a
consuming server syncing this repo would care about (new/changed
vocab, units, lessons, or `language-settings.json` shape). Pure grammar-doc
or tooling edits that don't affect served content need not appear.

Releases are cut as git tags `vX.Y.Z`. There are no tags yet; the entries
below accumulate under `[Unreleased]` until the first release is cut, at
which point they move under a dated `## [X.Y.Z]` heading.

## [Unreleased]

### Added

- Content for `unit-10-interjections` ("Tussenwerpsels"), authored on top of the
  merged structure scaffold (#115, follow-up to #99). Source chapter:
  `authored_docs/byakaran/07-interjections.md`. Adds 15 high-frequency
  interjections/discourse particles in the new
  `content/sarnami/vocab/interjections.json` (acchā, he, ho, cup, ayā, bacāo,
  bhalā, bāp-re-bāp, sābās, vāh-vāh, albat, cor-cor, hāy-hāy, oho, to —
  image-verified diacritics, tagged `book-p50`; `acchā` and `to` confirmed
  against `authored_docs/sarnamibhasa-vocab.md`, the rest carry
  `needs-verification`), the lesson content in
  `content/sarnami/lessons/unit-10-interjections.json` (grammar notes on what
  interjections express, the he/ho attention-callers, and particles/loanwords +
  exercises), and wires up the scaffold's two lessons (interjections / review)
  with `newVocab`, `grammarNoteRefs` and `exercises`. Reuses `hāṁ` (`greet-ja`)
  and `nā` (`greet-nee`) from `vocab/greetings.json` in the review. Exercise mix
  per the issue: `flashcard` + `matching` (interjection↔situation/meaning) +
  light `multiple-choice` in the content lesson (no `word-bank`/`fill-blank`),
  and a review lesson mixing all five kinds with a higher `xpReward`.
- Content for `unit-03-sounds` ("Klanken & uitspraak"), authored on top of the
  merged structure scaffold (#109, follow-up to #93). Source chapter:
  `authored_docs/byakaran/01-sounds.md`. Adds 19 sound-example words in the new
  `content/sarnami/vocab/sounds.json` — vowel/consonant/diacritic examples drawn
  from the book's klinker/medeklinker tables (ām, insān, ultā, ainā, aurat,
  kaun, khet, cor, chūrī, phul, garīb, roṭī, ḍar, laṛkā, jhaṇḍā, kaiñcī, Laṅkā,
  bhāṣā, śānti — image-verified diacritics, tagged `book-pNN` +
  `needs-verification`), the lesson content in
  `content/sarnami/lessons/unit-03-sounds.json` (grammar notes on macrons,
  aspiration, retroflex onderpunt and nasale tilde + exercises), and wires up
  the scaffold's four lessons (vowels / consonants / diacritics / review) with
  `newVocab`, `grammarNoteRefs` and `exercises`. Exercise mix per the issue:
  `matching` (symbol↔sound), `multiple-choice` and `flashcard` in the three
  content lessons (no `word-bank`), and a review lesson mixing all five kinds.
- Content for `unit-00-about-sarnami` ("Over het Sarnami"), authored on top of
  the merged structure scaffold (#108, follow-up to #92): reading-led
  orientation notes and exercises in
  `content/sarnami/lessons/unit-00-about-sarnami.json`, and a small set of key
  terms / proper nouns in the new
  `content/sarnami/vocab/about-sarnami.json` (Sarnāmī, Sarnām, Hindustani,
  Bhojpurī, Avadhī, girmiṭ, Lalla Rookh — tagged `book-pNN` +
  `needs-verification`). The scaffold's three lessons are wired up with
  `newVocab`, `grammarNoteRefs` and `exercises`: heavy `multiple-choice`
  comprehension plus a few `flashcard`s in the reading lessons, and a review
  lesson mixing all five exercise kinds.
- A writing/romanization teaser lesson `unit-00-about-sarnami-writing`
  ("Schrift & romanisatie") in `content/sarnami/units/unit-00-about-sarnami.json`
  and `content/sarnami/lessons/unit-00-about-sarnami.json`: an at-a-glance look
  at the devanagari script and the scientific romanization (macrons, retroflex
  dots, nasalization, aspirated consonants) as a teaser for `unit-03-sounds`,
  plus a new key term `about-devanagari` (devanāgarī) in
  `content/sarnami/vocab/about-sarnami.json` (tagged `book-p29` +
  `needs-verification`) and a matching review exercise (closes #92).

### Changed

- Reassigned unit `order` values to fit the `authored_docs/lesson-plan.md`
  sequence as new units land: `unit-01-basics` 1 → 3 and `unit-02-adjectives`
  2 → 6 (`unit-00-about-sarnami` = 1 and `unit-03-sounds` = 2 unchanged). Unit
  **ids** are stable; `order` is only a sort key, so this is an
  additive/non-breaking change (see `docs/versioning.md`).
- `content/sarnami/vocab/greetings.json`: reworded two `notes` strings to drop
  an internal PR citation (same-shape notes-string edit; no schema or
  served-field change).

## [0.1.0] - 2026-07-05

### Added

- Grammar content (`content/sarnami/grammar/grammar.json`) for
  the consuming server's `GET /grammar` endpoint.
- Versioning policy (`docs/versioning.md`): SemVer via annotated git tags as
  the source of truth, breaking/non-breaking definitions tied to the on-disk
  content/settings schema, and how a git-sync deployment pins to
  a tag instead of tracking `main`. Also this `CHANGELOG.md`.
