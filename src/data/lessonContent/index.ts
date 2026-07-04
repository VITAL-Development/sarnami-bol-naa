import type { ExampleSentence, ExerciseContent, GrammarNote, LessonContentBundle } from "@/domain/types";
import type { LessonContentFile } from "./types";
import { unit01BasicsContent } from "./unit-01-basics";
import { unit02AdjectivesContent } from "./unit-02-adjectives";

function flatten(files: LessonContentFile[][]): LessonContentBundle {
  const exampleSentences: ExampleSentence[] = [];
  const grammarNotes: GrammarNote[] = [];
  const exerciseContent: Record<string, ExerciseContent> = {};

  for (const file of files.flat()) {
    exampleSentences.push(...file.exampleSentences);
    grammarNotes.push(...file.grammarNotes);
    Object.assign(exerciseContent, file.exercises);
  }

  return { exampleSentences, grammarNotes, exerciseContent };
}

export const lessonContentBundle: LessonContentBundle = flatten([
  unit01BasicsContent,
  unit02AdjectivesContent,
]);
