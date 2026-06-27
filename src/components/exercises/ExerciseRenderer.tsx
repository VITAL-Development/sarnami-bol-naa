import type { LessonExercise, VocabItem } from "@/domain/types";
import { MultipleChoice } from "./MultipleChoice";
import { WordBank } from "./WordBank";
import { FillBlank } from "./FillBlank";
import { Matching } from "./Matching";
import { Flashcard } from "./Flashcard";

interface ExerciseRendererProps {
  exercise: LessonExercise;
  vocabById: Map<string, VocabItem>;
  onAnswer: (isCorrect: boolean) => void;
}

export function ExerciseRenderer({ exercise, vocabById, onAnswer }: ExerciseRendererProps) {
  switch (exercise.kind) {
    case "multiple-choice":
      return <MultipleChoice exercise={exercise} vocabById={vocabById} onAnswer={onAnswer} />;
    case "word-bank":
      return <WordBank exercise={exercise} vocabById={vocabById} onAnswer={onAnswer} />;
    case "fill-blank":
      return <FillBlank exercise={exercise} vocabById={vocabById} onAnswer={onAnswer} />;
    case "matching":
      return <Matching exercise={exercise} vocabById={vocabById} onAnswer={onAnswer} />;
    case "flashcard":
      return <Flashcard exercise={exercise} vocabById={vocabById} onAnswer={onAnswer} />;
  }
}
