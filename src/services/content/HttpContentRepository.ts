import type { ContentBundle, Lesson, Unit, VocabItem } from "@/domain/types";
import type { ContentRepository } from "./ContentRepository";

/**
 * Future backend-backed implementation. Not wired up for the MVP (see
 * services/index.ts) — kept here so the swap from local content to a real
 * API is a matter of implementing these fetches, not redesigning callers.
 */
export class HttpContentRepository implements ContentRepository {
  constructor(private readonly baseUrl: string) {}

  async getContentBundle(): Promise<ContentBundle> {
    const res = await fetch(`${this.baseUrl}/content`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async getUnit(unitId: string): Promise<Unit | undefined> {
    const res = await fetch(`${this.baseUrl}/units/${unitId}`);
    if (!res.ok) return undefined;
    return res.json();
  }

  async getLesson(lessonId: string): Promise<Lesson | undefined> {
    const res = await fetch(`${this.baseUrl}/lessons/${lessonId}`);
    if (!res.ok) return undefined;
    return res.json();
  }

  async getVocabItem(vocabId: string): Promise<VocabItem | undefined> {
    const res = await fetch(`${this.baseUrl}/vocab/${vocabId}`);
    if (!res.ok) return undefined;
    return res.json();
  }
}
