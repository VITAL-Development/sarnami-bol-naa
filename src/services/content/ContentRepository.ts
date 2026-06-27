import type { ContentBundle, Lesson, Unit, VocabItem } from "@/domain/types";

export interface ContentRepository {
  getContentBundle(): Promise<ContentBundle>;
  getUnit(unitId: string): Promise<Unit | undefined>;
  getLesson(lessonId: string): Promise<Lesson | undefined>;
  getVocabItem(vocabId: string): Promise<VocabItem | undefined>;
}
