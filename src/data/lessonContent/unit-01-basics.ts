import type { LessonContentFile } from "./types";

// TODO(remove once /server's /content endpoint reads from server/content/
// directly instead of bundling ../src/data, and the frontend fetches lesson
// content from the backend instead of its local bundle — issue #33/#34):
// the source of truth for this data is
// server/content/sarnami/lessons/unit-01-basics.json (issue #31). This file
// is a synced copy kept for the local-bundling path (`LocalJsonContentRepository`
// / `content-entry.ts`), mirroring how #30 handled the analogous vocab
// situation (see `src/data/vocab/greetings.ts`'s TODO comment). Keep it in
// sync with the JSON by hand until #33 removes the need for a TS copy.
export const unit01BasicsContent: LessonContentFile[] = [
  {
    lessonId: "lesson-1-greetings",
    exampleSentences: [
      {
        id: "ex-1-1",
        sarnami: "Rām Rām, kaise hai?",
        translations: { nl: "Hallo, hoe gaat het?" },
        vocabRefs: ["greet-ram-ram", "greet-kaise-hai"],
      },
      {
        id: "ex-1-2",
        sarnami: "Moi jā hai, dhanbād.",
        translations: { nl: "Het gaat goed, bedankt." },
        vocabRefs: ["greet-moi-jahe", "greet-dhanyavad"],
      },
    ],
    grammarNotes: [],
    exercises: {
      "l1-e1": {
        prompt: "Wat betekent 'Rām Rām'?",
        options: ["hallo / gegroet", "dank u", "hoe gaat het?", "tot ziens"],
        correctIndex: 0,
      },
      "l1-e4": {
        promptTranslations: { nl: "Hoe gaat het?" },
        correctSarnamiTokens: ["Kaise", "hai?"],
        distractorTokens: ["Dhanbād", "Rām"],
      },
      "l1-e5": {
        sentenceTemplate: "Moi ___ hai.",
        correctAnswer: "jā",
        options: ["jā", "kaise", "Rām", "dhanbād"],
        translations: { nl: "Het gaat goed." },
      },
    },
  },
  {
    lessonId: "lesson-2-pronouns",
    exampleSentences: [
      {
        id: "ex-2-1",
        sarnami: "Ham Sarnāmi bol-nā sikhe hai.",
        translations: { nl: "Ik leer Sarnami spreken." },
        vocabRefs: ["pron-ham"],
      },
      {
        id: "ex-2-2",
        sarnami: "Tū kaise hai?",
        translations: { nl: "Hoe gaat het met jou?" },
        vocabRefs: ["pron-tu"],
      },
    ],
    grammarNotes: [],
    exercises: {
      "l2-e1": {
        prompt: "Welk woord betekent 'ik'?",
        options: ["ham", "tū", "āp", "ū"],
        correctIndex: 0,
      },
      "l2-e2": {
        pairs: [
          { left: "ham", right: "ik" },
          { left: "tū", right: "jij (informeel)" },
          { left: "āp", right: "u (beleefd)" },
          { left: "ū", right: "hij / zij" },
          { left: "ham log", right: "wij" },
        ],
      },
      "l2-e4": {
        promptTranslations: { nl: "Hoe gaat het met jou?" },
        correctSarnamiTokens: ["Tū", "kaise", "hai?"],
        distractorTokens: ["ham", "āp"],
      },
      "l2-e5": {
        sentenceTemplate: "___ Sarnāmi bol-nā sikhe hai.",
        correctAnswer: "Ham",
        options: ["Ham", "Tū", "Āp", "Ū"],
        translations: { nl: "Ik leer Sarnami spreken." },
      },
    },
  },
  {
    lessonId: "lesson-3-nouns",
    exampleSentences: [
      {
        id: "ex-3-1",
        sarnami: "Ī hamar ghar hai.",
        translations: { nl: "Dit is mijn huis." },
        vocabRefs: ["noun-ghar"],
      },
      {
        id: "ex-3-2",
        sarnami: "Bappā kām kare hai.",
        translations: { nl: "Vader werkt." },
        vocabRefs: ["noun-bappa"],
      },
      {
        id: "ex-3-3",
        sarnami: "Maiyā bajār se saudā kin lāve hai.",
        translations: { nl: "Moeder haalt boodschappen van de markt." },
        vocabRefs: ["noun-maiya"],
      },
    ],
    grammarNotes: [],
    exercises: {
      "l3-e1": {
        prompt: "Wat betekent 'ghar'?",
        options: ["huis", "klok", "broer", "zus"],
        correctIndex: 0,
      },
      "l3-e2": {
        pairs: [
          { left: "ghar", right: "huis" },
          { left: "ghaṛī", right: "klok" },
          { left: "bhāi", right: "broer" },
          { left: "bahin", right: "zus" },
          { left: "mai-bāp", right: "ouders" },
        ],
      },
      "l3-e3": {
        promptTranslations: { nl: "Dit is mijn huis." },
        correctSarnamiTokens: ["Ī", "hamar", "ghar", "hai."],
        distractorTokens: ["tor", "bahin"],
      },
    },
  },
  {
    lessonId: "lesson-4-hai-sentences",
    exampleSentences: [
      {
        id: "ex-4-1",
        sarnami: "Ham hai. Tū hai. Ī/ū hai.",
        translations: { nl: "Ik ben. Jij bent. Hij/zij is." },
        vocabRefs: ["gram-hai", "pron-ham", "pron-tu", "pron-u"],
      },
      {
        id: "ex-4-2",
        sarnami: "Ham log haim. Tū log hai. Āp ho.",
        translations: { nl: "Wij zijn. Jullie zijn. U bent." },
        vocabRefs: ["gram-hai", "pron-hamlog", "pron-ap"],
      },
      {
        id: "ex-4-3",
        sarnami: "Ū kahām hai?",
        translations: { nl: "Waar is hij/zij?" },
        vocabRefs: ["gram-kaham", "pron-u"],
      },
      {
        id: "ex-4-4",
        sarnami: "Hamār bāp nā hai ghare.",
        translations: { nl: "Mijn vader is niet thuis." },
        vocabRefs: ["gram-na", "noun-bappa"],
      },
    ],
    grammarNotes: [
      {
        id: "gn-4-1",
        title: "Vervoeging van 'hai' (zijn) in de o.t.t.",
        body:
          "ham hai (ik ben) — tū hai (jij bent) — ī/ū hai (hij/zij is) — ham log haim (wij zijn) — tū log hai (jullie zijn) — āp ho (u bent) — ī/ū sab haim (zij zijn).",
        relatedVocab: ["gram-hai"],
      },
    ],
    exercises: {
      "l4-e1": {
        prompt: "Hoe zeg je 'wij zijn'?",
        options: ["ham log haim", "tū log hai", "āp ho", "ī sab haim"],
        correctIndex: 0,
      },
      "l4-e2": {
        sentenceTemplate: "Ham log ___ .",
        correctAnswer: "haim",
        options: ["haim", "hai", "ho", "nā"],
        translations: { nl: "Wij zijn." },
      },
      "l4-e3": {
        promptTranslations: { nl: "Waar is hij/zij?" },
        correctSarnamiTokens: ["Ū", "kahām", "hai?"],
        distractorTokens: ["nā", "ham"],
      },
      "l4-e4": {
        pairs: [
          { left: "hai", right: "is / ben / bent" },
          { left: "nā", right: "niet" },
          { left: "kahām", right: "waar" },
        ],
      },
    },
  },
  {
    lessonId: "lesson-5-review",
    exampleSentences: [],
    grammarNotes: [],
    exercises: {
      "l5-e1": {
        prompt: "Wat betekent 'Rām Rām'?",
        options: ["hallo / gegroet", "waar", "niet", "klok"],
        correctIndex: 0,
      },
      "l5-e2": {
        pairs: [
          { left: "ham", right: "ik" },
          { left: "ghar", right: "huis" },
          { left: "bhāi", right: "broer" },
          { left: "hai", right: "is / ben / bent" },
          { left: "kahām", right: "waar" },
        ],
      },
      "l5-e3": {
        promptTranslations: { nl: "Dit is mijn huis." },
        correctSarnamiTokens: ["Ī", "hamar", "ghar", "hai."],
        distractorTokens: ["kahām", "nā"],
      },
      "l5-e4": {
        sentenceTemplate: "Hamār bāp ___ hai ghare.",
        correctAnswer: "nā",
        options: ["nā", "kahām", "hai", "ham"],
        translations: { nl: "Mijn vader is niet thuis." },
      },
    },
  },
];
