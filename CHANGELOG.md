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

- Content for `unit-04-nouns` ("Zelfstandige naamwoorden"), authored on top of
  the merged structure scaffold (#110, follow-up to #94). Source chapter:
  `authored_docs/byakaran/02-the-noun.md`. Extends
  `content/sarnami/vocab/nouns.json` with 13 new nouns (kuttā, ghoṛā, peṛ, ām,
  gāī, gadahā, gadahī, laundā, chaumṛī, nānā, nanī, nāk, chūrī — image-verified
  diacritics, tagged `book-pNN` + `needs-verification`) and adopts the two
  previously-unowned entries `noun-beti` (beṭī) and `noun-citthi` (ciṭṭhi) into
  this unit; the basics nouns (`noun-ghar`/`noun-bhai`/`noun-maiya` …) are
  reused by id in examples without duplication. Adds the new
  `content/sarnami/vocab/numerals.json` with the 12 cardinal numerals
  0–10 + 100 (sunnā, ek, dūi, tīn, cār, pāṃc, chau, sāt, āṭh, nau, das, sau).
  Lesson content in `content/sarnami/lessons/unit-04-nouns.json` (grammar notes
  on gender, korte/lange vorm + meervoud, achterzetsels/naamvallen and the
  cardinals, plus example sentences and exercises), and wires up the scaffold's
  five lessons (geslacht / getal & meervoud / naamvallen / telwoorden / review)
  with `newVocab`, `exampleSentenceRefs`, `grammarNoteRefs` and `exercises`.
  Exercise mix per the issue: full mix leaning on `fill-blank` (case/number),
  `matching` (noun↔gender, cijfer↔telwoord) and `word-bank` (noun phrases) in
  the content lessons, with a review lesson mixing all five kinds and a higher
  `xpReward`.
- Content for `unit-07-postpositions` ("Achterzetsels"), authored on top of the
  merged structure scaffold (#113, follow-up to #97). Source chapter:
  `authored_docs/byakaran/05-postpositions.md`. Adds 13 postpositions in the new
  `content/sarnami/vocab/postpositions.json` — the four primary achterzetsels
  (mem, se, par, ke) plus nine samengestelde ke-vormen (ke uppar, ke nicce,
  ke bhittar, ke bāhar, ke sāth, ke binā, ke lage, ke āge, ke piche) — image-verified
  diacritics, tagged `book-pNN` (+ `needs-verification` where not confirmed against
  the second source `authored_docs/sarnamibhasa-vocab.md`). Lesson content in
  `content/sarnami/lessons/unit-07-postpositions.json` (grammar notes on the
  post-nominal position, the primary vs ke-compound split, the pronoun rule where
  ke drops and the pronoun goes possessive — hamār binā — and the optional -e
  ending, plus exercises), and wires up the scaffold's three lessons
  (common / attachment / review) with `newVocab`, `exampleSentenceRefs`,
  `grammarNoteRefs` and `exercises`. Exercise mix per the issue: `word-bank`
  (word order + attachment) as the workhorse plus `fill-blank`, `matching` and
  `flashcard` in the two content lessons, and a review lesson mixing all five
  kinds. Example sentences reuse existing `noun-ghar` / `pron-*` ids.
- Content for `unit-05-pronouns` ("Voornaamwoorden"), authored on top of the
  merged structure scaffold (#111, follow-up to #95). Source chapter:
  `authored_docs/byakaran/03-pronouns.md`. Extends
  `content/sarnami/vocab/pronouns.json` with 19 new pronoun forms (possessive
  hamār, tor, tŏṁhār, āpke, ekar, okar; demonstrative ī, eke, oke, inhan,
  unhan; interrogative ke, kaun, kā, kaunci, kekar; relative jaun, je, jekar —
  image-verified diacritics, tagged `book-pNN`, with `needs-verification` on the
  forms not yet cross-checked against `authored_docs/sarnamibhasa-vocab.md`). The
  five core personal pronouns (`pron-ham`/`tu`/`ap`/`u`/`hamlog`) are *not*
  re-introduced — basics owns them, and `ū` is reused by id in the demonstrative
  lesson. Adds the lesson content in
  `content/sarnami/lessons/unit-05-pronouns.json` (grammar notes on the
  possessive/demonstrative/interrogative/relative systems + exercises) and wires
  up the scaffold's four lessons (possessive / demonstrative /
  interrogative & relative / review) with `newVocab`, `grammarNoteRefs` and
  `exercises`. Exercise mix per the issue: `matching` (form↔meaning),
  `multiple-choice`, `fill-blank`, `flashcard` and `word-bank` (building a short
  possessive/demonstrative sentence from scrambled tokens) across the content
  lessons, and a review lesson mixing all five kinds.
- Content for `unit-06-adverbs` ("Bijwoorden"), authored on top of the merged
  structure scaffold (#112, follow-up to #96). Source chapter:
  `authored_docs/byakaran/04-the-adverb.md`. Adds 20 adverbs in the new
  `content/sarnami/vocab/adverbs.json` across time/place/manner/degree
  categories (āj, bihān, kāl, roj, hardam, uppar, nicce, dūr, nagicce, bāhar,
  dhīre, dhīre-dhīre, sacce, sait, bahut, thorā se, bilkul), including the
  chapter's loanword adverbs (habarā, kantī from Sranan Tongo; parsīs from
  Dutch) — image-verified diacritics, tagged `book-pNN` plus `needs-verification`
  where not yet confirmed against the sarnamibhasa.nl second source. Adds the
  lesson content in `content/sarnami/lessons/unit-06-adverbs.json` (grammar notes
  on the four adverb categories, nasalization → directional place adverbs,
  reduplication, and loanwords, plus exercises) and wires up the scaffold's three
  lessons (tijd & plaats / wijze & graad / review) with `newVocab`,
  `grammarNoteRefs` and `exercises`. Exercise mix per the issue: `flashcard`,
  `matching` (adverb↔category/meaning), `multiple-choice`, `fill-blank` and
  `word-bank` (adverb-placement — building a short sentence from scrambled
  tokens) across the two content lessons, and a review lesson mixing all five
  kinds.
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
