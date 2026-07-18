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

Releases are cut as git tags `vX.Y.Z`. Entries accumulate under
`[Unreleased]` until a release is cut, at which point they move under a
dated `## [X.Y.Z]` heading.

## [Unreleased]

### Added

- `settings/sarnami/scs-word-list.json`: generated SCS-plain-Latin →
  canonical-diacritical word-level dictionary (`scripts/generate-scs-word-list.mjs`),
  the dictionary-lookup pass called for by #244's combined input flow (first
  pass, with the existing `transliteration-rules.json` digraph rule table as
  fallback for anything not listed here). Mechanically derived from
  `content/sarnami/vocab/*.json`'s `word` fields by reusing the existing,
  native-speaker-sourced `toScs` mapping in `scripts/scs-transliterate.mjs`
  (previously TTS-only) rather than a second stripping rule. Collisions
  where more than one canonical spelling folds to the same SCS spelling are
  marked `ambiguous: true` with every candidate listed, per the issue's "don't
  silently guess" requirement — 2 found in the current vocab bank
  (`mare`/`māre`, `nani`/`nānī`). Regenerate-and-diff checked in CI
  (`validate-scs-word-list`) so it can't drift from the vocab it's derived
  from, gated to only run when vocab or the generator itself changes. New
  file, additive; no existing shape changed. (part of #244)

## [0.6.0] - 2026-07-18

### Changed

- `content/sarnami/units/unit-05-pronouns.json`: reclassified `cefrLevel` from
  `A2` to `B1` and moved `order` from `5` to `6` (now the first Intermediate-tier
  unit, right before `unit-06-adverbs`). Resolves Finding 2 of #241: the unit
  teaches productive relative-clause formation (`jaun`/`je`/`jekar`) and
  case-inflected demonstrative object forms, which exceeds the Beginner
  tier's "no productive grammar beyond basic agreement" ceiling.
- `content/sarnami/units/unit-02-adjectives.json`: `order` moved from `6` to
  `5` to fill the Beginner-tier slot vacated by the pronouns move above; its
  `cefrLevel` (`A2`) is unchanged. Adjective agreement only needs the core
  personal pronouns already taught in `unit-01-basics`, not the fuller
  pronoun system, so this has no prerequisite impact.

### Added

- `content/sarnami/lessons/unit-01-basics.json`: authored `tokenVocabRefs`
  (per-word vocab-id mapping, api-contract.md §"Optional per-word
  translation refs", issue #67) on every example sentence and fill-blank
  exercise, powering a per-word translation tooltip in the learner-facing
  app (issue #229). Additive — other lessons don't have it yet and can pick
  it up incrementally per the same pattern.
- New vocab entries needed to give every token in `unit-01-basics.json` a
  full tooltip mapping (native-speaker-reviewed glosses):
  `verb-bolna` (bol-nā), `verb-sikhe` (sikhe), `verb-lave` (lāve) in
  `vocab/verbs.json`; `gram-hai-aux` (hai as an auxiliary, distinct from
  the copula `gram-hai`) and `gram-kaise` (kaise) in `vocab/grammar.json`;
  `noun-kam` (kām), `noun-bajar` (bajār), `noun-sauda` (saudā) in
  `vocab/nouns.json`; `post-se-locative` (se, locative sense, distinct from
  `post-se`/`gram-se`) in `vocab/postpositions.json`; `adv-ghare` (ghare)
  in `vocab/adverbs.json`.
- `settings/sarnami/language-settings.json`: `audio.ttsModel` field
  (`"facebook/mms-tts-hns"`), declaring the MMS-TTS model id this repo's own
  `scripts/generate-audio.mjs` uses when calling rarelang-server's
  `POST /audio/generate` (rarelang-server#79/#80). Additive, no shape change
  to existing fields.
- `settings/sarnami/transliteration-rules.json`: new rule table per the
  finalized cross-repo transliteration contract (rarelang-server#83), gated
  in CI by a new `validate-transliteration-rules` job against both the JSON
  Schema and `validateRuleTable()` from rarelang-server. New optional file;
  old consumers that don't read it are unaffected. (part of #244)
- `content/sarnami/units/unit-08-verbs.json` and
  `content/sarnami/lessons/unit-08-verbs.json`: 10 new example
  sentences/exercises plus `en` translations added to existing entries,
  drafted via a new Byākaran-derived sentence-generation pipeline (LLM
  draft → independent re-check → human review checklist →
  `scripts/extract-verified-sentences.mjs`) and extracted after human
  review of `sentence-drafts/unit-08-verbs.review.md`. No ids removed or
  changed shape — purely additive. (#250)

### Changed

- `content/sarnami/vocab/verbs.json`: reworded the `notes` field of all 29
  pre-existing entries out of dense linguistics-register Dutch (undefined
  abbreviations like `o.t.t.`/`o.v.t.`/`o.t.t.t.`/`v.v.t.` and jargon like
  `klinkerstam`, `causatief`, `lijdende vorm`, `aanvoegende wijs`) into
  plain A2-level Dutch, defining any remaining technical term in-line on
  first use — same-shape value edits only, no ids/fields/refs changed, per
  `source-language-authoring-contract.md` §2/§3. (#274)

## [0.5.0] - 2026-07-15

### Changed

- `content/sarnami/grammar/grammar.json`: reworked prose bullet lists / run-on
  paradigm sentences across 13 topics (nouns, numerals, about-sarnami,
  sounds, basics, adjectives, adverbs, postpositions, verbs, conjunctions,
  interjections, loanwords, word-formation) into markdown tables, matching
  the style already established for nouns/pronouns. Same-shape body value
  edits only — no ids, fields, or refs changed. (#233)
- `content/sarnami/units/{unit-08-verbs,unit-09-conjunctions,unit-10-interjections}.json`:
  renumbered `order` so CEFR progression is strictly non-decreasing
  (conjunctions 10→9, interjections 11→10, verbs 9→11) — `unit-08-verbs`
  (B2) previously sat ahead of the B1 units. `order` is only a sort key;
  ids and `lessonId`/prerequisite refs are unaffected, so this is
  non-breaking. Also defined "nevenschikkende"/"onderschikkende"/"bijzin"
  (unit-09) and "de aanvoegende wijs" (unit-08) inline in unit
  descriptions per the A2 source-language ceiling. (#213)

### Removed

- Removed all `flashcard` exercises (96 across `content/sarnami/units/*.json`
  and `content/sarnami/lessons/*.json`) and the `flashcard` entry from the
  two `generatedSpec.kinds` lists that carried it — `flashcard` is
  Review-only and must not be authored in Path lesson content (BREAKING,
  see `docs/versioning.md`), matching the platform contract
  (vital-development/rarelang-server#75). The Review (spaced-repetition)
  feature is unaffected: it synthesizes flashcard exercises directly from
  `vocab`, not from lesson `exercises`. Every affected lesson still has at
  least 3 exercises. (#237)

### Fixed

- Simplified the 9 grammar-note bodies in
  `content/sarnami/lessons/unit-05-pronouns.json` (`gn-poss-1`–`gn-poss-3`,
  `gn-dem-1`–`gn-dem-3`, `gn-int-1`, `gn-int-2`, `gn-rel-1`) to meet the A2
  source-language readability ceiling in
  `docs/contracts/source-language-authoring-contract.md` §2/§2a — split
  dense multi-clause sentences and defined/removed jargon ("verbogen
  vorm", "meewerkend/lijdend voorwerp", "bijvoegelijk gebruikt",
  "deftigheid", "afstandelijkheid"). Flagged by an advisory contract
  review on #239. See #241.
- `content/sarnami/lessons/unit-05-pronouns.json`: simplified two exercise
  prompts (`ir-e2`, `rev-e7`) flagged by advisory contract review as above
  the A2 register ceiling ("zelfstandig en neutraal"/"zaak",
  "uitsluitend"). (#245)

## [0.4.2] - 2026-07-14

### Changed

- `content/sarnami/grammar/grammar.json`: reworked the `pronouns` topic's
  possessive/demonstrative/interrogative/relative paradigms from prose
  bullet lists into markdown tables, matching the table style already used
  in the `nouns` topic — same-shape `body` value edit only. (#233, #234)

### Fixed

- `content/sarnami/grammar/grammar.json`: simplified several `reading`
  topic phrases above the A2 Dutch-readability ceiling ("verkwist",
  "onthaalt", "komt tot inkeer", "rampzalige gevolgen") flagged by the
  advisory contract review on #234.

## [0.4.1] - 2026-07-14

### Fixed

- Simplified authoring prose across unit/lesson titles+descriptions,
  exercise prompts, and vocab/grammar notes/glosses in
  `content/sarnami/units/*.json` and `content/sarnami/vocab/*.json` to meet
  the A2 source-language readability ceiling in
  `docs/contracts/source-language-authoring-contract.md` §2/§2a — replaced
  anglicisms, dense compounds, and passive/embedded-clause constructions
  with plainer wording, and stripped citation/verification apparatus
  (already captured in each item's `tags`) out of learner-facing `notes`
  fields. Same-shape value edits only — no ids, refs, or field shapes
  changed. (#217, #218, #219, #226)
- `content/sarnami/lessons/unit-04-nouns.json`: trimmed the "Naamvallen"
  lesson to actively drill only the `ke` postposition (possession, indirect
  object), deferring the full postposition inventory (`se`, `meṃ`, `par`,
  `ke lage`) to `unit-07-postpositions` (Intermediate/B1), whose
  `bookChapterRef` is the dedicated source for that system; `se`/`par`
  example sentences remain as passive exposure only. Also simplified
  `unit-04-nouns` grammar-note prose (`gn-04-gender-1`, `gn-04-number-1`,
  `gn-04-cases-1`, `gn-04-gender-2`) per the A2 source-language ceiling.
  Same-shape edits — no vocab ids removed, only which ones this lesson
  actively drills. (#227, #228)

## [0.4.0] - 2026-07-11

### Added

- `settings/sarnami/ui/{en,nl}/strings.json` — UI-chrome string tables (nav,
  grammar section, lesson/review/profile/settings/startup/exercise copy)
  served by `GET /ui-strings?lang=`. Previously `settings/sarnami/ui/` didn't
  exist at all, so the endpoint had no data for any UI language and the
  frontend silently fell back to its bundled English example table — the
  Grammar section rendered "Grammar"/"Back to topics" even with
  `defaultUiLanguage: "nl"`. Fixes #208.
- `cefrLevel` populated on all 14 units in `content/sarnami/units/*.json`,
  backfilling the optional unit-level field from
  `docs/contracts/lesson-plan-authoring-contract.md` §3 (rarelang-server)
  using the CEFR tiers already established in `authored_docs/lesson-plan.md`
  (#200). Additive/optional field — old consumers ignore it. Fixes #211.

## [0.3.0] - 2026-07-10

### Added

- English (`en`) localization for all 14 units (unit-00 through unit-13):
  `en` glosses for every `VocabItem.translations`, `WordBankContent.promptTranslations`
  and `FillBlankContent.translations` map (map-based scope of #157–#170), plus the
  additive `*Translations` schema migration for previously bare-string fields —
  `Unit.titleTranslations`, `Lesson.titleTranslations`,
  `MultipleChoiceContent.promptTranslations` (and `optionTranslations` where
  options are language-bearing rather than Sarnami teaching tokens), and
  `MatchingContent.pairs[].leftTranslations`/`rightTranslations` (this unit's
  slice of the schema gap identified in #156). No `nl` value was removed or
  edited and no Sarnami target-language token (`correctTargetTokens`,
  `distractorTokens`, `sentenceTemplate`, `correctAnswer`, matching left-side
  Sarnami words) was touched — purely additive, old consumers reading only
  `nl`/the bare string are unaffected. Completes the per-unit English
  authoring and schema-gap sub-issues of the "English UI shows Dutch
  everywhere" epic (#154); combined with the `defaultUiLanguage` setting
  (0.2.0) and the `GET /grammar` reference (below), an English-language UI
  now reads as English throughout instead of falling back to Dutch. Closes
  #156, closes #154.
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
- `settings/sarnami/language-settings.json`: new top-level `defaultUiLanguage`
  field, set to `"nl"` — declares Dutch as the default interface language for
  the Sarnami deployment (the audience is Dutch-speaking). Additive/MINOR: a
  consumer that doesn't read the field is unaffected. Intended to be surfaced
  by the backend on `GET /languages` and consumed by the frontend as the
  default UI language when the user hasn't chosen one, so the app no longer
  starts in English over Dutch-only content. See sarnami-bol-naa#155.
- Real grammar-reference content for the remaining 12 topics in
  `content/sarnami/grammar/grammar.json` (`GET /grammar`): about-sarnami,
  sounds, basics, pronouns, adjectives, adverbs, postpositions, verbs,
  conjunctions, interjections, loanwords, word-formation and reading —
  consolidating each unit's already-authored per-lesson grammar notes into
  one browsable reference note per topic. Completes the standalone grammar
  reference so it covers every unit (#153); `units/` and `lessons/` are
  untouched, only the separate `GET /grammar` reference changes. Removed the
  `verb-to-be` scaffold placeholder, superseded by the authored `basics` and
  `verbs` notes.

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
