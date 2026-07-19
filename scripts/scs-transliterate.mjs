// Transliterates this repo's IAST-derived diacritic Sarnami spelling into
// SCS (Spellingscommissie Sarnami) plain-Latin spelling — see
// authored_docs/byakaran/01-sounds.md for the source mapping table this is
// derived from ("Aangepaste SCS-spelling" column).
//
// Why this exists: facebook/mms-tts-hns's tokenizer vocabulary is plain ASCII
// plus only four acute-accented vowels (á é í ó) — it has none of ā ī ū ṭ ḍ ṇ
// ñ ṅ ṁ ṛ ś ṣ ĕ ŏ ē ō ă. Out-of-vocabulary characters are silently dropped to
// `<unk>` rather than rejected, so feeding this model our authored diacritic
// `word` fields directly produces mispronounced audio with no error to
// signal it (see rarelang's docs/contracts/api-contract.md, "Choosing
// a model and preparing text"). SCS is this language's own real-world
// solution to exactly this problem — a spelling meant to be readable without
// diacritics — so it doubles as the right input form for this model.
export const SCS_CHAR_MAP = {
  // Macron long vowels: SCS drops the macron, keeping the base vowel letter.
  ā: "a",
  ī: "i",
  ū: "u",
  ē: "e",
  ō: "o",
  // Breve short vowels (ă ĕ ŏ mark a short vowel distinct from the plain
  // letter in the scientific transcription) — SCS makes no such distinction.
  ă: "a",
  ĕ: "e",
  ŏ: "o",
  // Retroflex consonants (underdot): SCS drops the dot.
  ṭ: "t",
  ḍ: "d",
  ṇ: "n",
  // Nasals: SCS folds all three of these to plain "n" (kaiñcī → kainci,
  // Laṅkā → Lanka, kahāṁ → kahan).
  ñ: "n",
  ṅ: "n",
  ṁ: "n",
  // Retroflex flap (laṛkā → larka). Note: the same "ṛ" character is also used
  // in the scientific transcription for the rare vocalic-r Sanskrit loanword
  // vowel (ṛsi → SCS "rishi", not "rsi") — this mechanical map only handles
  // the far more common retroflex-flap case correctly; vocalic-ṛ loanwords
  // need a manual override in RAW_WORD_OVERRIDES below if any turn up.
  ṛ: "r",
  // Sibilants: SCS's own examples render both as "sh" (śānti → shanti,
  // varṣā → varsha) — "bhāṣā → bhasa" is a documented alternate spelling in
  // the same source, but "sh" is the one used consistently enough to pick as
  // the mechanical default.
  ś: "sh",
  ṣ: "sh",
};

// Per-word overrides for cases the mechanical char-map gets wrong (see the
// ṛ note above). Keyed by the exact authored `word` field.
export const RAW_WORD_OVERRIDES = {};

const SCS_CHAR_RE = new RegExp(Object.keys(SCS_CHAR_MAP).join("|"), "g");

/** Sarnami diacritic `word` -> plain-Latin SCS spelling, for TTS input. */
export function toScs(word) {
  if (RAW_WORD_OVERRIDES[word]) return RAW_WORD_OVERRIDES[word];
  return word.replace(SCS_CHAR_RE, (char) => SCS_CHAR_MAP[char]);
}
