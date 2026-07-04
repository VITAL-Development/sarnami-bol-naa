import type { UiLanguageCode } from "@/domain/types";
import type { Strings } from "@/i18n/t";
import { strings } from "@/i18n/strings.nl";
import type { UiStringsRepository } from "./UiStringsRepository";

let warned = false;

/**
 * Local/offline fallback for UI strings, used when `VITE_API_BASE_URL` isn't
 * set. Only Dutch (`nl`) is bundled in the frontend today
 * (`src/i18n/strings.nl.ts`) — there is no local `en` table yet, so any
 * other UI language also falls back to `nl` rather than throwing (there's
 * no local-dev story for a language that isn't authored on disk).
 */
export class LocalUiStringsRepository implements UiStringsRepository {
  async getUiStrings(uiLanguage: UiLanguageCode): Promise<Strings> {
    if (uiLanguage !== "nl" && !warned) {
      warned = true;
      console.warn(
        `LocalUiStringsRepository: no bundled local UI strings for "${uiLanguage}" — ` +
          "falling back to the Dutch (nl) table. Set VITE_API_BASE_URL to fetch real " +
          "per-language UI strings from /server instead.",
      );
    }
    return strings;
  }
}
