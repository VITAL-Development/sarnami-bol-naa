// UI/translation language codes supported by the app. English support is
// being added alongside the existing Dutch content (see issue #27). Defined
// as a const array (rather than a bare string-literal union) so a future
// third language is one addition here, not a hunt through every place the
// union was spelled out — same pattern as `LearningLanguageCode` below.
export const UI_LANGUAGE_CODES = ["nl", "en"] as const;
export type UiLanguageCode = (typeof UI_LANGUAGE_CODES)[number];

// Not every entry has an English translation yet (translations are added
// incrementally as content is authored/reviewed), so this is a partial map
// rather than requiring all `UiLanguageCode`s up front. `nl` is expected to
// always be present in practice since it's the source language for existing
// content, but that isn't enforced by the type itself.
export type Translations = Partial<Record<UiLanguageCode, string>>;

// The language whose vocabulary/grammar is being taught. Distinct from
// `UiLanguageCode`, which is the language the interface/translations are
// shown in (see issue #28). Defined as a const array (rather than a bare
// string-literal union) so a future third language is one addition here,
// not a hunt through every place the union was spelled out.
export const LEARNING_LANGUAGE_CODES = ["sarnami", "sranantongo"] as const;
export type LearningLanguageCode = (typeof LEARNING_LANGUAGE_CODES)[number];

export interface VocabItem {
  id: string;
  sarnami: string;
  translations: Translations;
  audioUrl?: string;
  tags?: string[];
  notes?: string;
}

export interface ExampleSentence {
  id: string;
  sarnami: string;
  translations: Translations;
  vocabRefs: string[];
}

interface ExerciseBase {
  id: string;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  kind: "multiple-choice";
  prompt: string;
  promptVocabRef?: string;
  options: string[];
  correctIndex: number;
}

export interface WordBankExercise extends ExerciseBase {
  kind: "word-bank";
  promptTranslations: Translations;
  correctSarnamiTokens: string[];
  distractorTokens?: string[];
}

export interface FillBlankExercise extends ExerciseBase {
  kind: "fill-blank";
  sentenceTemplate: string;
  correctAnswer: string;
  options: string[];
  translations: Translations;
}

export interface MatchingExercise extends ExerciseBase {
  kind: "matching";
  pairs: { left: string; right: string }[];
}

export interface FlashcardExercise extends ExerciseBase {
  kind: "flashcard";
  vocabRef: string;
  direction: "sarnami-to-dutch" | "dutch-to-sarnami";
}

export type LessonExercise =
  | MultipleChoiceExercise
  | WordBankExercise
  | FillBlankExercise
  | MatchingExercise
  | FlashcardExercise;

export interface GrammarNote {
  id: string;
  title: string;
  body: string;
  relatedVocab?: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  description: string;
  newVocab: string[];
  exampleSentences?: ExampleSentence[];
  grammarNotes?: GrammarNote[];
  exercises: LessonExercise[];
  xpReward: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  bookChapterRef?: string;
  lessons: Lesson[];
}

export interface ContentBundle {
  units: Unit[];
  vocab: VocabItem[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LeitnerCard {
  box: number;
  lastReviewedAt: string;
}

export interface UserProgress {
  xp: number;
  streak: {
    count: number;
    lastCompletedDate: string | null;
  };
  hearts: {
    current: number;
    max: number;
  };
  completedLessons: Record<string, { stars: number; completedAt: string }>;
  leitnerBoxes: Record<string, LeitnerCard>;
  earnedBadges: string[];
}

export interface LessonResult {
  lessonId: string;
  mistakeCount: number;
  passed: boolean;
  vocabIntroduced: string[];
}
