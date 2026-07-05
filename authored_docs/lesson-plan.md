# Sarnami lesson plan

The single source of truth for the app's **unit/lesson curriculum**. Each
per-chapter unit is authored against this plan so that scope, sequencing and
vocab ownership stay consistent across units and nothing is taught twice.

This is a planning/design doc, not served content. It guides authoring order.
For the on-disk content model (`vocabRef`/`contentRef`, verification tags,
directory layout) see [`../CLAUDE.md`](../CLAUDE.md); for how content ships,
see [`../docs/versioning.md`](../docs/versioning.md).

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
  `description`, an integer `order` (display sort key), an optional
  `bookChapterRef`, and an ordered list of **lessons**.
- A **lesson** lists `newVocab` (vocab ids it introduces), optional
  `exampleSentenceRefs` / `grammarNoteRefs`, an ordered `exercises` array, and
  an `xpReward`. The prompt/sentence/note text itself lives in the parallel
  `content/sarnami/lessons/*.json`, keyed by `contentRef`; vocab lives in
  `content/sarnami/vocab/*.json`, keyed by `vocabRef`.
- **Exercise kinds** the engine supports: `multiple-choice`, `flashcard`,
  `word-bank`, `fill-blank`, `matching`.

Native/explanation language is **Dutch (`nl`)** throughout, matching the
existing units and the byakaran source.

## Unit sequence

Units are ordered pedagogically, not by chapter number: orientation and sounds
come first, productive grammar builds on the basics, and reading is a capstone.
Two units already exist — `unit-01-basics` and `unit-02-adjectives` — and keep
their **ids** (ids are the stable reference used by any consumer). Their
`order` values are reassigned to fit the sequence below as each new unit lands;
because `order` is only a sort key and ids don't change, renumbering it is an
**additive/non-breaking** content change (see `docs/versioning.md`).

| # | Unit id | Title (nl) | Source chapter | Status |
|---|---------|------------|----------------|--------|
| 1 | `unit-00-about-sarnami` | Over het Sarnami | `00-introduction.md` | new |
| 2 | `unit-03-sounds` | Klanken & uitspraak | `01-sounds.md` | new |
| 3 | `unit-01-basics` | Basis | *(intro subset of 02/03)* | **exists** |
| 4 | `unit-04-nouns` | Zelfstandige naamwoorden | `02-the-noun.md` | new |
| 5 | `unit-05-pronouns` | Voornaamwoorden | `03-pronouns.md` | new |
| 6 | `unit-02-adjectives` | Bijvoeglijke naamwoorden | `adjective-verified.md` | **exists** |
| 7 | `unit-06-adverbs` | Bijwoorden | `04-the-adverb.md` | new |
| 8 | `unit-07-postpositions` | Achterzetsels | `05-postpositions.md` | new |
| 9 | `unit-08-verbs` | Werkwoorden | `08-the-verb.md` | new |
| 10 | `unit-09-conjunctions` | Voegwoorden | `06-conjunctions.md` | new |
| 11 | `unit-10-interjections` | Tussenwerpsels | `07-interjections.md` | new |
| 12 | `unit-11-loanwords` | Leenwoorden & nieuwvormingen | `09-loan-words-and-neologisms.md` | new |
| 13 | `unit-12-word-formation` | Woordvorming | `10-word-formation.md` | new |
| 14 | `unit-13-reading` | Lezen: teksten & fabels | `11-texts.md` | new |

New unit ids are numbered `00` and `04`–`13` so they don't collide with the two
existing ids; the **`order` column** (1–14) is what actually drives display
sequence. (An implementer may instead choose to renumber all unit ids to a
clean `unit-01`…`unit-14`; if so, do it as one dedicated change and update every
`unitId` back-reference — the id-preserving scheme above avoids that churn.)

## Sequencing & dependencies

- **Orientation first, no prerequisites.** `unit-00-about-sarnami` is
  background/cultural and can be taken cold.
- **Sounds before everything productive.** `unit-03-sounds` teaches the
  romanization (macrons ā/ī/ū, underdots ṭ/ḍ/ṇ, ñ/ṅ) that every later unit
  relies on for correct spelling. It gates the grammar units.
- **Basics before deep grammar.** `unit-01-basics` already teaches greetings,
  the core personal pronouns, a handful of nouns, and `hai`/negation. The
  deeper noun and pronoun units **extend** it and must not re-teach that
  starter set (see *Overlap* below).
- **Nouns & pronouns before adjectives/verbs.** Agreement (adjective→noun,
  verb→subject) presupposes gender/number and the pronoun system.
