import { useState } from "react";
import type { FillBlankExercise } from "@/domain/types";
import type { ExerciseComponentProps } from "./types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/i18n/t";

export function FillBlank({ exercise, onAnswer }: ExerciseComponentProps<FillBlankExercise>) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected === exercise.correctAnswer;

  function check() {
    if (selected === null) return;
    setChecked(true);
  }

  function next() {
    onAnswer(isCorrect);
    setSelected(null);
    setChecked(false);
  }

  const [before, after] = exercise.sentenceTemplate.split("___");

  return (
    <Card>
      <p className="mb-1 text-sm text-stone-500">Vul aan</p>
      <p className="mb-1 text-sm text-stone-500">{exercise.dutchTranslation}</p>
      <h2 className="mb-4 text-xl font-semibold">
        {before}
        <span className="mx-1 rounded bg-sarnami-50 px-3 py-1 text-sarnami-700">
          {selected ?? "___"}
        </span>
        {after}
      </h2>
      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={checked}
            onClick={() => setSelected(option)}
            className={`rounded-xl border-2 px-4 py-2 ${
              selected === option ? "border-sarnami-500 bg-sarnami-50" : "border-stone-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={selected === null}>
            {t("lesson.checkAnswer")}
          </Button>
        ) : (
          <Button onClick={next}>{t("lesson.continue")}</Button>
        )}
      </div>
      {checked && (
        <p className={`mt-3 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
          {isCorrect ? t("lesson.correct") : `${t("lesson.incorrect")} (${exercise.correctAnswer})`}
        </p>
      )}
    </Card>
  );
}
