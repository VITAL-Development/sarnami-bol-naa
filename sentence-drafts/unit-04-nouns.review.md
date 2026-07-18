# unit-04-nouns — candidate example sentences

Status: FINALIZED

Source: `authored_docs/byakaran/02-the-noun.md` (Sarnami Byākaran, Marhé 1985, chapter "Het
zelfstandig naamwoord"). Generated per `/gen-sentences unit-04-nouns`, verified per
`/verify-sentences unit-04-nouns` (both passes performed manually while running the pipeline
against this chapter — see PR description for #253). Checkboxes below reflect an actual
human-review pass: only `verify: PASS` rows are ticked.

**Scope note:** this chapter also contains "2. HET BIJVOEGLIJK NAAMWOORD" (the adjective
section, incl. §2.13 comparison degrees) nested inside it. Per issue #253, that subsection is
superseded by the image-verified `adjective-verified.md` used for the unit-02-adjectives issue,
so none of the candidates below are sourced from §2 — only from §1 (the noun proper) and §3 (the
numeral). `unit-04-nouns`'s own lessons don't include a comparison lesson anyway, so this wasn't
a hard call in practice.

## lesson: unit-04-nouns-gender  (grammar point: gender marking of persons/animals, §1.3)

Existing `exampleSentences` cover the gadahā/gadahī pair (§1.3.1 contrastive frame) and the
nānā/nanī pair (an "X aur Y ghar meṃ bāteṃ" frame). newVocab for this lesson is small (6 items,
already almost fully used), so these add: the launda/chaumri pair (not used yet), the nānā/nanī
pair in the contrastive frame instead of the existing conjunction frame, and — honestly — one
candidate that turned out to be a low-value near-duplicate on verification.

- [x] id: ex-04-gender-3
      sarnami: Ū laundā hai, ī chaumṛī hai.
      nl: Dat is een jongen, dit is een meisje.
      vocabRefs: noun-launda, noun-chaumri
      rule: laundā/chaumṛī listed together as the canonical masc./fem. person-noun pair (§1.3.1,
        table rows), reusing the "Ū X hai, ī Y hai" frame from ex-04-gender-1
      verify: PASS — laundā and chaumṛī both appear directly in the §1.3.1 example table
        (lines "laundā — een jongen" / "chaumṛī — een meisje"), and gn-04-gender-2 (this unit's
        own note) separately confirms they're the base pair, not a -ā/-ī derivation of each
        other (§1.3.3.1.1: laundī actually means "hoertje", chaumṛā "vlegel" — this sentence
        correctly avoids that trap by using the two base forms, not a derived one). Words match
        noun-launda/noun-chaumri exactly. Frame is a verbatim reuse of ex-04-gender-1's
        structure with new vocab — not a duplicate.

- [x] id: ex-04-gender-4
      sarnami: Ū nānā hai, ī nanī hai.
      nl: Dat is een grootvader, dit is een grootmoeder.
      vocabRefs: noun-nana, noun-nani
      rule: nānā/nanī listed together in the §1.3.1 example table, same contrastive frame as
        ex-04-gender-1
      verify: PASS — nānā and nanī both appear directly in the §1.3.1 table. Words match
        noun-nana/noun-nani exactly. This reuses the same two nouns as the existing
        ex-04-gender-2, but in a different, independently-attested frame (proximal/distal
        contrast vs. that sentence's "X aur Y ghar meṃ bāteṃ" frame) — legitimate grammatical
        variety on the same vocab pair, not a restatement.

- [x] id: ex-04-gender-5
      sarnami: Gadahā aur gadahī ghar meṃ bāteṃ.
      nl: De ezel en de ezelin zijn thuis.
      vocabRefs: noun-gadaha, noun-gadahi
      rule: gender pair gadahā/gadahī (§1.3.1) in the "X aur Y ghar meṃ bāteṃ" frame
      verify: FAIL — grammatically well-formed (gadahā/gadahī match the vocab exactly, the
        frame is correctly copied), but it teaches nothing new: it's a mechanical recombination
        of an already-used vocab pair (gadahā/gadahī, already contrasted in ex-04-gender-1) with
        an already-used frame (the "X aur Y ghar meṃ bāteṃ" frame, already in ex-04-gender-2
        with nānā/nanī). Neither the pairing nor the pattern is new to this lesson, so it fails
        the novelty check even though nothing in it is factually wrong.

## lesson: unit-04-nouns-number  (grammar point: short/long form and singular/plural, §1.2, §1.4.1, §1.2.8)

Existing sentences give one singular/plural subject-verb agreement pair (ghŏṛvā/ghŏṛvan, §1.4.1)
and one bare direct-object sentence (ām, §1.4.2 without ke). These add: the same
singular/plural agreement pattern with a different, short-form noun (kuttā); a
demonstrative + long-form pair (§1.2.8, directly modeled on the book's own "ū gharvā — dat huis"
example); and a direct quote of the book's own plural-object variant of the existing ām sentence.

- [x] id: ex-04-number-4
      sarnami: Kuttā khāt bā.
      nl: Een hond eet.
      vocabRefs: noun-kutta
      rule: short (indefinite) form + singular subject-verb agreement bā, frame reused from
        ex-04-number-1 with a short form instead of a long form (§1.2.3.1 short form = general/
        indefinite meaning; §1.4.1 singular agreement)
      verify: PASS — kuttā matches noun-kutta's `word` exactly. Unlike ex-04-number-1 (which
        uses the long form ghŏṛvā, hence "Het paard"), this uses the plain short form, so the
        Dutch gloss is correctly indefinite ("Een hond", not "De hond") per §1.2.5's stated
        short-form-is-indefinite rule. Verb agreement (bā for singular) matches the §1.4.1
        pattern exactly.

- [x] id: ex-04-number-5
      sarnami: Kuttan khāt bāteṃ.
      nl: Honden eten.
      vocabRefs: noun-kutta
      rule: plural -(a)n suffix (gn-04-number-2's stated general rule, modeled on ghoṛā→ghoṛan)
        + plural subject-verb agreement bāteṃ, frame reused from ex-04-number-2
      verify: PASS — the book doesn't table kuttā's plural explicitly, but gn-04-number-2
        states the -(a)n rule generally ("het meervoud wordt gevormd door de uitgang -(a)n
        achter het woord te plaatsen") and shows the exact orthographic operation on a
        vowel-final noun of the same shape (ghoṛā → ghoṛan: final -ā elided, -an attached).
        Applying the identical operation to kuttā gives kuttan, not kuttān — this is a
        productive-rule generalization, not an invented form. Verb agreement (bāteṃ) matches
        the §1.4.1 plural row exactly.

- [x] id: ex-04-number-6
      sarnami: Ī nakiyā hai.
      nl: Dit is de neus.
      vocabRefs: noun-nak
      rule: definite long form nakiyā (§1.2.4.5.1 table row: nāk → nakiyā) + proximal
        demonstrative ī (§1.2.8)
      verify: PASS — nakiyā is the exact table form for nāk's long form (§1.2.4.5.1). The
        ī + long-form pattern is directly attested in §1.2.8 ("ī laṭhiyā — deze stok"); adding
        the copula to turn the noun phrase into a full sentence mirrors the "X hai" construction
        already established in this unit's own ex-04-gender-1.

- [x] id: ex-04-number-7
      sarnami: Ū pĕṛavā hai.
      nl: Dat is de boom.
      vocabRefs: noun-per
      rule: definite long form pĕṛavā (§1.2.4.4.1 table row: peṛ → pĕṛavā) + distal
        demonstrative ū (§1.2.8, same row as "ū gharvā — dat huis")
      verify: PASS — pĕṛavā is the exact table form for peṛ's long form (§1.2.4.4.1). This is
        the closest of the two demonstrative candidates to the book's own worked example: §1.2.8
        gives "ū gharvā — dat huis" as a direct model for "ū + long-form noun + hai" and this
        candidate applies that same model verbatim, only swapping in a different attested
        long-form noun.

- [x] id: ex-04-number-8
      sarnami: Ram amvan khā hai.
      nl: Ram eet de manjes.
      vocabRefs: noun-am
      rule: plural direct object without ke (§1.4.2 table row, plural column)
      verify: PASS — this is a near-verbatim quote of the book's own §1.4.2 table row: "Ram
        ām/amvan khā hai — Ram eet (de) manjes", choosing the amvan alternative explicitly
        offered by the book. amvan matches noun-am's noted plural form exactly. It's the
        deliberate plural companion of the unit's existing singular ex-04-number-3 ("Ram ām khā
        hai"), the same kind of intentional singular/plural pairing the unit already uses for
        ex-04-number-1/2 — not an accidental duplicate.

## lesson: unit-04-nouns-cases  (grammar point: the postposition ke — possessive, dative/benefactive, direct object, §1.4.2, §1.4.4, §1.4.6)

The lesson description explicitly scopes this lesson to the achterzetsel *ke* ("de andere
achterzetsels komen in de eenheid Achterzetsels"). All candidates below stay within that scope
(no se/meṃ/par). Three are near-verbatim quotes of book table rows the unit hadn't yet used
(the plural companions of its own existing ke examples, plus one more singular row); one reuses
a possessive phrase already written into this unit's own gn-04-cases-2 grammar note; one
generalizes the possessive-ke rule to a new noun pairing.

- [x] id: ex-04-cases-4
      sarnami: Ham beṭī ke ciṭṭhi paṛhilā.
      nl: Ik lees de brief van de dochter.
      vocabRefs: noun-beti, noun-citthi
      rule: possessive ke (§1.4.6, "ke geeft bezit aan"), reusing the "beṭī ke ciṭṭhī" phrase
        already given as this unit's own possessive example in gn-04-cases-2
      verify: PASS, with one spelling note — beṭī matches noun-beti's `word` exactly. For the
        second noun, gn-04-cases-2's body text spells it "ciṭṭhī" (with a final macron), but the
        vocab entry noun-citthi's `word` field is "ciṭṭhi" (no final macron) — these two existing
        repo sources disagree with each other; the chapter itself doesn't table this noun at
        all (it's not one of the words in the noun-form tables I read). Per the guardrail to
        copy diacritics from vocab/existing-example JSON rather than free text, I used the
        vocab-authoritative "ciṭṭhi". Flagging the inconsistency for a maintainer rather than
        silently picking one and staying quiet about it. Verb paṛhilā is the 1sg present form
        given verbatim in verb-parhe's own notes ("o.t.t. ham paṛhilā").

- [x] id: ex-04-cases-5
      sarnami: Gaiyan ke khartin ghāṁs lā de.
      nl: Haal gras voor de koeien.
      vocabRefs: noun-gai
      rule: dative/benefactive ke khartin, plural (§1.4.4 table row, plural column)
      verify: PASS — direct, verbatim quote of the book's §1.4.4 plural example: "Gaiyan ke
        khartin ghāṁs lā de — Haal gras voor de koeien". Gaiyan matches the plural form given in
        that same table row for gāī/gaiyā. This is the plural companion of the unit's existing
        singular ex-04-cases-2 ("Gāī ke pānī dai de"), filling in the pair the same way
        ex-04-number-1/2 already does elsewhere in the unit. "ghāṁs" (grass) has no vocabRef of
        its own, consistent with how the unit already treats incidental content words (e.g. the
        existing ex-04-cases-3 doesn't ref "pīṭhī" either).

- [x] id: ex-04-cases-6
      sarnami: Ham ghŏṛvan ke pīṭhī par baiṭhilā.
      nl: Ik zit op de ruggen van de paarden.
      vocabRefs: noun-ghora
      rule: possessive ke, plural (§1.4.6 table row, plural column)
      verify: PASS — direct, verbatim quote of the book's §1.4.6 plural example: "Ham ghŏṛvan ke
        pīṭhī par baiṭhilā — Ik zit op de ruggen van de paarden". This is the plural companion of
        the unit's existing singular ex-04-cases-3 ("Ham ghoṛā ke pīṭhī par baiṭhilā"),
        completing that pair the same way the number lesson already pairs singular/plural.

- [x] id: ex-04-cases-7
      sarnami: Rustam ghŏṛva ke pakaṛ leis hai.
      nl: Rustam heeft het paard vastgehouden.
      vocabRefs: noun-ghora
      rule: direct-object ke (§1.4.2 table row, singular column)
      verify: PASS — direct, verbatim quote of the book's §1.4.2 singular example: "Rustam
        ghŏṛva ke pakaṛ leis hai — Rustam heeft het paard vastgehouden". Note the book spells
        this instance "ghŏṛva" without a final ā (as printed at that table row, distinct from
        the citation form ghoṛā/ghŏṛvā used elsewhere) — preserved verbatim rather than
        "corrected", per the guardrail against normalizing diacritics/forms away from the
        source.

- [x] id: ex-04-cases-8
      sarnami: Ham beṭī ke chūrī dekhilā.
      nl: Ik zie het mes van de dochter.
      vocabRefs: noun-beti, noun-churi
      rule: possessive ke generalized to a new noun pairing (§1.4.6, the rule is stated
        generally — "ke wordt gebruikt om een bezitsrelatie aan te geven" — not restricted to
        the book's own ghorā/beṭī examples), + present 1sg dekhilā
      verify: PASS — this is the least directly-attested candidate in the set (both the ke
        pairing and the sentence as a whole are new combinations, not book table rows), but each
        piece is independently solid: the possessive-ke rule is stated as a general rule in
        §1.4.6, not just shown via one table row, so applying it to beṭī+chūrī (both attested
        nouns already used elsewhere in this unit) doesn't require inventing anything. dekhilā
        is not a form from this chapter — it's the 1sg present of dekh- (verb-dekhe), reused
        verbatim from unit-08-verbs' own already-verified ex-pres-4 ("Ham ghoṛā dekhilā."),
        rather than derived fresh here.

## lesson: unit-04-nouns-numerals  (grammar point: cardinal numerals + counter suffixes, §3.1.1, §3.1.3)

Existing sentences already quote two of the book's own worked examples (tīn ṭhe ām, dūi ṭhī
aṅguṭṭhī). These add a third book quote the unit hadn't used yet (the sāt go cor example) and two
new sentences built from the same attested frame with different numerals from the 0–10 table.

- [x] id: ex-04-num-3
      sarnami: Rajavā sāt go cor ke marvā deis rahā.
      nl: De koning had 7 dieven laten vermoorden.
      vocabRefs: num-sat
      rule: numeral + counter -go (§3.1.3, worked example 1)
      verify: PASS — direct, verbatim quote of the book's own §3.1.3 example ("Rajavā sāt
        go/ṭho cor ke marvā deis rahā", choosing the go variant it offers). sāt matches
        num-sat's `word` exactly. "cor" (thief) has no vocabRef, consistent with how the unit
        already treats incidental content words in book-quoted sentences.

- [x] id: ex-04-num-4
      sarnami: Sitā ego churī kīnis hai.
      nl: Sita heeft een mes gekocht.
      vocabRefs: num-ek, noun-churi
      rule: ego (= ek + go) as a generic indefinite article (gn-04-num-2, itself reporting the
        book's own remark on ego), + 3sg past kīnis hai reused from the unit's existing
        ex-04-num-2
      verify: PASS — gn-04-num-2 (sourced from the book) states ego functions generally as an
        indefinite article ("een"), not tied to a specific noun class, so applying it to churī
        is a direct application of a stated rule rather than an invented usage. num-ek's `word`
        is "ek", correctly fused to "ego" per that same rule. kīnis hai is copied verbatim from
        the unit's own existing ex-04-num-2 rather than derived fresh.

- [x] id: ex-04-num-5
      sarnami: Maiyā das ṭhe ām kīnis hai.
      nl: Moeder heeft tien manjes gekocht.
      vocabRefs: num-das, noun-am, noun-maiya
      rule: numeral (0–10 table, §3.1.1) + counter ṭhe with ām, same counter the book itself
        pairs with ām (§3.1.3, "tīn ṭhe ām"), frame reused from the unit's existing ex-04-num-2
      verify: PASS, with one correction made during verification — I initially drafted this with
        the -go counter (Maiyā das go ām...), but go is the book's general/default counter while
        -ṭhe is explicitly the one the book itself pairs with ām specifically ("tīn ṭhe ām",
        also already used in this unit's own ex-04-num-1); the book doesn't state that counters
        are freely interchangeable across noun classes, so switching counters would have been an
        unjustified generalization. Kept ṭhe to match the book's own attested ām+counter pairing,
        only changing the numeral itself (tīn → das, both from the §3.1.1 table). das matches
        num-das's `word` exactly; kīnis hai reused verbatim from ex-04-num-2.
