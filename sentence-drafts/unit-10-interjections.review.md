# unit-10-interjections — candidate example sentences

Status: DRAFT

Source: `authored_docs/byakaran/07-interjections.md` (Sarnami Byākaran, Marhé 1985, chapter 8).
Generated per `/gen-sentences unit-10-interjections`, verified per
`/verify-sentences unit-10-interjections` (both passes performed manually while running the
pipeline against this unit — see PR description). Checkboxes reflect an actual human-review pass:
only `verify: PASS` rows are ticked.

This unit has only one vocab-bearing lesson (`unit-10-interjections-interjections`) and, per
issue #258, interjections are mostly single-word exclamations rather than paradigm-driven forms —
there is very little grammar to safely generalize from. The chapter itself supplies exactly two
worked multi-word compounds (`he dekh!` / `hĕdde`, `ho dekh!` / `hŏdde`); everything else in the
table is a bare, self-contained exclamation with no example of it combined with anything else.
Rather than invent sentence contexts the chapter doesn't support (the risk issue #258 explicitly
flags), this draft stays small: the two attested compounds, one attested bare exclamation used
exactly as the book presents it, and two candidates that were generated as plausible-sounding but
that verification rejected for going beyond what the chapter actually attests — kept in the draft
per the pipeline's "don't rubber-stamp" spirit rather than quietly dropped.

## lesson: unit-10-interjections-interjections  (grammar point: interjections & discourse particles, §8.1–8.2)

Existing `exampleSentences` for this lesson: none. No numbering to continue from; ids start at
`ex-int-1`.

- [x] id: ex-int-1
      sarnami: He dekh!
      nl: Zie hier!
      vocabRefs: int-he, verb-dekhe
      rule: §8.1 table gives the contracted form "hĕdde (= he dekh!) — zie hier!" verbatim — he
        (attention-getter, nearby, gn-int-2) plus the bare-stem tū imperative "dekh!" (verb-dekhe
        notes: "Gebiedende wijs dekh! (kijk!)"), the same imperative pattern already verified for
        this repo in unit-08-verbs (ex-imp-4 "Ghar dekh!").
      verify: PASS — the two-word form "he dekh!" is the chapter's own uncontracted expansion of
        hĕdde, given right in the §8.1 table with the gloss "zie hier!". dekh! matches verb-dekhe's
        own notes for the bare imperative exactly, and he matches int-he's word exactly. Not a
        near-duplicate of anything existing (lesson has zero prior exampleSentences).

- [x] id: ex-int-2
      sarnami: Ho dekh!
      nl: Zie daar!
      vocabRefs: int-ho, verb-dekhe
      rule: §8.1 table gives the contracted form "hŏdde (= ho dekh)! — zie daar!" verbatim — ho
        (attention-getter, distant, gn-int-2) plus the same bare-stem tū imperative "dekh!" as
        ex-int-1.
      verify: PASS — same reasoning as ex-int-1, mirrored for the distal form: "ho dekh!" is the
        chapter's own uncontracted expansion of hŏdde, glossed "zie daar!" in the §8.1 table. ho
        matches int-ho's word exactly. Legitimate proximal/distal pair with ex-int-1, not a
        restatement of it — same structure as unit-08's tense-pair variety.

- [x] id: ex-int-3
      sarnami: Sābās!
      nl: Bravo!
      vocabRefs: int-sabas
      rule: §8.1 table lists "sābās! — bravo!" as its own bare exclamation, used exactly as the
        book presents it (no compounding, no invented frame) — the same pattern already used for
        a bare-stem imperative in unit-08 (ex-imp-5 "Sun!", a one-word sentence with no object).
      verify: PASS — matches the book's own table row exactly, in isolation, which is how the
        chapter itself presents every simple exclamation in §8.1 — no additional context is
        needed or claimed. int-sabas's word ("sābās") matches. This is thin novelty relative to
        the vocab entry itself, but it is not an invented usage: a one-word exclamatory
        utterance is the book's own attested form (compare gn-int-1's own framing: "vaak zijn
        het betekenisloze klanken" used standalone).

