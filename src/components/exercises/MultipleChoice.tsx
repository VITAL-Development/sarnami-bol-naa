import { useState } from "react";
import type { MultipleChoiceContent, MultipleChoiceExercise } from "@/domain/types";
import type { ExerciseComponentProps } from "./types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t, useUiStrings } from "@/i18n/t";

export function MultipleChoice({
  exercise,
  vocabById,
  contentById,
  onAnswer,
}: ExerciseComponentProps<MultipleChoiceExercise>) {
  useUiStrings(); // subscribes this component to UI-language changes; see t.ts
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const content = contentById.get(exercise.contentRef) as MultipleChoiceContent | undefined;
  const promptVocab = exercise.promptVocabRef ? vocabById.get(exercise.promptVocabRef) : undefined;

  function check() {
    if (selected === null) return;
    setChecked(true);
  }

  function next() {
    if (selected === null || !content) return;
    onAnswer(selected === content.correctIndex);
    setSelected(null);
    setChecked(false);
  }

  if (!content) return null;

  const isCorrect = selected === content.correctIndex;

  return (
    <Card>
      <p className="mb-1 text-sm text-stone-500">Meerkeuze</p>
      <h2 className="mb-4 text-xl font-semibold">
        {content.prompt}
        {promptVocab && <span className="ml-2 text-sarnami-600">{promptVocab.word}</span>}
      </h2>
      <div className="grid gap-3">
        {content.options.map((option, index) => {
          const isSelected = selected === index;
          const showState = checked && isSelected;
          return (
            <button
              key={option}
              type="button"
              disabled={checked}
              onClick={() => setSelected(index)}
              className={`min-h-[44px] rounded-2xl border-2 px-4 py-3 text-left transition active:opacity-75 ${
                showState
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : isSelected
                    ? "border-sarnami-500 bg-sarnami-50"
                    : "border-stone-200"
              }`}
            >
              {option}
            </button>
          );
        })}
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
          {isCorrect ? t("lesson.correct") : t("lesson.incorrect")}
        </p>
      )}
    </Card>
  );
}
