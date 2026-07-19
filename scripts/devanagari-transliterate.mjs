// Transliterates this repo's IAST-derived diacritic Sarnami spelling into
// Devanagari script, for Piper TTS input (issue #280). See
// authored_docs/byakaran/01-sounds.md for the source Devanagari<->romanization
// mapping table this is derived from -- the same document
// scripts/scs-transliterate.mjs was built from, but consumed here for its
// Devanagari columns instead of its "Aangepaste SCS-spelling" column.
//
// Why this exists: facebook/mms-tts-hns's tokenizer flattens all of this
// repo's diacritic Sarnami to ~30 ASCII/acute-accent characters, which can't
// represent Sarnami's real retroflex/aspirate/nasal/vowel-length
// distinctions and mispronounces most vocabulary (see scs-transliterate.mjs's
// header comment). Devanagari *can* represent those distinctions, and
// Piper's hi_IN-rohan-medium voice takes Devanagari input, so this module
// targets Devanagari directly rather than routing through the lossy SCS
// scheme.
//
// This is NOT a simple character remap like SCS_CHAR_MAP -- Devanagari is an
// abugida: a consonant letter carries an inherent /a/ vowel that a following
// vowel overrides via a combining "matra" sign (not a fresh, separate
// consonant+vowel pair); a consonant immediately followed by another
// consonant (no vowel between) needs an explicit virama (halant, ्) to
// suppress that inherent vowel and form a conjunct; and a vowel with no
// preceding consonant to attach to (word-initial, or immediately after
// another vowel, e.g. gāī "cow") needs its own independent letterform
// instead of a matra. toDevanagari() tokenizes each Latin word into a
// phoneme sequence (longest-match first, so aspirate/retroflex digraphs
// like kh/gh/ṭh/ḍh and the ai/au diphthongs win over their component single
// letters) and then walks that sequence applying those three rules.
//
// Word-final consonants are deliberately left "bare" (no virama) -- that
// matches standard Hindi/Devanagari orthography, which doesn't mark the
// schwa-deletion that happens when text is read aloud (घर is spelled
// gha+ra but read "ghar", not "ghara"). Piper's Hindi voice is trained on
// ordinary Hindi text and handles that convention the same way any Hindi
// reader/TTS would, so we don't need to model schwa-deletion ourselves --
// just spell things the way real Hindi words are spelled.
//
// MID-WORD virama is a deliberate design choice, not an oversight: every
// consonant immediately followed by another consonant (no vowel between,
// per the *source* romanization) gets an explicit virama -- e.g.
// laṛkā -> लड़्का, not the canonical dictionary spelling लड़का (which
// relies on a reader/TTS's own mid-word schwa-deletion rule to silently
// drop the vowel between ड़ and क that Devanagari orthography still
// *writes*). We stay phonemically faithful to the romanization instead of
// re-implementing Hindi's schwa-deletion algorithm (Ohala's rule) to
// reconstruct which "silent" vowels canonical spelling would include --
// that's a hard, error-prone NLP problem, and getting it wrong would
// silently corrupt words the romanization already tells us unambiguously
// how to pronounce. This makes a few outputs look visually non-standard to
// a Hindi-literate reader (लड़्का vs लड़का) despite almost certainly
// producing the same phonemes through Piper's phonemizer -- flagged for
// review, not treated as a bug.
//
// ROUND 2 -- empirically verified via espeak-ng's deterministic phonemizer
// (Piper's hi_IN-rohan-medium voice consumes espeak "hi" phonemes, so an
// identical phoneme string is strong evidence of no audible difference) plus
// multi-sample Piper+ASR round-trips. The blanket "always virama between
// consonants" default holds up for the vast majority of clusters and was
// deliberately NOT changed wholesale -- four narrower patterns emerged:
//   1. Geminates (त्त, च्छ, ल्ल, ...): virama is genuinely load-bearing --
//      it produces real consonant-duration gemination (and preserves
//      aspiration on aspirate geminates). Confirmed 4/4 samples. Default
//      behavior (keep virama) is correct; no change.
//   2. र् immediately before another consonant, specifically in an
//      UNSTRESSED word-initial CV-schwa syllable (सर्- in Sarnāmī/Sarnām):
//      fragile -- र gets dropped/garbled in Piper audio even though espeak
//      assigns it a real phoneme. The SAME cluster in a stressed syllable
//      (गिर्मिट) tested fine unmodified. Only 2 owner-confirmed instances
//      exist in the current vocab (both already fixed via
//      RAW_WORD_OVERRIDES below) -- not enough evidence to justify a
//      general stress-detection rule, so this is intentionally left as a
//      per-word override pattern, not mechanized. Flag any *other*
//      unstressed-syllable र्+consonant word for manual review if one is
//      ever added.
//   3. A nasal consonant + virama immediately before a stop of a DIFFERENT
//      place of articulation (heterorganic, e.g. न् before velar ग) does
//      NOT get place-assimilated by espeak the way anusvara does --
//      handled by a targeted rule in transliterateRun() below
//      (VELAR_STOPS_FOR_NASAL_ASSIMILATION), scoped to the one pattern
//      actually attested in this vocab (jangal). Already-homorganic nasal
//      letters (ङ् before क/ग, as in Laṅkā/aṅguṭṭhī) are unaffected and
//      untouched -- confirmed byte-identical espeak output either way.
//   4. Everything else (ड़्+क, ज्+प, न्+च, न्+त, न्+ब, स्+त, ...): virama
//      vs. no-virama produced identical or near-identical espeak
//      phonemization, and in a few cases (स्त, म्थ clusters) keeping the
//      virama actively prevents Hindi's default stress algorithm from
//      inserting a spurious extra schwa syllable. No change.
// See the generation report for the full word-by-word evidence table.
//
// Also surfaced (unrelated to virama, but caught by the same audio testing,
// noted here since it touches this module's other schwa-related claim
// below): a bare word-final consonant with NO vowel matra (लल्ल, before the
// owner's "Lalla Rookh" fix) was NOT silently schwa-deleted by
// espeak/Piper -- it produced an audible trailing schwa. That's a
// *word-final*, not mid-word, case, and the fix that resolved it (लल्ला,
// with an explicit ा matra) is a RAW_WORD_OVERRIDES entry below, not a
// change to the general word-final-bare-consonant handling in
// transliterateRun() -- there isn't yet enough evidence across other
// word-final-bare-consonant entries to know whether the schwa-deletion
// assumption stated below is wrong in general or specific to लल्ल's
// unusual bare-ल-with-no-following-letter shape. Flagged as a follow-up,
// not fixed wholesale.
//
// RESOLVED (round 3) -- Dutch-orthography loanwords: content/sarnami/
// vocab/loanwords.json's loan-dutch entries (mooi, uitleg, klop, beledig,
// bekeur, wachti, bel, help) are spelled with *Dutch* digraphs (oo, ui, eu,
// ch, ...), not this repo's IAST-derived Sarnami diacritic scheme, and this
// module's mechanical tokenizer still has no general Dutch-digraph handling
// -- letter-by-letter it would still shatter e.g. "oo" into two hiatus
// vowels. Rather than build a generic Dutch-phonology path into the
// tokenizer (risking regressions on the 300+ already-correct Sarnami-spelled
// entries for a pattern that only occurs in this one 8-word loan-dutch
// subset), the specific words that actually contain a problematic digraph
// are handled via targeted RAW_WORD_OVERRIDES entries below. mooi/uitleg/
// wachti/bekeur/beledig are all owner-provided ground truth (round 3): per
// the owner, Dutch word-final/medial "g" is usually rendered as "kh" in
// Sarnami -- see uitleg and beledig below, both spelled with ख़ where the
// Dutch source has "g". bel/klop/help have no digraph and are left
// mechanical.

