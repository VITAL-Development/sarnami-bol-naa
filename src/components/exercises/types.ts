import type { ExerciseContent, VocabItem } from "@/domain/types";

export interface ExerciseComponentProps<TExercise> {
  exercise: TExercise;
  vocabById: Map<string, VocabItem>;
  // Resolves `exercise.contentRef` to its literal prompt/options/answer text
  // (see issue #31). Flashcard doesn't use it — it has no contentRef.
  contentById: Map<string, ExerciseContent>;
  onAnswer: (isCorrect: boolean) => void;
}
