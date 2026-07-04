import { useState } from "react";
import type { FillBlankContent, FillBlankExercise } from "@/domain/types";
import type { ExerciseComponentProps } from "./types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t, useUiStrings } from "@/i18n/t";

export function FillBlank({ exercise, contentById, onAnswer }: ExerciseComponentProps<FillBlankExercise>) {
  useUiStrings(); // subscribes this component to UI-language changes; see t.ts
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const content = contentById.get(exercise.contentRef) as FillBlankContent | undefined;
  const isCorrect = content !== undefined && selected === content.correctAnswer;

  function check() {
    if (selected === null) return;
    setChecked(true);
  }

  function next() {
    onAnswer(isCorrect);
    setSelected(null);
    setChecked(false);
  }

  if (!content) return null;

  const [before, after] = content.sentenceTemplate.split("___");

  return (
    <Card>
      <p className="mb-1 text-sm text-stone-500">Vul aan</p>
      {/* Defaults to Dutch (`nl`) for now; UI-language switching is tracked in #36. */}
      <p className="mb-1 text-sm text-stone-500">{content.translations.nl}</p>
      <h2 className="mb-4 text-xl font-semibold">
        {before}
        <span className="mx-1 rounded bg-forest-50 px-3 py-1 text-forest-700">
          {selected ?? "___"}
        </span>
        {after}
      </h2>
      <div className="flex flex-wrap gap-2">
        {content.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={checked}
            onClick={() => setSelected(option)}
            className={`rounded-xl border-2 px-4 py-2 ${
              selected === option ? "border-forest-500 bg-forest-50" : "border-stone-200"
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
          {isCorrect ? t("lesson.correct") : `${t("lesson.incorrect")} (${content.correctAnswer})`}
        </p>
      )}
    </Card>
  );
}