- **Postpositions after nouns/pronouns** — they attach to them.
- **Verbs are the spine of sentence-building** and unlock everything after.
- **Conjunctions & interjections** are light and can slot in any time after
  basics, but sit best just before reading (they glue clauses together).
- **Reading is the capstone.** `unit-13-reading` reuses vocab and grammar from
  earlier units and should introduce little new machinery — only reading
  strategy and passage-specific vocab.
- **Word formation late.** It teaches learners to *derive* vocabulary from
  patterns, which only pays off once they have a base to build on.

## Overlap with the existing basics unit

`unit-01-basics` intentionally front-loads a small, high-frequency slice of
later chapters. The deeper units own the rest:

- **Nouns** — basics teaches `noun-ghar`, `noun-bhai`, `noun-maiya`, etc. as
  bare vocab. `unit-04-nouns` owns gender, number, case behaviour and numerals;
  it may *reuse* those vocab ids in examples but introduces no duplicate
  entries and adds its own `newVocab`.
- **Pronouns** — basics teaches the five core personal pronouns
  (`pron-ham`/`tu`/`ap`/`u`/`hamlog`). `unit-05-pronouns` completes the system
  (possessive, demonstrative, interrogative, relative) and does **not**
  re-introduce the five.
- **`hai` / negation** — basics teaches `gram-hai`, `gram-na`, `gram-kaham` as
  fixed forms. `unit-08-verbs` generalises them into the full conjugation
  paradigm.

Rule of thumb: a vocab entry has exactly one owning lesson (its `newVocab`);
every other lesson references it by id.

## Per-unit scope

Sizing follows the existing units: **4–5 lessons per unit**, **~5 exercises per
lesson** (review lessons ~6), ending each unit with a **review lesson**
(`newVocab: []`, mixed exercises, higher `xpReward`). Vocab counts below are
targets, to be met only with entries verifiable against the book or
`sarnamibhasa-vocab.md`; unverified entries carry `needs-verification`.

### 1. `unit-00-about-sarnami` — Over het Sarnami (`00-introduction.md`)
Background/cultural, reading-led. What Sarnami is, the name's origin, the
British-Indian immigration history, and an at-a-glance look at the
writing/romanization system.
- ~2–3 short reading lessons + a light review. Little to no productive drilling.
- Vocab: a small set of key terms/proper nouns (flashcard-worthy), not a
  general vocab set.
- **Exercise mix:** heavy `multiple-choice` comprehension + a few `flashcard`
  for key terms. No `word-bank`/`fill-blank` (nothing to construct yet).

### 2. `unit-03-sounds` — Klanken & uitspraak (`01-sounds.md`)
The foundation unit: vowels (*klinkers*), consonants (*medeklinkers*), and the
diacritics. Teaches learners to recognise and distinguish sounds and their
spellings.
- ~4 lessons: vowels & macrons → consonants → the special diacritics
  (ṭ/ḍ/ṇ, ñ/ṅ) → review.
- Vocab: minimal-pair example words rather than a themed vocab set.
- **Exercise mix:** `matching` (symbol ↔ sound/description), `multiple-choice`
  (which spelling / which sound), `flashcard` (diacritic recognition). Avoid
  `word-bank`; use `fill-blank` only for "pick the correctly-spelled form".

### 4. `unit-04-nouns` — Zelfstandige naamwoorden (`02-the-noun.md`)
Gender (*geslacht*), number, case behaviour, plus the chapter's numeral
subsections. Extends the basics nouns.
- ~5 lessons: gender → number/plurals → cases → numerals → review.
- Vocab target ~20–25 new nouns + numerals (own vocab file, e.g.
  `vocab/nouns.json` extension and a `vocab/numerals.json`).
- **Exercise mix:** full mix; lean on `fill-blank` (case/number endings),
  `matching` (noun ↔ gender), `word-bank` (noun phrases).

### 5. `unit-05-pronouns` — Voornaamwoorden (`03-pronouns.md`)
Completes the pronoun system beyond the basics' personal pronouns: possessive,
demonstrative, interrogative, relative.
- ~4 lessons: possessive → demonstrative → interrogative & relative → review.
- Vocab ~15–20 pronoun forms (extends `vocab/pronouns.json`).
- **Exercise mix:** `matching` (form ↔ meaning), `fill-blank` (choose the right
  pronoun in a sentence), `word-bank`, `multiple-choice`.

### 7. `unit-06-adverbs` — Bijwoorden (`04-the-adverb.md`)
Common adverbs of time, place, manner and degree, including the loanword
adverbs the chapter discusses, with example sentences.
- ~3–4 lessons grouped by category → review.
- Vocab ~15–20 adverbs.
- **Exercise mix:** `flashcard` + `matching` (adverb ↔ category/meaning),
  `fill-blank` and `word-bank` (place the adverb correctly in a sentence).

