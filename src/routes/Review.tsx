import { useState } from "react";
import { useContent } from "@/hooks/useContent";
import { useProgress } from "@/state/ProgressContext";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { Flashcard } from "@/components/exercises/Flashcard";
import { Card } from "@/components/ui/Card";
import { t } from "@/i18n/t";

export function Review() {
  const { bundle, isLoading } = useContent();
  const { progress, reviewVocab } = useProgress();
  const queue = useReviewQueue(bundle, progress);
  const [index, setIndex] = useState(0);

  if (isLoading || !bundle) {
    return <p className="text-center text-stone-400">Laden...</p>;
  }

  if (queue.length === 0 || index >= queue.length) {
    return (
      <Card className="text-center">
        <h2 className="text-xl font-bold">{t("review.title")}</h2>
        <p className="mt-2 text-stone-500">{t("review.empty")}</p>
      </Card>
    );
  }

  const item = queue[index];
  const vocabById = new Map(bundle.vocab.map((v) => [v.id, v]));

  function handleAnswer(isCorrect: boolean) {
    void reviewVocab(item.id, isCorrect);
    setIndex((i) => i + 1);
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t("review.title")}</h2>
      <Flashcard
        key={item.id}
        exercise={{ id: item.id, kind: "flashcard", vocabRef: item.id, direction: "sarnami-to-dutch" }}
        vocabById={vocabById}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