- [ ] id: ex-int-4
      sarnami: Cor-cor! Bacāo!
      nl: Houd de dief! Help!
      vocabRefs: int-cor-cor, int-bacao
      rule: combines two independently attested alarm-cry exclamations (§8.1: "cor-cor! —
        houdt de dief!"; "bacāo! — help!") into a realistic two-part warning-then-appeal cry.
      verify: FAIL — cor-cor and bacāo are each individually attested, but the chapter gives no
        example of them (or any two interjections) said together as a single utterance; §8.1
        presents every entry as its own isolated table row. Stringing two exclamations together
        is an invented multi-interjection utterance, not something the chapter demonstrates —
        exactly the kind of "tacked on" context issue #258 warns about, even though each half in
        isolation would be fine.

- [ ] id: ex-int-5
      sarnami: Bhalā, to?
      nl: Zeg, toch?
      vocabRefs: int-bhala, int-to
      rule: combines the attention-getter bhalā (gn-int-2: "zeg!, kijk aan!") with the emphasis
        particle to (gn-int-3: "toch?, nietwaar?") to form a short tag-question-like utterance.
      verify: FAIL — bhalā and to are each attested individually (§8.1 table row for bhalā; §8.2/
        gn-int-3 for to), but the chapter never shows to attached to, or co-occurring with,
        another interjection — every mention of to is an isolated table/prose entry with no
        sentence example at all. gn-int-3 only says to is a "nadrukgevend/aansporend
        gesprekspartikel", not where in a clause it attaches or that it can follow bhalā. There is
        no source evidence for this specific combination or word order; treating "not sure" as
        FAIL per the verify pass's instructions.

- [x] id: ex-int-6
      sarnami: Acchā!
      nl: Goed, oké!
      vocabRefs: int-accha
      rule: §8.1 table lists "acchā! — goed, o.k.!" as its own bare exclamation, used exactly as
        the book presents it — same standalone-exclamation pattern already verified for ex-int-3
        (sābās).
      verify: PASS — matches the book's own table row exactly, in isolation. int-accha's word
        ("acchā") matches. Not a compound or invented context, just the table's own bare entry —
        the same treatment already accepted for ex-int-3.

- [x] id: ex-int-7
      sarnami: Cup!
      nl: Stil!
      vocabRefs: int-cup
      rule: §8.1 table lists "cup! — stil!" as its own bare exclamation, used exactly as the book
        presents it — same standalone-exclamation pattern as ex-int-3/ex-int-6.
      verify: PASS — matches the book's own table row exactly, in isolation. int-cup's word
        ("cup") matches. No compounding or invented frame.

- [x] id: ex-int-8
      sarnami: Ayā!
      nl: Au!
      vocabRefs: int-aya
      rule: §8.1 table lists "ayā! — au!" as its own bare exclamation, used exactly as the book
        presents it — same standalone-exclamation pattern as ex-int-3/ex-int-6/ex-int-7.
      verify: PASS — matches the book's own table row exactly, in isolation. int-aya's word
        ("ayā") matches. No compounding or invented frame.

- [x] id: ex-int-9
      sarnami: Bāp-re-bāp!
      nl: Lieve hemel!
      vocabRefs: int-bap-re-bap
      rule: §8.1 table lists "bāp-re-bāp! — lieve hemel!" as its own single (hyphenated) bare
        exclamation, used exactly as the book presents it — the hyphenation is the book's own
        fixed form (compare sābās treated as one indivisible exclamation in ex-int-3), not an
        invented multi-word combination.
      verify: PASS — matches the book's own table row exactly, in isolation. int-bap-re-bap's
        word ("bāp-re-bāp") matches exactly, including the hyphenation. Not two interjections
        strung together (unlike the rejected ex-int-4) — it is a single table entry treated as
        one fixed exclamation.

- [x] id: ex-int-10
      sarnami: Vāh-vāh!
      nl: Bravo, prachtig!
      vocabRefs: int-vah-vah
      rule: §8.1 table lists "vāh-vāh! — bravo!" as its own single (hyphenated) bare exclamation,
        used exactly as the book presents it — same fixed-hyphenated-entry treatment as ex-int-9.
      verify: PASS — matches the book's own table row exactly, in isolation. int-vah-vah's word
        ("vāh-vāh") matches exactly. Distinct vocab entry from int-sabas (also "bravo!" in Dutch,
        but a different attested Sarnami word) — not a duplicate of ex-int-3, just the chapter's
        other bravo-exclamation.

- [x] id: ex-int-11
      sarnami: Albat!
      nl: Warempel, inderdaad!
      vocabRefs: int-albat
      rule: §8.1 table lists "albat! — warempel, inderdaad" as its own bare exclamation, used
        exactly as the book presents it — same standalone-exclamation pattern as ex-int-3.
      verify: PASS — matches the book's own table row exactly, in isolation. int-albat's word
        ("albat") matches. No compounding or invented frame.

- [x] id: ex-int-12
      sarnami: Cor-cor!
      nl: Houd de dief!
      vocabRefs: int-cor-cor
      rule: §8.1 table lists "cor-cor! — houdt de dief!" as its own bare exclamation, used exactly
        as the book presents it. This is the same vocab item as the rejected ex-int-4, but here
        used alone rather than strung together with bacāo — the standalone use is exactly the
        book's own table row, unlike the invented two-interjection utterance that failed
        ex-int-4.
      verify: PASS — matches the book's own table row exactly, in isolation. int-cor-cor's word
        ("cor-cor") matches. Using it alone (not combined with bacāo, unlike the rejected
        ex-int-4) removes the exact defect that caused ex-int-4 to FAIL.

- [x] id: ex-int-13
      sarnami: Hāy-hāy!
      nl: Ach!
      vocabRefs: int-hay-hay
      rule: §8.1 table lists "hāy-hāy! — ach!" as its own single (hyphenated) bare exclamation,
        used exactly as the book presents it — same fixed-hyphenated-entry treatment as
        ex-int-9/ex-int-10.
      verify: PASS — matches the book's own table row exactly, in isolation. int-hay-hay's word
        ("hāy-hāy") matches exactly. Not to be confused with the separate table row "hāy re —
        jammer!" (a different, unused vocab item) — this candidate only uses hāy-hāy as attested.

- [x] id: ex-int-14
      sarnami: Oho!
      nl: Och-och!
      vocabRefs: int-oho
      rule: §8.1 table lists "oho! — och-och!" as its own bare exclamation, used exactly as the
        book presents it — same standalone-exclamation pattern as ex-int-3.
      verify: PASS — matches the book's own table row exactly, in isolation. int-oho's word
        ("oho") matches. No compounding or invented frame.
