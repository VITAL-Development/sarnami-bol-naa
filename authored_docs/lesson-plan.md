# Sarnami lesson plan

The single source of truth for the app's **unit/lesson curriculum**. Each
per-chapter unit is authored against this plan so that scope, sequencing and
vocab ownership stay consistent across units and nothing is taught twice.

This is a planning/design doc, not served content. It guides authoring order.
For the on-disk content model (`vocabRef`/`contentRef`, verification tags,
directory layout) see [`../CLAUDE.md`](../CLAUDE.md); for how content ships,
see [`../docs/versioning.md`](../docs/versioning.md). The curriculum is
organized into three CEFR tiers — **Beginner (A1–A2)**, **Intermediate
(B1–B2)**, **Advanced (C1–C2)** — per the shared, cross-language
[lesson-plan authoring contract](https://github.com/VITAL-Development/rarelang/blob/main/docs/contracts/lesson-plan-authoring-contract.md);
that contract defines what each tier means, the required document shape, and
the `cefrLevel` unit field. This document covers only what's Sarnami-specific.

## Source material

The curriculum is built from the grammar reference in
[`byakaran/`](byakaran/) — a chapter-by-chapter romanization of *Sarnami
Byākaran* (Marhé, 1985) — cross-checked against
[`sarnamibhasa-vocab.md`](sarnamibhasa-vocab.md). One byakaran chapter maps to
one unit (the large verb chapter spans several lessons; the noun chapter's
numeral subsection is folded in). Every unit records its source chapter in the
unit JSON's `bookChapterRef`, as `unit-02-adjectives` already does.

## The content model, briefly

- A **unit** (`content/sarnami/units/*.json`) has an `id`, `title`,
  `description`, an integer `order` (display sort key), a `cefrLevel`
  (per the shared contract), an optional `bookChapterRef`, and an ordered
  list of **lessons**.
- A **lesson** lists `newVocab` (vocab ids it introduces), optional
  `exampleSentenceRefs` / `grammarNoteRefs`, an ordered `exercises` array, and
  an `xpReward`. The prompt/sentence/note text itself lives in the parallel
  `content/sarnami/lessons/*.json`, keyed by `contentRef`; vocab lives in
  `content/sarnami/vocab/*.json`, keyed by `vocabRef`.
- **Exercise kinds** the engine supports: `multiple-choice`, `word-bank`,
  `fill-blank`, `matching`.

Native/explanation language is **Dutch (`nl`)** throughout, matching the
existing units and the byakaran source.

## Tier overview

Units are ordered pedagogically within and across tiers, not by chapter
number: orientation and sounds come first, productive grammar builds on the
basics, and reading is a capstone. Two units already exist —
`unit-01-basics` and `unit-02-adjectives` — and keep their **ids** (ids are
the stable reference used by any consumer). Their `order`/`cefrLevel` values
are assigned to fit the sequence below; because `order`/`cefrLevel` are only
metadata and ids don't change, assigning or renumbering them is an
**additive/non-breaking** content change (see `docs/versioning.md` and the
shared authoring contract's `cefrLevel` versioning note).

| Tier | Units | CEFR range |
|---|---|---|
| Beginner | 5 | A1–A2 |
| Intermediate | 7 | B1–B2 |
| Advanced | 2 | C1 |

New unit ids are numbered `00` and `04`–`13` so they don't collide with the
two existing ids; the **`order` column** (1–14, spanning tiers) is what
actually drives display sequence. (An implementer may instead choose to
renumber all unit ids to a clean `unit-01`…`unit-14`; if so, do it as one
dedicated change and update every `unitId` back-reference — the id-preserving
scheme above avoids that churn.)

---

## Beginner tier (A1–A2)

*A learner completing this tier can greet people, introduce themselves and
their family, name everyday objects, form simple `hai` ("to be") sentences,
recognise and spell Sarnami's diacritics, and use basic adjectives and the
core personal pronouns — with no productive grammar beyond basic agreement.*

| # | Unit id | Title (nl) | CEFR | Source chapter | Status |
|---|---------|------------|------|----------------|--------|
| 1 | `unit-00-about-sarnami` | Over het Sarnami | A1 | `00-introduction.md` | new |
| 2 | `unit-03-sounds` | Klanken & uitspraak | A1 | `01-sounds.md` | new |
| 3 | `unit-01-basics` | Basis | A1 | *(intro subset of 02/03)* | **exists** |
| 4 | `unit-04-nouns` | Zelfstandige naamwoorden | A2 | `02-the-noun.md` | new |
| 5 | `unit-02-adjectives` | Bijvoeglijke naamwoorden | A2 | `adjective-verified.md` | **exists** |

### Sequencing & dependencies

- **Orientation first, no prerequisites.** `unit-00-about-sarnami` is
  background/cultural and can be taken cold.
- **Sounds before everything productive.** `unit-03-sounds` teaches the
  romanization (macrons ā/ī/ū, underdots ṭ/ḍ/ṇ, ñ/ṅ) that every later unit
  relies on for correct spelling. It gates the rest of this tier and every
  higher tier.
- **Basics before deep grammar.** `unit-01-basics` already teaches greetings,
  the core personal pronouns, a handful of nouns, and `hai`/negation. The
  deeper noun unit **extends** it and must not re-teach that starter set (see
  *Overlap* below).
- **Nouns before adjectives.** Agreement (adjective→noun) presupposes
  gender/number; the five core personal pronouns from `unit-01-basics` cover
  the pronoun side of that agreement, so adjectives don't need the fuller
  pronoun system (see below) as a prerequisite.
- No unit in this tier carries an Intermediate- or Advanced-tier
  prerequisite, per the shared contract's cross-tier sequencing rule.

### Overlap with the existing basics unit

`unit-01-basics` intentionally front-loads a small, high-frequency slice of
later chapters. The deeper units own the rest:

- **Nouns** — basics teaches `noun-ghar`, `noun-bhai`, `noun-maiya`, etc. as
  bare vocab. `unit-04-nouns` owns gender, number, case behaviour and numerals;
  it may *reuse* those vocab ids in examples but introduces no duplicate
  entries and adds its own `newVocab`.
- **Pronouns** — basics teaches the five core personal pronouns
  (`pron-ham`/`tu`/`ap`/`u`/`hamlog`). `unit-05-pronouns` (Intermediate tier —
  see below) completes the system (possessive, demonstrative, interrogative,
  relative) and does **not** re-introduce the five.
- **`hai` / negation** — basics teaches `gram-hai`, `gram-na`, `gram-kaham` as
  fixed forms. `unit-08-verbs` (Intermediate tier) generalises them into the
  full conjugation paradigm.

Rule of thumb: a vocab entry has exactly one owning lesson (its `newVocab`);
every other lesson references it by id — including across tier boundaries.

### Per-unit scope

Sizing follows the existing units: **4–5 lessons per unit**, **~5 exercises per
lesson** (review lessons ~6), ending each unit with a **review lesson**
(`newVocab: []`, mixed exercises, higher `xpReward`). Vocab counts below are
targets, to be met only with entries verifiable against the book or
`sarnamibhasa-vocab.md`; unverified entries carry `needs-verification`.

#### 1. `unit-00-about-sarnami` — Over het Sarnami (A1, `00-introduction.md`)
Background/cultural, reading-led. What Sarnami is, the name's origin, the
British-Indian immigration history, and an at-a-glance look at the
writing/romanization system.
- ~2–3 short reading lessons + a light review. Little to no productive drilling.
- Vocab: a small set of key terms/proper nouns, not a general vocab set.
- **Exercise mix:** heavy `multiple-choice` comprehension for key terms. No
  `word-bank`/`fill-blank` (nothing to construct yet).

#### 2. `unit-03-sounds` — Klanken & uitspraak (A1, `01-sounds.md`)
The foundation unit: vowels (*klinkers*), consonants (*medeklinkers*), and the
diacritics. Teaches learners to recognise and distinguish sounds and their
spellings.
- ~4 lessons: vowels & macrons → consonants → the special diacritics
  (ṭ/ḍ/ṇ, ñ/ṅ) → review.
- Vocab: minimal-pair example words rather than a themed vocab set.
- **Exercise mix:** `matching` (symbol ↔ sound/description), `multiple-choice`
  (which spelling / which sound / diacritic recognition). Avoid `word-bank`;
  use `fill-blank` only for "pick the correctly-spelled form".

#### 4. `unit-04-nouns` — Zelfstandige naamwoorden (A2, `02-the-noun.md`)
Gender (*geslacht*), number, case behaviour, plus the chapter's numeral
subsections. Extends the basics nouns.
- ~5 lessons: gender → number/plurals → cases → numerals → review.
- Vocab target ~20–25 new nouns + numerals (own vocab file, e.g.
  `vocab/nouns.json` extension and a `vocab/numerals.json`).
- **Exercise mix:** full mix; lean on `fill-blank` (case/number endings),
  `matching` (noun ↔ gender), `word-bank` (noun phrases).
- **Cases lesson scope (resolved via #227):** the `unit-04-nouns-cases` lesson
  was pre-empting `unit-07-postpositions` (Intermediate/B1) by actively
  drilling the full postposition inventory (`se`, `ke`, `meṃ`, `par`,
  compounds). Trimmed to actively teach only `ke` (possession, indirect
  object) — the achterzetsel most tied to basic noun relations — while
  keeping `se`/`par` example sentences for passive exposure only. The full
  postposition system remains owned by `unit-07-postpositions`, whose
  `bookChapterRef` (`05-postpositions.md`) is the dedicated source for it.

#### 5. `unit-02-adjectives` — Bijvoeglijke naamwoorden (A2, `adjective-verified.md`) *(exists)*
Already authored and verified: adjective forms, gender/number agreement, and
comparative/superlative formation (`lesson-8-comparison`; particles `se`,
`aur`, `jādā`, `sab se`, `sab se jādā`). No new authoring needed beyond
keeping its `order`/`cefrLevel` in step with this sequence.
**Revisited (issue #288 → #291):** the advisory-contract-review bot
repeatedly flagged this lesson against the shared contract's "no productive
grammar beyond basic agreement" A2 ceiling, reading its particle-based
comparison as the kind of "case or particle system" the contract reserves
for Intermediate. #291 initially split it into a new B1 unit on that basis,
but on review the comparative/superlative *paradigm itself* — the Sarnami
equivalent of English "-er/-est", a closed base/comparative/superlative
triad rather than an open-ended particle system — sits squarely in the A2
descriptor mainstream ESL/CEFR curricula use (comparatives/superlatives are
introduced at A2, refined at B1+), and the lesson's own grammar note
(`gn-8-1`) teaches `se`/`aur`/`jādā`/`sab se`/`sab se jādā` as one formation
rule, not a layered system with an advanced subset. There is no B1-level
subset to split out, so the lesson stays here, unsplit, at A2; the shared
contract has a clarifying carve-out for this (see
[rarelang#lesson-plan-authoring-contract.md](https://github.com/VITAL-Development/rarelang/blob/main/docs/contracts/lesson-plan-authoring-contract.md)
v2.1.0+).

---

## Intermediate tier (B1–B2)

*A learner completing this tier can produce connected sentences with the full
core grammar spine — the fuller pronoun system (possessive, demonstrative,
interrogative, relative), adverbs, postpositions, verb conjugation across
tenses and moods, conjunctions, and light interjections/loanword vocabulary —
and handle most everyday topics.*

| # | Unit id | Title (nl) | CEFR | Source chapter | Status |
|---|---------|------------|------|----------------|--------|
| 6 | `unit-05-pronouns` | Voornaamwoorden | B1 | `03-pronouns.md` | new |
| 7 | `unit-06-adverbs` | Bijwoorden | B1 | `04-the-adverb.md` | new |
| 8 | `unit-07-postpositions` | Achterzetsels | B1 | `05-postpositions.md` | new |
| 9 | `unit-09-conjunctions` | Voegwoorden | B1 | `06-conjunctions.md` | new |
| 10 | `unit-10-interjections` | Tussenwerpsels | B1 | `07-interjections.md` | new |
| 11 | `unit-08-verbs` | Werkwoorden | B2 | `08-the-verb.md` | new |
| 12 | `unit-11-loanwords` | Leenwoorden & nieuwvormingen | B2 | `09-loan-words-and-neologisms.md` | new |

### Sequencing & dependencies

- **Nouns (Beginner tier) and the core personal pronouns (`unit-01-basics`)
  before this tier's pronouns/adverbs/postpositions/verbs.** Agreement
  (verb→subject) and postposition attachment presuppose gender/number and at
  least the core pronoun set taught in the Beginner tier.
- **Pronouns lead this tier.** `unit-05-pronouns` completes the pronoun
  system (possessive, demonstrative, interrogative, relative) — including
  productive relative-clause formation and case-inflected demonstrative
  object forms, which is why it sits here rather than in the Beginner tier
  (see [issue #241](https://github.com/VITAL-Development/sarnami-bol-naa/issues/241)).
  Postpositions and verb agreement lean on the fuller system it teaches, so
  it comes first.
- **Postpositions after nouns/pronouns** — they attach to them.
- **Verbs are the spine of sentence-building** and unlock everything after.
  `unit-08-verbs` spans B1 (present/past/future) through B2 (imperative,
  subjunctive); it may ship as two sub-units if it grows unwieldy, but keeps
  a single `cefrLevel: "B2"` (its ceiling) on the unit unless split.
- **Conjunctions & interjections** are light and can slot in any time after
  the Beginner tier, but sit best just before this tier's later units (they
  glue clauses together).
- No unit in this tier carries an Advanced-tier prerequisite, per the shared
  contract's cross-tier sequencing rule; every unit here depends only on
  Beginner-tier material (see *Overlap*, Beginner tier above, for the
  `hai`/negation → full conjugation extension).

### Per-unit scope

Same sizing convention as the Beginner tier: **4–5 lessons per unit** (the
verb unit runs longer, see below), **~5 exercises per lesson**, review
lesson per unit.

#### 6. `unit-05-pronouns` — Voornaamwoorden (B1, `03-pronouns.md`)
Completes the pronoun system beyond the basics' personal pronouns: possessive,
demonstrative, interrogative, relative. Moved here from the Beginner tier
(see [issue #241](https://github.com/VITAL-Development/sarnami-bol-naa/issues/241)):
productive relative-clause formation (`jaun`/`je`/`jekar`) and case-inflected
demonstrative object forms (`eke`/`oke` vs. `ī`/`ū`) exceed the Beginner
tier's "no productive grammar beyond basic agreement" ceiling.
- ~4 lessons: possessive → demonstrative → interrogative & relative → review.
- Vocab ~15–20 pronoun forms (extends `vocab/pronouns.json`).
- **Exercise mix:** `matching` (form ↔ meaning), `fill-blank` (choose the right
  pronoun in a sentence), `word-bank`, `multiple-choice`.

#### 7. `unit-06-adverbs` — Bijwoorden (B1, `04-the-adverb.md`)
Common adverbs of time, place, manner and degree, including the loanword
adverbs the chapter discusses, with example sentences.
- ~3–4 lessons grouped by category → review.
- Vocab ~15–20 adverbs.
- **Exercise mix:** `matching` (adverb ↔ category/meaning), `fill-blank` and
  `word-bank` (place the adverb correctly in a sentence).

#### 8. `unit-07-postpositions` — Achterzetsels (B1, `05-postpositions.md`)
Sarnami uses postpositions, not prepositions: the common ones and how they
attach to nouns/pronouns.
- ~3–4 lessons → review. Depends on nouns/pronouns.
- Vocab ~10–15 postpositions.
- **Exercise mix:** `word-bank` is the workhorse (word order + attachment),
  plus `fill-blank` (choose the postposition) and `matching`.

#### 9. `unit-09-conjunctions` — Voegwoorden (B1, `06-conjunctions.md`)
Coordinating and subordinating conjunctions; joining clauses. Pairs with the
Advanced tier's reading unit. Several forms already live in
`vocab/structuurwoorden.json` — reuse them, don't duplicate.
- ~2–3 lessons → review.
- **Exercise mix:** `word-bank` (join two clauses), `fill-blank` (choose the
  conjunction), `matching`.

#### 10. `unit-10-interjections` — Tussenwerpsels (B1, `07-interjections.md`)
Short, high-frequency, conversational: common exclamations and discourse
particles. Some (`hāṁ`, `nā`) already exist in `vocab/greetings.json` — reuse.
- ~2 lessons → review.
- **Exercise mix:** `matching` (interjection ↔ situation/meaning), light
  `multiple-choice`.

#### 11. `unit-08-verbs` — Werkwoorden (B2, `08-the-verb.md`)
The largest chapter and the sentence-building spine. Conjugation across tenses
and moods including the subjunctive (*aanvoegende wijs*). Split by difficulty.
- **~6–7 lessons** (the one unit that runs longer): present → past → future →
  imperative → subjunctive → (optional aspect/compound verbs) → review. May be
  delivered as two shipped sub-units if it grows unwieldy.
- Vocab ~25–30 verbs, taught as stems with their conjugations in
  `grammarNotes`.
- **Exercise mix:** `fill-blank` (conjugated form) and `word-bank` (build the
  clause) dominate; `matching` (person ↔ ending), `multiple-choice` (which
  tense/mood).

#### 12. `unit-11-loanwords` — Leenwoorden & nieuwvormingen (B2, `09-loan-words-and-neologisms.md`)
Dutch/Sranantongo/other loanwords and coined modern terms. A vocab-expansion
unit; cross-check spellings per the verification discipline.
- ~3 lessons grouped by source language → review.
- Vocab ~20 loanwords, each tagged with `book-pNN` / source.
- **Exercise mix:** `matching` (loanword ↔ origin/meaning), `multiple-choice`.
  Little productive grammar.

---

## Advanced tier (C1)

*A learner completing this tier can derive new vocabulary from productive
word-formation patterns and read graded authentic texts (fables, passages)
with Dutch translations, applying the full grammar spine from lower tiers to
unfamiliar material.*

| # | Unit id | Title (nl) | CEFR | Source chapter | Status |
|---|---------|------------|------|----------------|--------|
| 13 | `unit-12-word-formation` | Woordvorming | C1 | `10-word-formation.md` | new |
| 14 | `unit-13-reading` | Lezen: teksten & fabels | C1 | `11-texts.md` | new |

This tier is deliberately the smallest and most likely to stay thin for a
while — both units depend on the full Intermediate-tier grammar spine and
genuine authentic source text (the *BIJLAGEN* fables/passages), so there is
no fabricated content here to pad it out. No further Advanced units are
currently planned beyond these two; if the book's rarer/long-tail verb
paradigms (see *Out of scope* below) are authored later, they would land
here as C2 material.

### Sequencing & dependencies

- **Word formation depends on the full Intermediate-tier grammar spine** — it
  teaches learners to *derive* vocabulary from patterns, which only pays off
  once they have a base to build on.
- **Reading is the capstone** and sits last — it reuses vocab and grammar from
  every lower tier and should introduce little new machinery, only reading
  strategy and passage-specific vocab.

### Per-unit scope

#### 13. `unit-12-word-formation` — Woordvorming (C1, `10-word-formation.md`)
Derivational suffixes (incl. those of Arabic-Persian origin) and how words are
built — recognising patterns to expand vocabulary. Best placed late.
- ~3 lessons by suffix family → review.
- **Exercise mix:** `matching` (suffix ↔ meaning), `multiple-choice` (which
  derived form), `fill-blank` (build the derived word). Meta over rote.

#### 14. `unit-13-reading` — Lezen: teksten & fabels (C1, `11-texts.md`)
Capstone/applied: the fables and reading passages (with Dutch translations)
from the *BIJLAGEN*. Graded comprehension that reuses earlier vocab and grammar.
- ~3–4 graded reading lessons → review; sits at the end.
- Introduces little new machinery — reading strategy + passage vocab only.
- **Exercise mix:** `multiple-choice` comprehension leads; `word-bank`
  (reconstruct a sentence from the passage), `fill-blank` (cloze over known
  words), `matching` (passage vocab).

---

## Exercise-type reference

| Kind | Best for |
|------|----------|
| `matching` | Sets of pairs: form↔meaning, symbol↔sound, noun↔gender, adverb↔category. |
| `multiple-choice` | Meaning recognition, "which rule/tense/spelling", reading comprehension. |
| `fill-blank` | One targeted slot: case ending, verb conjugation, correct pronoun/postposition. |
| `word-bank` | Word order & construction: noun phrases, postposition attachment, whole clauses. |

Progression within a unit: recognition first (`multiple-choice`), then
production (`fill-blank` → `word-bank`), with `matching` for consolidation.
Review lessons mix all four and carry the highest `xpReward`.

## Out of scope / deferred for a first release

- **Audio recording/playback** beyond what `language-settings.json`'s `audio`
  config already references — no new audio assets authored here.
- **Devanagari script.** Content is romanization-only for the first release;
  the noun/verb chapters' script tables are deferred.
- **Free-text / speaking / listening-transcription** exercise kinds — the
  engine ships the five kinds above; nothing here assumes more.
- **Spaced-repetition scheduling & mastery tracking** — engine/app concerns,
  not content.
- **Dialectal variation** beyond what the book documents; where sources
  disagree, prefer the book's diacritic-correct form and tag
  `needs-verification` until a second source confirms.
- **A fully exhaustive verb paradigm** (every rare compound/aspect) — the verb
  unit ships the common tenses/moods; long-tail forms are a later addition
  and, per the Advanced-tier note above, the most likely candidate for a
  future C2 unit.
