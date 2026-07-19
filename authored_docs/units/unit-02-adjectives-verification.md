# Verification checklist — `unit-02-adjectives`

This unit **already exists** (`content/sarnami/units/unit-02-adjectives.json`,
lessons in `content/sarnami/lessons/unit-02-adjectives.json`). Per
`authored_docs/lesson-plan.md` it is a **verify-and-complete** task, not a
rebuild. Source chapter: `authored_docs/byakaran/adjective-verified.md`.

Canonical placement in the merged plan: this unit stayed at **order 5, A2**.
(An earlier version of this checklist targeted `order: 6` before
`unit-01-basics`/`unit-02-adjectives` were reassigned to their current
`order: 3`/`order: 5`.)

**Update (issue #288, revisited on #291):** the advisory-contract-review bot
repeatedly flagged `lesson-8-comparison` (comparative/superlative particles
`se`/`aur`/`jādā`/`sab se`/`sab se jādā`) as exceeding the A2/Beginner-tier
"no productive grammar beyond basic agreement" ceiling. #291 first split it
into its own `unit-14-comparison` (B1) on that basis, then reverted the
split on review: `gn-8-1` teaches all five particles as one formation rule
(not a basic/advanced pair), and comparative/superlative morphology — the
Sarnami equivalent of English "-er"/"-est" — is A2-level in mainstream
CEFR-aligned curricula, refined further only at B1+. There is no B1 subset
of this lesson to carve out, so `lesson-8-comparison` stays here, unchanged,
at A2. Lessons 6-7-8 below are all in scope for this checklist.

## To verify against `adjective-verified.md`

- [ ] **Three forms** — stem / long / longer (*stam / lang / langer*) are all
      taught and spelled per the chapter.
- [ ] **Indefinite vs. definite** meaning distinction is covered.
- [ ] **Gender & number agreement** (lesson `lesson-7-adjective-agreement`)
      matches the chapter's paradigm.
- [ ] **Diacritics** on every adjective (`adj-*`) vocab entry verified against
      rendered page images (not raw extraction — see `CLAUDE.md`).
- [ ] Any vocab still tagged `needs-verification` is cross-checked against
      `authored_docs/sarnamibhasa-vocab.md` or cleared.

## Gaps to fill (if found)

- [ ] Add `fill-blank` / `word-bank` exercises covering the three forms +
      agreement if under-represented.
- [ ] Confirm the review lesson mixes all five exercise kinds.
- [ ] Set `order: 6` and record the change in `CHANGELOG.md` under
      `[Unreleased]` when the reorder lands.

Content authoring/verification itself is tracked in the follow-up issue linked
from the scaffold PR.
