import { useMemo } from "react";
import type { ContentBundle, UserProgress, VocabItem } from "@/domain/types";
import { getDueVocabIds } from "@/domain/leitner";

export function useReviewQueue(bundle: ContentBundle | null, progress: UserProgress): VocabItem[] {
  return useMemo(() => {
    if (!bundle) return [];
    const dueIds = new Set(getDueVocabIds(progress.leitnerBoxes));
    return bundle.vocab.filter((item) => dueIds.has(item.id));
  }, [bundle, progress.leitnerBoxes]);
}
