# unit-07-postpositions — candidate example sentences

Status: FINALIZED

Source: `authored_docs/byakaran/05-postpositions.md` (Sarnami Byākaran, Marhé 1985, chapter 6,
printed pp. 86-88). Generated per `/gen-sentences unit-07-postpositions`, verified per
`/verify-sentences unit-07-postpositions` (both passes performed manually while running the
pipeline against issue #256 — see PR description). Checkboxes below reflect an actual
human-review pass: only `verify: PASS` rows are ticked.

## lesson: unit-07-postpositions-common  (grammar point: primary and ke-compound postpositions, §6.2)

Existing `exampleSentences` cover the primary postposition *meṁ* (`ex-p1-1`, book's own §6.2.1.1
worked example) and two *ke*-compounds, *ke bhittar* / *ke bāhar* (`ex-p1-2`, `ex-p1-3`). These
add the remaining primary postposition *par* and two more *ke*-compounds (*ke uppar*, *ke
nicce*) that the §6.2 table lists but the chapter gives no full worked-example sentence for —
plus one attempt at a bare noun-genitive use of *ke* that verification could not confirm.

- [x] id: ex-p1-4
      sarnami: Ām peṛ par hai.
      nl: De mango is aan de boom.
      en: The mango is on the tree.
      vocabRefs: post-par, noun-am, noun-per
      rule: primary postposition "par" (§6.2 table row: "par of pe — op"), same locative pattern
        as the book's own §6.2.1.3 worked example ("āpan ghar par ... bichāvat rahlem", "op hun
        huis/dak") and the same "Subject + Noun+par + hai" structure already used by ex-p1-3.
      verify: PASS — post-par's word ("par") matches the sentence and the §6.2 table gloss
        ("op"/"on") exactly; the book's own alternate form "pe" is separately noted on the vocab
        item, consistent with §6.2's "par of pe". ām and peṛ match noun-am/noun-per's `word`
        fields exactly. Not a near-duplicate of any existing sentence in this lesson (new
        postposition, new vocab).

- [ ] id: ex-p1-5
      sarnami: Kuttā bappā ke ghar meṁ hai.
      nl: De hond is in het huis van vader.
      en: The dog is in father's house.
      vocabRefs: post-ke, post-mem, noun-kutta, noun-bappa, noun-ghar
      rule: bare noun-genitive use of "ke" ("bappā ke ghar" = "father's house"), inferred from
        the internal structure of the book's §6.2.1.2 example "apne ke jahājī ke nām se ..."
        (where "jahājī ke nām" appears to mean "shipmate's name"), combined with the primary
        postposition "meṁ" already attested in ex-p1-1.
      verify: FAIL — insufficient source evidence. The book's own Dutch gloss for §6.2.1.2 is a
        loose, idiomatic translation ("Veel kontraktanten noemden elkaar 'jahājī'
        (scheepsgenoot)") that never isolates "jahājī ke nām" as "shipmate's name" — that
        genitive reading is my own inference about the Sarnami's internal structure, not
        something the chapter states or glosses directly. §6.2's table entry for "ke" itself just
        glosses it as "van, aan" (one word), not a worked genitive-linking pattern. No other
        passage in this chapter demonstrates bare-noun (non-pronoun) "ke" as a possession marker
        independently of the ke-compound postposition system covered by §6.2.2/6.3. Per the
        "treat not-sure as FAIL" rule, this needs a clearer worked example before it's safe to
        promote — meṁ itself (already attested via ex-p1-1) is fine, but the genitive "ke" use is
        not confirmed here.

- [x] id: ex-p1-6
      sarnami: Peṛ ghar ke uppar hai.
      nl: De boom staat boven het huis.
      en: The tree is above the house.
      vocabRefs: post-ke-uppar, noun-per, noun-ghar
      rule: ke-compound postposition "ke uppar" (§6.2 table row: "ke uppar — boven"), an explicit
        rule/table-row justification per the guardrail (the chapter gives no full worked-example
        sentence for this specific compound, only the table row); same "Subject + Noun+ke+X + hai"
        pattern already used by ex-p1-2/ex-p1-3, and the exact phrase "ghar ke uppar" already
        appears verbatim in this unit's own `gn-post-3` grammar note ("ghar ke uppar (boven het
        huis)").
      verify: PASS — "ke uppar" matches the §6.2 table row exactly (book-p87, same source page as
        post-ke-uppar's vocab tag). peṛ/ghar match noun-per/noun-ghar's `word` fields. Sentence
        pattern matches ex-p1-2/ex-p1-3 structurally. Plausible real-world scene (a tree
        overhanging/standing above a house), not a mechanically-correct-but-implausible string.

- [x] id: ex-p1-7
      sarnami: Kuttā ghar ke nicce hai.
      nl: De hond is onder het huis.
      en: The dog is under the house.
      vocabRefs: post-ke-nicce, noun-kutta, noun-ghar
      rule: ke-compound postposition "ke nicce" (§6.2 table row: "ke nicce — beneden"), same
        table-row justification and "Subject + Noun+ke+X + hai" pattern as ex-p1-6 above.
      verify: PASS — "ke nicce" matches the §6.2 table row exactly (book-p87). kuttā/ghar match
        noun-kutta/noun-ghar's `word` fields. Well-formed and plausible (traditional Surinamese
        houses are commonly built on stilts, so a dog resting in the shade under one is a natural
        scene, not a strained one). Not a near-duplicate of ex-p1-6 — different postposition
        (opposite of "ke uppar"), different subject/object pair.

- [x] id: ex-p1-8
      sarnami: Apane bāp se ī batiyā bol diye.
      nl: Je moet dit aan je vader vertellen.
      en: You must tell this to your father.
      vocabRefs: post-se
      rule: primary postposition "se" (§6.2 table row: "se — met, door, aan, uit"), the book's own
        §6.4 worked example 2 (printed p.88) quoted verbatim, demonstrating the "aan" (to) sense of
        se — same convention already used by ex-p2-3, which is itself a verbatim quote of the
        adjacent §6.4 worked example 1.
      verify: PASS — "se" matches the primary-postposition table row exactly and the sentence is
        the book's own worked example, quoted verbatim rather than adapted (same low-risk approach
        already accepted for ex-p2-3). Not a near-duplicate of ex-p2-3 — different §6.4 example,
        different sense of the achterzetsel involved. post-se was unused by all 9 existing
        candidates in this unit; this is the first sentence to exercise it.

