# unit-12-word-formation — candidate example sentences

Status: DRAFT

Source: `authored_docs/byakaran/10-word-formation.md` (Sarnami Byākaran, Marhé 1985, "Woordvorming"
chapter — voor- en achtervoegsels). Generated per `/gen-sentences unit-12-word-formation`, verified
per `/verify-sentences unit-12-word-formation` (both passes performed manually per issue #260 — see
PR description). This chapter is wordlist tables, not worked example sentences like the verb
chapter, so every candidate is a newly-constructed sentence built from an attested derived word
(vocab `word` = book table entry) placed in a minimal, independently-correct grammatical frame
(copula `hai`, an established postposition, or the §9.7.1 present-tense pattern from unit-08).
Checkboxes below reflect an actual review pass: only `verify: PASS` rows are ticked.

## lesson: unit-12-word-formation-suffixes  (grammar point: derivational suffixes -akkaṛ/-ār/-āī/-vālā, Achtervoegsels §1/§11/§13/§34)

Unit currently has 0 `exampleSentences` for this lesson. These six candidates each place one
`newVocab` derived word in a simple predicate-nominal or locative frame and cite the chapter's own
table row for the suffix.

- [x] id: ex-sfx-1
      sarnami: Hamār bhāī ghumakkaṛ hai.
      nl: Mijn broer is een zwerver.
      vocabRefs: wf-ghumakkar, noun-bhai, pron-hamar, gram-hai
      rule: -akkaṛ forms a habitual doer (Achtervoegsels §1); ghumakkaṛ "a wanderer" from ghum-
        "to roam", listed verbatim in the book's own table and in gn-wf-1.
      verify: PASS — wf-ghumakkar's `word` (ghumakkaṛ) and `nl` translation match the chapter
        table row exactly ("ghumakkaṛ | een zwerver"). hamār (pron-hamar) + bhāī (noun-bhai) +
        hai (gram-hai) is a plain possessive-subject + predicate-nominal + copula sentence, no
        invented grammar.

- [x] id: ex-sfx-2
      sarnami: Hamār bappā lŏhār hai.
      nl: Mijn vader is een smid.
      vocabRefs: wf-lohar, noun-bappa, pron-hamar, gram-hai
      rule: -ār forms an occupational name (Achtervoegsels §13); lŏhār "a blacksmith" from lŏhā
        "iron", per gn-wf-1's own worked example.
      verify: PASS — matches the chapter's table row ("lŏhār | een smid") and gn-wf-1's explicit
        "lŏhā 'ijzer' → lŏhār 'een smid'" derivation. Same sentence frame as ex-sfx-1, different
        vocab.

- [x] id: ex-sfx-3
      sarnami: Ū sŏnār hai.
      nl: Hij is een goudsmid.
      vocabRefs: wf-sonar, pron-u, gram-hai
      rule: -ār occupational suffix (Achtervoegsels §13), same table row as lŏhār; sŏnār "a
        goldsmith" from sŏnā "gold".
      verify: PASS — sŏnār appears in the same book table row (item 13) as lŏhār ("sŏnār | een
        goudsmid"), confirming the -ār class extends beyond the one grammar-note example. Minimal
        pronoun+predicate+hai frame, no unattested vocab.

- [x] id: ex-sfx-4
      sarnami: Ghar meṁ safāī hai.
      nl: Er is netheid in het huis.
      vocabRefs: wf-safai, noun-ghar, post-mem, gram-hai
      rule: -āī forms an abstract noun (Achtervoegsels §11); safāī "cleanliness" from sāf "clean",
        per gn-wf-1's own worked example.
      verify: PASS — matches chapter table row ("safāī | netheid") and gn-wf-1's "sāf 'schoon' →
        safāī 'netheid'" derivation exactly. "ghar meṁ" (post-mem "in") + abstract-noun subject +
        hai is a standard locative-existential frame, not invented.

- [ ] id: ex-sfx-5
      sarnami: Ū paṛhāī kare hai.
      nl: Hij studeert. (letterlijk: hij doet studie)
      vocabRefs: wf-parhai, verb-kare, pron-u, gram-hai
      rule: -āī forms an abstract noun (Achtervoegsels §11); paṛhāī "study" from paṛh- "to
        read/study". Used as the object of kare "to do" (a "do + abstract-noun" light-verb
        reading), 3sg present -e hai per §9.7.1 (unit-08-verbs).
      verify: FAIL — the -āī derivation itself is solid (paṛhāī matches the chapter table row
        "paṛhāī | studie" exactly), and "ū ... kare hai" is a correctly-formed 3sg present per
        §9.7.1. But the "paṛhāī kare" (lit. "do studying") light-verb collocation is not attested
        anywhere in this chapter, in verb-kare's own notes, or in any existing exampleSentence —
        it's my own construction by analogy to related languages, not something I can point to a
        specific book passage for. Per the pipeline's own rule ("treat not sure as FAIL"), this
        needs a source-attested frame (e.g. a plain predicate-nominal use of paṛhāī) before it's
        safe to promote.

