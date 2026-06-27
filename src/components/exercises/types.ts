import type { VocabItem } from "@/domain/types";

export interface ExerciseComponentProps<TExercise> {
  exercise: TExercise;
  vocabById: Map<string, VocabItem>;
  onAnswer: (isCorrect: boolean) => void;
}
