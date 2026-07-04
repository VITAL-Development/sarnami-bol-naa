import { LocalJsonContentRepository } from "./content/LocalJsonContentRepository";
import { HttpContentRepository } from "./content/HttpContentRepository";
import type { ContentRepository } from "./content/ContentRepository";
import { LocalStorageProgressRepository } from "./progress/LocalStorageProgressRepository";
import { HttpProgressRepository } from "./progress/HttpProgressRepository";
import type { ProgressRepository } from "./progress/ProgressRepository";
import { LocalUiStringsRepository } from "./uiStrings/LocalUiStringsRepository";
import { HttpUiStringsRepository } from "./uiStrings/HttpUiStringsRepository";
import type { UiStringsRepository } from "./uiStrings/UiStringsRepository";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const contentRepository: ContentRepository = apiBaseUrl
  ? new HttpContentRepository(apiBaseUrl)
  : new LocalJsonContentRepository();

export const progressRepository: ProgressRepository = apiBaseUrl
  ? new HttpProgressRepository(apiBaseUrl)
  : new LocalStorageProgressRepository();

export const uiStringsRepository: UiStringsRepository = apiBaseUrl
  ? new HttpUiStringsRepository(apiBaseUrl)
  : new LocalUiStringsRepository();