- [x] id: ex-sfx-6
      sarnami: Ū ṭopī-vālā hai.
      nl: Hij is de man met de hoed.
      vocabRefs: wf-topivala, pron-u, gram-hai
      rule: -vāl(-ā) means "the one with/of X" (Achtervoegsels §34); ṭopī-vālā "the man with the
        hat" from ṭopī "hat", listed directly in the book's table and in gn-wf-1.
      verify: PASS — wf-topivala's `word` (ṭopī-vālā) and `nl` match the chapter table row exactly
        ("ṭopī-vālā | de man met de hoed"). Minimal predicate-nominal frame, no invented material.

## lesson: unit-12-word-formation-arabic-persian  (grammar point: Arabic-Persian suffixes -dār/-gar/-khānā and prefixes be-/nā-, gn-wf-2 / gn-wf-3)

Unit currently has 0 `exampleSentences` for this lesson. These six candidates cover both
grammar notes: -dār and -gar (occupational/possessive suffixes) and -khānā (place suffix) from
gn-wf-2, plus be- and nā- (negating prefixes) from gn-wf-3.

- [x] id: ex-ap-1
      sarnami: Hamār bappā imāndār hai.
      nl: Mijn vader is eerlijk.
      vocabRefs: wf-imandar, noun-bappa, pron-hamar, gram-hai
      rule: -dār means "bezittend, houder van" (Arabisch-Perzische achtervoegsels §6); imāndār
        "honest" from imān "honor", per gn-wf-2's own worked example.
      verify: PASS — matches chapter table row ("imāndār | eerlijk") and gn-wf-2's "imān 'eer' →
        imāndār 'eerlijk'" derivation exactly. Plain possessive-subject + predicate-adjective +
        hai frame.

- [x] id: ex-ap-2
      sarnami: Ū dukāndār hai.
      nl: Hij is een winkelier.
      vocabRefs: wf-dukandar, pron-u, gram-hai
      rule: -dār (Arabisch-Perzische achtervoegsels §6), same suffix class as imāndār; dukāndār
        "a shopkeeper" from dukān "shop", per gn-wf-2's own worked example.
      verify: PASS — matches chapter table row ("dukāndār | een winkelier") and gn-wf-2's "dukān
        'winkel' → dukāndār 'een winkelier'" derivation exactly.

- [x] id: ex-ap-3
      sarnami: Ū jādūgar hai.
      nl: Hij is een goochelaar.
      vocabRefs: wf-jadugar, pron-u, gram-hai
      rule: -gar forms a maker/doer (Arabisch-Perzische achtervoegsels §4); jādūgar "a magician"
        from jādū "magic, sorcery", per gn-wf-2's own worked example.
      verify: PASS — wf-jadugar's `nl` ("een goochelaar, een tovenaar") matches the chapter table
        row exactly, and gn-wf-2 states "jādū 'toverkunst' → jādūgar 'een goochelaar'" verbatim.

- [x] id: ex-ap-4
      sarnami: Davā-khānā ghar ke lage hai.
      nl: De apotheek is dichtbij het huis.
      vocabRefs: wf-davakhana, noun-ghar, post-ke-lage, gram-hai
      rule: -khānā means "huis, plaats" (Arabisch-Perzische achtervoegsels §2); davā-khānā "a
        pharmacy" from davā "medicine", per gn-wf-2's own worked example.
      verify: PASS — matches chapter table row ("davā-khānā | een apotheek") and gn-wf-2's "davā
        'medicijn' → davā-khānā 'een apotheek'" derivation exactly. "X ghar ke lage hai" is a
        standard locative-proximity frame built from post-ke-lage ("bij, dichtbij"), no invented
        grammar.

- [x] id: ex-ap-5
      sarnami: Ū becain hai.
      nl: Hij is radeloos.
      vocabRefs: wf-becain, pron-u, gram-hai
      rule: be- prefix means "zonder, -loos" (Arabisch-Perzische voorvoegsels §5); becain
        "distraught, restless" from cain "rest", per gn-wf-3's own worked example.
      verify: PASS — matches chapter table row ("becain | radeloos") and gn-wf-3's "cain 'rust' →
        becain 'radeloos'" derivation exactly. Minimal predicate-adjective + hai frame.

- [x] id: ex-ap-6
      sarnami: Ū nā-lāyak hai.
      nl: Hij is ongeschikt.
      vocabRefs: wf-nalayak, pron-u, gram-hai
      rule: nā- prefix means "on-, niet" (Arabisch-Perzische voorvoegsels §3); nā-lāyak "unfit"
        from lāyak "geschikt, bekwaam", per gn-wf-3's own worked example.
      verify: PASS — matches chapter table row ("nā-lāyak | ongeschikt") and gn-wf-3's "lāyak
        'geschikt' → nā-lāyak 'ongeschikt'" derivation exactly.
