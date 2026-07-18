# unit-05-pronouns — candidate example sentences

Status: DRAFT

Source: `authored_docs/byakaran/03-pronouns.md` (Sarnami Byākaran, Marhé 1985, chapter 4 —
"Het voornaamwoord"). Generated per `/gen-sentences unit-05-pronouns`, verified per
`/verify-sentences unit-05-pronouns` (both passes performed manually while running the pipeline
against this chapter — see PR description / issue #254). This unit currently has zero existing
`exampleSentences`, so every candidate below is net-new variety, not incremental. Checkboxes
reflect an actual human-review pass: only `verify: PASS` rows are ticked.

The `unit-05-pronouns-review` lesson has no `newVocab` (it only recombines earlier vocab in
review exercises), so per `scripts/prompts/gen-sentences.md` it is skipped — no candidates
generated for it.

## lesson: unit-05-pronouns-possessive  (grammar point: possessive pronouns, §4.2.1–4.2.3)

Model example (§4.2.1.1 ex.2): `Hamār/ham log(-an)/loṅ ke ghar hiṁyā se dūr nā hai` — "Mijn/ons
huis is niet ver van hier." `hiṁyā` ("here") has no vocab entry in `content/sarnami/vocab/*.json`,
so these candidates reuse the same core frame (possessive + `ghar` + `dūr` + `(nā) hai`) with
`hiṁyā se` dropped, plus one candidate demonstrating the `-e` extension before the postposition
`meṁ` (§4.2.1.2 opmerking 5 / §4.2.2.2 opmerking 2 / §4.2.3 opmerking 2). Existing
`unit-05-pronouns-possessive` exercises (`poss-e3`, `poss-e6`) already drill the `hamār` form
directly, so these add the other five paradigm forms instead of repeating it.

- [x] id: ex-poss-1
      sarnami: Tor ghar dūr hai.
      nl: Jouw huis is ver.
      vocabRefs: pron-tor, noun-ghar, adv-dur, gram-hai
      rule: 2sg possessive "tor" (§4.2.2 table), same predicate frame as the book's own hamār
        example (§4.2.1.1 ex.2), minus the vocab-less "hiṁyā se"
      verify: PASS — "tor" is the exact table row for 2e persoon bezittelijk vnw. (§4.2.2), and
        "tor ... ghar" is itself attested as a substitutable form in the book's own opmerking 2
        example ("Ū tor/tore ... ghar meṁ rahat rahā", §4.2.2.2). dūr matches adv-dur's `word`
        exactly; nothing invented.

- [x] id: ex-poss-2
      sarnami: Tŏṁhār ghar dūr nā hai.
      nl: Uw huis is niet ver.
      vocabRefs: pron-tomhar, noun-ghar, adv-dur, gram-na, gram-hai
      rule: 2sg polite possessive "tŏṁhār" (§4.2.2 beleefdheidsvorm table)
      verify: PASS — "tŏṁhār" matches the beleefdheidsvorm table row exactly (§4.2.2, also
        attested inflecting alongside "ghar" in the opmerking 2 example). Negation order
        "dūr nā hai" mirrors the book's own hamār example exactly.

- [x] id: ex-poss-3
      sarnami: Āpke ghar dūr nā hai.
      nl: Uw huis is niet ver.
      vocabRefs: pron-apke, noun-ghar, adv-dur, gram-na, gram-hai
      rule: 2sg polite possessive alternate form "āpke" (§4.2.2 beleefdheidsvorm table, second
        column of the same row as tŏṁhār)
      verify: PASS — āpke is the book's listed alternate polite form in the same table row as
        tŏṁhār (§4.2.2). Not a near-duplicate of ex-poss-2 in a bad sense — gn-poss-2's whole
        point is that tŏṁhār and āpke are two synonymous polite forms, so a minimal pair
        distinguishing only that word is exactly what this grammar note is teaching.

- [x] id: ex-poss-4
      sarnami: Ekar ghar dūr hai.
      nl: Zijn/haar huis (dichtbij) is ver.
      vocabRefs: pron-ekar, noun-ghar, adv-dur, gram-hai
      rule: 3sg possessive, near referent, "ekar" (§4.2.3.1 table)
      verify: PASS — "ekar" matches the §4.2.3.1 bezittelijk vnw. row exactly (enkelvoud,
        dichtbij de spreker). ghar/dūr/hai all match vocab `word` fields exactly.

- [x] id: ex-poss-5
      sarnami: Okar ghar dūr nā hai.
      nl: Zijn/haar huis (veraf) is niet ver.
      vocabRefs: pron-okar, noun-ghar, adv-dur, gram-na, gram-hai
      rule: 3sg possessive, far referent, "okar" (§4.2.3.2 table)
      verify: PASS — "okar" matches the §4.2.3.2 bezittelijk vnw. row exactly (enkelvoud, van de
        spreker verwijderd). Mirrors ex-poss-4 as the near/far contrast pair, which is the exact
        distinction gn-poss-1 teaches.

- [x] id: ex-poss-6
      sarnami: Ū hamare ghar meṁ hai.
      nl: Hij/zij is in mijn huis.
      vocabRefs: pron-u, pron-hamar, noun-ghar, post-mem, gram-hai
      rule: -e extension of "hamār" before the postposition "meṁ" (§4.2.1.2 opmerking 5:
        "hamār/hamare/hamāre ghar meṁ ...")
      verify: PASS — "hamare" is one of the three forms explicitly attested in opmerking 5's own
        worked example before "ghar meṁ". Swapping the book's verb "rahat rahā" (not in any
        vocab file — no vocabRefs id would cover it) for the copula "hai" keeps the sentence
        grammatical and testable with only vocabbed words, while still demonstrating the -e
        extension rule, which is the point of this candidate.

