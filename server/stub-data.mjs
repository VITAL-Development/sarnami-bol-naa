// Placeholder data for routes whose content hasn't migrated into `/server`
// yet (see README.md's "Transitional state" section and issue #29's task
// list, which explicitly allows stubbing `/languages`, `/settings`, and
// `/ui-strings`). `/content` is the only content route backed by real data
// (via build-content.mjs / content-entry.ts reusing the frontend's
// src/data) since that's the one the contract's acceptance criteria
// requires to be real (`curl .../content?lang=sarnami`).

export const LEARNING_LANGUAGES = [
  { code: "sarnami", displayName: "Sarnami Hindoestani", status: "available" },
  { code: "sranantongo", displayName: "Sranan Tongo", status: "stub" },
];

export const UI_LANGUAGES = [
  { code: "nl", displayName: "Nederlands" },
  { code: "en", displayName: "English" },
];

const SARNAMI_SETTINGS = {
  code: "sarnami",
  displayName: "Sarnami Hindoestani",
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

// Stub: language is "registered" per /languages but not content-complete —
// contract says to return this shape with minimal/placeholder values, not a 404.
const SRANANTONGO_SETTINGS = {
  code: "sranantongo",
  displayName: "Sranan Tongo",
  romanization: {
    scheme: "",
    diacritics: [],
    notes: "Stub — Sranan Tongo settings have not been authored yet.",
  },
  alphabet: {
    vowels: [],
    consonants: [],
  },
  audio: {
    baseUrl: "/audio/sranantongo/",
    format: "mp3",
    voice: "single-speaker-tts",
  },
};

export const SETTINGS_BY_LANGUAGE = {
  sarnami: SARNAMI_SETTINGS,
  sranantongo: SRANANTONGO_SETTINGS,
};

// Mirrors src/i18n/strings.nl.ts's shape exactly (see that file and
// src/i18n/t.ts's DotPaths lookup). `en` is a stub translation added only
// here — the frontend has no strings.en.ts yet (issue #27 tracks adding
// real English content); every key present in `nl` is present in `en` too,
// per the contract's "no partial locales" rule.
const NL_STRINGS = {
  appName: "Sarnami Bol Naa",
  nav: {
    path: "Pad",
    review: "Oefenen",
    profile: "Profiel",
  },
  path: {
    title: "Jouw leerpad",
    lessonLocked: "Voltooi de vorige les om deze te ontgrendelen.",
    startLesson: "Start les",
  },
  lesson: {
    checkAnswer: "Controleren",
    continue: "Verder",
    correct: "Goed zo!",
    incorrect: "Niet helemaal — proberen we het nog eens?",
    heartsRemaining: "levens over",
    lessonComplete: "Les voltooid!",
    lessonFailed: "Geen levens meer — probeer het opnieuw.",
    backToPath: "Terug naar het pad",
    tryAgain: "Opnieuw proberen",
    xpEarned: "XP verdiend",
  },
  review: {
    title: "Herhalen",
    empty: "Niets te herhalen vandaag — kom morgen terug!",
    showAnswer: "Toon antwoord",
    knewIt: "Wist ik!",
    didntKnowIt: "Wist ik niet",
  },
  profile: {
    title: "Profiel",
    xp: "XP",
    streak: "dagen op rij",
    badges: "Badges",
    noBadgesYet: "Nog geen badges verdiend — ga aan de slag!",
  },
};

const EN_STRINGS = {
  appName: "Sarnami Bol Naa",
  nav: {
    path: "Path",
    review: "Review",
    profile: "Profile",
  },
  path: {
    title: "Your learning path",
    lessonLocked: "Complete the previous lesson to unlock this one.",
    startLesson: "Start lesson",
  },
  lesson: {
    checkAnswer: "Check",
    continue: "Continue",
    correct: "Correct!",
    incorrect: "Not quite — want to try again?",
    heartsRemaining: "hearts left",
    lessonComplete: "Lesson complete!",
    lessonFailed: "Out of hearts — try again.",
    backToPath: "Back to path",
    tryAgain: "Try again",
    xpEarned: "XP earned",
  },
  review: {
    title: "Review",
    empty: "Nothing to review today — check back tomorrow!",
    showAnswer: "Show answer",
    knewIt: "Knew it!",
    didntKnowIt: "Didn't know it",
  },
  profile: {
    title: "Profile",
    xp: "XP",
    streak: "day streak",
    badges: "Badges",
    noBadgesYet: "No badges yet — get started!",
  },
};

export const UI_STRINGS_BY_LANGUAGE = {
  nl: NL_STRINGS,
  en: EN_STRINGS,
};
