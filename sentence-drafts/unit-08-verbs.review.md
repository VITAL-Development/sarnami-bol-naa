# unit-08-verbs — candidate example sentences

Status: DRAFT

Source: `authored_docs/byakaran/08-the-verb.md` (Sarnami Byākaran, Marhé 1985, chapter 9).
Generated per `/gen-sentences unit-08-verbs`, verified per `/verify-sentences unit-08-verbs`
(both passes performed manually while building this pipeline — see PR description). Checkboxes
below reflect an actual human-review pass: only `verify: PASS` rows are ticked.

## lesson: unit-08-verbs-present  (grammar point: present tense, §9.7.1)

Model paradigm (consonant stem, §9.7.1): `ham paṛhilā`, `tū paṛhe hai`, `ū paṛhe hai`. Existing
`exampleSentences` cover 1sg (`verb-parhe`), a 2sg question (`verb-kare`), and the irregular
ā-stem class (`verb-khai`). These add a 1sg and a 3sg declarative with different verbs/vocab.

- [x] id: ex-pres-4
      sarnami: Ham ghoṛā dekhilā.
      nl: Ik zie een paard.
      vocabRefs: verb-dekhe, noun-ghora
      rule: 1sg present -ilā ending, consonant stem (§9.7.1, same class as model verb paṛhe)
      verify: PASS — dekh- is a consonant stem (vocab notes: "Stam: dekh-"), same infinitive
        class as the model verb paṛhe; -ilā ending matches the §9.7.1 table row for ham. ghoṛā
        matches noun-ghora's `word` exactly.

- [x] id: ex-pres-5
      sarnami: Ū ciṭṭhi likhe hai.
      nl: Hij schrijft een brief.
      vocabRefs: verb-likhe, noun-citthi, gram-hai
      rule: 3sg present -e hai ending, consonant stem (§9.7.1)
      verify: PASS — likh- is a consonant stem, same class as paṛhe; "ū ... -e hai" matches the
        §9.7.1 table row for ū exactly. ciṭṭhi matches noun-citthi's `word`. Not a near-duplicate
        of the existing past-tense sentence using the same noun+verb (ex-past-3) — it
        demonstrates the present-tense form of that pair, which the source chapter itself does
        for its own model verb across tenses.

## lesson: unit-08-verbs-past  (grammar point: simple past tense, §9.7.2)

Model paradigm (consonant stem, §9.7.2): `ham paṛhlī`, `tū paṛhle`, `ū paṛhis`. Existing sentences
cover 3sg (`verb-kine`), an irregular verb (`verb-jai`), and 1sg (`verb-likhe`). These add a 2sg
and a second 1sg with different verbs.

- [x] id: ex-past-4
      sarnami: Tū ghar dekhle.
      nl: Je zag een huis.
      vocabRefs: verb-dekhe, noun-ghar
      rule: 2sg past -le ending, consonant stem (§9.7.2)
      verify: PASS — "tū ... -le" matches the §9.7.2 table row for tū exactly. ghar matches
        noun-ghar's `word`.

