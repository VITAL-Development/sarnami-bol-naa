# /gen-sentences — generate candidate example sentences from a Byākaran chapter

Part of the sentence-generation pipeline described in `sentence-drafts/README.md`
(tracking issue [#248](https://github.com/VITAL-Development/sarnami-bol-naa/issues/248)).

This repo's `.gitignore` excludes `.claude/` entirely, so this prompt isn't installed as a
tracked slash command. To use it as one locally, copy it to `.claude/commands/gen-sentences.md`
in your own checkout (it's plain Markdown, no repo-specific state); otherwise paste it into
Claude Code directly, substituting `$1` for the unit id yourself.

**Usage:** `/gen-sentences <unit-id>`, e.g. `/gen-sentences unit-08-verbs`.

---

Generate candidate example sentences for the unit `$1` and write them to
`sentence-drafts/$1.review.md`, following the format spec in `sentence-drafts/README.md` exactly
(read that file first). Start the file with a `Status: DRAFT` line, before the first `##
lesson:` heading — the human reviewer flips it to `FINALIZED` once review is complete; don't set
it to `FINALIZED` yourself.

## Context to read

1. `content/sarnami/units/$1.json` — get `bookChapterRef` (which file under
   `authored_docs/byakaran/` this unit is sourced from) and the list of lessons (`id`, `title`,
   `newVocab`, `exampleSentenceRefs`).
2. The chapter file named in `bookChapterRef`. This is the grammar source — paradigm tables,
   worked examples, section numbers (`§9.x`). Read the whole chapter, not just an excerpt; the
   rules that matter for a given lesson are often stated once and referenced implicitly
   elsewhere in the chapter.
3. `content/sarnami/vocab/*.json` files referenced by each lesson's `newVocab` (plus
   `grammar.json` for function words like `gram-hai`/`gram-na` that most sentences need). Pay
   attention to each vocab item's `notes` field — for verbs it typically carries the stem and
   worked conjugation examples the book itself uses.
4. `content/sarnami/lessons/$1.json` — the lessons file for this unit, to see the existing
   `exampleSentences[]` per lesson (their `id` naming pattern, and their actual sentences, which
   you must not duplicate).

## What to generate

For each lesson in the unit (skip a lesson that has no `newVocab`, e.g. a review lesson):

- Write a `## lesson: <lessonId>  (grammar point: <short description>, §<section>)` heading.
- Generate 3-6 new candidate sentences per lesson that exercise the grammar point the lesson's
  existing `exampleSentenceRefs` already exercise, but with different vocabulary (different verbs
  from `newVocab`, different nouns/pronouns as subjects/objects) so they add real variety instead
  of restating what's already authored.
- Every sentence must be directly justified by something in the chapter — a paradigm table row,
  a worked example, or an explicit rule statement. If you can't point to the specific paragraph
  or table row a sentence follows, don't generate it.
- Prefer combining an already-attested sentence pattern from the chapter's own worked examples
  with vocabulary from `newVocab`/`grammar.json`, over inventing a new sentence shape from the
  paradigm tables alone — the book's own example sentences are the safest scaffolding.
- Fill in every field from the format spec: `id` (new, following the existing `ex-<slug>-<n>`
  numbering, continuing from the highest existing `n` for that lesson), `sarnami`, `nl` (and
  `en` if you're confident of it), `vocabRefs` (ids that actually exist in the vocab files you
  read), and `rule` (cite the section number, e.g. "§9.7.1 present tense, consonant stem").
- Leave every checkbox unchecked (`- [ ]`) and do not write a `verify:` line — that's the next
  pipeline step, not this one.

## Guardrails

- Diacritics: copy Sarnami word forms verbatim from the byakaran chapter or existing
  vocab/example-sentence JSON. Never type a form from memory or normalize a diacritic away.
- Don't invent vocabulary — every content word in a candidate sentence must resolve to a
  `vocabRefs` id that exists in `content/sarnami/vocab/*.json`.
- If a lesson's grammar point isn't clear enough from the chapter to safely generate new
  sentences for, say so in that lesson's section (as a comment, no candidates) instead of
  guessing.
