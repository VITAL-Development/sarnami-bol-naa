import type { LessonResult, UserProgress } from "@/domain/types";
import type { ProgressRepository } from "./ProgressRepository";
import { computeXpReward, createInitialProgress, todayDateString, updateStreak } from "@/domain/gamification";
import { createLeitnerCard, reviewLeitnerCard } from "@/domain/leitner";
import { evaluateBadges } from "@/data/badges";

const STORAGE_KEY = "sarnami-progress-v1";

export class LocalStorageProgressRepository implements ProgressRepository {
  private cache: UserProgress | null = null;

  async getProgress(): Promise<UserProgress> {
    if (this.cache) return this.cache;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = createInitialProgress();
      this.cache = fresh;
      return fresh;
    }
    try {
      const parsed = JSON.parse(raw) as UserProgress;
      this.cache = migrateIfNeeded(parsed);
      return this.cache;
    } catch {
      const fresh = createInitialProgress();
      this.cache = fresh;
      return fresh;
    }
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    this.cache = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  async recordLessonCompletion(result: LessonResult): Promise<UserProgress> {
    const progress = await this.getProgress();
    const today = todayDateString();

    if (!result.passed) {
      return progress;
    }

    const xpEarned = computeXpReward(10, result.mistakeCount);
    const leitnerBoxes = { ...progress.leitnerBoxes };
    for (const vocabId of result.vocabIntroduced) {
      if (!leitnerBoxes[vocabId]) {
        leitnerBoxes[vocabId] = createLeitnerCard(today);
      }
    }

    const next: UserProgress = {
      ...progress,
      xp: progress.xp + xpEarned,
      streak: updateStreak(progress.streak, today),
      completedLessons: {
        ...progress.completedLessons,
        [result.lessonId]: {
          stars: result.mistakeCount === 0 ? 3 : result.mistakeCount <= 2 ? 2 : 1,
          completedAt: today,
        },
      },
      leitnerBoxes,
    };
    next.earnedBadges = evaluateBadges(next);
    await this.saveProgress(next);
    return next;
  }

  async recordReviewResult(vocabId: string, correct: boolean): Promise<UserProgress> {
    const progress = await this.getProgress();
    const today = todayDateString();
    const existing = progress.leitnerBoxes[vocabId] ?? createLeitnerCard(today);
    const next: UserProgress = {
      ...progress,
      leitnerBoxes: {
        ...progress.leitnerBoxes,
        [vocabId]: reviewLeitnerCard(existing, correct, today),
      },
    };
    next.earnedBadges = evaluateBadges(next);
    await this.saveProgress(next);
    return next;
  }
}

function migrateIfNeeded(progress: UserProgress): UserProgress {
  // Versioned key (sarnami-progress-v1) leaves room for future shape changes;
  // no migrations needed yet.
  return progress;
}