## lesson: unit-05-pronouns-demonstrative  (grammar point: demonstrative pronouns, §4.2.3)

Existing `dem-e6` exercise already drills "Ī ghar hamār hai" (Dit huis is van mij.) as a
word-bank item, so ex-dem-1 below swaps the noun to avoid restating it verbatim. §4.2.3's own
worked examples (4.2.3.4) use vocabulary not in any vocab file (parŏsiniyā, orahanā, bisvās,
bidā), so these candidates instead combine the paradigm-table forms with vocab that does exist,
following the predicate-possessive shape already established by `dem-e6` and the plain
present-tense object-pronoun shape already established by `unit-08-verbs`' own candidates
(`ex-pres-4`: "Ham ghoṛā dekhilā.").

- [x] id: ex-dem-1
      sarnami: Ī kuttā hamār hai.
      nl: Deze hond is van mij.
      vocabRefs: pron-i, noun-kutta, pron-hamar, gram-hai
      rule: ī = demonstrative "this" for a near referent (§4.2.3.1 table); predicate-possessive
        frame "[demonstrative] [noun] [possessive] hai" reused from the existing dem-e6 exercise
        ("Ī ghar hamār hai"), noun swapped for variety
      verify: PASS — ī matches the §4.2.3.1 onderwerp row (dichtbij de spreker). kuttā matches
        noun-kutta's `word` exactly. Not a duplicate of dem-e6's exercise sentence (different
        noun) and there are no existing exampleSentences for this lesson to duplicate.

- [x] id: ex-dem-2
      sarnami: Ū ghoṛā okar hai.
      nl: Dat paard is van hem/haar.
      vocabRefs: pron-u, noun-ghora, pron-okar, gram-hai
      rule: ū = demonstrative "that" for a far referent (§4.2.3.2 table), paired with the far
        possessive okar (§4.2.3.2) in the same predicate-possessive frame as ex-dem-1
      verify: PASS — ū matches the §4.2.3.2 onderwerp row. okar matches the §4.2.3.2 bezittelijk
        vnw. row. ghoṛā matches noun-ghora's `word` exactly (retroflex ṛ preserved). Near/far
        contrast with ex-dem-1 is deliberate variety, not redundancy.

