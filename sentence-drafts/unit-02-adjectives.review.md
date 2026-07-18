# unit-02-adjectives — candidate example sentences

Status: DRAFT

Source: `authored_docs/byakaran/adjective-verified.md` (Sarnami Byākaran, Marhé 1985, p.55-61,
image-verified transcription — trusted over `02-the-noun.md`'s raw OCR for this topic).
Generated per `/gen-sentences unit-02-adjectives`, verified per `/verify-sentences
unit-02-adjectives` (both passes performed manually per issue #252, following the pipeline built
in PR #250). `lesson-9-adjectives-review` has no `newVocab` (it's a `generatedSpec`-driven review
lesson), so it is skipped per `scripts/prompts/gen-sentences.md`.

## lesson: lesson-6-adjective-forms  (grammar point: stem/long/longer adjective forms, §2.1-2.3)

Model pattern (§2.1-2.3): stem form = indefinite (`Mahes ego choṭā ghar kīnis hai`), long `-kā`
form = definite (`Mahes chŏṭkā gharvā kīnis hai`). Existing `exampleSentences` use `adj-chota`
(stem + long) and `adj-lal` (stem). These add the same stem/long contrast for `adj-patar` and
`adj-mitha` with different nouns, plus one deliberately marginal `adj-sojha` candidate.

- [x] id: ex-6-4
      sarnami: Mahes ego pātar chūrī kīnis hai.
      nl: Mahes heeft een dun mes gekocht.
      en: Mahes bought a thin knife.
      vocabRefs: adj-patar
      rule: stem/indefinite adjective form (§2.1 table row: pātar), §2.2 indefinite meaning;
        sentence pattern reused verbatim from ex-6-1 ("Mahes ego <stem-adj> <noun> kīnis hai"),
        only the adjective and noun are new.
      verify: PASS — pātar is the exact §2.1 table stem form; "ego <adj> <noun> kīnis hai" is
        directly attested (ex-6-1); chūrī matches noun-churi's `word` exactly.

- [x] id: ex-6-5
      sarnami: Mahes patarkā churiyā kīnis hai.
      nl: Mahes heeft het dunne mes gekocht.
      en: Mahes bought the thin knife.
      vocabRefs: adj-patar
      rule: long -kā adjective form (§2.1 table row: patarkā) + §2.2-2.3 definite meaning;
        mirrors ex-6-2's structure ("Mahes <long-adj> <long-noun> kīnis hai") exactly.
      verify: PASS — patarkā matches the §2.1 table's long form for pātar exactly (also
        confirmed in adj-patar's own `notes`: "Lange vorm: patarkā"). churiyā matches noun-churi's
        `notes` ("Lange vorm churiyā") exactly. Structure matches ex-6-2, not a duplicate (new
        adjective+noun pair).

- [x] id: ex-6-6
      sarnami: Mahes ego mīṭhā ām kīnis hai.
      nl: Mahes heeft een lekkere manje gekocht.
      en: Mahes bought a tasty mango.
      vocabRefs: adj-mitha
      rule: stem/indefinite adjective form (§2.1 table row: mīṭhā), same ex-6-1 pattern; the
        mīṭhā+ām pairing itself is independently book-attested in §2.9's "Ram mīṭhā-mīṭhā ām
        turle bā (hai)".
      verify: PASS — mīṭhā matches the §2.1 stem form exactly. ām matches noun-am's `word`
        exactly. The adjective-noun pairing (mīṭhā + ām) is directly confirmed natural by the
        book's own §2.9 example, even though that example is reduplicated and this one isn't.

- [x] id: ex-6-7
      sarnami: Mahes miṭhkā amvā kīnis hai.
      nl: Mahes heeft de lekkere manje gekocht.
      en: Mahes bought the tasty mango.
      vocabRefs: adj-mitha
      rule: long -kā adjective form (§2.1 table row: miṭhkā) + definite meaning, mirrors ex-6-2's
        structure.
      verify: PASS — miṭhkā matches the §2.1 table's long form for mīṭhā (also confirmed in
        adj-mitha's `notes`: "Lange vorm: miṭhkā"). amvā matches noun-am's `notes` ("Lange vorm
        amvā") exactly.

- [ ] id: ex-6-8
      sarnami: Mahes ego sojhā chūrī kīnis hai.
      nl: Mahes heeft een rechte mes gekocht.
      en: Mahes bought a straight knife.
      vocabRefs: adj-sojha
      rule: stem/indefinite adjective form (§2.1 table row: sojhā), same ex-6-1 pattern.
      verify: FAIL — sojhā is correctly the §2.1 table stem form, and the sentence pattern is
        correctly reused, but sojhā never appears paired with any noun anywhere in the chapter
        (it only occurs in the isolated §2.1 table, no worked example). "A straight knife" is a
        semantically atypical, unattested collocation — a table row alone doesn't establish this
        specific pairing reads as natural Sarnami rather than a mechanically-assembled string.

## lesson: lesson-7-adjective-agreement  (grammar point: gender and number agreement, §2.7-2.8)

Existing `exampleSentences` cover stem singular (`ego barkā per`), plural longer form (`ū
barkāvan pervan`), and one feminine `-ī` example (`karikkanī bakariyā`). §2.7.1 gives two more
worked feminine-agreement examples verbatim that aren't yet in the unit; these quote them
directly rather than inventing new ones, plus one new plural example applying the §2.8 pattern to
a different noun, and one deliberately-invalid extrapolation.

- [x] id: ex-7-4
      sarnami: Karikkī gaiyā.
      nl: De zwarte koe.
      en: The black cow.
      vocabRefs: adj-karikka
      rule: feminine -ī agreement, directly quoted worked example from §2.7.1 ("karikkī gaiyā —
        de zwarte koe").
      verify: PASS — this is a verbatim quote of the chapter's own §2.7.1 worked example, not a
        derived form. karikkī matches adj-karikka's stated feminine variant (`notes`:
        "Vrouwelijke vorm bij dieren/mensen: karikkī (koe), karikkanī (geit)"). gaiyā matches
        noun-gai's `notes` ("Lange vorm gaiyā"). Not a duplicate of ex-7-3 (which uses karikkanī
        + bakariyā, a different noun/adjective-form pair).

- [x] id: ex-7-5
      sarnami: Chŏṭkanī chaumriyā.
      nl: Het kleine meisje.
      en: The small girl.
      vocabRefs: adj-chota
      rule: feminine -ī agreement on the long/Nickerie form, directly quoted worked example from
        §2.7.1 ("chŏṭkanī chaumriyā — het kleine meisje"); reuses adj-chota from
        lesson-6-adjective-forms cumulatively, as this lesson's own newVocab (barka, lamma,
        barhimya, karikka) has no chapter-attested feminine form parallel to this one.
      verify: PASS — verbatim quote of the chapter's §2.7.1 worked example. chŏṭkanī matches the
        pattern shown for adj-chota's Nickerie-variant + feminine suffix; chaumriyā is a
        plausible long form of noun-chaumri's `word` (chaumṛī) and is the exact word the chapter
        itself uses in this example. Legitimate cross-lesson reuse, not an invented pairing.