const VOWELS = {
  a: { indep: "अ", matra: "" },
  ā: { indep: "आ", matra: "ा" },
  i: { indep: "इ", matra: "ि" },
  ī: { indep: "ई", matra: "ी" },
  u: { indep: "उ", matra: "ु" },
  ū: { indep: "ऊ", matra: "ू" },
  e: { indep: "ए", matra: "े" },
  ai: { indep: "ऐ", matra: "ै" },
  o: { indep: "ओ", matra: "ो" },
  au: { indep: "औ", matra: "ौ" },
  // RESOLVED (round 3) -- see report / RAW_WORD_OVERRIDES below. The source
  // doc defines the breve vowels as *nasalized* short e/o (rows "ए, एँ" ->
  // े/ेँ and "ओ, ओँ" -> ो/ोँ, i.e. matra + candrabindu). This repo's ĕ/ŏ
  // words split into three groups:
  //   - wf-lohar "lŏhār" / wf-sonar "sŏnār": CONFIRMED non-nasal. Both
  //     descend from the Sanskrit -kāra agentive suffix (lohakāra,
  //     suvarṇakāra), which has no nasal consonant anywhere in its
  //     attested NIA history in any dialect -- the breve here is a
  //     non-etymological artifact, not eroded-but-real nasality. Plain
  //     e/o (this module's default, below) is correct for these.
  //   - pron-tomhar "tŏṁhār": CONFIRMED nasal, from tumhārā's genuine
  //     historical -mh- cluster (retained pre-vocalically in Old Hindi;
  //     general NIA pattern of nasal-consonant-loss -> compensatory vowel
  //     nasalization). Already audibly nasal in this module's output
  //     without any special-casing of ŏ itself: the word's own explicit
  //     ṁ token (see NASAL_KEYS below) already produces an anusvara right
  //     after the ो, so तोंहार is not silently losing the nasal quality
  //     -- no override added.
  //   - loan-riwors "riwŏrs" (< English "reverse"), loan-lesiyai
  //     "lĕsiyāī", loan-setiyave "sĕtiyāve": owner decision (round 3) --
  //     KEEP the nasal marking on these loanwords (candrabindu on the
  //     breve syllable) rather than defaulting to non-nasal, since
  //     etymology alone couldn't settle it either way. See the
  //     RAW_WORD_OVERRIDES entries below, which add an explicit ँ next to
  //     the breve's matra. All three vocab entries already carry the
  //     `needs-verification` tag (content/sarnami/vocab/loanwords.json),
  //     which is the right place to flag this as owner-decided-but-not-yet
  //     native-speaker-confirmed -- no additional code-level flag needed.
  ĕ: { indep: "ए", matra: "े" },
  ŏ: { indep: "ओ", matra: "ो" },
  // Untested: 0 occurrences in the current vocab (see /tmp scan during
  // authoring). Included only for completeness against the doc's full
  // vowel inventory -- verify against a real example before trusting it if
  // a ă word is ever added.
  ă: { indep: "अ", matra: "" },
};

