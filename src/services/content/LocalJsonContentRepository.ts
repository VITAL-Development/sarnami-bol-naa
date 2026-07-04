import type {
  ContentBundle,
  LanguageSettings,
  LearningLanguageCode,
  Lesson,
  Unit,
  VocabItem,
} from "@/domain/types";
import type { ContentRepository } from "./ContentRepository";
import { contentBundle } from "@/data";
import { languageSettingsByCode } from "@/data/languageSettings";

const warnedLanguages = new Set<LearningLanguageCode>();

// Local dev without a backend only ever bundles Sarnami content (see
// src/data's header comments — it's the frontend's own local/offline
// fallback copy, not a general multi-language store). Warn (once per
// language per session) rather than throw so this fallback keeps working
// for the app's default language while surfacing the gap for anything else.
function warnIfUnsupported(learningLanguage: LearningLanguageCode): void {
  if (learningLanguage !== "sarnami" && !warnedLanguages.has(learningLanguage)) {
    warnedLanguages.add(learningLanguage);
    console.warn(
      `LocalJsonContentRepository: no bundled local content for "${learningLanguage}" — ` +
        "falling back to the Sarnami content bundle. Set VITE_API_BASE_URL to fetch real " +
        "per-language content from /server instead.",
    );
  }
}

export class LocalJsonContentRepository implements ContentRepository {
  async getContentBundle(learningLanguage: LearningLanguageCode): Promise<ContentBundle> {
    warnIfUnsupported(learningLanguage);
    return contentBundle;
  }

  async getLanguageSettings(learningLanguage: LearningLanguageCode): Promise<LanguageSettings> {
    return languageSettingsByCode[learningLanguage];
  }

  async getUnit(
    learningLanguage: LearningLanguageCode,
    unitId: string,
  ): Promise<Unit | undefined> {
    warnIfUnsupported(learningLanguage);
    return contentBundle.units.find((unit) => unit.id === unitId);
  }

  async getLesson(
    learningLanguage: LearningLanguageCode,
    lessonId: string,
  ): Promise<Lesson | undefined> {
    warnIfUnsupported(learningLanguage);
    for (const unit of contentBundle.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  }

  async getVocabItem(
    learningLanguage: LearningLanguageCode,
    vocabId: string,
  ): Promise<VocabItem | undefined> {
    warnIfUnsupported(learningLanguage);
    return contentBundle.vocab.find((item) => item.id === vocabId);
  }
}
