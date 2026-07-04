// Plain-JS port of the frontend's pure gamification/Leitner/badge functions
// (`../src/domain/gamification.ts`, `../src/domain/leitner.ts`,
// `../src/data/badges.ts`), used by the progress routes in `server.mjs`.
//
// Previously these were re-exported as-is via an esbuild-bundled
// `content-entry.ts` (see `build-content.mjs`, removed in issue #33) so this
// dependency-free-at-runtime server didn't need a TypeScript toolchain. Now
// that `/server` owns its content data directly (issue #33), the same
// reasoning that justified duplicating vocab/lesson content into
// `server/content/*.json` (issues #30/#31, "kept in sync by hand") applies
// here too: this is a deliberate, small, faithful copy of pure functions with
// no external dependencies, not a re-implementation. Keep in sync by hand
// with the three frontend files above if their logic changes.
export const DEFAULT_MAX_HEARTS = 5;

export function createInitialProgress() {
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
export function todayDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

export function updateStreak(prev, today = todayDateString()) {
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

export function computeXpReward(baseXp, mistakeCount) {
  return mistakeCount === 0 ? Math.round(baseXp * 1.5) : baseXp;
}

export const LEITNER_MAX_BOX = 5;

/** Days to wait before a card in this box is due again. */
export const LEITNER_INTERVALS_DAYS = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

export function createLeitnerCard(today = todayDateString()) {
  return { box: 1, lastReviewedAt: today };
}

export function reviewLeitnerCard(card, correct, today = todayDateString()) {
  const nextBox = correct ? Math.min(card.box + 1, LEITNER_MAX_BOX) : 1;
  return { box: nextBox, lastReviewedAt: today };
}

function daysSince(dateString, today) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(today) - Date.parse(dateString)) / msPerDay);
}

export function isCardDue(card, today = todayDateString()) {
  const interval = LEITNER_INTERVALS_DAYS[card.box] ?? 1;
  return daysSince(card.lastReviewedAt, today) >= interval;
}

export function getDueVocabIds(leitnerBoxes, today = todayDateString()) {
  return Object.entries(leitnerBoxes)
    .filter(([, card]) => isCardDue(card, today))
    .map(([vocabId]) => vocabId);
}

const badgeDefinitions = [
  {
    id: "first-lesson",
    title: "Eerste stap",
    description: "Je hebt je eerste les voltooid.",
    icon: "seedling",
    predicate: (p) => Object.keys(p.completedLessons).length >= 1,
  },
  {
    id: "unit-1-complete",
    title: "Basis gelegd",
    description: "Je hebt alle lessen van Eenheid 1 voltooid.",
    icon: "trophy",
    predicate: (p) => Object.keys(p.completedLessons).length >= 5,
  },
  {
    id: "streak-3",
    title: "Volhouder",
    description: "3 dagen op rij geoefend.",
    icon: "fire",
    predicate: (p) => p.streak.count >= 3,
  },
  {
    id: "perfect-lesson",
    title: "Foutloos",
    description: "Een les voltooid zonder fouten.",
    icon: "medal",
    predicate: (p) => Object.values(p.completedLessons).some((l) => l.stars === 3),
  },
];

export function evaluateBadges(progress) {
  return badgeDefinitions.filter((b) => b.predicate(progress)).map((b) => b.id);
}

export function getAllBadgeDefinitions() {
  return badgeDefinitions.map(({ id, title, description, icon }) => ({ id, title, description, icon }));
}
