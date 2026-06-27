import type { UserProgress } from "./types";

export const DEFAULT_MAX_HEARTS = 5;

export function createInitialProgress(): UserProgress {
  return {
    xp: 0,
    streak: { count: 0, lastCompletedDate: null },
    hearts: { current: DEFAULT_MAX_HEARTS, max: DEFAULT_MAX_HEARTS },
    completedLessons: {},
    leitnerBoxes: {},
    earnedBadges: [],
  };
}

/** Local calendar date string (YYYY-MM-DD), not a timestamp, to avoid timezone/DST drift. */
export function todayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

export function updateStreak(
  prev: UserProgress["streak"],
  today: string = todayDateString(),
): UserProgress["streak"] {
  if (prev.lastCompletedDate === null) {
    return { count: 1, lastCompletedDate: today };
  }
  const diff = daysBetween(prev.lastCompletedDate, today);
  if (diff === 0) {
    return prev;
  }
  if (diff === 1) {
    return { count: prev.count + 1, lastCompletedDate: today };
  }
  return { count: 1, lastCompletedDate: today };
}

export function computeXpReward(baseXp: number, mistakeCount: number): number {
  return mistakeCount === 0 ? Math.round(baseXp * 1.5) : baseXp;
}
