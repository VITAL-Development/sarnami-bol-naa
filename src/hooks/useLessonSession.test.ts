import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLessonSession } from "./useLessonSession";
import type { Lesson } from "@/domain/types";

function makeLesson(exerciseCount: number): Lesson {
  return {
    id: "test-lesson",
    unitId: "u01",
    order: 1,
    title: "Test",
    description: "",
    newVocab: [],
    exercises: Array.from({ length: exerciseCount }, (_, i) => ({
      id: `ex-${i}`,
      kind: "flashcard" as const,
      vocabRef: `v-${i}`,
      direction: "sarnami-to-dutch" as const,
    })),
    xpReward: 10,
  };
}

describe("useLessonSession", () => {
  it("starts in-progress at exercise 0 with full hearts", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(3)));
    expect(result.current.status).toBe("in-progress");
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hearts).toBe(5);
    expect(result.current.mistakeCount).toBe(0);
  });

  it("advances to next exercise on correct answer", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(3)));
    act(() => result.current.submitAnswer(true));
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.hearts).toBe(5);
  });

  it("passes after answering all exercises correctly", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(2)));
    act(() => result.current.submitAnswer(true));
    act(() => result.current.submitAnswer(true));
    expect(result.current.status).toBe("passed");
    expect(result.current.mistakeCount).toBe(0);
  });

  it("decrements hearts on wrong answer", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(3)));
    act(() => result.current.submitAnswer(false));
    expect(result.current.hearts).toBe(4);
    expect(result.current.mistakeCount).toBe(1);
    expect(result.current.currentIndex).toBe(0); // stays on same exercise
  });

  it("fails the lesson when hearts reach 0", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(3)));
    for (let i = 0; i < 5; i++) {
      act(() => result.current.submitAnswer(false));
    }
    expect(result.current.status).toBe("failed");
  });

  it("ignores submitAnswer calls after lesson ends", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(1)));
    act(() => result.current.submitAnswer(true)); // pass
    const snapshot = result.current;
    act(() => result.current.submitAnswer(true));
    expect(result.current).toStrictEqual(snapshot);
  });

  it("reports correct progressFraction", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(4)));
    expect(result.current.progressFraction).toBe(0); // 0/4
    act(() => result.current.submitAnswer(true));
    expect(result.current.progressFraction).toBe(0.25); // 1/4
  });

  it("returns null currentExercise after lesson ends", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(1)));
    act(() => result.current.submitAnswer(true));
    expect(result.current.currentExercise).toBeNull();
  });

  it("counts mistakes across multiple wrong answers", () => {
    const { result } = renderHook(() => useLessonSession(makeLesson(5)));
    act(() => result.current.submitAnswer(false));
    act(() => result.current.submitAnswer(false));
    act(() => result.current.submitAnswer(true));
    expect(result.current.mistakeCount).toBe(2);
    expect(result.current.currentIndex).toBe(1);
  });
});