- [x] id: ex-dem-3
      sarnami: Ham eke dekhilā.
      nl: Ik zie hem/haar (dichtbij).
      vocabRefs: pron-ham, pron-eke, verb-dekhe
      rule: eke = verbogen (lijdend/meewerkend) vorm of ī, "hem/haar (dichtbij)" (§4.2.3.1 table,
        this lesson's newVocab); object-pronoun placed before the verb, 1sg present -ilā ending
        per verb-dekhe's vocab notes, same construction already verified for `unit-08-verbs`'
        ex-pres-4 ("Ham ghoṛā dekhilā.")
      verify: PASS — eke matches the §4.2.3.1 meewerkend/lijdend row exactly. dekh- is a
        consonant stem (vocab notes: "Stam: dekh-"); "-ilā" matches the present-tense 1sg ending
        already verified for this same verb in the unit-08 draft. SOV order with the pronoun
        object preceding the verb matches the book's own general word order.

- [x] id: ex-dem-4
      sarnami: Ham oke dekhilā.
      nl: Ik zie hem/haar (veraf).
      vocabRefs: pron-ham, pron-oke, verb-dekhe
      rule: oke = verbogen vorm of ū, "hem/haar (veraf)" (§4.2.3.2 table); same frame as ex-dem-3
      verify: PASS — oke matches the §4.2.3.2 meewerkend/lijdend row exactly. Same verb
        derivation as ex-dem-3; near/far contrast is the deliberate teaching point of this
        vocab pair (gn-dem-2).

- [x] id: ex-dem-5
      sarnami: Inhan ghar meṁ hai.
      nl: Zij (beleefd/meervoud, dichtbij) zijn in het huis.
      vocabRefs: pron-inhan, noun-ghar, post-mem, gram-hai
      rule: inhan = onderwerp form, beleefd/meervoud, near referent (§4.2.3.3 table, explicitly
        lists "inhan, unhan — zij" as the meervoud onderwerp row)
      verify: PASS — inhan matches the §4.2.3.3 onderwerp row for meervoud exactly. "ghar meṁ
        hai" (locative + copula) is a plain, well-formed predicate using only vocabbed words.

- [x] id: ex-dem-6
      sarnami: Unhan ghar meṁ hai.
      nl: Zij (beleefd/meervoud, veraf) zijn in het huis.
      vocabRefs: pron-unhan, noun-ghar, post-mem, gram-hai
      rule: unhan = onderwerp form, beleefd/meervoud, far referent (§4.2.3.3 table, same row as
        inhan)
      verify: PASS — unhan matches the §4.2.3.3 onderwerp row. Mirrors ex-dem-5 as the near/far
        contrast pair for this vocab item, consistent with how gn-dem-3 itself introduces the two
        forms side by side.

## lesson: unit-05-pronouns-interrogative-relative  (grammar point: interrogative & relative pronouns, §4.5, §4.3)

Two of this lesson's newVocab items — `pron-kaunci` (wat, welk ding) and `pron-jekar` (van
wie/wiens, betrekkelijk) — appear in the chapter only in a definition line or a bare paradigm
table row, with no worked example sentence anywhere in §4.3/§4.5 to model a full sentence on. Per
the generation guardrails, no candidates are generated for either; a new full sentence for them
would be inventing a sentence shape from the paradigm alone, which the guardrails say not to do.

- [x] id: ex-ir-1
      sarnami: Ke āil hai?
      nl: Wie is er gekomen?
      vocabRefs: pron-ke, verb-ave, gram-hai
      rule: ke = wie, vertrouwelijk/zelfstandig (§4.5.1); sentence is the book's own worked
        example verbatim (§4.5.3 ex.1: "Ke (of: kaun) āil hai?")
      verify: PASS — copied verbatim (the "ke" branch) from §4.5.3 ex.1, diacritics intact.
        verb-ave's stem is ā-; "āil hai" is the book's own attested perfect form here, not an
        inference from the vocab notes alone.

- [x] id: ex-ir-2
      sarnami: Kaun āil hai?
      nl: Wie is er gekomen?
      vocabRefs: pron-kaun, verb-ave, gram-hai
      rule: kaun = wie, afstandelijk/deftig, zelfstandig gebruikt (§4.5.1); the book's own
        alternate branch of the same worked example (§4.5.3 ex.1: "Ke (of: kaun) āil hai?")
      verify: PASS — copied verbatim (the "kaun" branch) from the same §4.5.3 ex.1 sentence as
        ex-ir-1. Both branches are explicitly given by the book as interchangeable in this exact
        sentence, so this isn't a near-duplicate in a bad sense — it directly demonstrates the
        ke/kaun contrast gn-int-1 teaches.