- [x] id: ex-p1-9
      sarnami: Ām ghar ke bhittar hai.
      nl: De mango is binnen in het huis.
      en: The mango is inside the house.
      vocabRefs: post-ke-bhittar, noun-am, noun-ghar
      rule: reuses the book-table-attested compound "ke bhittar" (§6.2 table row: "ke bhittar —
        binnen, in"), already used with a different subject/verb in ex-p1-2 ("Ham ghar ke bhittar
        bāṭī"); this generalizes to a new noun+postposition pairing (ām + ke bhittar) not yet
        exercised, using the same "Subject + Noun+ke+X + hai" pattern as ex-p1-3/ex-p1-4/ex-p1-6/
        ex-p1-7.
      verify: PASS — "ke bhittar" matches the §6.2 table row exactly (book-p87). ām/ghar match
        noun-am/noun-ghar's `word` fields exactly. Plausible scene (fruit kept inside the house).
        Not a near-duplicate of ex-p1-2 — different subject (ām vs ham) and different verb (hai,
        matching this lesson's other locative-hai sentences, vs ex-p1-2's bāṭī).

## lesson: unit-07-postpositions-attachment  (grammar point: ke-compounds with pronouns and the ke-drop rule, §6.3)

Existing `exampleSentences` cover *ke binā* with *tor* (`ex-p2-1`) and *ke sāth* with *tor*
(`ex-p2-2`), both already demonstrating the §6.3 ke-drop rule, plus *meṁ* with the optional -e
ending (`ex-p2-3`, §6.4). These add the §6.3 table's near/far 3rd-person possessive forms (*ekar*
/ *okar*) with *ke binā*, generalize *ke sāth* to a third pronoun, and cover the three remaining
newVocab compounds (*ke lage*, *ke āge*, *ke piche*) via the §6.2 table.

- [x] id: ex-p2-4
      sarnami: Ekar binā ham na jāb.
      nl: Zonder hem/haar (dichtbij) ga ik niet.
      en: Without him/her (nearby) I will not go.
      vocabRefs: post-ke-bina, pron-ekar, pron-ham
      rule: §6.3 table row "ekar binā — zonder hem, -haar" (near-demonstrative 3sg possessive,
        ke dropped before the pronoun per §6.3's stated rule), same "X binā ham na jāb" frame as
        the existing ex-p2-1.
      verify: PASS — "ekar" matches pron-ekar's `word` and the §6.3 table row exactly; "ke" is
        correctly dropped per §6.3 ("De vorm ke valt dan weg"), matching the same convention
        already used by ex-p2-1's vocabRefs (post-ke-bina cited even though the surface form is
        bare "binā"). Frame identical to ex-p2-1 so subject/verb ("ham ... na jāb") stays inside
        the one future form already attested in this unit. Meaningfully different from ex-p2-1:
        demonstrates the near-demonstrative possessive row of the §6.3 table, not the 2sg row.

- [x] id: ex-p2-5
      sarnami: Okar binā ham na jāb.
      nl: Zonder hem/haar (verder weg) ga ik niet.
      en: Without him/her (further away) I will not go.
      vocabRefs: post-ke-bina, pron-okar, pron-ham
      rule: §6.3 table row "okar binā — zonder hem, -haar" (far-demonstrative 3sg possessive),
        same frame as ex-p2-4/ex-p2-1.
      verify: PASS — "okar" matches pron-okar's `word` and the §6.3 table row exactly, same
        ke-drop reasoning as ex-p2-4. Deliberately paired with ex-p2-4 to demonstrate the book's
        own near/far distinction (ekar vs okar) side by side, which is a real, taught contrast in
        §6.3's table, not a cosmetic one-word swap — this is the specific judgment call flagged
        in the PR description.

