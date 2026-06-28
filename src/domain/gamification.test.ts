import { describe, it, expect } from "vitest";
import {
  computeXpReward,
  createInitialProgress,
  todayDateString,
  updateStreak,
} from "./gamification";

describe("todayDateString", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(todayDateString(new Date("2024-03-15T10:00:00"))).toBe("2024-03-15");
  });

  it("zero-pads single-digit month and day", () => {
    expect(todayDateString(new Date("2024-01-05T00:00:00"))).toBe("2024-01-05");
  });
});

describe("computeXpReward", () => {
  it("gives 1.5x XP for a perfect lesson (0 mistakes)", () => {
    expect(computeXpReward(10, 0)).toBe(15);
    expect(computeXpReward(12, 0)).toBe(18);
    expect(computeXpReward(15, 0)).toBe(23); // Math.round(15 * 1.5)
  });

  it("gives base XP for any mistakes", () => {
    expect(computeXpReward(10, 1)).toBe(10);
    expect(computeXpReward(10, 5)).toBe(10);
  });
});

describe("updateStreak", () => {
  const base = createInitialProgress().streak;

  it("starts a streak on first-ever completion", () => {
    const result = updateStreak(base, "2024-03-15");
    expect(result).toEqual({ count: 1, lastCompletedDate: "2024-03-15" });
  });

  it("does not change streak if already completed today", () => {
    const prev = { count: 3, lastCompletedDate: "2024-03-15" };
    expect(updateStreak(prev, "2024-03-15")).toBe(prev);
  });

  it("increments streak for consecutive days", () => {
    const prev = { count: 3, lastCompletedDate: "2024-03-15" };
    const result = updateStreak(prev, "2024-03-16");
    expect(result).toEqual({ count: 4, lastCompletedDate: "2024-03-16" });
  });

  it("resets streak after a gap of more than 1 day", () => {
    const prev = { count: 5, lastCompletedDate: "2024-03-10" };
    const result = updateStreak(prev, "2024-03-15");
    expect(result).toEqual({ count: 1, lastCompletedDate: "2024-03-15" });
  });

  it("resets streak after exactly 2-day gap", () => {
    const prev = { count: 2, lastCompletedDate: "2024-03-13" };
    const result = updateStreak(prev, "2024-03-15");
    expect(result).toEqual({ count: 1, lastCompletedDate: "2024-03-15" });
  });
});

describe("createInitialProgress", () => {
  it("returns zeroed-out progress for a new user", () => {
    const p = createInitialProgress();
    expect(p.xp).toBe(0);
    expect(p.streak.count).toBe(0);
    expect(p.streak.lastCompletedDate).toBeNull();
    expect(p.completedLessons).toEqual({});
    expect(p.earnedBadges).toEqual([]);
    expect(p.leitnerBoxes).toEqual({});
  });
});
