# unit-06-adverbs — candidate example sentences

Status: FINALIZED

Source: `authored_docs/byakaran/04-the-adverb.md` (Sarnami Byākaran, Marhé 1985, chapter 5).
Generated per `/gen-sentences unit-06-adverbs`, verified per `/verify-sentences unit-06-adverbs`
(both passes performed manually while running the pipeline against this unit — see PR
description, part of #255). Checkboxes below reflect an actual human-review pass: only
`verify: PASS` rows are ticked.

## lesson: unit-06-adverbs-time-place  (grammar point: adverbs of time & place, §5.1.1/§5.1.2/§5.1.2.1)

Existing `exampleSentences` for this lesson: none. The book itself gives only one time-adverb
worked example ("Āj ham jādā khāi lelī hai", §5.1.4 Voorbeeld 1) and one place-adverb worked
example ("Jā nicvāṁ dekh to, ke āil hai", §5.3 example 3). These candidates reuse those two
attested patterns — the fronted-time-adverb idiom and the nasalized-directional predicate — with
different subjects/objects, plus a plain predicate pattern ("X ADV hai") directly justified by
the grammar note's own description of place adverbs ("zeggen waar iets is").

- [x] id: ex-tp-1
      sarnami: Āj ham ām khāi lelī hai.
      nl: Ik heb vandaag een mango gegeten.
      vocabRefs: adv-aaj, pron-ham, noun-am, verb-khai, verb-leve, gram-hai
      rule: reuses the book's own §5.1.4 Voorbeeld 1 sentence verbatim ("Āj ham jādā khāi lelī
        hai") with time adverb "āj" (§5.1.1) fronted, per the chapter's own word-order note for
        time adverbs ("ze staan vaak vooraan in de zin"); object swapped from the unspecified
        "jādā [khāi lelī]" to "ām" (mango).
      verify: PASS — "āj" matches adv-aaj's `word` exactly and is listed in §5.1.1. "khāi lelī
        hai" is copied form-for-form from the book's own example (khāi = converb of khāī,
        "lelī" = 1sg past of leve, matching the -lī ending independently attested in §9.7.2's
        paṛhlī model). "ām" matches noun-am's `word` exactly. Not a near-duplicate of anything
        already authored — this lesson has zero existing exampleSentences.

- [x] id: ex-tp-2
      sarnami: Roj ū kuttā dekhe hai.
      nl: Hij ziet elke dag een hond.
      vocabRefs: adv-roj, pron-u, noun-kutta, verb-dekhe, gram-hai
      rule: time adverb "roj" (§5.1.1, dagelijks) fronted; 3sg present "-e hai" ending for
        consonant stem dekh- (§9.7.1 class), same paradigm class already PASS-verified for dekh-
        in unit-08-verbs (ex-pres-4/5).
      verify: PASS — "roj" matches adv-roj's `word` and §5.1.1 table row exactly. dekh- is a
        consonant stem (vocab notes: "Stam: dekh-"); "ū ... -e hai" matches the independently
        attested §9.7.1 present-tense table row. kuttā matches noun-kutta's `word`.

- [ ] id: ex-tp-3
      sarnami: Hardam ham ām khāi lelī hai.
      nl: Ik heb altijd een mango gegeten.
      vocabRefs: adv-hardam, pron-ham, noun-am, verb-khai, verb-leve, gram-hai
      rule: time adverb "hardam" (§5.1.1, altijd) fronted, reusing the same idiom as ex-tp-1.
      verify: FAIL — aspect mismatch: "khāi lelī hai" is a completed/perfect-aspect construction
        ("have eaten"), and "hardam" is a habitual adverb ("always"). No worked example anywhere
        in the chapter pairs a habitual time adverb with this perfect-aspect idiom, so there's no
        book evidence the combination reliably means "I always eat a mango" rather than reading
        as contradictory. Needs a genuinely habitual-compatible verb form instead.

- [x] id: ex-tp-4
      sarnami: Bihān ham ghoṛā kīnab.
      nl: Ik zal morgen een paard kopen.
      vocabRefs: adv-bihaan, pron-ham, noun-ghora, verb-kine
      rule: time adverb "bihān" (§5.1.1, morgen) fronted; 1sg future "-ab" ending for consonant
        stem kīn- (§9.7.3), same paradigm class already PASS-verified for other consonant-stem
        verbs in unit-08-verbs (ex-fut-4).
      verify: PASS — "bihān" matches adv-bihaan's `word` and §5.1.1 table row exactly. kīn- is a
        consonant stem (vocab notes: "Stam: kīn-"); "ham ... -ab" matches the §9.7.3 table row
        for ham. ghoṛā matches noun-ghora's `word` exactly.

