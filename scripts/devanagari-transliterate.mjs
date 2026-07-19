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
// review, not treated as a bug. See the generation report for spot-check
// results (e.g. about-sarnami/about-sarnam, which already contain this
// same र् conjunct pattern, in the mandated smoke-test set).
//
// KNOWN GAP -- Dutch-orthography loanwords: content/sarnami/vocab/loanwords.json
// entries (mooi, uitleg, klop, beledig, bekeur, wachti, ...) are spelled with
// *Dutch* digraphs (oo, ui, eu, ...), not this repo's IAST-derived Sarnami
// diacritic scheme. This module has no Dutch-digraph handling, so it
// transliterates them letter-by-letter as if they were Sarnami vowels,
// which is very likely wrong (e.g. "mooi" -> मोओइ shatters the Dutch "oo"
// into two separate Devanagari o's). Whether these loanwords are actually
// *pronounced* with Dutch phonology or a nativized Sarnami approximation in
// speech is a judgment call outside this module's scope -- every word in
// loanwords.json should be treated as needs-review, not trusted as-is; see
// the generation report.

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
  // AMBIGUOUS -- see report / RAW_WORD_OVERRIDES below. The source doc
  // defines the breve vowels as *nasalized* short e/o (rows "ए, एँ" ->
  // े/ेँ and "ओ, ओँ" -> ो/ोँ, i.e. matra + candrabindu). But this repo's
  // actual usage doesn't fit that definition: wf-lohar "lŏhār" and
  // wf-sonar "sŏnār" are ordinary, non-nasal Hindi-cognate words
  // (lohar/sonar, "blacksmith"/"goldsmith") that would be mispronounced if
  // nasalized, and loan-riwors "riwŏrs" (from English "reverse") has no
  // reason to be nasal either. Rather than guess and silently apply
  // nasalization, we map ĕ/ŏ to the *same* Devanagari as plain e/o (no
  // nasal mark) -- this is very likely correct for the lohar/sonar/riwors
  // group, but genuinely uncertain for words where the breve might be
  // marking something else (a reduced/short vowel quality?) that we're
  // currently just dropping. Flagged for human review; every affected word
  // is called out in the generation report.
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

function transliterateRun(run) {
  const tokens = tokenize(run);
  let out = "";
  let pendingConsonant = null; // Devanagari base glyph awaiting resolution

  const flushPendingBare = () => {
    if (pendingConsonant !== null) {
      out += pendingConsonant;
      pendingConsonant = null;
    }
  };

  for (const tok of tokens) {
    const type = tokenType(tok);
    if (type === "consonant") {
      // A consonant right after another still-pending consonant means no
      // vowel separated them -- form a conjunct via virama.
      if (pendingConsonant !== null) out += pendingConsonant + VIRAMA;
      pendingConsonant = CONSONANTS[tok];
    } else if (type === "vowel") {
      const { indep, matra } = VOWELS[tok];
      if (pendingConsonant !== null) {
        out += pendingConsonant + matra; // matra "" for inherent /a/
        pendingConsonant = null;
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
// RAW_WORD_OVERRIDES pattern). Empty/sparse to start -- the mechanical
// tokenizer above produces defensible standard-Hindi-style spelling for all
// 312 current vocab entries; see the report for words flagged as uncertain
// (ĕ/ŏ nasalization, anusvara-vs-candrabindu) that were deliberately NOT
// silently guessed into an override, so a human can confirm or correct them.
export const RAW_WORD_OVERRIDES = {};

/** Sarnami diacritic `word` -> Devanagari spelling, for Piper TTS input. */
export function toDevanagari(word) {
  if (RAW_WORD_OVERRIDES[word]) return RAW_WORD_OVERRIDES[word];
  return word.replace(WORD_RE, (run) => transliterateRun(run.toLowerCase()));
}
