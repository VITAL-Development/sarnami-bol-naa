import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Lesson as LessonType, VocabItem } from "@/domain/types";
import { useContent } from "@/hooks/useContent";
import { useProgress } from "@/state/ProgressContext";
import { useLessonSession } from "@/hooks/useLessonSession";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { HeartsBar } from "@/components/hud/HeartsBar";
import { LessonSummary } from "@/components/feedback/LessonSummary";

export function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { bundle, isLoading } = useContent();

  const lesson = useMemo(
    () => bundle?.units.flatMap((u) => u.lessons).find((l) => l.id === lessonId) ?? null,
    [bundle, lessonId],
  );

  if (isLoading || !bundle) {
    return <p className="text-center text-stone-400">Laden...</p>;
  }

  if (!lesson) {
    return <p className="text-center text-stone-500">Les niet gevonden.</p>;
  }

  return <LessonRunner key={lesson.id} lesson={lesson} vocab={bundle.vocab} onExit={() => navigate("/")} />;
}

function LessonRunner({
  lesson,
  vocab,
  onExit,
}: {
  lesson: LessonType;
  vocab: VocabItem[];
  onExit: () => void;
}) {
  const session = useLessonSession(lesson);
  const { completeLesson } = useProgress();
  const vocabById = useMemo(() => new Map(vocab.map((v) => [v.id, v])), [vocab]);

  if (session.status !== "in-progress") {
    const passed = session.status === "passed";

    async function finish() {
      if (passed) {
        await completeLesson({
          lessonId: lesson.id,
          mistakeCount: session.mistakeCount,
          passed: true,
          vocabIntroduced: lesson.newVocab,
        });
      }
      onExit();
    }

    return (
      <LessonSummary
        passed={passed}
        xpEarned={lesson.xpReward}
        onBackToPath={() => {
          void finish();
        }}
        onRetry={onExit}
      />
    );
  }

  if (!session.currentExercise) {
    return <p className="text-center text-stone-400">Laden...</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full bg-sarnami-500 transition-all"
            style={{ width: `${session.progressFraction * 100}%` }}
          />
        </div>
        <div className="ml-4">
          <HeartsBar hearts={session.hearts} maxHearts={session.maxHearts} />
        </div>
      </div>
      <ExerciseRenderer
        key={session.currentIndex}
        exercise={session.currentExercise}
        vocabById={vocabById}
        onAnswer={session.submitAnswer}
      />
    </div>
  );
}