- [x] id: ex-tp-5
      sarnami: Kāl ham kuttā dekhlī.
      nl: Ik zag gisteren een hond.
      vocabRefs: adv-kaal, pron-ham, noun-kutta, verb-dekhe
      rule: time adverb "kāl" (§5.1.1, gisteren) fronted; 1sg past "-lī" ending for consonant
        stem dekh- (§9.7.2), same paradigm class already PASS-verified in unit-08-verbs.
      verify: PASS — "kāl" matches adv-kaal's `word` and §5.1.1 table row exactly. "ham ... -lī"
        matches the §9.7.2 table row for ham. kuttā matches noun-kutta's `word`.

- [x] id: ex-tp-6
      sarnami: Kuttā bāhar hai.
      nl: De hond is buiten.
      vocabRefs: noun-kutta, adv-baahar, gram-hai
      rule: predicate place adverb "bāhar" (§5.1.2, buiten), matching the grammar note's own
        framing that place adverbs "zeggen waar iets is" (say where something is).
      verify: PASS — "bāhar" matches adv-baahar's `word` and §5.1.2 table row exactly. Simple
        subject + adverb + hai predicate is a natural, well-formed sentence; not a near-duplicate
        of any existing exampleSentence (lesson has none) or of the book's own worked examples.

- [x] id: ex-tp-7
      sarnami: Ghoṛā nicvāṁ hai.
      nl: Het paard is daarbeneden.
      vocabRefs: noun-ghora, adv-nicce, gram-hai
      rule: nasalized directional form "nicvāṁ" ("daarbeneden") of adv-nicce, explicitly attested
        in the §5.1.2.1 table and in this unit's own gn-adv-place grammar note and rev-e3
        exercise (same word, same gloss).
      verify: PASS — "nicvāṁ" is directly attested in §5.1.2.1's table row ("nicvām |
        daarbeneden") and in the unit's own grammar note body, so it is not an invented
        inflected form. ghoṛā matches noun-ghora's `word` exactly. Not a near-duplicate of the
        book's own §5.3 example 3 ("Jā nicvāṁ dekh to...") — different sentence shape
        (predicate vs. imperative-with-object-clause), same attested word.

## lesson: unit-06-adverbs-manner-degree  (grammar point: adverbs of manner, degree, and loanword adverbs, §5.1.3/§5.1.4/§5.2)

Existing `exampleSentences` for this lesson: none. The book's own worked examples for this
territory are §5.1.4 Voorbeeld 2 ("Rāmlalvā āj bahut batiyā hai") for degree, and §5.3 examples
6–9 for loanwords (habarī-habarā, parsīs-parsīs). These candidates reuse the "X ADV verb+hai"
frame from Voorbeeld 2 and the plain-predicate frame established in the time/place lesson above,
applied to manner, degree, and loanword vocabulary.

- [x] id: ex-md-1
      sarnami: Ū dhīre bole hai.
      nl: Hij spreekt zacht.
      vocabRefs: pron-u, adv-dhire, verb-bole, gram-hai
      rule: manner adverb "dhīre" (§5.1.3, zacht); 3sg present "-e hai" ending for consonant
        stem bol- (§9.7.1 class).
      verify: PASS — "dhīre" matches adv-dhire's `word` and §5.1.3 table row exactly. bol- is a
        consonant stem (vocab notes: "Stam: bol-"); "ū ... -e hai" matches the independently
        attested §9.7.1 present-tense pattern.

- [x] id: ex-md-2
      sarnami: Ū dhīre-dhīre cale hai.
      nl: Hij loopt langzaamaan.
      vocabRefs: pron-u, adv-dhire-dhire, verb-cale, gram-hai
      rule: reduplicated manner adverb "dhīre-dhīre" (§5.1.3, langzaamaan), explicitly attested
        as the reduplication of dhīre both in the chapter's §5.1.3 remark and in this unit's
        adv-dhire-dhire vocab note; 3sg present -e hai for consonant stem cal-.
      verify: PASS — "dhīre-dhīre" is directly attested (§5.1.3: "dhīre-dhīre | langzaamaan"),
        not an invented reduplication. cal- is a consonant stem (vocab notes: "Stam: cal-");
        "-e hai" ending correct. "Loopt langzaamaan" (walks gradually) is a coherent pairing of
        verb and adverb, unlike a static verb.

- [x] id: ex-md-3
      sarnami: Ham sacce bolilā.
      nl: Ik zeg het echt.
      vocabRefs: pron-ham, adv-sacce, verb-bole
      rule: manner adverb "sacce" (§5.1.3, echt/inderdaad); 1sg present "-ilā" ending for
        consonant stem bol- (§9.7.1), same paradigm class already PASS-verified in unit-08-verbs.
      verify: PASS — "sacce" matches adv-sacce's `word` and §5.1.3 table row exactly. "ham
        ... -ilā" matches the §9.7.1 table row for ham (paṛhilā model).

