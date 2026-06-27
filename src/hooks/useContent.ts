import { useEffect, useState } from "react";
import type { ContentBundle } from "@/domain/types";
import { contentRepository } from "@/services";

interface UseContentResult {
  bundle: ContentBundle | null;
  isLoading: boolean;
}

export function useContent(): UseContentResult {
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    contentRepository.getContentBundle().then((b) => {
      if (!cancelled) {
        setBundle(b);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { bundle, isLoading };
}