- [x] id: ex-p2-6
      sarnami: Ham ekar sāth jāb.
      nl: Ik ga samen met hem/haar (dichtbij).
      en: I will go together with him/her (nearby).
      vocabRefs: post-ke-sath, pron-ekar, pron-ham
      rule: generalizes the §6.3 ke-drop rule (stated for pronouns generally, illustrated in the
        book with *binā*) to *ke sāth*, following this unit's own `gn-post-5` note ("Hetzelfde
        patroon geldt voor de andere samengestelde achterzetsels: tor sāth") and the same "Ham X
        sāth jāb" frame already attested by ex-p2-2.
      verify: PASS — "ekar" correctly replaces "ke" per §6.3/`gn-post-5`; frame and future verb
        form ("jāb") identical to the already-attested ex-p2-2, so no new verb form is invented.
        Adds coverage for post-ke-sath with a pronoun other than tor, which the lesson's existing
        sentences don't do.

- [x] id: ex-p2-7
      sarnami: Kuttā ghar ke lage hai.
      nl: De hond is bij het huis.
      en: The dog is near the house.
      vocabRefs: post-ke-lage, noun-kutta, noun-ghar
      rule: ke-compound postposition "ke lage" (§6.2 table row: "ke lage — bij"), same "Subject +
        Noun+ke+X + hai" pattern as ex-p1-6/ex-p1-7 in the previous lesson.
      verify: PASS — "ke lage" matches the §6.2 table row exactly (book-p87). Note: the
        post-ke-lage vocab entry itself carries a "needs-verification" tag with the note
        "'Dichtbij' maar zonder boekkruisverwijzing" — but the word and gloss ARE directly in the
        §6.2 table (line "ke lage | bij"), so the compound itself is book-attested even though
        the vocab item's own record flags lower confidence; flagging this caveat rather than
        silently ignoring it. kuttā/ghar match their vocab `word` fields.

- [x] id: ex-p2-8
      sarnami: Kuttā ghar ke āge hai.
      nl: De hond is voor het huis.
      en: The dog is in front of the house.
      vocabRefs: post-ke-age, noun-kutta, noun-ghar
      rule: ke-compound postposition "ke āge" (§6.2 table row: "ke āge — voor"), same pattern as
        ex-p2-7.
      verify: PASS — "ke āge" matches the §6.2 table row exactly (book-p87). Same
        needs-verification caveat as ex-p2-7 applies to the post-ke-age vocab entry, noted for
        the record; the compound itself is directly in the book table. kuttā/ghar match their
        vocab `word` fields. Not a near-duplicate of ex-p2-7 — opposite spatial relation
        ("in front of" vs "near"), matching the contrast the §6.2 table itself draws between
        entries.

- [x] id: ex-p2-9
      sarnami: Kuttā ghar ke piche hai.
      nl: De hond is achter het huis.
      en: The dog is behind the house.
      vocabRefs: post-ke-piche, noun-kutta, noun-ghar
      rule: ke-compound postposition "ke piche" (§6.2 table row: "ke piche — achter, om"), same
        pattern as ex-p2-7/ex-p2-8.
      verify: PASS — "ke piche" matches the §6.2 table row exactly (book-p87); post-ke-piche
        carries no needs-verification tag, so this is the most confidently sourced of the three
        ke-lage/ke-āge/ke-piche compounds. kuttā/ghar match their vocab `word` fields. Completes
        the front/near/behind spatial contrast set with ex-p2-7 and ex-p2-8.

- [x] id: ex-p2-10
      sarnami: Ham okar sāth jāb.
      nl: Ik ga samen met hem/haar (verder weg).
      en: I will go together with him/her (further away).
      vocabRefs: post-ke-sath, pron-okar, pron-ham
      rule: generalizes the §6.3 ke-drop rule to "ke sāth" with the far-demonstrative 3sg
        possessive pronoun "okar" (§6.3 table row "okar binā — zonder hem, -haar", pronoun form
        generalized to sāth per this unit's own `gn-post-5` note), completing the near/far pair
        started by ex-p2-6 (ekar) — the same deliberate near/far contrast already used for
        ex-p2-4/ex-p2-5 with binā.
      verify: PASS — "okar" matches pron-okar's `word` and the §6.3 table row exactly, same
        ke-drop reasoning as ex-p2-4/ex-p2-5/ex-p2-6. Frame and verb ("jāb") identical to the
        already-attested ex-p2-2/ex-p2-6, so no new form is invented. Not a near-duplicate of
        ex-p2-6 — completes the ekar/okar near/far contrast for "ke sāth" that ex-p2-6 alone left
        half-done, mirroring the pattern already used for "ke binā".
