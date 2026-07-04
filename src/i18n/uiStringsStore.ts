import type { UiLanguageCode } from "@/domain/types";
import { uiStringsRepository } from "@/services";
import { strings as bundledNlStrings } from "./strings.nl";
import type { Strings } from "./types";

// Module-level external store for the active UI string table. `t()` (see
// `./t.ts`) reads synchronously from `current` so its call shape never has to
// become async/hook-based — only this module needs to know that string
// tables are now loaded at runtime instead of bundled at build time.
//
// `current` starts out as the bundled Dutch table (`strings.nl.ts`) so there
// is never a blank/undefined-keys flash before the first fetch resolves —
// see the "keep strings.nl as offline/loading fallback" decision in the PR
// description for issue #36.
let current: Strings = bundledNlStrings;
let loadedLanguage: UiLanguageCode | null = null;
let inFlight: Promise<void> | null = null;

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Read-only snapshot for `t()` and `useSyncExternalStore`. */
export function getUiStringsSnapshot(): Strings {
  return current;
}

/** Subscribe to string-table changes; returns an unsubscribe function. Compatible with `useSyncExternalStore`. */
export function subscribeUiStrings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Fetches the string table for `uiLanguage` via the same `UiStringsRepository`
 * used elsewhere (`src/services/index.ts`), unless it's already loaded/loading.
 * Failures are swallowed (logged) and the previously-loaded table (or the
 * bundled `nl` fallback) keeps serving `t()` — a broken/offline backend
 * should never blank out the UI's chrome text.
 */
export function ensureUiLanguageLoaded(uiLanguage: UiLanguageCode): Promise<void> {
  if (loadedLanguage === uiLanguage) {
    return Promise.resolve();
  }
  if (inFlight) {
    return inFlight;
  }

  inFlight = uiStringsRepository
    .getUiStrings(uiLanguage)
    .then((strings) => {
      current = strings;
      loadedLanguage = uiLanguage;
      notify();
    })
    .catch((err: unknown) => {
      console.warn(
        `Failed to load UI strings for "${uiLanguage}" — keeping the previously-loaded table.`,
        err,
      );
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Test-only reset hook so specs don't leak state across cases. */
export function __resetUiStringsStoreForTests(): void {
  current = bundledNlStrings;
  loadedLanguage = null;
  inFlight = null;
  listeners.clear();
}
