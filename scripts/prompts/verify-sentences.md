# /verify-sentences — independent second-pass verification of a generated sentence draft

Part of the sentence-generation pipeline described in `sentence-drafts/README.md`
(tracking issue [#248](https://github.com/VITAL-Development/sarnami-bol-naa/issues/248)).

This repo's `.gitignore` excludes `.claude/` entirely, so this prompt isn't installed as a
tracked slash command. To use it as one locally, copy it to
`.claude/commands/verify-sentences.md` in your own checkout (it's plain Markdown, no
repo-specific state); otherwise paste it into Claude Code directly, substituting `$1` for the
unit id yourself.

**Usage:** `/verify-sentences <unit-id>`, e.g. `/verify-sentences unit-08-verbs`.

---

Run an **independent** verification pass over `sentence-drafts/$1.review.md` and add a
`verify:` line to every candidate. This is the second pass mentioned in issue #248 — its job is
to catch generation errors before a human reviewer ever sees the draft, so treat every candidate
as unproven, including its stated `rule`.

Use Sonnet-level judgment for this (per #248's discussion): grammatical correctness in a
low-resource language is a judgment call, not a mechanical check, so don't rubber-stamp a
candidate just because its `rule` field sounds plausible — re-derive the correctness from the
source material yourself.

## Method

1. Read `sentence-drafts/$1.review.md` for the candidates.
2. Read `content/sarnami/units/$1.json` for `bookChapterRef`, then read that whole chapter under
   `authored_docs/byakaran/` yourself — do not rely on the candidate's `rule` citation without
   checking it. Also read the vocab files referenced by the unit's `newVocab`.
3. For each candidate, independently check:
   - **Grammar point**: does the sentence actually demonstrate the rule its `rule` field claims
     (correct paradigm form / word order / agreement per the chapter section cited)? Find and
     cross-check that specific section/table row yourself.
   - **Vocab**: does every `vocabRefs` id exist and does the Sarnami word in the sentence
     actually match that vocab item's `word` (accounting for the inflection the grammar point
     requires)?
   - **Well-formedness**: is the sentence a sentence a fluent speaker following this grammar
     would plausibly produce, not just a mechanically-correct-looking string?
   - **Novelty**: is it meaningfully different from the unit's existing `exampleSentences` (not
     a near-duplicate with one word swapped in a way that doesn't teach anything new)?
4. Append a `verify:` line to each candidate:
   - `verify: PASS — <one-line reason citing what you checked>`
   - `verify: FAIL — <specific problem: wrong ending, wrong word order, vocabRef mismatch,
     grammar point not actually demonstrated, etc.>`
5. Do **not** check or uncheck any `- [ ]`/`- [x]` boxes — that decision belongs to the human
   reviewer. Do not delete or rewrite candidates; only add the `verify:` line.
6. Write the updated file back to `sentence-drafts/$1.review.md`.

If you cannot verify a candidate confidently either way (e.g. the source material is genuinely
ambiguous), say so explicitly: `verify: FAIL — insufficient source evidence to confirm <specific
thing>`. Treat "I'm not sure" as FAIL, never as PASS — the human reviewer only sees PASS rows as
a positive signal, so an unproven candidate must not read as one.
