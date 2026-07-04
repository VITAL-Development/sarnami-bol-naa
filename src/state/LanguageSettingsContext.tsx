import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { LearningLanguageCode, UiLanguageCode } from "@/domain/types";

// This is a separate context rather than an extension of ProgressContext:
// language settings are a distinct concern from spaced-repetition/XP progress
// (different lifecycle, no interaction with the progress repository/service
// layer), so keeping them apart avoids overloading ProgressContext's
// responsibilities and lets future issues (e.g. a language picker, or wiring
// this into content fetching) evolve independently of progress persistence.

const STORAGE_KEY = "sarnami-language-settings-v1";

const DEFAULT_LEARNING_LANGUAGE: LearningLanguageCode = "sarnami";
const DEFAULT_UI_LANGUAGE: UiLanguageCode = "nl";

interface StoredLanguageSettings {
  learningLanguage: LearningLanguageCode;
  uiLanguage: UiLanguageCode;
}

function loadStoredSettings(): StoredLanguageSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { learningLanguage: DEFAULT_LEARNING_LANGUAGE, uiLanguage: DEFAULT_UI_LANGUAGE };
    }
    const parsed = JSON.parse(raw) as Partial<StoredLanguageSettings>;
    return {
      learningLanguage: parsed.learningLanguage ?? DEFAULT_LEARNING_LANGUAGE,
      uiLanguage: parsed.uiLanguage ?? DEFAULT_UI_LANGUAGE,
    };
  } catch {
    return { learningLanguage: DEFAULT_LEARNING_LANGUAGE, uiLanguage: DEFAULT_UI_LANGUAGE };
  }
}

function saveStoredSettings(settings: StoredLanguageSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

interface LanguageSettingsContextValue {
  learningLanguage: LearningLanguageCode;
  uiLanguage: UiLanguageCode;
  setLearningLanguage: (language: LearningLanguageCode) => void;
  setUiLanguage: (language: UiLanguageCode) => void;
}

const LanguageSettingsContext = createContext<LanguageSettingsContextValue | null>(null);

export function LanguageSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoredLanguageSettings>(() => loadStoredSettings());

  const setLearningLanguage = useCallback((language: LearningLanguageCode) => {
    setSettings((prev) => {
      const next = { ...prev, learningLanguage: language };
      saveStoredSettings(next);
      return next;
    });
  }, []);

  const setUiLanguage = useCallback((language: UiLanguageCode) => {
    setSettings((prev) => {
      const next = { ...prev, uiLanguage: language };
      saveStoredSettings(next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageSettingsContextValue>(
    () => ({
      learningLanguage: settings.learningLanguage,
      uiLanguage: settings.uiLanguage,
      setLearningLanguage,
      setUiLanguage,
    }),
    [settings, setLearningLanguage, setUiLanguage],
  );

  return (
    <LanguageSettingsContext.Provider value={value}>{children}</LanguageSettingsContext.Provider>
  );
}

export function useLanguageSettings(): LanguageSettingsContextValue {
  const ctx = useContext(LanguageSettingsContext);
  if (!ctx) {
    throw new Error("useLanguageSettings must be used within a LanguageSettingsProvider");
  }
  return ctx;
}
