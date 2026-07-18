# unit-09-conjunctions — candidate example sentences

Status: DRAFT

Source: `authored_docs/byakaran/06-conjunctions.md` (Sarnami Byākaran, Marhé 1985, chapter 7,
"Het voegwoord"). Generated per `/gen-sentences unit-09-conjunctions`, verified per
`/verify-sentences unit-09-conjunctions` (both passes performed manually while running the
pipeline against this chapter — see PR description). Checkboxes below reflect an actual
human-review pass: only `verify: PASS` rows are ticked.

Existing `exampleSentences` (ex-09-1..6) already cover: `struct-en` (aur), `struct-maar` (baki),
`conj-zowel-als` (kā … kā …), `struct-dat` (ki), `struct-als` (jo … nā), `struct-omdat` (kāhe
se). The candidates below prioritize the unit's newVocab items that have **no** existing example
sentence yet (`struct-of`, `conj-ofwel`, `conj-noch-noch`, `struct-dan`, `struct-sinds`,
`conj-zodat`, `conj-ookal`, `conj-zolang`), plus one variety candidate each for `struct-en` /
`struct-maar` with different vocabulary.

## lesson: unit-09-conjunctions-coordinating  (grammar point: coordinating conjunctions, §7.1.1)

§7.1.1's table lists `aur/baki/yā/yā to/kā…kā…/nā…nā…`; its intro (§7.1) states all
voegwoorden in this class "verbinden zinnen of zinsdelen" the same way, so the class's own
worked examples and the unit's existing `ex-09-1`/`ex-09-2`/`ex-09-3` clause shapes are reused
as scaffolding for the still-uncovered items in the same table row set.

- [x] id: ex-09-7
      sarnami: Bhāī yā bahin ghar meṁ hai.
      nl: Broer of zus is thuis.
      vocabRefs: struct-of, noun-bhai, noun-bahin, noun-ghar
      rule: §7.1.1 table row "yā, ki, ki to | of"; exact clause shape of ex-09-1 ("Bhāī aur
        bahin ghar meṁ hai") with aur swapped for yā, both being coordinating conjunctions of
        the same class per §7.1's opening statement.
      verify: PASS — yā matches struct-of's `word` exactly. Clause is character-for-character
        ex-09-1 with only the conjunction changed, and the table explicitly lists yā alongside
        aur/baki as members of the same coordinating class, so the substitution is grounded, not
        guessed. Not a near-duplicate of ex-09-1: it demonstrates yā specifically, which had no
        existing example sentence.

- [x] id: ex-09-8
      sarnami: Bhāī ghar meṁ hai, yā to bahin ghar meṁ hai.
      nl: Broer is thuis, of anders is zus thuis.
      vocabRefs: conj-ofwel, noun-bhai, noun-bahin, noun-ghar
      rule: §7.1.1 table row "yā to | of wel"; both clauses are the "X ghar meṁ hai" pattern
        attested verbatim in ex-09-1/ex-09-4, joined by yā to as presented alternatives.
      verify: PASS — yā to matches conj-ofwel's `word` exactly (vocab notes confirm it's a
        variant of yā). Each half-clause is an already-attested exact phrase from this unit; only
        the connective is new. Reads as a natural "either... or else..." deduction, not a
        near-duplicate of ex-09-1 (different conjunction, different semantic function —
        alternative facts, not simple addition).

- [x] id: ex-09-9
      sarnami: Nā bhāī nā bahin ghar meṁ hai.
      nl: Noch broer noch zus is thuis.
      vocabRefs: conj-noch-noch, noun-bhai, noun-bahin, noun-ghar
      rule: §7.1.1 table row "nā … nā … | noch … noch …", mirrors the correlative structure of
        the unit's own ex-09-3 ("Kā bhāī kā bahin, sab ghar meṁ hai") for the paired kā…kā…
        entry in the same table, swapped to the table's other correlative pair.
      verify: PASS — nā … nā … matches conj-noch-noch's `word` exactly. Structure directly
        mirrors ex-09-3's kā…kā… correlative shape (same table, same "paired voegwoord before
        each conjunct" pattern). "sab" (all) from ex-09-3 is correctly dropped here since
        "neither...nor" contradicts a summarizing "all are home".

