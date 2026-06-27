import type { ContentBundle, Lesson, Unit, VocabItem } from "@/domain/types";
import type { ContentRepository } from "./ContentRepository";
import { contentBundle } from "@/data";

export class LocalJsonContentRepository implements ContentRepository {
  async getContentBundle(): Promise<ContentBundle> {
    return contentBundle;
  }

  async getUnit(unitId: string): Promise<Unit | undefined> {
    return contentBundle.units.find((unit) => unit.id === unitId);
  }

  async getLesson(lessonId: string): Promise<Lesson | undefined> {
    for (const unit of contentBundle.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  }

  async getVocabItem(vocabId: string): Promise<VocabItem | undefined> {
    return contentBundle.vocab.find((item) => item.id === vocabId);
  }
}
