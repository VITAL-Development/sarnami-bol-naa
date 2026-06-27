import type { LessonResult, UserProgress } from "@/domain/types";

export interface ProgressRepository {
  getProgress(): Promise<UserProgress>;
  saveProgress(progress: UserProgress): Promise<void>;
  recordLessonCompletion(result: LessonResult): Promise<UserProgress>;
  recordReviewResult(vocabId: string, correct: boolean): Promise<UserProgress>;
}
