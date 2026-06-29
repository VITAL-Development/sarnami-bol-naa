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
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    const res = await fetch(`${this.baseUrl}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progress),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  }

  async recordLessonCompletion(result: LessonResult): Promise<UserProgress> {
    const res = await fetch(`${this.baseUrl}/progress/lesson-completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async recordReviewResult(vocabId: string, correct: boolean): Promise<UserProgress> {
    const res = await fetch(`${this.baseUrl}/progress/review-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vocabId, correct }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }
}
