import type { LeitnerCard } from "./types";
import { todayDateString } from "./gamification";

export const LEITNER_MAX_BOX = 5;

/** Days to wait before a card in this box is due again. */
export const LEITNER_INTERVALS_DAYS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

export function createLeitnerCard(today: string = todayDateString()): LeitnerCard {
  return { box: 1, lastReviewedAt: today };
}

export function reviewLeitnerCard(
  card: LeitnerCard,
  correct: boolean,
  today: string = todayDateString(),
): LeitnerCard {
  const nextBox = correct ? Math.min(card.box + 1, LEITNER_MAX_BOX) : 1;
  return { box: nextBox, lastReviewedAt: today };
}

function daysSince(dateString: string, today: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(today) - Date.parse(dateString)) / msPerDay);
}

export function isCardDue(card: LeitnerCard, today: string = todayDateString()): boolean {
  const interval = LEITNER_INTERVALS_DAYS[card.box] ?? 1;
  return daysSince(card.lastReviewedAt, today) >= interval;
}

export function getDueVocabIds(
  leitnerBoxes: Record<string, LeitnerCard>,
  today: string = todayDateString(),
): string[] {
  return Object.entries(leitnerBoxes)
    .filter(([, card]) => isCardDue(card, today))
    .map(([vocabId]) => vocabId);
}
