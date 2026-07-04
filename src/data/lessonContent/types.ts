import type { ExampleSentence, ExerciseContent, GrammarNote } from "@/domain/types";

// On-disk shape of `server/content/sarnami/lessons/*.json`, grouped by
// lesson for readability/traceability even though the runtime
// `LessonContentBundle` (see `@/domain/types`) flattens everything into
// arrays/maps keyed by id. `exercises` is keyed by `contentRef`.
export interface LessonContentFile {
  lessonId: string;
  exampleSentences: ExampleSentence[];
  grammarNotes: GrammarNote[];
  exercises: Record<string, ExerciseContent>;
}