### 8. `unit-07-postpositions` — Achterzetsels (`05-postpositions.md`)
Sarnami uses postpositions, not prepositions: the common ones and how they
attach to nouns/pronouns.
- ~3–4 lessons → review. Depends on nouns/pronouns.
- Vocab ~10–15 postpositions.
- **Exercise mix:** `word-bank` is the workhorse (word order + attachment),
  plus `fill-blank` (choose the postposition) and `matching`.

### 9. `unit-08-verbs` — Werkwoorden (`08-the-verb.md`)
The largest chapter and the sentence-building spine. Conjugation across tenses
and moods including the subjunctive (*aanvoegende wijs*). Split by difficulty.
- **~6–7 lessons** (the one unit that runs longer): present → past → future →
  imperative → subjunctive → (optional aspect/compound verbs) → review. May be
  delivered as two shipped sub-units if it grows unwieldy.
- Vocab ~25–30 verbs, taught as stems with their conjugations in
  `grammarNotes`.
- **Exercise mix:** `fill-blank` (conjugated form) and `word-bank` (build the
  clause) dominate; `matching` (person ↔ ending), `multiple-choice` (which
  tense/mood), `flashcard` for stems.

### 10. `unit-09-conjunctions` — Voegwoorden (`06-conjunctions.md`)
Coordinating and subordinating conjunctions; joining clauses. Pairs with
reading. Several forms already live in `vocab/structuurwoorden.json` — reuse
them, don't duplicate.
- ~2–3 lessons → review.
- **Exercise mix:** `word-bank` (join two clauses), `fill-blank` (choose the
  conjunction), `matching`.

### 11. `unit-10-interjections` — Tussenwerpsels (`07-interjections.md`)
Short, high-frequency, conversational: common exclamations and discourse
particles. Some (`hāṁ`, `nā`) already exist in `vocab/greetings.json` — reuse.
- ~2 lessons → review.
- **Exercise mix:** `flashcard` + `matching` (interjection ↔ situation/meaning),
  light `multiple-choice`.

### 12. `unit-11-loanwords` — Leenwoorden & nieuwvormingen (`09-loan-words-and-neologisms.md`)
Dutch/Sranantongo/other loanwords and coined modern terms. A vocab-expansion
unit; cross-check spellings per the verification discipline.
- ~3 lessons grouped by source language → review.
- Vocab ~20 loanwords, each tagged with `book-pNN` / source.
- **Exercise mix:** `flashcard` + `matching` (loanword ↔ origin/meaning),
  `multiple-choice`. Little productive grammar.

### 13. `unit-12-word-formation` — Woordvorming (`10-word-formation.md`)
Derivational suffixes (incl. those of Arabic-Persian origin) and how words are
built — recognising patterns to expand vocabulary. Best placed late.
- ~3 lessons by suffix family → review.
- **Exercise mix:** `matching` (suffix ↔ meaning), `multiple-choice` (which
  derived form), `fill-blank` (build the derived word). Meta over rote.

### 14. `unit-13-reading` — Lezen: teksten & fabels (`11-texts.md`)
Capstone/applied: the fables and reading passages (with Dutch translations)
from the *BIJLAGEN*. Graded comprehension that reuses earlier vocab and grammar.
- ~3–4 graded reading lessons → review; sits at the end.
- Introduces little new machinery — reading strategy + passage vocab only.
- **Exercise mix:** `multiple-choice` comprehension leads; `word-bank`
  (reconstruct a sentence from the passage), `fill-blank` (cloze over known
  words), `matching` (passage vocab).

## Exercise-type reference

| Kind | Best for |
|------|----------|
| `flashcard` | Raw vocab memorisation, both directions (`target-to-native`, `native-to-target`). |
| `matching` | Sets of pairs: form↔meaning, symbol↔sound, noun↔gender, adverb↔category. |
| `multiple-choice` | Meaning recognition, "which rule/tense/spelling", reading comprehension. |
| `fill-blank` | One targeted slot: case ending, verb conjugation, correct pronoun/postposition. |
| `word-bank` | Word order & construction: noun phrases, postposition attachment, whole clauses. |

Progression within a unit: recognition first (`flashcard`/`multiple-choice`),
then production (`fill-blank` → `word-bank`), with `matching` for consolidation.
Review lessons mix all five and carry the highest `xpReward`.

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
  unit ships the common tenses/moods; long-tail forms are a later addition.
