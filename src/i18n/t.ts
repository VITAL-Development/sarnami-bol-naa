import { useEffect, useSyncExternalStore } from "react";
import { useLanguageSettings } from "@/state/LanguageSettingsContext";
import type { Strings } from "./types";
import { ensureUiLanguageLoaded, getUiStringsSnapshot, subscribeUiStrings } from "./uiStringsStore";

// Re-exported so existing `import type { Strings } from "@/i18n/t"` call
// sites (the uiStrings repositories from #34) keep working unchanged — the
// canonical definition now lives in `./types.ts` to avoid a runtime import
// cycle between this module and `./uiStringsStore.ts`.
export type { Strings } from "./types";

type DotPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
    }[keyof T & string]
  : never;

export type TranslationKey = DotPaths<Strings>;

/**
 * Looks up `key` in the *currently active* UI string table.
 *
 * `t()`'s call shape is unchanged from before issue #36: still a plain
 * synchronous function taking a dotted key and returning a string. What
 * changed is only where that table comes from — it now reads a module-level
 * snapshot (`getUiStringsSnapshot()`, see `./uiStringsStore.ts`) that's
 * populated at runtime from the backend (`UiStringsRepository`, #34) for the
 * active `useLanguageSettings().uiLanguage`, instead of the bundled
 * `strings.nl` table directly. The bundled table is still the *initial*
 * snapshot (and the permanent fallback for `nl` in local/offline dev), so
 * there's no loading flash.
 *
 * Callers that render translated text must also call `useUiStrings()` once
 * in their component body (return value can be ignored) so they re-render
 * when the active table changes — see that function's doc comment for why
 * this can't be done for free at a single spot higher in the tree.
 */
export function t(key: TranslationKey): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = getUiStringsSnapshot();
  for (const part of parts) {
    value = value?.[part];
  }
  return typeof value === "string" ? value : key;
}

/**
 * Subscribes the calling component to the active UI string table and kicks
 * off loading it for the current `useLanguageSettings().uiLanguage` if it
 * isn't already loaded/loading.
 *
 * Why this has to be called in *every* component that calls `t()` (rather
 * than once at the app root): React bails out of re-rendering a subtree
 * whose `children` element reference is unchanged, even when an ancestor
 * provider re-renders for its own reasons. A language switch updates
 * `LanguageSettingsContext` and the module-level string-table store, but
 * neither of those propagates a re-render to a descendant that doesn't
 * itself subscribe. `useSyncExternalStore` is the correct primitive for
 * this: it subscribes *this* component specifically, independent of any
 * ancestor's bailout.
 *
 * The return value mirrors the current table in case a caller wants it
 * directly; most callers can ignore it and just keep calling `t(key)`.
 */
export function useUiStrings(): Strings {
  const { uiLanguage } = useLanguageSettings();

  useEffect(() => {
    void ensureUiLanguageLoaded(uiLanguage);
  }, [uiLanguage]);

  return useSyncExternalStore(subscribeUiStrings, getUiStringsSnapshot);
}