- [x] id: ex-09-10
      sarnami: Ghoṛā barkā aur lammā hai.
      nl: Het paard is groot en lang.
      vocabRefs: struct-en, noun-ghora, adj-barka, adj-lamma
      rule: §7.1.1 table row "aur | en"; mirrors ex-09-2's adjective+copula shape ("Ū X baki Y
        hai") with aur substituted for baki and new vocabulary (noun-ghora, adj-barka,
        adj-lamma) for variety, per the generation guardrail to exercise the same grammar point
        with different vocab.
      verify: PASS — aur matches struct-en's `word`. ghoṛā/barkā/lammā match noun-ghora's,
        adj-barka's, adj-lamma's `word` fields exactly. Not a near-duplicate of ex-09-1 (which
        uses aur to join two nouns/subjects) or ex-09-2 (which uses baki): this is aur joining
        two adjectives in the ex-09-2 clause shape, a combination not yet demonstrated.

- [ ] id: ex-09-11
      sarnami: Kuttā choṭā baki barhimyā hai.
      nl: De hond is klein maar goed.
      vocabRefs: struct-maar, noun-kutta, adj-chota, adj-barhimya
      rule: §7.1.1 table row "baki | maar"; mirrors ex-09-2's adjective+copula shape with the
        subject changed from pronoun (ū) to a noun (kuttā).
      verify: FAIL — grammatically fine (baki matches struct-maar's `word`; choṭā/barhimyā match
        the existing example's own adjectives exactly), but this is a near-duplicate of ex-09-2:
        identical adjective pair, identical copula, only the subject swapped from a pronoun to a
        noun. It doesn't demonstrate baki in a new way or introduce a meaningfully new
        vocabulary combination — fails the novelty check.

## lesson: unit-09-conjunctions-subordinating  (grammar point: subordinating conjunctions, §7.1.2)

§7.1.2's table and grammar notes (gn-09-2, gn-09-3) cover several conjunctions with no worked
example sentence of their own in the chapter (jaune, cāhe, jab talak, jab se, tab, nahīṁ to,
tabbo — the chapter's own two "voorbeelden" only illustrate ki and jo…to/nahīṁ to using
vocabulary — Buddhū, āphat, taiyār, der — that isn't in this repo's vocab files, so those exact
sentences can't be reused verbatim). Candidates below instead recombine full clauses already
attested verbatim in this unit's own existing examples (`ū bīmār rahā` from ex-09-6, `ham nā āb`
from ex-09-5, `ū/bhāī ghar meṁ hai` from ex-09-1/ex-09-4) under the new conjunctions, so no new
verb inflection is invented — only the connective changes.

- [x] id: ex-09-12
      sarnami: Ū bīmār rahā, jaune ham nā āb.
      nl: Hij was ziek, zodat ik niet kwam.
      vocabRefs: conj-zodat, pron-u, gram-na, pron-ham
      rule: §7.1.2 table row "jaune, jame, jeme | opdat, zodat" (result sense); reuses ex-09-6's
        "ū bīmār rahā" and ex-09-5's "ham nā āb" verbatim, joined by jaune.
      verify: PASS — jaune matches conj-zodat's `word` exactly. Both clauses are
        character-for-character reused from this unit's own existing, already-verified example
        sentences, so no new inflected form is introduced. "Zodat" (result) fits: him being sick
        resulting in me not coming is a coherent cause-effect reading, not a near-duplicate of
        either source sentence (new conjunction, new clause combination).

- [x] id: ex-09-13
      sarnami: Cāhe ū bīmār rahā, ham ghar meṁ hai.
      nl: Hoewel hij ziek was, ben ik thuis.
      vocabRefs: conj-ookal, pron-u, pron-ham, noun-ghar
      rule: gn-09-2 states explicitly "Met cāhe druk je 'ook al / hoewel' uit"; §7.1.2 table row
        "cāhe … | ook al …"; reuses ex-09-6's "ū bīmār rahā" and the "ham … hai" copula form
        listed in gram-hai's own conjugation note ("ham hai, tū hai, ...").
      verify: PASS — cāhe matches conj-ookal's `word` exactly and the grammar note directly
        states its concessive meaning. "ham ghar meṁ hai" uses the invariant copula form
        explicitly listed in gram-hai's notes, not an invented conjugation. Coherent concessive
        reading (sick but I'm still home / unaffected), distinct from ex-09-6's own causal
        kāhe-se sentence.

- [x] id: ex-09-14
      sarnami: Jab talak ū ghar meṁ hai, ham nā āb.
      nl: Zolang hij thuis is, kom ik niet.
      vocabRefs: conj-zolang, pron-u, noun-ghar, pron-ham, gram-na
      rule: §7.1.2 table row "jab talak/-tak | zo lang …" and gn-09-2's restatement; reuses the
        "ū ghar meṁ hai" clause shape (ex-09-1/ex-09-4) and ex-09-5's "ham nā āb" verbatim.
      verify: PASS — jab talak matches conj-zolang's `word` exactly. Both clauses reuse
        already-attested forms; the durative "as long as X, Y" reading is coherent and distinct
        from ex-09-5's own conditional (jo) sentence using the same "ham nā āb" clause — this
        demonstrates a different subordinator governing the same clause, legitimate variety.

- [x] id: ex-09-15
      sarnami: Jab se bhāī ghar meṁ hai, ham barhimyā hai.
      nl: Sinds broer thuis is, ben ik goed.
      vocabRefs: struct-sinds, noun-bhai, noun-ghar, pron-ham, adj-barhimya
      rule: §7.1.2 table row "jab se | sinds, sedert" and gn-09-2's restatement; "bhāī ghar meṁ
        hai" mirrors ex-09-1's clause; "ham barhimyā hai" uses the gram-hai-attested invariant
        copula plus adj-barhimya, applying an adjective+hai predicate to a person exactly as
        ex-09-2 already does ("Ū ... barhimyā hai").
      verify: PASS — jab se matches struct-sinds's `word` exactly. Neither clause invents a new
        verb form: the copula usage is the one explicitly listed in gram-hai's notes, and
        barhimyā-as-predicate-adjective-for-a-person is exactly how ex-09-2 already uses it.
        Not a near-duplicate of ex-09-2 (different conjunction, different subject/structure —
        a time clause, not a simple coordination).

- [ ] id: ex-09-16
      sarnami: Jo bariś hoī, tab ham nā āb.
      nl: Als het regent, dan kom ik niet.
      vocabRefs: struct-dan, struct-als, gram-na, pron-ham
      rule: mirrors the chapter's own §7.1.2 worked example 2 ("Jo ham sūt jāb, to tū hamke
        jagāī diye" — jo…to correlate); §7.1.2 table row "tab, ta | dan" offered as the
        correlate word for struct-dan; reuses ex-09-5's exact clause pair ("bariś hoī" / "ham nā
        āb").
      verify: FAIL — the chapter's own worked example and grammar note gn-09-3 both use "to"
        specifically as the jo-correlate ("Jo … to (indien … dan)"); the table lists "tab, ta"
        as a separate entry glossed "dan" but nothing in the chapter confirms "tab" is
        interchangeable with "to" in this exact correlate slot. Treating them as swappable here
        is not confirmed by the source — insufficient evidence to pass. A safe struct-dan
        example would need either explicit source confirmation that tab/to are interchangeable
        in this construction, or a different (non-jo-correlate) usage of tab that the chapter
        doesn't show either.

**No candidate generated** for `struct-anders` (nahīṁ to) — the chapter's own §7.1.2 worked
example 3 ("Tū apne ke jaldī taiyār kar, nahīṁ to der hoī jāī") uses vocabulary (taiyār, der,
jaldī) not present in this repo's vocab files, and no combination of this unit's other
already-attested clauses produces a semantically coherent "do X, otherwise Y" warning (nahīṁ to
pairs a directive/fact with a plausible negative *future* consequence; the only attested
consequence-shaped clause available here, "ū bīmār rahā", is past tense and reads as a stated
fact rather than a hypothetical warning). Generating one anyway would mean guessing at word order
and register the chapter doesn't actually show for a well-formed nahīṁ to sentence — better left
for a future pass with more source material (or once `taiyār`/`der`/`jaldī`-type vocabulary is
added).

**No candidate generated** for `struct-toch` (tabbo) — gn-09-3 only lists it in passing ("Andere
vaste verbindingen zijn nahīṁ to ('anders') en tabbo ('toch')") with no worked example and no
indication of its word order or clause position. There isn't enough in the chapter to safely
generate a sentence rather than guess.
