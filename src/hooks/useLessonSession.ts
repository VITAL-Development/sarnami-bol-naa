import { useMemo, useState } from "react";
import type { Lesson } from "@/domain/types";
import { DEFAULT_MAX_HEARTS } from "@/domain/gamification";

export type LessonSessionStatus = "in-progress" | "passed" | "failed";

interface UseLessonSessionResult {
  currentExercise: Lesson["exercises"][number] | null;
  currentIndex: number;
  total: number;
  hearts: number;
  maxHearts: number;
  mistakeCount: number;
  status: LessonSessionStatus;
  progressFraction: number;
  submitAnswer: (isCorrect: boolean) => void;
}

export function useLessonSession(lesson: Lesson): UseLessonSessionResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(DEFAULT_MAX_HEARTS);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [status, setStatus] = useState<LessonSessionStatus>("in-progress");

  const total = lesson.exercises.length;
  const currentExercise = useMemo(
    () => (status === "in-progress" ? lesson.exercises[currentIndex] ?? null : null),
    [lesson.exercises, currentIndex, status],
  );

  function submitAnswer(isCorrect: boolean) {
    if (status !== "in-progress") return;

    if (!isCorrect) {
      const remainingHearts = hearts - 1;
      setHearts(remainingHearts);
      setMistakeCount((m) => m + 1);
      if (remainingHearts <= 0) {
        setStatus("failed");
        return;
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      setStatus("passed");
      return;
    }
    setCurrentIndex(nextIndex);
  }

  return {
    currentExercise,
    currentIndex,
    total,
    hearts,
    maxHearts: DEFAULT_MAX_HEARTS,
    mistakeCount,
    status,
    progressFraction: total === 0 ? 0 : currentIndex / total,
    submitAnswer,
  };
}
