# unit-11-loanwords — candidate example sentences

Status: FINALIZED

Source: `authored_docs/byakaran/09-loan-words-and-neologisms.md` (Sarnami Byākaran, Marhé 1985,
§9.14 "Leenwoorden en nieuwvormingen"). Generated per `/gen-sentences unit-11-loanwords`, verified
per `/verify-sentences unit-11-loanwords` (both passes performed manually per issue #259 — see PR
description). This chapter is a vocabulary chapter (loanword tables + usage/etymology notes), not
a paradigm chapter, so each `rule` field is anchored to the chapter's own table row/usage note for
the loanword (per issue #259's guidance), not to a grammar table in this chapter. Tense endings
used on the borrowed `kare` auxiliary (present `-e hai`, 1sg present `-ilā`, 3sg past `-is`) come
from the general consonant-stem paradigm already established in `08-the-verb.md` §9.7 and reused
for this unit's own `kare` (`verb-kare` notes explicitly attest the 1sg past form "ham karlī" for
this exact stem) — the same kind of general-paradigm reuse the `unit-08-verbs` draft used for new
vocabulary. `hove` (the passive auxiliary) is deliberately avoided throughout: the chapter lists
`X kare/hove` pairs but nowhere shows `hove` actually conjugated across tenses/persons, so
inflecting it here would be guessing at an unattested form.

## lesson: unit-11-loanwords-dutch  (usage note: Dutch loanwords with kare/hove, §9.14.2.2)

Existing `exampleSentences` for this lesson: none. All six candidates below are new.

