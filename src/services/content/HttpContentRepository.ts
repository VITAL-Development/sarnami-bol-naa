import type {
  ContentBundle,
  LanguageSettings,
  LearningLanguageCode,
  Lesson,
  Unit,
  VocabItem,
} from "@/domain/types";
import type { ContentRepository } from "./ContentRepository";

/**
 * Backend-backed implementation, wired up in services/index.ts when
 * `VITE_API_BASE_URL` is set. `baseUrl` (the backend host) is fixed at
 * construction time — still one backend per deployment, reached over
 * Tailscale per deploy.yml — but `learningLanguage` is a per-call parameter
 * (see ContentRepository) so it can change at runtime once a language
 * picker lands (issues #35/#36).
 *
 * Per docs/api-contract.md, the server only exposes the full per-language
 * bundle (`GET /content?lang=`) — there are no per-id `/units/:id`,
 * `/lessons/:id`, `/vocab/:id` routes. `getUnit`/`getLesson`/`getVocabItem`
 * therefore fetch the bundle and resolve locally, same as
 * `LocalJsonContentRepository`.
 */
export class HttpContentRepository implements ContentRepository {
  constructor(private readonly baseUrl: string) {}

  async getContentBundle(learningLanguage: LearningLanguageCode): Promise<ContentBundle> {
    const res = await fetch(`${this.baseUrl}/content?lang=${learningLanguage}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async getLanguageSettings(learningLanguage: LearningLanguageCode): Promise<LanguageSettings> {
    const res = await fetch(`${this.baseUrl}/settings?lang=${learningLanguage}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  async getUnit(
    learningLanguage: LearningLanguageCode,
    unitId: string,
  ): Promise<Unit | undefined> {
    const bundle = await this.getContentBundle(learningLanguage);
    return bundle.units.find((unit) => unit.id === unitId);
  }

  async getLesson(
    learningLanguage: LearningLanguageCode,
    lessonId: string,
  ): Promise<Lesson | undefined> {
    const bundle = await this.getContentBundle(learningLanguage);
    for (const unit of bundle.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  }

  async getVocabItem(
    learningLanguage: LearningLanguageCode,
    vocabId: string,
  ): Promise<VocabItem | undefined> {
    const bundle = await this.getContentBundle(learningLanguage);
    return bundle.vocab.find((item) => item.id === vocabId);
  }
}
