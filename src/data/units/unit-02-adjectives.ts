import type { Unit } from "@/domain/types";

// Structure only — see `unit-01-basics.ts`'s header comment: literal text
// lives in `server/content/sarnami/lessons/unit-02-adjectives.json`,
// resolved via `contentRef` / `exampleSentenceRefs` / `grammarNoteRefs`
// against `ContentBundle.lessonContent` (issue #31). This file is the
// frontend's own local/offline fallback copy of
// `server/content/sarnami/units/unit-02-adjectives.json` (issue #33), not a
// duplicate kept for backend-bundling purposes.
export const unit02Adjectives: Unit = {
  id: "unit-02-adjectives",
  title: "Bijvoeglijke naamwoorden",
  description: "Vorm, geslacht, getal en vergelijking van het bijvoeglijk naamwoord.",
  order: 2,
  bookChapterRef: "Sarnami Byākaran (Marhé, 1985), p.55-61",
  lessons: [
    {
      id: "lesson-6-adjective-forms",
      unitId: "unit-02-adjectives",
      order: 1,
      title: "Stam, lang en langer",
      description: "De drie vormen van het bijvoeglijk naamwoord.",
      newVocab: ["adj-chota", "adj-lal", "adj-sojha", "adj-patar", "adj-mitha"],
      exampleSentenceRefs: ["ex-6-1", "ex-6-2", "ex-6-3"],
      grammarNoteRefs: ["gn-6-1"],
      exercises: [
        {
          id: "l6-e1",
          kind: "multiple-choice",
          contentRef: "l6-e1",
          promptVocabRef: "adj-chota",
        },
        {
          id: "l6-e2",
          kind: "matching",
          contentRef: "l6-e2",
        },
        {
          id: "l6-e3",
          kind: "fill-blank",
          contentRef: "l6-e3",
        },
        {
          id: "l6-e4",
          kind: "flashcard",
          vocabRef: "adj-lal",
          direction: "target-to-native",
        },
        {
          id: "l6-e5",
          kind: "word-bank",
          contentRef: "l6-e5",
        },
      ],
      xpReward: 10,
    },
    {
      id: "lesson-7-adjective-agreement",
      unitId: "unit-02-adjectives",
      order: 2,
      title: "Geslacht en getal",
      description: "Hoe het bijvoeglijk naamwoord meegaat met het zelfstandig naamwoord.",
      newVocab: ["adj-barka", "adj-lamma", "adj-barhimya", "adj-karikka"],
      exampleSentenceRefs: ["ex-7-1", "ex-7-2", "ex-7-3"],
      grammarNoteRefs: ["gn-7-1"],
      exercises: [
        {
          id: "l7-e1",
          kind: "multiple-choice",
          contentRef: "l7-e1",
          promptVocabRef: "adj-barka",
        },
        {
          id: "l7-e2",
          kind: "matching",
          contentRef: "l7-e2",
        },
        {
          id: "l7-e3",
          kind: "word-bank",
          contentRef: "l7-e3",
        },
        {
          id: "l7-e4",
          kind: "fill-blank",
          contentRef: "l7-e4",
        },
        {
          id: "l7-e5",
          kind: "flashcard",
          vocabRef: "adj-barhimya",
          direction: "native-to-target",
        },
      ],
      xpReward: 10,
    },
    {
      id: "lesson-8-comparison",
      unitId: "unit-02-adjectives",
      order: 3,
      title: "Trappen van vergelijking",
      description: "Vergrotende en overtreffende trap in het Sarnami.",
      newVocab: ["gram-se", "gram-aur-compare", "gram-jada", "gram-sabse"],
      exampleSentenceRefs: ["ex-8-1", "ex-8-2", "ex-8-3"],
      grammarNoteRefs: ["gn-8-1"],
      exercises: [
        {
          id: "l8-e1",
          kind: "multiple-choice",
          contentRef: "l8-e1",
        },
        {
          id: "l8-e2",
          kind: "fill-blank",
          contentRef: "l8-e2",
        },
        {
          id: "l8-e3",
          kind: "word-bank",
          contentRef: "l8-e3",
        },
        {
          id: "l8-e4",
          kind: "matching",
          contentRef: "l8-e4",
        },
        {
          id: "l8-e5",
          kind: "flashcard",
          vocabRef: "gram-sabse",
          direction: "target-to-native",
        },
      ],
      xpReward: 12,
    },
    {
      id: "lesson-9-adjectives-review",
      unitId: "unit-02-adjectives",
      order: 4,
      title: "Herhaling",
      description: "Alles uit Eenheid 2 nog eens herhalen.",
      newVocab: [],
      exercises: [
        {
          id: "l9-e1",
          kind: "multiple-choice",
          contentRef: "l9-e1",
        },
        {
          id: "l9-e2",
          kind: "matching",
          contentRef: "l9-e2",
        },
        {
          id: "l9-e3",
          kind: "word-bank",
          contentRef: "l9-e3",
        },
        {
          id: "l9-e4",
          kind: "fill-blank",
          contentRef: "l9-e4",
        },
        {
          id: "l9-e5",
          kind: "flashcard",
          vocabRef: "adj-mitha",
          direction: "target-to-native",
        },
        {
          id: "l9-e6",
          kind: "flashcard",
          vocabRef: "gram-se",
          direction: "native-to-target",
        },
      ],
      xpReward: 15,
    },
  ],
};
