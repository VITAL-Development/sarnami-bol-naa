import { describe, it, expect } from "vitest";
import { evaluateBadges } from "./badges";
import { createInitialProgress } from "@/domain/gamification";
import type { UserProgress } from "@/domain/types";

function makeProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return { ...createInitialProgress(), ...overrides };
}

describe("evaluateBadges — milestone predicates", () => {
  it("no badges for a new user", () => {
    expect(evaluateBadges(makeProgress())).toEqual([]);
  });

  it('awards "first-lesson" after completing 1 lesson', () => {
    const p = makeProgress({
      completedLessons: { "lesson-1": { stars: 2, completedAt: "2024-03-15" } },
    });
    expect(evaluateBadges(p)).toContain("first-lesson");
  });

  it('does not award "unit-1-complete" with fewer than 5 lessons', () => {
    const p = makeProgress({
      completedLessons: Object.fromEntries(
        Array.from({ length: 4 }, (_, i) => [`lesson-${i + 1}`, { stars: 1, completedAt: "2024-03-15" }]),
      ),
    });
    expect(evaluateBadges(p)).not.toContain("unit-1-complete");
  });

  it('awards "unit-1-complete" after completing 5 lessons', () => {
    const p = makeProgress({
      completedLessons: Object.fromEntries(
        Array.from({ length: 5 }, (_, i) => [`lesson-${i + 1}`, { stars: 1, completedAt: "2024-03-15" }]),
      ),
    });
    expect(evaluateBadges(p)).toContain("unit-1-complete");
  });

  it('does not award "streak-3" for a 2-day streak', () => {
    const p = makeProgress({ streak: { count: 2, lastCompletedDate: "2024-03-15" } });
    expect(evaluateBadges(p)).not.toContain("streak-3");
  });

  it('awards "streak-3" for a 3-day streak', () => {
    const p = makeProgress({ streak: { count: 3, lastCompletedDate: "2024-03-15" } });
    expect(evaluateBadges(p)).toContain("streak-3");
  });

  it('awards "streak-3" for streaks longer than 3 days', () => {
    const p = makeProgress({ streak: { count: 10, lastCompletedDate: "2024-03-15" } });
    expect(evaluateBadges(p)).toContain("streak-3");
  });

  it('does not award "perfect-lesson" with only 1-2 star completions', () => {
    const p = makeProgress({
      completedLessons: {
        "lesson-1": { stars: 2, completedAt: "2024-03-15" },
        "lesson-2": { stars: 1, completedAt: "2024-03-16" },
      },
    });
    expect(evaluateBadges(p)).not.toContain("perfect-lesson");
  });

  it('awards "perfect-lesson" when any lesson has 3 stars', () => {
    const p = makeProgress({
      completedLessons: {
        "lesson-1": { stars: 1, completedAt: "2024-03-15" },
        "lesson-2": { stars: 3, completedAt: "2024-03-16" },
      },
    });
    expect(evaluateBadges(p)).toContain("perfect-lesson");
  });

  it("can earn all 4 badges simultaneously", () => {
    const p = makeProgress({
      streak: { count: 3, lastCompletedDate: "2024-03-15" },
      completedLessons: Object.fromEntries(
        Array.from({ length: 5 }, (_, i) => [`lesson-${i + 1}`, { stars: i === 0 ? 3 : 2, completedAt: "2024-03-15" }]),
      ),
    });
    const badges = evaluateBadges(p);
    expect(badges).toContain("first-lesson");
    expect(badges).toContain("unit-1-complete");
    expect(badges).toContain("streak-3");
    expect(badges).toContain("perfect-lesson");
    expect(badges).toHaveLength(4);
  });
});
