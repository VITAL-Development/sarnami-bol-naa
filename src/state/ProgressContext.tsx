import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { LessonResult, UserProgress } from "@/domain/types";
import { progressRepository } from "@/services";
import { createInitialProgress } from "@/domain/gamification";

interface ProgressContextValue {
  progress: UserProgress;
  isLoading: boolean;
  completeLesson: (result: LessonResult) => Promise<void>;
  reviewVocab: (vocabId: string, correct: boolean) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    progressRepository.getProgress().then((p) => {
      setProgress(p);
      setIsLoading(false);
    });
  }, []);

  const completeLesson = useCallback(async (result: LessonResult) => {
    const next = await progressRepository.recordLessonCompletion(result);
    setProgress(next);
  }, []);

  const reviewVocab = useCallback(async (vocabId: string, correct: boolean) => {
    const next = await progressRepository.recordReviewResult(vocabId, correct);
    setProgress(next);
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, isLoading, completeLesson, reviewVocab }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}
