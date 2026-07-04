import type { UiLanguageCode } from "@/domain/types";
import type { Strings } from "@/i18n/t";

// Sibling repository to ContentRepository/ProgressRepository, one per axis
// of concern (see LanguageSettingsContext's comment on why UI language and
// content language are tracked separately). `uiLanguage` is a per-call
// parameter for the same reason `learningLanguage` is on ContentRepository
// — it can change at runtime once a language picker lands (issues #35/#36).
export interface UiStringsRepository {
  getUiStrings(uiLanguage: UiLanguageCode): Promise<Strings>;
}
