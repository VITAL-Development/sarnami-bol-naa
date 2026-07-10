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

- Real grammar-reference content for the nouns topic in
  `content/sarnami/grammar/grammar.json` (served by the backend's `GET /grammar`
  endpoint): replaced the `nouns` placeholder with a consolidated note covering
  geslacht, enkelvoud/meervoud and functie (achterzetsels), and added a
  `numerals` note (hoofdtelwoorden, gebruik, rangtelwoorden). Distilled from
  `authored_docs/byakaran/02-the-noun.md`, image-verified diacritics. First
  topic of populating the standalone grammar reference (#153). Note: the
  per-lesson grammar notes in `content/sarnami/lessons/*.json` were already
  complete for all units; this fills the separate `GET /grammar` reference,
  which still held only scaffold placeholders.
- Grammar-reference note `about-sarnami` ("Over het Sarnami") for `unit-00-about-sarnami` in `content/sarnami/grammar/grammar.json` (served by `GET /grammar`): consolidates the unit's per-lesson grammar notes into one browsable reference entry so the PWA grammar screen covers this unit. Part of #153.
- Grammar-reference note `sounds` ("Klanken & uitspraak") for `unit-03-sounds` in `content/sarnami/grammar/grammar.json` (served by `GET /grammar`): consolidates the unit's per-lesson grammar notes into one browsable reference entry so the PWA grammar screen covers this unit. Part of #153.
- Grammar-reference note `basics` ("Basis") for `unit-01-basics` in `content/sarnami/grammar/grammar.json` (served by `GET /grammar`): consolidates the unit's per-lesson grammar notes into one browsable reference entry so the PWA grammar screen covers this unit. Part of #153.
- Grammar-reference note `pronouns` ("Voornaamwoorden") for `unit-05-pronouns` in `content/sarnami/grammar/grammar.json` (served by `GET /grammar`): consolidates the unit's per-lesson grammar notes into one browsable reference entry so the PWA grammar screen covers this unit. Part of #153.
- Grammar-reference note `adjectives` ("Bijvoeglijke naamwoorden") for `unit-02-adjectives` in `content/sarnami/grammar/grammar.json` (served by `GET /grammar`): consolidates the unit's per-lesson grammar notes into one browsable reference entry so the PWA grammar screen covers this unit. Part of #153.

## [0.2.0] - 2026-07-09

### Added

- `content/sarnami/units/{unit-01-basics,unit-02-adjectives}.json`: opt-in,
  id-keyed `generatedSpec` on the two units' review lessons
  (`lesson-5-review`, `lesson-9-adjectives-review`) — additive, the fixed
  `exercises` arrays are left in place — so the seeded exercise-arrangement
  generator (rarelang-server#37) can serve a freshly varied exercise mix on
  each replay. Every id is a foreign key into this repo's own vocab; no
  content text moves into the engine (#147).
- `settings/sarnami/language-settings.json`: documented the anusvara `ṁ`
  (nasalization of the preceding vowel) in `romanization.diacritics`, alongside
  the existing `ñ`/`ṅ` nasals, so the correct nasal is discoverable and content
  doesn't drift back to a bare `m` (#149). Additive `diacritics` array entry —
  no shape change.
- Content for `unit-13-reading` ("Lezen: teksten & fabels"), the capstone
  reading unit authored on top of the merged structure scaffold (#119). Source
  chapter: `authored_docs/byakaran/11-texts.md` (BIJLAGEN). Adds 15
  passage-specific words in the new `content/sarnami/vocab/reading.json` drawn
  from three graded passages — Bijlage 1 *Nātī aur nānī ke khissā* (nānī, nātī,
  bakarī, peṛ, bhūjā), Bijlage 2 *Herāil beṭavā* (beṭā, bāp, dhan, naukar, pāp)
  and Bijlage 3 *Canak siyar* in the simplified SCS spelling (siyar, kaiman,
  akkil, tagat, jangal) — image-verified diacritics, tagged `book-pNN` +
  `needs-verification`. Lesson content lives in
  `content/sarnami/lessons/unit-13-reading.json` (per-text intro/passage/
  keyword grammar notes plus comprehension exercises) and wires up the
  scaffold's four lessons (text 1 / text 2 / text 3 / review) with `newVocab`,
  `grammarNoteRefs` and `exercises`. As a capstone it reuses earlier units'
  vocab/connectives by id (e.g. `noun-ghar`, `struct-en`, `struct-dan`,
  `struct-weer`, `struct-maar`). Exercise mix per the issue: `multiple-choice`
  comprehension leads, backed by `fill-blank` (cloze), `word-bank` (sentence
  reconstruction) and `matching` (passage vocab) in the content lessons, and a
  review lesson mixing all five kinds.
- Content for `unit-12-word-formation` ("Woordvorming"), authored on top of the
  merged structure scaffold (#118, follow-up to #102; supersedes scaffold #131).
  Source chapter: `authored_docs/byakaran/10-word-formation.md`. Adds 16
  derived-form vocab entries in the new `content/sarnami/vocab/word-formation.json`
  — native derivational suffixes (ghumakkaṛ, piyakkaṛ, lŏhār, sŏnār, paṛhāī,
  safāī, ṭopī-vālā, macharī-vālā) and Arabic-Persian suffixes/prefixes (imāndār,
  dukāndār, jādūgar, kārīgar, davā-khānā, chapkhānā, becain, nā-lāyak) — with
  image-verified diacritics, tagged `book-pNN` + `needs-verification`. Adds the
  lesson content (grammar notes on the suffix/prefix families + exercises) in
  `content/sarnami/lessons/unit-12-word-formation.json`, and wires up the
  scaffold's three lessons (native suffixes / Arabic-Persian suffixes+prefixes /
  review) with `newVocab`, `grammarNoteRefs` and `exercises`. Exercise mix per
  the issue: `matching` (suffix↔meaning), `multiple-choice` (which derived form)
  and `fill-blank` (build the derived word) in the two content lessons; the
  review lesson mixes all five exercise kinds and carries a higher `xpReward`.
- Content for `unit-11-loanwords` ("Leenwoorden & nieuwvormingen"), authored on
  top of the merged structure scaffold (#117, follow-up to #101). Source chapter:
  `authored_docs/byakaran/09-loan-words-and-neologisms.md`. Adds 21 loanwords in
  the new `content/sarnami/vocab/unit-11-loanwords.json` — Dutch, English and
  Sranantongo verb borrowings formed with the auxiliaries kare/hove (bel kare,
  klop kare, uitleg kare, beledig kare, bekeur kare, wachti kare, help kare,
  mooi kare, lūrū kare, būṭū bhare, don kare, lās kare, hambog kare, pharyam
  kare, riwŏrs kare, boro kare, trīkī kare, yūrū kare, morsū kare) plus two fully
  assimilated neologisms (lĕsiyāī, sĕtiyāve) — image-verified diacritics, tagged
  `book-pNN` + source-language + `needs-verification` (only `don` is confirmed by
  the second source `sarnamibhasa-vocab.md` and drops `needs-verification`), the
  lesson content in `content/sarnami/lessons/unit-11-loanwords.json` (grammar
  notes on the kare/hove pattern, Sranantongo-via-Dutch routing and
  volksetymologie + exercises), and wires up the scaffold's three lessons (Dutch
  / Sranantongo & other / review) with `newVocab`, `grammarNoteRefs` and
  `exercises`. Exercise mix per the issue: `flashcard`, `matching`
  (loanword↔origin/meaning) and `multiple-choice` in the two content lessons (no
  `word-bank`), and a review lesson mixing all five kinds with a higher
  `xpReward`.
- Content for `unit-08-verbs` ("Werkwoorden"), the curriculum's largest chapter,
  authored on top of the merged structure scaffold (#116, follow-up to #100).
  Source chapter: `authored_docs/byakaran/08-the-verb.md`. Adds 30 verbs taught
  as stems in the new `content/sarnami/vocab/verbs.json` (paṛhe, kare, bole,
  dekhe, sune, khāī, jāī, āve, kīne, sūte, likhe, khele, leve, deve, pīye, pūche,
  khoje, samjhe, cale, baiṭhe, uṭhe, dhove, rove, sīye, pahine, nāce, haṁse,
  māre, mare, kāṭe — image-verified diacritics, tagged `book-pNN` +
  `needs-verification`), lesson content in
  `content/sarnami/lessons/unit-08-verbs.json` (grammar notes carrying the full
  present/past/future/imperative/subjunctive paradigms of the model verb paṛhe,
  the irregular jāī → gail-, the continuous/perfect and causative forms, plus
  example sentences and exercises), and wires up the scaffold's six lessons
  (present → past → future → imperative → subjunctive → review) with `newVocab`,
  `exampleSentenceRefs`, `grammarNoteRefs` and `exercises`. Generalises the
  fixed forms `gram-hai`/`gram-na`/`gram-kaham` from `unit-01-basics` into the
  full conjugation paradigm (reused by id, not duplicated). Exercise mix per the
  issue: `fill-blank` (conjugated form) and `word-bank` (build the clause)
  dominate the five content lessons, alongside `matching` (person ↔ ending),
  `multiple-choice` (which tense/mood) and `flashcard` (stems); the review
  lesson mixes all five exercise kinds and carries a higher `xpReward` (15 vs 10).
- Content for `unit-09-conjunctions` ("Voegwoorden"), authored on top of the
  merged structure scaffold (#114, follow-up to #98). Source chapter:
  `authored_docs/byakaran/06-conjunctions.md`. Adds 6 new conjunctions in the new
  `content/sarnami/vocab/conjunctions.json` — coordinating yā to (of wel),
  kā … kā … (zowel … als …), nā … nā … (noch … noch …) and subordinating jaune
  (opdat, zodat), cāhe (ook al, hoewel), jab talak (zolang); image-verified
  diacritics, tagged `book-p49`/`book-p50` (all confirmed against
  `authored_docs/sarnamibhasa-vocab.md`, so no `needs-verification`). Reuses the
  10 conjunctions already in `content/sarnami/vocab/structuurwoorden.json`
  (struct-en/maar/of/dat/als/dan/omdat/anders/sinds/toch) by id without
  duplicating them. Adds the lesson content in
  `content/sarnami/lessons/unit-09-conjunctions.json` (grammar notes on
  coordinating vs subordinating conjunctions and correlative pairs + example
  sentences reusing existing noun/pronoun/adjective vocab) and wires up the
  scaffold's three lessons (coordinating / subordinating / review) with
  `newVocab`, `exampleSentenceRefs`, `grammarNoteRefs` and `exercises`. Exercise
  mix per the issue: `matching`, `fill-blank` (choose the conjunction),
  `word-bank` (join clauses) and `multiple-choice` in the two content lessons,
  and a review lesson mixing all five exercise kinds with a higher `xpReward`.
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

### Fixed

- Spelling: nasalized Sarnami words now use the anusvara `ṁ` (nasalization of
  the preceding vowel) instead of a bare consonant `m`, per the IAST-derived
  scheme in `authored_docs/byakaran/01-sounds.md` (closes #149). Corrected
  display text (words, options, tokens, matching pairs, grammar-note bodies) —
  `haim` → `haiṁ` (हैं), `kahām` → `kahāṁ` (कहाँ), `mem` → `meṁ` (में),
  `nahīm to` → `nahīṁ to` (नहीं), and the explicitly-nasalized direction
  adverbs `nicvām` → `nicvāṁ` / `uparām` → `uparāṁ` (plus the Nickeriaans
  variants `emām`/`omām` → `emāṁ`/`omāṁ`). **Display text only**: vocab **ids**
  (`gram-kaham`, `post-mem`, `struct-in`, …) and their `vocabRef`/`vocabRefs`
  are left unchanged, so this is a PATCH, not a breaking id rename. Consonant
  `m` (`ham`, `Rām`, `kām`, `Sarnām`, …) and Dutch glosses are untouched.

## [0.1.0] - 2026-07-05

### Added

- Grammar content (`content/sarnami/grammar/grammar.json`) for
  the consuming server's `GET /grammar` endpoint.
- Versioning policy (`docs/versioning.md`): SemVer via annotated git tags as
  the source of truth, breaking/non-breaking definitions tied to the on-disk
  content/settings schema, and how a git-sync deployment pins to
  a tag instead of tracking `main`. Also this `CHANGELOG.md`.
