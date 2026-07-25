# Dictionary-growth tooling: design

Status: **design only — not implemented**. Tracked by [#282](https://github.com/VITAL-Development/sarnami-bol-naa/issues/282).

## Context

`#281` built `settings/sarnami/scs-word-list.json`, the SCS-plain-Latin →
canonical-diacritical word list that serves as the first pass of the
transliteration input flow described in `#244`. Words not yet in that list
fall back to the digraph rule table (`settings/sarnami/transliteration-rules.json`,
consumed client-side in `rarelang-pwa` via `applyRuleTable`), which lets a
contributor manually build up a word character-by-character but produces no
record that the word was missing from the dictionary.

`#244`'s design, step 4 ("Dictionary growth"), calls for treating every
rule-table-fallback usage as a candidate to add to the dictionary, so that
over time contributors need the manual digraph fallback less often:

> every time the rule-table fallback (step 2) is used to manually produce a
> word that isn't in the dictionary yet, that's a candidate to add to the
> dictionary...

This document proposes a design for capturing, reviewing, and promoting
those candidates. It does not implement any of it — see
[Sequencing and why this isn't implemented yet](#sequencing-and-why-this-isnt-implemented-yet).

## Capture: where a fallback usage gets recorded

The dictionary lookup itself does not exist in `rarelang-pwa` yet — as of
this writing `useTransliteration`/`TransliterationField` only run
`applyRuleTable` (the digraph rule table), with no dictionary-lookup pass in
front of it. That first-pass lookup is the scope of `rarelang-pwa#80`. Until
it lands, there is no code path that can distinguish "the dictionary was
checked and this word wasn't in it" from "the dictionary doesn't get
checked at all" — i.e. no observable fallback event to instrument.

Once `#80` lands, the natural capture point is inside the same per-word
lookup that decides to fall back: after `#80`'s dictionary-lookup step
returns "not found" and control passes to `applyRuleTable` for a given word,
that's the fallback event. Proposed shape, deliberately lightweight given
this repo has no cross-repo telemetry sync mechanism (the same constraint
`useTransliteration`'s raw-mode preference already works around by using
local storage instead of a server-side settings API):

- Maintain an in-memory (session-scoped) list of `{ word, timestamp }`
  entries on the hook/field, appended whenever the dictionary lookup misses
  and the rule table is used for a word.
- Persist that list to `localStorage` under its own versioned key, following
  the same interim pattern already used twice in this codebase for
  per-user/per-session state with no backend to write to: the
  `rarelang-transliteration-raw-mode-v1` key (`useTransliteration.ts`'s
  raw-mode toggle) and the `rarelang-dev-transliteration-v1` key
  (`useDevTransliterationEdits.ts`'s per-word Devanagari-correction edits,
  read/write wrapped in try/catch, exposed via an `exportJson` helper). Note
  `useDevTransliterationEdits` itself is a *different* mechanism — it
  captures manually-typed Devanagari corrections for the hidden
  `/dev/transliteration` page (issue rarelang-pwa#86), unrelated to the
  ASCII rule-table typing aid this issue is about — but its
  read/write/export shape is the right one to copy for fallback-candidate
  capture, not something to extend directly.
- Expose it only through a dev-only surface (e.g. alongside
  `src/routes/DevTransliteration.tsx`, or a new sibling dev route) as a
  simple "export fallback candidates" action — e.g. a button that dumps the
  accumulated list as JSON to the clipboard or a downloaded file, mirroring
  `useDevTransliterationEdits`'s `exportJson`. No new production UI, no
  network calls, no analytics/telemetry service.

This keeps capture entirely client-side and opt-in-by-usage: a contributor
(or maintainer testing the widget) triggers fallback usage by typing, and
can export what accumulated. It does not attempt real-time or
cross-session aggregation across multiple contributors — that would need a
server-side collection endpoint, which is out of scope until there's
evidence the manual/local flow is insufficient.

## Review: how candidates get surfaced for human review

Given the capture mechanism above is a manual export, review is a manual,
low-frequency process:

1. A maintainer (or contributor) periodically exports the fallback-candidate
   JSON from the dev route described above.
2. The exported file is submitted the same way other content changes are —
   e.g. pasted into a PR description, attached to an issue, or committed as
   a throwaway file under a path like `tmp/fallback-candidates.json` — for
   a human to read.
3. A maintainer skims the candidate list and manually judges which words
   are (a) real, correctly-spelled Sarnami words worth adding, versus
   (b) typos, test input, or words that already exist in
   `content/sarnami/vocab/**` under a different tokenization/spelling.

This intentionally does not propose a script in this repo (`sarnami-bol-naa`)
that ingests a candidates file automatically — a review script's value
depends entirely on candidate volume, and there's no data yet on how often
the rule-table fallback actually fires in practice once `#80` ships. If
volume turns out to be high enough that manual skimming doesn't scale, a
small script to dedupe candidates against the existing word list (flagging
only genuinely-new tokens) would be a reasonable, easy follow-up — but
building it ahead of that evidence risks the "tooling for tooling's sake"
failure mode.

## Promotion: how an approved candidate reaches `scs-word-list.json`

`settings/sarnami/scs-word-list.json` is a **generated** artifact — like a
lockfile — built by `scripts/generate-scs-word-list.mjs` from the `word`
fields of `content/sarnami/vocab/*.json`, and CI (`validate-content.yml`'s
`validate-scs-word-list` job) fails a PR whose committed word-list file has
drifted from what the generator would produce. It is never hand-edited.

So promoting an approved fallback candidate is **not** "add an entry to
`scs-word-list.json`" — it's:

1. Confirm the word is a genuine Sarnami word not already covered by an
   existing `content/sarnami/vocab/*.json` entry (existing entries may
   already produce it via `tokenizeWord`'s per-word splitting of
   multi-word `word` values — check `settings/sarnami/scs-word-list.json`
   first, since re-adding a word that already resolves there is a no-op).
2. Add or edit a vocab entry in the appropriate
   `content/sarnami/vocab/*.json` file (translations, tags, notes, etc. —
   the normal content-authoring flow already used for `#281` and every
   other vocab addition).
3. Re-run `node scripts/generate-scs-word-list.mjs` and commit the
   regenerated `scs-word-list.json` alongside the vocab change, same as any
   other vocab PR.

No new promotion tooling is needed for this step — it reuses the existing
vocab-authoring and generator workflow. The only genuinely new piece this
issue introduces is capture (above), not promotion.

## Sequencing and why this isn't implemented yet

The capture design above depends on a dictionary-lookup step existing in
`rarelang-pwa`'s transliteration widget so there's a real "fallback was
used" event to hook into. That step is the scope of
**`rarelang-pwa#80`** ("Wire SCS word-list dictionary lookup into
transliteration widget as first pass"), which was still open and
unimplemented as of 2026-07-25 (this design doc's writing date) — confirmed
directly against the issue, not inherited secondhand. As of the same date,
`useTransliteration.ts` only runs `applyRuleTable` (the digraph rule
table); there is no dictionary-lookup pass in front of it yet. Writing
capture code against the current rule-table-only flow would mean logging
*every* word typed (since there is no dictionary pass to miss against yet),
which is not what this issue asks for and would need to be reworked once
`#80` lands anyway.

Recommendation:

- Keep `#282` open, scoped to design (this document) for now — do not mark
  it as requiring closure by this PR.
- Once `rarelang-pwa#80` has landed, open a follow-up implementation issue
  (in `rarelang-pwa`, since capture is widget-side) that references this
  design doc and `#80` as prerequisites, covering the capture step above.
- Treat the review and promotion steps as process (documented here), not
  code, unless/until candidate volume from real usage justifies a review
  script.