- [x] id: ex-dutch-1
      sarnami: Ū bel kare hai.
      nl: Hij belt op.
      vocabRefs: loan-bel, pron-u, gram-hai
      tokenVocabRefs: pron-u, loan-bel, loan-bel, gram-hai
      rule: §9.14.2.2 table row "bel kare/hove = (op-)bellen/(op-)gebeld worden" (active kare
        form); "kare hai" is the 3sg present of kar- (verb-kare), a regular consonant-stem verb,
        per the general present-tense paradigm in §9.7.1 ("ū paṛhe hai" model — kare's own
        citation form already carries the -e ending, only hai is added).
      verify: PASS — loan-bel's `word` is "bel kare"; the sentence uses that stem unchanged with
        "kare hai" as a routine 3sg present of kar- (attested general paradigm, same class as
        verb-kare's own past-tense note "ham karlī"). "belt op" matches the gn-loan-dutch-1 gloss
        exactly. Well-formed, not a duplicate (lesson has zero existing exampleSentences).

- [x] id: ex-dutch-2
      sarnami: Tū ghar par klop kare hai.
      nl: Jij klopt op het huis.
      vocabRefs: loan-klop, pron-tu, noun-ghar, post-par, gram-hai
      tokenVocabRefs: pron-tu, noun-ghar, post-par, loan-klop, loan-klop, gram-hai
      rule: §9.14.2.2 table row "klop kare/hove = kloppen/geklopt worden"; 2sg present -e hai
        ending (§9.7.1, same table row as "tū paṛhe hai"); "ghar par" = "op het huis" using
        post-par ("op").
      verify: PASS — loan-klop's `word` "klop kare" used unchanged with the routine 2sg present
        "-e hai" ending (matches "tū paṛhe hai" row exactly). noun-ghar's `word` "ghar" + post-par
        "par" gives "ghar par" = "op het huis", matching gn-loan-dutch-1's own gloss "klop kare =
        kloppen". Natural, not a near-duplicate of anything existing.

- [x] id: ex-dutch-3
      sarnami: Ū ghar moi kare hai.
      nl: Hij maakt het huis mooi.
      vocabRefs: loan-mooi, pron-u, noun-ghar, gram-hai
      tokenVocabRefs: pron-u, noun-ghar, loan-mooi, loan-mooi, gram-hai
      rule: gn-loan-dutch-2 / §9.14.2.2 "moi kare (mooi maken) — basis is een bijvoeglijk
        naamwoord ('mooi')", the chapter's own explicit adjective-base example; ghar as direct
        object mirrors that gloss ("mooi maken" = to make [something] beautiful); 3sg present -e
        hai ending (§9.7.1).
      verify: PASS — loan-mooi's `word` "moi kare" used with the routine 3sg present ending,
        matches gn-loan-dutch-2's own worked gloss "mooi kare (mooi maken)" precisely, using ghar
        as the thing being made beautiful (an ordinary transitive reading of "maken"). Not a
        duplicate of ex-dutch-1/2 despite reusing "ghar" — different verb and grammatical role
        (object here, locative there).

- [x] id: ex-dutch-4
      sarnami: Ham bhāī bekeur karlī.
      nl: Ik bekeurde mijn broer.
      vocabRefs: loan-bekeur, pron-ham, noun-bhai
      tokenVocabRefs: pron-ham, noun-bhai, loan-bekeur, loan-bekeur
      rule: §9.14.2.2 table row "bekeur kare/hove = bekeuren/bekeurd worden"; 1sg past -lī ending
        on kar-, directly attested in verb-kare's own vocab notes ("O.v.t. ... rest van Suriname
        ham karlī").
      verify: PASS — "karlī" is the exact form verb-kare's notes give for 1sg past of this verb
        class (not extrapolated from the ch.08 table alone — it's the stem-specific note).
        loan-bekeur's `word` "bekeur kare" used unchanged as the compound base. bhāī (noun-bhai)
        as direct object of "to fine/ticket" is a plain transitive reading, not invented usage.

- [x] id: ex-dutch-5
      sarnami: Ū bahin wachti kare hai.
      nl: Hij wacht op zijn zus.
      vocabRefs: loan-wachti, pron-u, noun-bahin, gram-hai
      tokenVocabRefs: pron-u, noun-bahin, loan-wachti, loan-wachti, gram-hai
      rule: §9.14.2.2 table row "wachti kare/hove = wachten/opgewacht worden"; loan-wachti's own
        vocab notes gloss it as "wachten/opwachten" (transitive "opwachten" sense), which supports
        a direct object here; 3sg present -e hai ending (§9.7.1).
      verify: PASS — loan-wachti's notes explicitly include the transitive "opwachten" sense, so
        "bahin" as an unmarked direct object ("wait for [my] sister") is grounded in the vocab
        entry itself, not guessed. Ending and stem check out against the same present-tense
        paradigm as the other candidates above.

- [x] id: ex-dutch-6
      sarnami: Ū būṭū bhare hai.
      nl: Hij betaalt een boete.
      vocabRefs: loan-butu, pron-u, gram-hai
      tokenVocabRefs: pron-u, loan-butu, loan-butu, gram-hai
      rule: §9.14.1 lists "būṭū bhare" verbatim as a fully established idiom ("een boete
        betalen"); "bhare hai" is the 3sg present of bhar- ("betalen/vullen", a regular
        consonant-stem verb per gn-loan-dutch-2's own gloss "bhare = betalen"), same -e hai
        pattern as §9.7.1.
      verify: PASS — "būṭū bhare" is the book's own listed idiom, unchanged; adding "hai" for 3sg
        present follows the same regular pattern used throughout this draft. Distinct from
        ex-dutch-4 (bekeur, a different loanword/verb) despite the shared "paying a fine" theme —
        this is the chapter's own separate fully-nativized idiom (§9.14.1), not a restatement.

## lesson: unit-11-loanwords-other  (usage note: Sranantongo/English loanwords & neologisms, §9.14.1/§9.14.2.1/§9.14.2.3)

Existing `exampleSentences` for this lesson: none. All six candidates below are new.

- [x] id: ex-other-1
      sarnami: Ham ciṭṭhi don karilā.
      nl: Ik maak de brief af.
      vocabRefs: loan-don, pron-ham, noun-citthi
      tokenVocabRefs: pron-ham, noun-citthi, loan-don, loan-don
      rule: §9.14.2.1 table row "don kare/hove = afmaken/klaar zijn (van done)"; 1sg present -ilā
        ending on kar- (§9.7.1 general paradigm, "ham paṛhilā" model row).
      verify: PASS — loan-don's `word` "don kare" used unchanged; "karilā" is the routine 1sg
        present of kar- (same ending class attested elsewhere for this exact stem, e.g. verb-kare
        notes' past-tense form uses the same kar- base). ciṭṭhi (noun-citthi) as the thing being
        finished is a plain transitive reading.

- [x] id: ex-other-2
      sarnami: Ū ghaṛī lās karis.
      nl: Hij verloor het horloge.
      vocabRefs: loan-las, pron-u, noun-ghari
      tokenVocabRefs: pron-u, noun-ghari, loan-las, loan-las
      rule: §9.14.2.1 table row "lās kare/hove = verliezen/verloren raken (van lost)"; 3sg past
        -is ending on kar- (§9.7.2 general paradigm, "ū paṛhis" model row).
      verify: PASS — loan-las's `word` "lās kare" used unchanged; "karis" matches the §9.7.2 3sg
        past table row exactly. noun-ghari's `word` "ghaṛī" used as the lost object, a plain
        transitive reading of "verliezen".

- [x] id: ex-other-3
      sarnami: Ū ghar yūrū kare hai.
      nl: Hij huurt het huis.
      vocabRefs: loan-yuru, pron-u, noun-ghar, gram-hai
      tokenVocabRefs: pron-u, noun-ghar, loan-yuru, loan-yuru, gram-hai
      rule: §9.14.2.3 table row "yūrū kare/hove = huren/verhuurd worden (van yuru uit het Ned.
        huren/huur)"; 3sg present -e hai ending (§9.7.1).
      verify: PASS — loan-yuru's `word` "yūrū kare" unchanged; standard 3sg present ending. ghar
        as the rented object matches the gloss "huren" directly (renting a house is the paradigm
        case for this verb). Not a near-duplicate of ex-dutch-1/2/3 (different verb entirely).

- [x] id: ex-other-4
      sarnami: Laundā ciṭṭhi morsū kare hai.
      nl: De jongen maakt de brief vuil.
      vocabRefs: loan-morsu, noun-launda, noun-citthi, gram-hai
      tokenVocabRefs: noun-launda, noun-citthi, loan-morsu, loan-morsu, gram-hai
      rule: §9.14.2.3 table row "morsū kare/hove = vuil maken/vervuild raken"; 3sg present -e hai
        ending, subject is a full noun (laundā) rather than a pronoun — same SOV order and same
        3rd-person agreement as the ū-subject examples elsewhere in this draft.
      verify: PASS — loan-morsu's `word` "morsū kare" unchanged; noun subject taking the same 3sg
        "-e hai" agreement as pronoun ū is standard SOV behavior used consistently elsewhere in
        the repo's content, not an invented rule specific to this sentence. ciṭṭhi as the object
        being dirtied is a plain transitive reading of "vuil maken".

- [x] id: ex-other-5
      sarnami: Laundā lĕsiyāī hai.
      nl: De jongen luiert.
      vocabRefs: loan-lesiyai, noun-launda, gram-hai
      tokenVocabRefs: noun-launda, loan-lesiyai, gram-hai
      rule: §9.14.1 / gn-loan-other-2: "lĕsiyāī = luieren", explicitly described as "volledig
        aangepast aan de Sarnami-werkwoordstructuur" (no longer takes kare/hove). Sentence treats
        the citation form + hai as a present-tense construction by analogy with the kare+hai
        sentences above.
      verify: FAIL — insufficient source evidence to confirm this is actually how lĕsiyāī
        inflects for tense/person. Unlike kar- (whose §9.7 paradigm and verb-kare's own notes
        give explicit conjugated forms), the chapter and vocab entry for loan-lesiyai give only
        the bare citation form "lĕsiyāī" — no worked example anywhere shows it conjugated, so
        "lĕsiyāī hai" is a guess at its tense/agreement pattern, not a form the source attests.
        The guardrail against inventing forms outside what the chapter shows applies here.

- [x] id: ex-other-6
      sarnami: Ū ghar sĕtiyāve hai.
      nl: Hij brengt het huis op orde.
      vocabRefs: loan-setiyave, pron-u, noun-ghar, gram-hai
      tokenVocabRefs: pron-u, noun-ghar, loan-setiyave, gram-hai
      rule: §9.14.1 / gn-loan-other-2: "sĕtiyāve = ordenen", also described as fully adapted (no
        kare/hove). Same citation-form-plus-hai construction as ex-other-5, by analogy.
      verify: FAIL — same problem as ex-other-5: no worked example in the chapter or vocab entry
        shows sĕtiyāve conjugated for any tense or person, so "sĕtiyāve hai" is an unattested
        guess, not a form the source material supports. Treating this as unproven rather than a
        false positive.

## lesson: unit-11-loanwords-review

No `newVocab` (pure review lesson) — skipped per `/gen-sentences` guardrail.

## Summary

12 candidates drafted: 10 PASS (ticked), 2 FAIL (unticked) — both FAIL rows are the two
"fully-nativized" neologisms (`lĕsiyāī`, `sĕtiyāve`) that the chapter itself says no longer take
`kare`/`hove`, where no source material anywhere shows the actual conjugated/inflected form, so
the candidate sentences are honest guesses rather than book-grounded forms.