const CONSONANTS = {
  // Aspirate/retroflex digraphs. Must be tried before their component
  // single letters -- see PHONEME_KEYS sorting below.
  kh: "ख",
  gh: "घ",
  ch: "छ",
  jh: "झ",
  ṭh: "ठ",
  ḍh: "ढ",
  th: "थ",
  dh: "ध",
  ph: "फ",
  bh: "भ",
  ṛh: "ढ़", // untested (0 occurrences) -- full-inventory completeness only
  k: "क",
  g: "ग",
  c: "च",
  j: "ज",
  ṭ: "ट",
  ḍ: "ड",
  ṇ: "ण",
  t: "त",
  d: "द",
  n: "न",
  p: "प",
  b: "ब",
  m: "म",
  y: "य",
  r: "र",
  l: "ल",
  v: "व",
  w: "व", // doc: व covers both (va) and (wa) -- one Devanagari letter
  ś: "श",
  ṣ: "ष",
  s: "स",
  h: "ह",
  ñ: "ञ",
  ṅ: "ङ",
  // Retroflex flap. This is the ONLY sense ṛ is used for anywhere in this
  // repo's vocab (laṛkā, ghaṛī, paṛhe, ...). scs-transliterate.mjs's ṛ note
  // documents a second, rarer sense -- vocalic-ṛ in Sanskrit loanwords
  // (ṛsi -> SCS "rishi") -- which would need a different Devanagari letter
  // (ऋ) entirely; that sense does not occur in the current 312-entry vocab
  // (checked), so no special-case is implemented. Re-check this comment if
  // a ṛ-word is ever added that isn't a retroflex flap.
  ṛ: "ड़",
  f: "फ़", // nukta form (wf-safai "safāī")
  // Untested (0 occurrences) -- full-inventory completeness only.
  q: "क़",
  z: "ज़",
};

// Anusvara (U+0902). Both ṁ (dot-above) and ṃ (dot-below, used
// inconsistently in this repo's authored spelling -- see num-panc "pāṃc")
// map to this one mark. We deliberately don't distinguish anusvara (ं) from
// candrabindu (ँ): Hindi orthography's choice between them is
// lexically/historically conventionalized per-word (हाँ "yes" conventionally
// takes chandrabindu, मैं "I" conventionally takes anusvara, with no clean
// phonetic rule deciding between them), and both marks are pronounced
// identically by Devanagari readers/TTS. So standardizing on one is
// TTS-safe even where it diverges from a dictionary's preferred spelling
// for a handful of common words (hāṁ, kahāṁ, ...) -- flagged in the report,
// but not a pronunciation bug.
const ANUSVARA = "ं";
const VISARGA = "ः"; // untested (0 occurrences)
const VIRAMA = "्";
// Used only in RAW_WORD_OVERRIDES, to mark the owner-decided nasal breve
// vowels in loan-riwors/loan-lesiyai/loan-setiyave (round 3) -- see the ĕ/ŏ
// VOWELS comment above.
const CANDRABINDU = "ँ";

