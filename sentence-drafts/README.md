# Sentence drafts — Byākaran-derived generation pipeline

Tracking issue: [#248](https://github.com/VITAL-Development/sarnami-bol-naa/issues/248).

This directory holds **candidate** example sentences generated from
`authored_docs/byakaran/*.md` (the digitized Marhé grammar book) plus the existing
`content/sarnami/vocab/*.json` — before any of it is promoted into live content. It exists so
new example sentences can be reviewed as plain Markdown (easy for a human to read and tick off)
rather than as raw JSON (hard to eyeball for correctness). Nothing here is authored content;
`content/sarnami/**` and `authored_docs/**` are unaffected until a file's checked items are
extracted.

`sentence-drafts/` is deliberately **outside** `content/` and `authored_docs/`, so it does not
trigger `advisory-contract-review` in `.github/workflows/validate-content.yml` (gated on those
two paths) — draft candidates aren't authored content and shouldn't be reviewed as if they were.

## Workflow

1. **Generate.** Run `/gen-sentences <unit-id>` (prompt: `scripts/prompts/gen-sentences.md` —
   this repo's `.gitignore` excludes `.claude/`, so it isn't a tracked slash command; see that
   file for how to install/use it). Reads that unit's `bookChapterRef` chapter, its vocab, and
   its existing `exampleSentences` (to avoid duplicating them), and writes
   `sentence-drafts/<unit-id>.review.md` in the format below, all boxes unchecked.
2. **Verify.** Run `/verify-sentences <unit-id>` (prompt: `scripts/prompts/verify-sentences.md`).
   An independent second pass (Sonnet — see #248's discussion of why Sonnet over Haiku here: this
   is a grammatical judgment call on a low-resource language, not a mechanical check) re-derives
   each candidate from the source material and sets a `verify:` line to `PASS` or `FAIL — <why>`.
   It never touches the checkboxes — that's the human's call.
3. **Human review.** Read the draft. Tick `- [x]` on exactly the candidates you personally
   confirm are correct, natural Sarnami. Leave everything else unchecked — including anything
   marked `verify: FAIL`, and anything `PASS` that still looks off to you. The checkbox is the
   real gate; `verify:` is input to your decision, not a substitute for it.
4. **Extract.** Run:
   ```
   node scripts/extract-verified-sentences.mjs --unit <unit-id> --dry-run
   ```
   to preview what would be added, then without `--dry-run` to write it. Only rows that are both
   `[x]` **and** `verify: PASS` are promoted into `content/sarnami/lessons/<unit-id>.json`
   (`exampleSentences[]`) and `content/sarnami/units/<unit-id>.json`
   (`lessons[].exampleSentenceRefs`). Re-running is safe — ids already present are skipped.

## Checklist format

One `##` section per lesson, one candidate per checkbox block. Field order doesn't matter but
the field names below do — they're exactly what the extractor parses:

```markdown
## lesson: unit-08-verbs-present  (grammar point: present tense, §9.7.1)

- [ ] id: ex-pres-4
      sarnami: Ham kitāb paṛhilā.
      nl: Ik lees een boek.
      vocabRefs: verb-parhe, gram-hai
      rule: 1sg present -ilā ending, consonant stem (§9.7.1)
      verify: PASS — pass-2: ending + SOV order correct
```

- `id` — must look like `ex-<something>` and must not already exist in the target lesson.
- `sarnami` — the full candidate sentence, diacritics exactly as sourced from the byakaran
  chapter or existing vocab/example sentences. Never normalize or drop diacritics (see
  `CLAUDE.md`'s note on `pdftotext` corruption — copy from the `.md`/JSON sources, not from a
  fresh PDF extraction).
- `nl` — Dutch gloss (required). `en` optional, same line format (`en: ...`) if provided.
- `vocabRefs` — comma-separated vocab ids; every one must exist in `content/sarnami/vocab/*.json`
  or extraction fails for that row.
- `rule` — free text, the grammar point this sentence is meant to demonstrate. Not written to
  JSON; it's there so a human reviewer (or the verify pass) can check the sentence actually
  demonstrates what it claims to.
- `verify` — written only by `/verify-sentences`, not by `/gen-sentences` or the human reviewer.

See `unit-08-verbs.review.md` in this directory for a full worked example against the verb
chapter.