- [x] id: ex-md-4
      sarnami: Sait ham peṛ dekhilā.
      nl: Misschien zie ik een boom.
      vocabRefs: adv-sait, pron-ham, noun-per, verb-dekhe
      rule: modal/manner adverb "sait" (§5.1.3, misschien), fronted by analogy to the fronting
        rule the chapter states for adverbs of time; 1sg present -ilā ending for dekh-.
      verify: FAIL — the chapter's "vaak vooraan in de zin" (often stands at the front of the
        sentence) fronting rule is stated specifically in §5.1.1 for adverbs of TIME. There is
        no worked example anywhere in the chapter of "sait", or any other §5.1.3 manner adverb,
        in sentence-initial position — applying the time-adverb fronting rule here is an
        unsupported extrapolation across subsections, not something the source actually
        demonstrates. Needs either book evidence for this placement or a non-initial position.

- [x] id: ex-md-5
      sarnami: Ū bahut bole hai.
      nl: Hij praat veel.
      vocabRefs: pron-u, adv-bahut, verb-bole, gram-hai
      rule: degree adverb "bahut" (§5.1.4, veel), directly parallels the book's own §5.1.4
        Voorbeeld 2 "Rāmlalvā āj bahut batiyā hai" (subject + bahut + verb + hai) with a
        different subject and verb.
      verify: PASS — "bahut" matches adv-bahut's `word` and §5.1.4 table row exactly, and its own
        vocab note quotes the same book example this candidate's shape is modeled on. "ū ... -e
        hai" matches the §9.7.1 present-tense pattern for bol-.

- [x] id: ex-md-6
      sarnami: Ham thorā se khāilā.
      nl: Ik eet een beetje.
      vocabRefs: pron-ham, adv-thora-se, verb-khai
      rule: degree adverb "thorā se" (§5.1.4, weinig/een beetje), the antonym of bahut per the
        chapter's §5.1.4.1 table and this unit's own vocab note; verb form "khāilā" is the exact
        1sg present form given directly in verb-khai's own vocab note (irregular ā-stem: "o.t.t.
        ham khāilā").
      verify: PASS — "thorā se" matches adv-thora-se's `word` and §5.1.4.1 table row exactly.
        "khāilā" is copied verbatim from the vocab note, not derived/invented.

- [ ] id: ex-md-7
      sarnami: Ū bilkul bole hai.
      nl: Hij spreekt helemaal.
      vocabRefs: pron-u, adv-bilkul, verb-bole, gram-hai
      rule: degree adverb "bilkul" (§5.1.5, helemaal); 3sg present -e hai ending for bol-.
      verify: FAIL — "bilkul" ("helemaal, volkomen") is a scalar/completive intensifier. Every
        attestation of it in the chapter (§5.1.5 table, listed alongside na/nā) implies a scale
        or negation it completes; there is no worked example of it modifying a bare verb with no
        such complement, and "hij spreekt helemaal" isn't a complete thought in the gloss
        language either. Needs a negation ("bilkul nā bole hai" = "doesn't speak at all") or an
        adjectival complement to be well-formed; unverifiable as written.

- [x] id: ex-md-8
      sarnami: Kuttā habarā hai.
      nl: De hond is aan de overkant.
      vocabRefs: noun-kutta, adv-habara, gram-hai
      rule: loanword adverb "habarā" (§5.2, aan de overkant; from Sranan Tongo "abra", ultimately
        Eng. "over"), predicate use with hai, parallel to the plain place-adverb predicate
        pattern established in ex-tp-6.
      verify: PASS — "habarā" matches adv-habara's `word` and the §5.2 loanwords table exactly.
        Subject + adverb + hai is the same well-formed predicate frame already used for
        non-loanword place adverbs in this draft, and demonstrates this lesson's loanword point
        (gn-adv-loan) specifically.

- [x] id: ex-md-9
      sarnami: Ghar kantī hai.
      nl: Het huis staat aan de zijkant.
      vocabRefs: noun-ghar, adv-kanti, gram-hai
      rule: loanword adverb "kantī" (§5.2, langs/aan de zijkant; from Dutch "kant" via Sranan
        Tongo), predicate use with hai.
      verify: PASS — "kantī" matches adv-kanti's `word` and the §5.2 loanwords table exactly
        ("kantī ... langs"). Not a near-duplicate of ex-md-8 despite the identical frame — it
        exercises a different loanword adverb, which is the point of this lesson's vocab list.

- [x] id: ex-md-10
      sarnami: Ū parsīs bole hai.
      nl: Hij zegt het precies zo.
      vocabRefs: pron-u, adv-parsis, verb-bole, gram-hai
      rule: loanword adverb "parsīs" (§5.2, precies/toevallig/eigenlijk; from Dutch "precies"),
        3sg present -e hai ending for bol-.
      verify: PASS — "parsīs" matches adv-parsis' `word` and the §5.2 loanwords table exactly.
        The chapter's own §5.3 example 8 ("Tū hamse parsīs-parsīs bataiye...") uses parsīs with a
        speech verb (bataiye, to tell) in the reduplicated intensified form; this candidate uses
        the same semantic pairing (a speech verb, bole) with the plain, non-reduplicated form, a
        legitimate simplification rather than an invented usage.
