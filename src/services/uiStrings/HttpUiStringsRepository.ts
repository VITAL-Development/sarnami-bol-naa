import type { UiLanguageCode } from "@/domain/types";
import type { Strings } from "@/i18n/t";
import type { UiStringsRepository } from "./UiStringsRepository";

/**
 * Backend-backed implementation, wired up in services/index.ts when
 * `VITE_API_BASE_URL` is set. `baseUrl` (the backend host) is fixed at
 * construction time, same as HttpContentRepository/HttpProgressRepository —
 * `uiLanguage` is a per-call parameter instead so it can change at runtime.
 */
export class HttpUiStringsRepository implements UiStringsRepository {
  constructor(private readonly baseUrl: string) {}

  async getUiStrings(uiLanguage: UiLanguageCode): Promise<Strings> {
    const res = await fetch(`${this.baseUrl}/ui-strings?lang=${uiLanguage}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }
}