- [ ] id: ex-ir-3
      sarnami: Ī kā hai?
      nl: Wat is dit?
      vocabRefs: pron-i, pron-ka, gram-hai
      rule: kā = wat, zelfstandig/neutraal (§4.5.2); attempted copula-predicate use of kā
      verify: FAIL — §4.5.2/4.5.3 only attest kā as the direct object of a verb ("Kā lāis hai?" —
        wat heeft hij meegebracht?), never in copula-predicate position ("X kā hai?"). The
        definition ("zelfstandig en neutraal gebruikt") is compatible with this use, and it's
        very plausible by analogy with related languages, but the chapter itself never shows kā
        in this exact syntactic slot, so I can't independently confirm it from the source text
        alone — treating as unproven rather than rubber-stamping it.

- [x] id: ex-ir-4
      sarnami: Kekar kuttā hai?
      nl: Wiens hond is het?
      vocabRefs: pron-kekar, noun-kutta, gram-hai
      rule: kekar used bijvoeglijk directly before a noun (§4.5.3 ex.6: "Tū kekar jūtā pahinle
        bāṭe?" — Wiens schoenen heb je aan?), simplified to a copula question since "jūtā" and
        the verb form "bāṭe" aren't in any vocab file
      verify: PASS — kekar + noun matches the book's own attested bijvoeglijk-use pattern
        (§4.5.3 ex.6) exactly in word order; only the object noun and the predicate verb changed,
        to a plain copula question using vocabbed words only. kuttā matches noun-kutta's `word`
        exactly.

- [x] id: ex-ir-5
      sarnami: Ī ghar jaun barkā hai hamār hai.
      nl: Dit huis, dat groot is, is van mij.
      vocabRefs: pron-i, noun-ghar, pron-jaun, adj-barka, gram-hai, pron-hamar
      rule: jaun = die/welke, gebruikt voor personen én dingen (§4.3); sentence structure is a
        direct transplant of the book's own worked example (§4.3.1 ex.1: "Ū adamiyā jaun humvā
        cale hai hamār māmā hai" — [NP] jaun [clause] hai, [NP] [possessive] hai), substituting
        only vocabulary (ghar for adamiyā, barkā hai for humvā cale hai, hamār for hamār māmā)
      verify: PASS — the [NP] jaun [relative clause ending in hai] [main predicate] frame matches
        §4.3.1 ex.1's own structure clause-for-clause. jaun is explicitly usable for
        non-persons ("gebruikt voor personen en niet-personen", §4.3), so "ghar" as the head noun
        is valid. All words match their vocab `word` fields exactly.

- [ ] id: ex-ir-6
      sarnami: Ū laundā je barkā hai hamār bhāī hai.
      nl: Die jongen, die groot is, is mijn broer.
      vocabRefs: pron-u, noun-launda, pron-je, adj-barka, gram-hai, pron-hamar, noun-bhai
      rule: je = die/wie, alleen voor personen (§4.3, gn-rel-1); attempted structural transplant
        of the jaun frame from ex-ir-5 onto je, on the reasoning that gn-rel-1 states je has the
        same function as jaun but restricted to persons
      verify: FAIL — the chapter gives no worked example sentence anywhere for "je" used this way
        (as a plain subject relative pronoun in a "[NP] je [clause] hai" frame); the only
        sentence-level attestation of je in the whole chapter is the "je ... te" correlative
        construction in §4.4 ("Je Sarnām jāī mange, te khūb paisā baṭore"), which is a different
        grammar point (this lesson's grammarNoteRefs cover gn-rel-1, not §4.4) and a different
        clause structure (no matrix-clause "te" here). The structural transplant from jaun is a
        reasonable guess but not something I can independently confirm from the source text, so
        this stays unproven.

## lesson: unit-05-pronouns-review  (no newVocab — skipped)

No candidates generated; this lesson only recombines vocabulary already introduced by the other
three lessons in this unit and has no `newVocab` of its own to generate against.
