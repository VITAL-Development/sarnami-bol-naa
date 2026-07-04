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
  // Mirrors rarelang-server PR #3's branding data for `sarnami` (see
  // https://github.com/VITAL-Development/rarelang-server/pull/3) — the same
  // Suriname-flag palette already expressed as `--color-forest/flame/gold/
  // cream-*` custom properties in src/styles/index.css, carried over the
  // wire instead of baked into that file (issue #62).
  branding: {
    appName: "Sarnami Bol Naa",
    colors: {
      primary: {
        "50": "240 247 241",
        "100": "212 235 213",
        "200": "170 213 172",
        "400": "90 173 96",
        "500": "61 142 67",
        "600": "55 126 63",
        "700": "42 97 49",
      },
      danger: {
        "400": "224 80 112",
        "500": "200 16 46",
        "600": "180 10 45",
        "700": "143 7 31",
      },
      accent: {
        "100": "253 245 194",
        "300": "245 220 106",
        "400": "236 200 29",
        "500": "212 176 25",
        "600": "184 146 0",
      },
      background: {
        "50": "253 246 236",
        "100": "248 232 200",
      },
    },
    icons: {
      favicon: "/favicon.svg",
      icon192: "/icons/icon-192.png",
      icon512: "/icons/icon-512.png",
      iconMaskable512: "/icons/icon-maskable-512.png",
    },
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
  // Mirrors rarelang-server PR #3's branding data for `sranantongo`
  // (confirmed against that repo's issue-62-branding-metadata branch) —
  // same color values as Sarnami's for now (no distinct Sranan Tongo
  // palette has been authored yet), and `icons` is omitted entirely rather
  // than pointing at placeholder assets, since no distinct icon set exists
  // yet either (see issue #62's task description). Callers must treat a
  // missing `icons` key as "use the build-time defaults", not as an error.
  branding: {
    appName: "Sranan Tongo",
    colors: {
      primary: {
        "50": "240 247 241",
        "100": "212 235 213",
        "200": "170 213 172",
        "400": "90 173 96",
        "500": "61 142 67",
        "600": "55 126 63",
        "700": "42 97 49",
      },
      danger: {
        "400": "224 80 112",
        "500": "200 16 46",
        "600": "180 10 45",
        "700": "143 7 31",
      },
      accent: {
        "100": "253 245 194",
        "300": "245 220 106",
        "400": "236 200 29",
        "500": "212 176 25",
        "600": "184 146 0",
      },
      background: {
        "50": "253 246 236",
        "100": "248 232 200",
      },
    },
  },
};

export const languageSettingsByCode: Record<LearningLanguageCode, LanguageSettings> = {
  sarnami: sarnamiLanguageSettings,
  sranantongo: sranantongoLanguageSettings,
};
