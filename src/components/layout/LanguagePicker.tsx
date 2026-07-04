import type { ChangeEvent } from "react";
import { faGlobe, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/ui/Icon";
import { LEARNING_LANGUAGE_CODES, type LearningLanguageCode } from "@/domain/types";
import { languageSettingsByCode } from "@/data/languageSettings";
import { useLanguageSettings } from "@/state/LanguageSettingsContext";

// Picker for the *learning* language (the content being taught — issue #35),
// distinct from a future UI-language picker (issue #36 — the language the
// chrome/labels are shown in). Lives in AppShell's header since it's global
// app chrome, not tied to any one route.
//
// Display names come from `languageSettingsByCode` (already the frontend's
// canonical source of per-language metadata, see src/data/languageSettings.ts)
// rather than a second hardcoded label list — the code list itself comes
// from `LEARNING_LANGUAGE_CODES` (src/domain/types.ts) so a future third
// learning language is picked up here automatically.
interface LanguagePickerProps {
  isLoading?: boolean;
}

export function LanguagePicker({ isLoading }: LanguagePickerProps) {
  const { learningLanguage, setLearningLanguage } = useLanguageSettings();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setLearningLanguage(event.target.value as LearningLanguageCode);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-stone-500">
      <Icon
        icon={isLoading ? faSpinner : faGlobe}
        className={isLoading ? "animate-spin text-forest-600" : "text-forest-600"}
        aria-hidden
      />
      <span className="sr-only">Leertaal</span>
      <select
        aria-label="Leertaal"
        value={learningLanguage}
        onChange={handleChange}
        className="rounded-full border border-cream-100 bg-cream-50 px-3 py-1.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-forest-600"
      >
        {LEARNING_LANGUAGE_CODES.map((code) => (
          <option key={code} value={code}>
            {languageSettingsByCode[code].displayName}
          </option>
        ))}
      </select>
    </label>
  );
}
