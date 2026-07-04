import type { LanguageSettings, LearningLanguageCode } from "@/domain/types";

// This is the frontend's own local/offline fallback copy, used by
// `LocalJsonContentRepository` when `VITE_API_BASE_URL` isn't set (see
// `src/services/index.ts`) — not a duplicate kept for backend-bundling
// purposes. `/server` serves its own authored copy verbatim from
// `server/settings/{code}/language-settings.json` (issue #32/#33). Keep the
// two in sync by hand if this content changes.
const sarnamiLanguageSettings: LanguageSettings = {
  code: "sarnami",
  displayName: "Sarnami Hindoestani",
  scriptDirection: "ltr",
  romanization: {
    scheme: "IAST-derived",
    diacritics: [
      { char: "ā", description: "long a (macron)" },
      { char: "ī", description: "long i (macron)" },
      { char: "ū", description: "long u (macron)" },
      { char: "ṭ", description: "retroflex t (underdot)" },
      { char: "ḍ", description: "retroflex d (underdot)" },
      { char: "ṇ", description: "retroflex n (underdot)" },
      { char: "ñ", description: "palatal nasal" },
      { char: "ṅ", description: "velar nasal" },
    ],
    notes:
      "Raw text extraction from book-source PDFs commonly corrupts or drops these diacritics (e.g. ā → ä, or vanishing entirely); content must be verified against rendered page images, not trusted from pdftotext output.",
  },
  alphabet: {
    vowels: ["a", "ā", "i", "ī", "u", "ū", "e", "o"],
    consonants: [
      "k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh",
      "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l",
      "v", "ś", "s", "h",
    ],
  },
  audio: {
    baseUrl: "/audio/sarnami/",
    format: "mp3",
    voice: "single-speaker-tts",
  },
};

// Sranan Tongo has no lesson content bundled in src/data (local/offline mode
// only ever falls back to the Sarnami content bundle — see
// LocalJsonContentRepository's warnIfUnsupported); real Sranan Tongo lesson
// content lives server-side only, under server/content/sranantongo/ (issue
// #37). These settings are kept in sync by hand with
// server/settings/sranantongo/language-settings.json.
const sranantongoLanguageSettings: LanguageSettings = {
  code: "sranantongo",
  displayName: "Sranan Tongo",
  scriptDirection: "ltr",
  romanization: {
    scheme: "Plain Dutch-derived Latin orthography",
    diacritics: [],
    notes:
      "Unlike Sarnami, Sranan Tongo does NOT use macron (ā/ī/ū) or underdot (ṭ/ḍ/ṇ) diacritics; it is written with the plain, unaccented Latin alphabet (confirmed by every loanword the Sarnami grammar attributes to Sranan Tongo — see docs/byakaran/00-introduction.md and docs/byakaran/09-loan-words-and-neologisms.md), so this list is intentionally empty rather than mirroring Sarnami's.",
  },
  alphabet: {
    vowels: ["a", "e", "i", "o", "u"],
    consonants: ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "y"],
  },
  audio: {
    baseUrl: "/audio/sranantongo/",
    format: "mp3",
    voice: "single-speaker-tts",
  },
};

export const languageSettingsByCode: Record<LearningLanguageCode, LanguageSettings> = {
  sarnami: sarnamiLanguageSettings,
  sranantongo: sranantongoLanguageSettings,
};
