import { useMemo, useState } from "react";
import type { MatchingExercise } from "@/domain/types";
import type { ExerciseComponentProps } from "./types";
import { Card } from "@/components/ui/Card";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Matching({ exercise, onAnswer }: ExerciseComponentProps<MatchingExercise>) {
  const rightShuffled = useMemo(() => shuffle(exercise.pairs.map((p) => p.right)), [exercise]);
  const [matchedLefts, setMatchedLefts] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongRight, setWrongRight] = useState<string | null>(null);

  function pickLeft(left: string) {
    if (matchedLefts.includes(left)) return;
    setSelectedLeft(left);
    setWrongRight(null);
  }

  function pickRight(right: string) {
    if (!selectedLeft) return;
    const pair = exercise.pairs.find((p) => p.left === selectedLeft);
    if (pair?.right === right) {
      const nextMatched = [...matchedLefts, selectedLeft];
      setMatchedLefts(nextMatched);
      setSelectedLeft(null);
      if (nextMatched.length === exercise.pairs.length) {
        onAnswer(true);
      }
    } else {
      setWrongRight(right);
      onAnswer(false);
      setSelectedLeft(null);
    }
  }

  const isUsedRight = (right: string) => {
    const pair = exercise.pairs.find((p) => p.right === right);
    return pair ? matchedLefts.includes(pair.left) : false;
  };

  return (
    <Card>
      <p className="mb-4 text-sm text-stone-500">Sleep de juiste paren bij elkaar (tik om te koppelen)</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {exercise.pairs.map((p) => (
            <button
              key={p.left}
              type="button"
              disabled={matchedLefts.includes(p.left)}
              onClick={() => pickLeft(p.left)}
              className={`min-h-[44px] rounded-xl border-2 px-4 py-2 text-left active:opacity-75 ${
                matchedLefts.includes(p.left)
                  ? "border-green-400 bg-green-50 text-green-700"
                  : selectedLeft === p.left
                    ? "border-sarnami-500 bg-sarnami-50"
                    : "border-stone-200"
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rightShuffled.map((right) => (
            <button
              key={right}
              type="button"
              disabled={isUsedRight(right)}
              onClick={() => pickRight(right)}
              className={`min-h-[44px] rounded-xl border-2 px-4 py-2 text-left active:opacity-75 ${
                isUsedRight(right)
                  ? "border-green-400 bg-green-50 text-green-700"
                  : wrongRight === right
                    ? "border-red-400 bg-red-50"
                    : "border-stone-200"
              }`}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