const NASAL_KEYS = { ṁ: "nasal", ṃ: "nasal", ḥ: "visarga" };

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PHONEME_KEYS = [
  ...Object.keys(CONSONANTS),
  ...Object.keys(VOWELS),
  ...Object.keys(NASAL_KEYS),
].sort((a, b) => b.length - a.length);

const TOKEN_RE = new RegExp(PHONEME_KEYS.map(escapeRegExp).join("|"), "g");

// Sequence of Latin letters (this repo's full diacritic inventory) that
// gets tokenized/transliterated as one run; everything else (spaces,
// hyphens, "?", "…", ...) passes through toDevanagari() unchanged.
const WORD_RE = /[a-zA-Zāăēĕīōŏūñṅṇṛśṣṭḍṁṃ]+/g;

function tokenize(run) {
  const tokens = [];
  let i = 0;
  while (i < run.length) {
    TOKEN_RE.lastIndex = i;
    const m = TOKEN_RE.exec(run);
    if (!m || m.index !== i) {
      throw new Error(
        `devanagari-transliterate: unrecognized character "${run[i]}" in "${run}" (extend VOWELS/CONSONANTS or add a RAW_WORD_OVERRIDES entry)`
      );
    }
    tokens.push(m[0]);
    i += m[0].length;
  }
  return tokens;
}

function tokenType(tok) {
  if (CONSONANTS[tok]) return "consonant";
  if (VOWELS[tok]) return "vowel";
  return NASAL_KEYS[tok]; // "nasal" | "visarga"
}

// Empirical finding (multi-sample Piper+ASR round-trip against espeak-ng's
// deterministic phonemization, see the issue #280 round-2 review): an
// explicitly-spelled nasal consonant + virama immediately before a stop of a
// DIFFERENT place of articulation does NOT get place-assimilated by
// espeak-ng the way the conventional anusvara spelling does -- न्ग
// phonemizes with a wrong-place alveolar [n] before the velar ग, while
// अनुस्वार (ं) correctly gives the assimilated velar [ŋ] that matches real
// Hindi pronunciation (confirmed on "jangal": जन्गल -> garbled ASR vs जंगल
// -> ASR closer to the intended shape). This does NOT apply when the nasal
// letter is already homorganic with what follows (ङ् before क/ग, as in
// Laṅkā/aṅguṭṭhī, already elsewhere in this vocab and left untouched --
// espeak's IPA for that case is byte-identical with or without this rule).
// Scoped narrowly to plain "n" immediately before a velar stop -- the only
// heterorganic-nasal pattern actually attested in the current 312-entry
// vocab (jangal) -- rather than a broader nasal-nearest-place-assimilation
// rewrite, to avoid touching untested consonant combinations.
const VELAR_STOPS_FOR_NASAL_ASSIMILATION = new Set(["k", "kh", "g", "gh"]);

function transliterateRun(run) {
  const tokens = tokenize(run);
  let out = "";
  let pending = null; // { tok, glyph } for a consonant awaiting resolution

  const flushPendingBare = () => {
    if (pending !== null) {
      out += pending.glyph;
      pending = null;
    }
  };

  for (const tok of tokens) {
    const type = tokenType(tok);
    if (type === "consonant") {
      // A consonant right after another still-pending consonant means no
      // vowel separated them -- form a conjunct via virama, EXCEPT the
      // targeted heterorganic-nasal-before-stop override above.
      if (pending !== null) {
        if (
          pending.tok === "n" &&
          VELAR_STOPS_FOR_NASAL_ASSIMILATION.has(tok)
        ) {
          out += ANUSVARA;
        } else {
          out += pending.glyph + VIRAMA;
        }
      }
      pending = { tok, glyph: CONSONANTS[tok] };
    } else if (type === "vowel") {
      const { indep, matra } = VOWELS[tok];
      if (pending !== null) {
        out += pending.glyph + matra; // matra "" for inherent /a/
        pending = null;
      } else {
        out += indep; // word-initial, or hiatus after another vowel
      }
    } else if (type === "nasal") {
      flushPendingBare();
      out += ANUSVARA;
    } else if (type === "visarga") {
      flushPendingBare();
      out += VISARGA;
    }
  }
  flushPendingBare(); // word-final bare consonant (schwa-deletion, unmarked)
  return out;
}