- [x] id: ex-past-5
      sarnami: Ham kuttā sunlī.
      nl: Ik hoorde de hond.
      vocabRefs: verb-sune, noun-kutta
      rule: 1sg past -lī ending, consonant stem (§9.7.2)
      verify: FAIL — the -lī ending and consonant-stem class are correct per §9.7.2, but sune
        (to hear/listen) takes an audible-content object (speech, sound, a name — see the
        chapter's own examples and vocab note "sun leve = horen") not the animal itself as
        direct object; no worked example in the chapter supports "sune" governing an animal
        this way. Needs a different object (e.g. a sound/word) or a different verb before this
        is safe to promote.

## lesson: unit-08-verbs-future  (grammar point: simple future tense, §9.7.3)

Model paradigm (§9.7.3): `ham paṛhab/paṛhbe`, `tū paṛhiye`, `ū paṛhī(-gā)`. Existing sentences
cover 1sg (`verb-deve`), 2sg (`verb-puche`), 3sg (`verb-samjhe`). These add another 1sg and 3sg
with different verbs, reusing the noun+verb pair from the present-tense additions above so a
learner can compare the same content across tenses.

- [x] id: ex-fut-4
      sarnami: Ham peṛ dekhab.
      nl: Ik zal een boom zien.
      vocabRefs: verb-dekhe, noun-per
      rule: 1sg future -ab ending (§9.7.3)
      verify: PASS — "ham ... -ab" matches the §9.7.3 table row for ham. peṛ matches
        noun-per's `word` exactly (retroflex ṛ preserved).

- [x] id: ex-fut-5
      sarnami: Ū ciṭṭhi likhī.
      nl: Hij zal een brief schrijven.
      vocabRefs: verb-likhe, noun-citthi
      rule: 3sg future -ī ending (§9.7.3)
      verify: PASS — "ū ... -ī" matches the §9.7.3 table row for ū. Same noun+verb pair as
        ex-pres-5, now in future tense — legitimate cross-tense variety, not a duplicate.

## lesson: unit-08-verbs-imperative  (grammar point: bare-stem imperative for tū, §9.9.1)

§9.9.1 gives the bare verb stem as the tū-imperative and explicitly lists `paṛh!`, `dekh!`,
`sun!`, `jā!` as its own worked examples — these three reuse those exact book-attested forms
rather than generalizing to an unlisted verb, per the guardrail against inventing forms outside
what the chapter shows.

- [x] id: ex-imp-4
      sarnami: Ghar dekh!
      nl: Kijk naar het huis!
      vocabRefs: verb-dekhe, noun-ghar
      rule: bare-stem tū imperative, "dekh!" listed directly in the §9.9.1 table
      verify: PASS — "dekh!" is the book's own listed form, not a generalization. ghar matches
        noun-ghar's `word`; object placement before the verb matches SOV word order used
        throughout the chapter's other imperative examples (e.g. "Kapaṛā dhovo!").

- [x] id: ex-imp-5
      sarnami: Sun!
      nl: Luister!
      vocabRefs: verb-sune
      rule: bare-stem tū imperative, "sun!" listed directly in the §9.9.1 table
      verify: PASS — matches the book's own table row exactly ("sun! — luister!"), no object
        needed (mirrors the book's own minimal one-word imperative examples).

- [x] id: ex-imp-6
      sarnami: Ghare jā!
      nl: Ga naar huis!
      vocabRefs: verb-jai, noun-ghar
      rule: bare-stem tū imperative "jā!" (§9.9.1) with locative "ghare"
      verify: PASS — "jā!" is the book's own listed form. "ghare" (locative of ghar) is not
        invented here — it's the exact form already attested in this unit's existing ex-past-2
        ("Ū ghare gail."), so this reuses a form already verified in this repo rather than
        deriving a new locative independently.

## lesson: unit-08-verbs-subjunctive  (grammar point: subjunctive mood, §9.8.1)

Model paradigm (§9.8.1): `ham paṛhī` (1sg), `tū paṛh(-e)` (2sg), `ū paṛhe` (3sg). Existing
sentences cover 3sg (`verb-khele`), 1sg (`verb-nace`), and 2sg (`verb-pahine`) — all inside the
book's own `māṅge hai ki .../cāhilā ki ...` ("wants that .../wishes that ...") framing sentences,
which these reuse rather than inventing a new matrix-clause frame.

- [x] id: ex-subj-4
      sarnami: Ū māṅge hai ki ham peṛ dekhī.
      nl: Hij wil dat ik een boom zie.
      vocabRefs: verb-dekhe, noun-per
      rule: 1sg subjunctive -ī ending (§9.8.1), "māṅge hai ki" frame reused from ex-subj-1
      verify: PASS — "ham ... -ī" matches the §9.8.1 table row for ham (same ending as
        ex-subj-2's "ham nācī"). The "X māṅge hai ki ..." frame is copied verbatim from
        ex-subj-1, only the embedded clause changes.

- [x] id: ex-subj-5
      sarnami: Ham cāhilā ki tū ciṭṭhi likhe.
      nl: Ik wil dat jij een brief schrijft.
      vocabRefs: verb-likhe, noun-citthi
      rule: 2sg subjunctive -e ending (§9.8.1), "cāhilā ki" frame reused from ex-subj-3
      verify: PASS — "tū ... -e" matches the §9.8.1 table row for tū (same ending/frame as
        ex-subj-3's "Ham cāhilā ki tū sundar kapaṛā pahine"). ciṭṭhi matches noun-citthi's
        `word`.
