# Verification checklist — `unit-02-adjectives`

This unit **already exists** (`content/sarnami/units/unit-02-adjectives.json`,
lessons in `content/sarnami/lessons/unit-02-adjectives.json`). Per
`authored_docs/lesson-plan.md` it is a **verify-and-complete** task, not a
rebuild. Source chapter: `authored_docs/byakaran/adjective-verified.md`.

Canonical placement in the merged plan: **order 6** (currently `order: 2` in the
unit JSON — reassigning it is an id-stable, non-breaking sort-key change, to be
done as part of the integration that also bumps `unit-01-basics` to `order: 3`).

## To verify against `adjective-verified.md`

- [ ] **Three forms** — stem / long / longer (*stam / lang / langer*) are all
      taught and spelled per the chapter.
- [ ] **Indefinite vs. definite** meaning distinction is covered.
- [ ] **Gender & number agreement** (lesson `lesson-7-adjective-agreement`)
      matches the chapter's paradigm.
- [ ] **Comparison** (lesson `lesson-8-comparison`) — comparative/superlative
      forms and the `se` / `sabse` constructions are correct.
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