// Per-word overrides for cases genuine judgment is needed rather than a
// mechanical char/syllable mapping (mirrors scs-transliterate.mjs's
// RAW_WORD_OVERRIDES pattern). Keyed by the *exact* `word` field as authored
// (including capitalization) -- these are specific, owner/research-verified
// corrections to specific vocab entries, not general rules, so they
// deliberately do NOT go through the lowercase-folding mechanical path.
//
// Group 1 -- owner's own direct PR corrections (issue #280 round 2), ground
// truth, applied verbatim:
export const RAW_WORD_OVERRIDES = {
  // सर्नामी (mechanical, र्+न unstressed-syllable cluster) dropped the र in
  // Piper+ASR round-trip testing; doubling it into its own syllable (र्र)
  // fixed it. See the मिड-word-virama empirical findings: र्+consonant is
  // specifically fragile in an UNSTRESSED word-initial CV-schwa syllable
  // (सर्- here), not र्+consonant clusters generally (contrast the stressed
  // गिर्मिट, which tested fine unmodified).
  Sarnāmī: "सर्रनामी",
  // Same unstressed सर्- fragility as above; here the owner's fix relocates
  // the virama onto the word-final म instead of doubling र.
  Sarnām: "सरनाम्",
  // Two independent, unrelated bugs the owner's fix corrects at once (see
  // round-2 empirical findings): (1) लल्ल's bare word-final ल (no vowel
  // matra) was NOT silently schwa-deleted by espeak/Piper as this module's
  // schwa-deletion assumption expects -- it produced an audible epenthetic
  // schwa; लल्ला's overt ा matra sidesteps the ambiguity. (2) रोओख spelled
  // the "oo" as two separate o's (a real 2-syllable hiatus), where रूख
  // (long ū) gives the intended single long vowel.
  "Lalla Rookh": "लल्ला रूख",

  // Group 2 -- Dutch-loanword digraphs (content/sarnami/vocab/loanwords.json,
  // the loan-dutch tagged entries). This module's mechanical tokenizer has
  // no Dutch-digraph handling (see the module header comment) and shatters
  // Dutch spelling-doubled long vowels / diphthongs into spurious
  // Devanagari vowel hiatus. Owner-provided ground truth (round 3),
  // superseding the round-2 research candidates -- applied verbatim:
  //
  // Owner-confirmed anchor: oo -> ो, offglide -> ई (independent ī, not i).
  "mooi kare": "मोई करे",
  // Owner's rule: Dutch word-final/medial "g" -> ख़ ("kh") in Sarnami.
  "uitleg kare": "आोतलेख करे",
  "beledig kare": "बलएडेख करे",
  "wachti kare": "ववक्ती करे",
  "bekeur kare": "बकर करे",
  // loan-bel, loan-klop, loan-help: no Dutch digraph present (single short
  // vowels) -- the mechanical tokenizer's output is already a reasonable
  // rendering of Dutch short vowels, not part of the digraph problem.

  // Group 3 -- ĕ/ŏ nasal loanwords (round 3 owner decision): etymology
  // research (round 2) couldn't settle whether these three recent
  // loanword-derived coinages are nasal, since they have no inherited
  // Bhojpuri/Sanskrit etymology to appeal to. Owner's call: keep the nasal
  // marking rather than defaulting to non-nasal. Each starts from this
  // module's own mechanical output for the word (confirmed against the
  // round-2 research report) with an explicit candrabindu added on the
  // breve syllable; all three vocab entries already carry the
  // `needs-verification` tag (content/sarnami/vocab/loanwords.json).
  "riwŏrs kare": `रिवो${CANDRABINDU}र्स करे`,
  lĕsiyāī: `ले${CANDRABINDU}सियाई`,
  sĕtiyāve: `से${CANDRABINDU}तियावे`,
};

/** Sarnami diacritic `word` -> Devanagari spelling, for Piper TTS input. */
export function toDevanagari(word) {
  if (RAW_WORD_OVERRIDES[word]) return RAW_WORD_OVERRIDES[word];
  return word.replace(WORD_RE, (run) => transliterateRun(run.toLowerCase()));
}
