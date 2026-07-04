import { UI_LANGUAGE_CODES, type UiLanguageCode } from "@/domain/types";
import { useLanguageSettings } from "@/state/LanguageSettingsContext";
import { Card } from "@/components/ui/Card";
import { t, useUiStrings } from "@/i18n/t";

// Native display names for the UI-language picker. Deliberately not run
// through `t()` — language names are conventionally shown in their own
// language regardless of the currently active UI language, so a user can
// always find their language even if they've landed on the wrong one.
const UI_LANGUAGE_DISPLAY_NAMES: Record<UiLanguageCode, string> = {
  nl: "Nederlands",
  en: "English",
};

// New dedicated route (`/settings`) rather than a panel nested in
// `Profile.tsx` — see issue #36's PR description for the reasoning: Settings
// is an app-configuration concern (distinct from Profile's
// progress/badges/streak display), and a standalone route gives both this
// UI-language picker and a future learning-language picker (#35) a natural
// shared home without overloading Profile's responsibilities.
export function Settings() {
  useUiStrings(); // subscribes this component to UI-language changes; see t.ts
  const { uiLanguage, setUiLanguage } = useLanguageSettings();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("settings.title")}</h2>
      <Card>
        <h3 className="mb-3 font-semibold">{t("settings.uiLanguageLabel")}</h3>
        <div
          className="flex gap-2"
          role="radiogroup"
          aria-label={t("settings.uiLanguageLabel")}
        >
          {UI_LANGUAGE_CODES.map((code) => {
            const isActive = code === uiLanguage;
            return (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setUiLanguage(code)}
                className={`min-h-[44px] flex-1 rounded-2xl border-2 px-4 py-3 font-semibold transition active:opacity-75 ${
                  isActive
                    ? "border-forest-600 bg-forest-50 text-forest-700"
                    : "border-cream-100 text-stone-500"
                }`}
              >
                {UI_LANGUAGE_DISPLAY_NAMES[code]}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