- [x] id: ex-7-6
      sarnami: Ū barkāvan ghŏṛvan.
      nl: Die grote paarden.
      en: Those big horses.
      vocabRefs: adj-barka
      rule: number agreement, plural longer-form pattern from §2.8 ("ū barkāvan pervan — die
        grote bomen"), applied with a different noun (horse) whose attested plural is
        ghoṛan/ghŏṛvan.
      verify: PASS — "ū barkāvan <noun-plural>" matches the §2.8 pattern exactly (same adjective
        form as the chapter's own pervan example). ghŏṛvan is one of the two plural forms listed
        verbatim in noun-ghora's `notes` ("meervoud ghoṛan/ghŏṛvan"). Not a duplicate of ex-7-2
        (different noun).

- [ ] id: ex-7-7
      sarnami: Ū karikkāvan bakariyan.
      nl: Die zwarte geiten.
      en: Those black goats.
      vocabRefs: adj-karikka
      rule: attempted plural agreement, generalizing the §2.8 -āvan plural pattern to karikkā.
      verify: FAIL — no plural form of karikkā is attested anywhere in the chapter; only karikkī
        (feminine singular) and karikkanī (feminine long-form singular) are shown (§2.7.1).
        "Karikkāvan" is an unverified extrapolation from the plural pattern the book only
        demonstrates for barkā, not a form the book itself gives for this adjective. Additionally
        "bakariyā/bakariyan" (goat) has no entry at all in content/sarnami/vocab/nouns.json, so
        its plural spelling can't be independently confirmed either.

## lesson: lesson-8-comparison  (grammar point: comparative and superlative degree, §2.13)

Existing `exampleSentences` cover comparative with `se` (`ghar se barkā`), comparative with `aur`
(`gharī se aur choṭā`), and superlative with `sab se` (`sab se dhanī adamī`). §2.13 itself states
`jādā` is an attested alternative/addition to `aur` in both the comparative and superlative, and
gives a `sab se jādā` worked example — these add that unused `jādā` variant, a `sab se jādā`
superlative with different vocab, an `aur` comparative reusing a cumulative lesson-7 adjective,
and one deliberately-unverifiable extrapolation of the fixed `barhimyā-se-barhimyā` idiom into a
full sentence.

- [x] id: ex-8-4
      sarnami: Hamār ghar tor ghar se jādā barkā hai.
      nl: Mijn huis is groter dan jouw huis (met nadruk).
      en: My house is (even) bigger than your house.
      vocabRefs: gram-se, gram-jada, adj-barka
      rule: intensified comparative, §2.13 explicitly states "...se aur (of: jādā) barkā hai —
        same meaning, intensified", i.e. jādā is an attested drop-in alternative to aur in the
        exact ex-8-1 sentence.
      verify: PASS — this is the chapter's own stated variant of ex-8-1's sentence (se ... jādā
        barkā hai), directly named in §2.13's prose, not an inference beyond it.

- [x] id: ex-8-5
      sarnami: Ī ghoṛā sab se jādā barkā hai.
      nl: Dit paard is het allergrootst.
      en: This horse is the biggest of all.
      vocabRefs: gram-sabse, gram-jada, adj-barka
      rule: superlative with sab se jādā, directly attested pattern from §2.13 ("Ī Sarnam mem sab
        se jādā dhanī adamī hai") and §2.13.3.1 ("aur jādā barkā"), applied with a different
        adjective/subject.
      verify: PASS — "sab se jādā <adj> hai" matches the §2.13 worked example's structure
        exactly, only subject/adjective swapped (dhanī adamī → barkā ghoṛā); barkā is confirmed
        combinable with the sab se jādā frame by §2.13.3.1's own "aur jādā barkā" gloss. Not a
        near-duplicate of ex-8-3 (different adjective and no sab se-only form).

- [x] id: ex-8-6
      sarnami: Hamār kuttā tor kuttā se aur barhimyā hai.
      nl: Mijn hond is beter dan jouw hond.
      en: My dog is better than your dog.
      vocabRefs: gram-se, gram-aur-compare, adj-barhimya
      rule: comparative "se aur ... hai" pattern, directly attested in §2.13 ("Hamār gharī tor
        gharī se aur choṭā hai"), applied with a different (cumulative, lesson-7) adjective and
        noun.
      verify: PASS — "Hamār <noun> tor <noun> se aur <adj> hai" matches the §2.13/ex-8-2 pattern
        exactly. barhimyā matches adj-barhimya's `word` exactly; kuttā matches noun-kutta's
        `word` exactly. Cross-lesson vocab reuse (barhimya is lesson-7's), same pattern as
        unit-08's own worked example did for verb vocab.

- [ ] id: ex-8-7
      sarnami: Ū barhimyā-se-barhimyā laundā hai.
      nl: Hij is de allerbeste jongen.
      en: He is the very best boy.
      vocabRefs: gram-se, adj-barhimya
      rule: special superlative-intensifying form "barhimyā-se-barhimyā" (§2.13.3.1: "de
        (aller-)beste").
      verify: FAIL — insufficient source evidence to confirm this usage. The chapter lists
        "barhimyā-se-barhimyā" only as a standalone gloss (an isolated phrase with its Dutch
        translation, §2.13.3.1), never embedded in a full subject+copula sentence. How it
        combines with a noun and "hai" (word order, whether "laundā" can even follow it this way)
        is not demonstrated anywhere in the chapter, so this specific sentence is an unverified
        extrapolation rather than a re-derivation of an attested example.
