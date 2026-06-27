export interface VocabItem {
  id: string;
  sarnami: string;
  dutch: string;
  audioUrl?: string;
  tags?: string[];
  notes?: string;
}

export interface ExampleSentence {
  id: string;
  sarnami: string;
  dutch: string;
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
  promptDutch: string;
  correctSarnamiTokens: string[];
  distractorTokens?: string[];
}

export interface FillBlankExercise extends ExerciseBase {
  kind: "fill-blank";
  sentenceTemplate: string;
  correctAnswer: string;
  options: string[];
  dutchTranslation: string;
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
