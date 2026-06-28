import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageProgressRepository } from "./LocalStorageProgressRepository";
import type { LessonResult } from "@/domain/types";

// Minimal localStorage stub — no DOM required for pure logic tests
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
vi.stubGlobal("localStorage", localStorageMock);

function makeResult(overrides: Partial<LessonResult> = {}): LessonResult {
  return {
    lessonId: "u01-l01",
    mistakeCount: 0,
    passed: true,
    vocabIntroduced: ["v-dagomba", "v-namaste"],
    ...overrides,
  };
}

describe("LocalStorageProgressRepository", () => {
  let repo: LocalStorageProgressRepository;

  beforeEach(() => {
    localStorageMock.clear();
    repo = new LocalStorageProgressRepository();
  });

  describe("getProgress", () => {
    it("returns initial progress for a brand-new user", async () => {
      const p = await repo.getProgress();
      expect(p.xp).toBe(0);
      expect(p.earnedBadges).toEqual([]);
      expect(p.completedLessons).toEqual({});
    });

    it("deserialises saved progress from localStorage", async () => {
      store["sarnami-progress-v1"] = JSON.stringify({
        xp: 42,
        streak: { count: 2, lastCompletedDate: "2024-03-14" },
        hearts: { current: 5, max: 5 },
        completedLessons: {},
        leitnerBoxes: {},
        earnedBadges: [],
      });
      const p = await repo.getProgress();
      expect(p.xp).toBe(42);
      expect(p.streak.count).toBe(2);
    });

    it("returns fresh progress if stored JSON is corrupt", async () => {
      store["sarnami-progress-v1"] = "{{not-json}}";
      const p = await repo.getProgress();
      expect(p.xp).toBe(0);
    });
  });

  describe("recordLessonCompletion — XP and star progression", () => {
    it("awards 1.5x XP for a perfect lesson", async () => {
      const p = await repo.recordLessonCompletion(makeResult({ mistakeCount: 0 }));
      expect(p.xp).toBe(15); // Math.round(10 * 1.5)
    });

    it("awards base XP (10) for a lesson with mistakes", async () => {
      const p = await repo.recordLessonCompletion(makeResult({ mistakeCount: 2 }));
      expect(p.xp).toBe(10);
    });

    it("awards 3 stars for a perfect lesson", async () => {
      const p = await repo.recordLessonCompletion(makeResult({ mistakeCount: 0 }));
      expect(p.completedLessons["u01-l01"].stars).toBe(3);
    });

    it("awards 2 stars for 1-2 mistakes", async () => {
      const p1 = await repo.recordLessonCompletion(makeResult({ mistakeCount: 1 }));
      expect(p1.completedLessons["u01-l01"].stars).toBe(2);

      repo = new LocalStorageProgressRepository();
      const p2 = await repo.recordLessonCompletion(makeResult({ mistakeCount: 2 }));
      expect(p2.completedLessons["u01-l01"].stars).toBe(2);
    });

    it("awards 1 star for 3+ mistakes", async () => {
      const p = await repo.recordLessonCompletion(makeResult({ mistakeCount: 3 }));
      expect(p.completedLessons["u01-l01"].stars).toBe(1);
    });

    it("does not update progress for a failed (not passed) lesson", async () => {
      const p = await repo.recordLessonCompletion(makeResult({ passed: false }));
      expect(p.xp).toBe(0);
      expect(p.completedLessons).toEqual({});
    });

    it("accumulates XP across multiple lessons", async () => {
      await repo.recordLessonCompletion(makeResult({ lessonId: "u01-l01", mistakeCount: 0 }));
      const p = await repo.recordLessonCompletion(
        makeResult({ lessonId: "u01-l02", mistakeCount: 1 }),
      );
      expect(p.xp).toBe(25); // 15 + 10
    });
  });

  describe("recordLessonCompletion — Leitner card initialisation", () => {
    it("creates box-1 Leitner cards for newly introduced vocab", async () => {
      const p = await repo.recordLessonCompletion(makeResult({ vocabIntroduced: ["v-a", "v-b"] }));
      expect(p.leitnerBoxes["v-a"].box).toBe(1);
      expect(p.leitnerBoxes["v-b"].box).toBe(1);
    });

    it("does not overwrite an existing Leitner card", async () => {
      // First lesson puts v-a at box 1
      await repo.recordLessonCompletion(makeResult({ lessonId: "u01-l01", vocabIntroduced: ["v-a"] }));
      // Manually advance v-a to box 3
      const progress = await repo.getProgress();
      await repo.saveProgress({
        ...progress,
        leitnerBoxes: { "v-a": { box: 3, lastReviewedAt: "2024-03-15" } },
      });
      repo = new LocalStorageProgressRepository(); // clear cache
      // Completing another lesson that also references v-a should not downgrade it
      const p = await repo.recordLessonCompletion(
        makeResult({ lessonId: "u01-l02", vocabIntroduced: ["v-a"] }),
      );
      expect(p.leitnerBoxes["v-a"].box).toBe(3);
    });
  });

  describe("recordLessonCompletion — milestone badges", () => {
    it('earns "first-lesson" badge on first completion', async () => {
      const p = await repo.recordLessonCompletion(makeResult());
      expect(p.earnedBadges).toContain("first-lesson");
    });

    it('earns "perfect-lesson" badge for a 3-star lesson', async () => {
      const p = await repo.recordLessonCompletion(makeResult({ mistakeCount: 0 }));
      expect(p.earnedBadges).toContain("perfect-lesson");
    });

    it('does not earn "perfect-lesson" for an imperfect lesson', async () => {
      const p = await repo.recordLessonCompletion(makeResult({ mistakeCount: 1 }));
      expect(p.earnedBadges).not.toContain("perfect-lesson");
    });

    it('earns "unit-1-complete" after 5 distinct lessons', async () => {
      for (let i = 1; i <= 5; i++) {
        await repo.recordLessonCompletion(
          makeResult({ lessonId: `u01-l0${i}`, mistakeCount: 1 }),
        );
      }
      const p = await repo.getProgress();
      expect(p.earnedBadges).toContain("unit-1-complete");
    });

    it('does not earn "unit-1-complete" before 5 lessons', async () => {
      for (let i = 1; i <= 4; i++) {
        await repo.recordLessonCompletion(
          makeResult({ lessonId: `u01-l0${i}`, mistakeCount: 1 }),
        );
      }
      const p = await repo.getProgress();
      expect(p.earnedBadges).not.toContain("unit-1-complete");
    });
  });

  describe("recordReviewResult — Leitner progression", () => {
    it("advances a card's box on a correct review", async () => {
      // Seed a box-1 card
      await repo.saveProgress({
        ...(await repo.getProgress()),
        leitnerBoxes: { "v-a": { box: 1, lastReviewedAt: "2024-03-10" } },
      });
      repo = new LocalStorageProgressRepository();

      const p = await repo.recordReviewResult("v-a", true);
      expect(p.leitnerBoxes["v-a"].box).toBe(2);
    });

    it("resets a card to box 1 on an incorrect review", async () => {
      await repo.saveProgress({
        ...(await repo.getProgress()),
        leitnerBoxes: { "v-a": { box: 4, lastReviewedAt: "2024-03-01" } },
      });
      repo = new LocalStorageProgressRepository();

      const p = await repo.recordReviewResult("v-a", false);
      expect(p.leitnerBoxes["v-a"].box).toBe(1);
    });

    it("creates a box-1 card if vocab was never reviewed before", async () => {
      const p = await repo.recordReviewResult("v-new", true);
      expect(p.leitnerBoxes["v-new"].box).toBe(2); // new card at 1 → correct → 2
    });
  });
});
