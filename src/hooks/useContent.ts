import { useEffect, useState } from "react";
import type { ContentBundle } from "@/domain/types";
import { contentRepository } from "@/services";

interface UseContentResult {
  bundle: ContentBundle | null;
  isLoading: boolean;
  error: Error | null;
}

export function useContent(): UseContentResult {
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    contentRepository
      .getContentBundle()
      .then((b) => {
        if (!cancelled) {
          setBundle(b);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { bundle, isLoading, error };
}
