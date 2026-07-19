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
// PARTIALLY RESOLVED (round 2) -- Dutch-orthography loanwords:
// content/sarnami/vocab/loanwords.json's loan-dutch entries (mooi, uitleg,
// klop, beledig, bekeur, wachti, bel, help) are spelled with *Dutch*
// digraphs (oo, ui, eu, ch, ...), not this repo's IAST-derived Sarnami
// diacritic scheme, and this module's mechanical tokenizer still has no
// general Dutch-digraph handling -- letter-by-letter it would still shatter
// e.g. "oo" into two hiatus vowels. Rather than build a generic Dutch-
// phonology path into the tokenizer (risking regressions on the 300+
// already-correct Sarnami-spelled entries for a pattern that only occurs in
// this one 8-word loan-dutch subset), the specific words that actually
// contain a problematic digraph are handled via targeted
// RAW_WORD_OVERRIDES entries below (mooi/uitleg/wachti/bekeur), calibrated
// against the owner's own mooi correction. bel/klop/help have no digraph
// and are left mechanical; beledig's digraph-adjacent "g as Dutch fricative"
// question is flagged but deliberately NOT applied (see the override
// comment). See the generation report for the full reasoning and remaining
// uncertainty (bekeur's eu-nucleus choice, beledig's g).

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
  // PARTIALLY RESOLVED (round 2, etymology research) -- see report /
  // RAW_WORD_OVERRIDES below. The source doc defines the breve vowels as
  // *nasalized* short e/o (rows "ए, एँ" -> े/ेँ and "ओ, ओँ" -> ो/ोँ, i.e.
  // matra + candrabindu). This repo's ĕ/ŏ words split into three groups:
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
  //     -- no override added. (Whether the *breve* should additionally
  //     carry its own candrabindu, per a leftward-nasal-harmony reading,
  //     is untested and left as a documentation flag, not a code change,
  //     to avoid an unverified double-nasal-mark spelling.)
  //   - loan-riwors "riwŏrs" (< English "reverse"), loan-lesiyai
  //     "lĕsiyāī", loan-setiyave "sĕtiyāve": UNRESOLVED. All three are
  //     recent loanword-derived coinages with no inherited Bhojpuri/
  //     Sanskrit etymology to appeal to -- etymology genuinely can't
  //     settle these. Left at this module's non-nasal default pending an
  //     empirical Piper-audio decision; flagged in the generation report.
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
  // Devanagari vowel hiatus. Calibrated against the owner's own mooi fix
  // above (oo -> ो, i/j-offglide -> ई not इ) and phoneme-verified via
  // espeak-ng where noted; NOT every entry below is equally certain -- see
  // each note and the generation report's needsReview section.
  //
  // Owner-confirmed anchor: oo -> ो, offglide -> ई (independent ī, not i).
  "mooi kare": "मोई करे",
  // "ui" /œy/: offglide=ई is grounded in the mooi anchor; the उ nucleus is
  // an unverified approximation (Devanagari has no letter for Dutch's
  // rounded-schwa-to-/y/ diphthong) -- flagged for an audio check.
  "uitleg kare": "उईत्लेग करे",
  // Dutch "ch" = /x/ (voiceless velar/uvular fricative), NOT the Devanagari
  // छ palatal affricate this module's CONSONANTS table maps IAST "ch" to
  // for genuine Sarnami words (a false-friend collision with Dutch
  // orthography). ख़ (kha + nukta, U+0959) is phoneme-verified via
  // piper's own espeak-ng phonemizer to produce a genuine [x] fricative,
  // where छ gives [cʰ] (wrong place+manner) and ख (no nukta) gives [kʰ]
  // (right place, wrong manner -- no frication). High confidence on the
  // phoneme claim; the acoustic model's nukta-letter fidelity on this
  // specific Piper voice is untested -- recommend a human listen-check.
  "wachti kare": "वख़्ति करे",
  // "eu" /øː/ (front rounded -- Devanagari has no matching vowel at all, a
  // pure approximation either way). LOW CONFIDENCE, genuinely unresolved:
  // leaning ू (long-ū) for consistency with how this same loanwords.json
  // corpus already resolves other Dutch rounded vowels (lūrū/yūrū/morsū
  // all use ū), over े (e), which is the phonetically-closer front vowel
  // but breaks that in-corpus pattern. espeak phonemization doesn't
  // discriminate between the two candidates (both produce a single
  // plausible monophthong, no anomaly either way). Recommend an actual
  // Piper-audio A/B by a Dutch speaker before treating this as settled.
  "bekeur kare": "बेकूर करे",
  // NOTE: loan-beledig ("beledig kare") is deliberately left UNCHANGED
  // (mechanical बेलेदिग करे) despite word-final/medial Dutch "g" also being
  // realized as [x] in Dutch (same fricative as "ch" above, phoneme-
  // verified: बेलेदिख़ -> [...x] vs बेलेदिग -> [...ɡ]). This is the most
  // speculative candidate substitution surfaced in the round-2 research --
  // ग "looks fine" as a reading and this would change an
  // established-looking word rather than fix an obviously broken one -- so
  // it's presented as a candidate for the repo owner's judgment (see the
  // generation report), not committed here.
  // loan-bel, loan-klop, loan-help: no Dutch digraph present (single short
  // vowels) -- the mechanical tokenizer's output is already a reasonable
  // rendering of Dutch short vowels, not part of the digraph problem.
};

/** Sarnami diacritic `word` -> Devanagari spelling, for Piper TTS input. */
export function toDevanagari(word) {
  if (RAW_WORD_OVERRIDES[word]) return RAW_WORD_OVERRIDES[word];
  return word.replace(WORD_RE, (run) => transliterateRun(run.toLowerCase()));
}
