import type { LessonResult, UserProgress } from "@/domain/types";
import type { ProgressRepository } from "./ProgressRepository";

/**
 * Future backend-backed implementation. Not wired up for the MVP (see
 * services/index.ts) — kept here so the swap from localStorage to a real
 * API is a matter of implementing these fetches, not redesigning callers.
 */
export class HttpProgressRepository implements ProgressRepository {
  constructor(private readonly baseUrl: string) {}

  async getProgress(): Promise<UserProgress> {
    const res = await fetch(`${this.baseUrl}/progress`);
    return res.json();
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    await fetch(`${this.baseUrl}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progress),
    });
  }

  async recordLessonCompletion(result: LessonResult): Promise<UserProgress> {
    const res = await fetch(`${this.baseUrl}/progress/lesson-completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    return res.json();
  }

  async recordReviewResult(vocabId: string, correct: boolean): Promise<UserProgress> {
    const res = await fetch(`${this.baseUrl}/progress/review-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vocabId, correct }),
    });
    return res.json();
  }
}
