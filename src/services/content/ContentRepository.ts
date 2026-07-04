import type {
  ContentBundle,
  LanguageSettings,
  LearningLanguageCode,
  Lesson,
  Unit,
  VocabItem,
} from "@/domain/types";

// `learningLanguage` is a per-call parameter, not baked into the repository
// at construction time — it can change at runtime once a language picker
// lands (issues #35/#36), so callers pass whatever `useLanguageSettings()`
// currently reports rather than the repository owning that state.
export interface ContentRepository {
  getContentBundle(learningLanguage: LearningLanguageCode): Promise<ContentBundle>;
  getLanguageSettings(learningLanguage: LearningLanguageCode): Promise<LanguageSettings>;
  getUnit(learningLanguage: LearningLanguageCode, unitId: string): Promise<Unit | undefined>;
  getLesson(learningLanguage: LearningLanguageCode, lessonId: string): Promise<Lesson | undefined>;
  getVocabItem(
    learningLanguage: LearningLanguageCode,
    vocabId: string,
  ): Promise<VocabItem | undefined>;
}
