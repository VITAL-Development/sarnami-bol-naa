import { describe, it, expect } from "vitest";
import {
  createLeitnerCard,
  getDueVocabIds,
  isCardDue,
  LEITNER_INTERVALS_DAYS,
  LEITNER_MAX_BOX,
  reviewLeitnerCard,
} from "./leitner";

const TODAY = "2024-03-15";

describe("createLeitnerCard", () => {
  it("creates a card at box 1 with today's date", () => {
    expect(createLeitnerCard(TODAY)).toEqual({ box: 1, lastReviewedAt: TODAY });
  });
});

describe("reviewLeitnerCard", () => {
  it("advances to next box on correct answer", () => {
    const card = createLeitnerCard(TODAY);
    const next = reviewLeitnerCard(card, true, "2024-03-16");
    expect(next.box).toBe(2);
    expect(next.lastReviewedAt).toBe("2024-03-16");
  });

  it("resets to box 1 on wrong answer", () => {
    const card = { box: 4, lastReviewedAt: TODAY };
    const next = reviewLeitnerCard(card, false, "2024-03-20");
    expect(next.box).toBe(1);
  });

  it("stays at max box (5) on correct answer when already at max", () => {
    const card = { box: LEITNER_MAX_BOX, lastReviewedAt: TODAY };
    const next = reviewLeitnerCard(card, true, "2024-03-29");
    expect(next.box).toBe(LEITNER_MAX_BOX);
  });

  it("advances through all 5 boxes correctly on streak", () => {
    let card = createLeitnerCard("2024-01-01");
    const boxes: number[] = [card.box];
    const reviews = ["2024-01-02", "2024-01-04", "2024-01-08", "2024-01-15", "2024-01-29"];
    for (const date of reviews) {
      card = reviewLeitnerCard(card, true, date);
      boxes.push(card.box);
    }
    expect(boxes).toEqual([1, 2, 3, 4, 5, 5]);
  });
});

describe("isCardDue", () => {
  it("is due when the interval has elapsed", () => {
    const card = { box: 1, lastReviewedAt: "2024-03-14" }; // interval = 1 day
    expect(isCardDue(card, TODAY)).toBe(true);
  });

  it("is not due before the interval elapses", () => {
    const card = { box: 2, lastReviewedAt: "2024-03-14" }; // interval = 2 days, only 1 passed
    expect(isCardDue(card, TODAY)).toBe(false);
  });

  it("is due exactly on the interval day", () => {
    const card = { box: 3, lastReviewedAt: "2024-03-11" }; // interval = 4 days
    expect(isCardDue(card, TODAY)).toBe(true);
  });

  it("respects correct intervals for each box", () => {
    for (const [box, interval] of Object.entries(LEITNER_INTERVALS_DAYS)) {
      const card = {
        box: Number(box),
        lastReviewedAt: "2024-01-01",
      };
      const dueDateStr = `2024-01-${String(1 + interval).padStart(2, "0")}`;
      expect(isCardDue(card, dueDateStr)).toBe(true);
    }
  });
});

describe("getDueVocabIds", () => {
  it("returns only vocab cards that are due", () => {
    const boxes = {
      "v-1": { box: 1, lastReviewedAt: "2024-03-14" }, // 1 day ago → due
      "v-2": { box: 2, lastReviewedAt: "2024-03-14" }, // 1 day ago → not due (needs 2)
      "v-3": { box: 1, lastReviewedAt: "2024-03-15" }, // today → not due
    };
    const due = getDueVocabIds(boxes, TODAY);
    expect(due).toEqual(["v-1"]);
  });

  it("returns empty array when no cards are due", () => {
    const boxes = {
      "v-1": { box: 5, lastReviewedAt: "2024-03-14" }, // needs 14 days
    };
    expect(getDueVocabIds(boxes, TODAY)).toEqual([]);
  });

  it("returns all due cards from an empty set", () => {
    expect(getDueVocabIds({}, TODAY)).toEqual([]);
  });
});
