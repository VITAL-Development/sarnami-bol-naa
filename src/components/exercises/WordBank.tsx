import { useMemo, useState } from "react";
import type { WordBankExercise } from "@/domain/types";
import type { ExerciseComponentProps } from "./types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/i18n/t";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function WordBank({ exercise, onAnswer }: ExerciseComponentProps<WordBankExercise>) {
  const bank = useMemo(
    () => shuffle([...exercise.correctSarnamiTokens, ...(exercise.distractorTokens ?? [])]),
    [exercise],
  );
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const selectedTokens = usedIndices.map((i) => bank[i]);
  const isCorrect = selectedTokens.join(" ") === exercise.correctSarnamiTokens.join(" ");

  function toggleToken(index: number) {
    if (checked) return;
    setUsedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }

  function check() {
    setChecked(true);
  }

  function next() {
    onAnswer(isCorrect);
    setUsedIndices([]);
    setChecked(false);
  }

  return (
    <Card>
      <p className="mb-1 text-sm text-stone-500">Zinnen bouwen</p>
      <h2 className="mb-4 text-xl font-semibold">{exercise.promptDutch}</h2>

      <div className="mb-4 flex min-h-[3rem] flex-wrap gap-2 rounded-2xl border-2 border-dashed border-stone-200 p-3">
        {selectedTokens.map((token, i) => (
          <button
            key={`${token}-${i}`}
            type="button"
            disabled={checked}
            onClick={() => toggleToken(usedIndices[i])}
            className="rounded-xl bg-sarnami-100 px-3 py-1 text-sarnami-700"
          >
            {token}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {bank.map((token, index) => (
          <button
            key={`${token}-${index}`}
            type="button"
            disabled={checked || usedIndices.includes(index)}
            onClick={() => toggleToken(index)}
            className="rounded-xl border border-stone-200 px-3 py-1 disabled:opacity-30"
          >
            {token}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={usedIndices.length === 0}>
            {t("lesson.checkAnswer")}
          </Button>
        ) : (
          <Button onClick={next}>{t("lesson.continue")}</Button>
        )}
      </div>
      {checked && (
        <p className={`mt-3 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
          {isCorrect
            ? t("lesson.correct")
            : `${t("lesson.incorrect")} (${exercise.correctSarnamiTokens.join(" ")})`}
        </p>
      )}
    </Card>
  );
}
