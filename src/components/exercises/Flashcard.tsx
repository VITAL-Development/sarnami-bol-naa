import { useState } from "react";
import type { FlashcardExercise } from "@/domain/types";
import type { ExerciseComponentProps } from "./types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/i18n/t";

export function Flashcard({ exercise, vocabById, onAnswer }: ExerciseComponentProps<FlashcardExercise>) {
  const [revealed, setRevealed] = useState(false);
  const vocab = vocabById.get(exercise.vocabRef);

  function next(isCorrect: boolean) {
    onAnswer(isCorrect);
    setRevealed(false);
  }

  if (!vocab) return null;

  const front = exercise.direction === "sarnami-to-dutch" ? vocab.sarnami : vocab.dutch;
  const back = exercise.direction === "sarnami-to-dutch" ? vocab.dutch : vocab.sarnami;

  return (
    <Card>
      <p className="mb-4 text-sm text-stone-500">Flashcard</p>
      <button
        type="button"
        onClick={() => setRevealed(true)}
        disabled={revealed}
        className="flex min-h-[10rem] w-full flex-col items-center justify-center rounded-2xl border-2 border-sarnami-200 bg-sarnami-50 px-4 py-8 text-center"
      >
        <span className="text-2xl font-semibold text-sarnami-700">{front}</span>
        {revealed && <span className="mt-3 text-lg text-stone-600">{back}</span>}
      </button>

      <div className="mt-6 flex justify-end gap-3">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)}>{t("review.showAnswer")}</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => next(false)}>
              {t("review.didntKnowIt")}
            </Button>
            <Button onClick={() => next(true)}>{t("review.knewIt")}</Button>
          </>
        )}
      </div>
    </Card>
  );
}
