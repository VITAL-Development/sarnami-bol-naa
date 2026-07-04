// UI/translation language codes supported by the app. English support is
// being added alongside the existing Dutch content (see issue #27). Defined
// as a const array (rather than a bare string-literal union) so a future
// third language is one addition here, not a hunt through every place the
// union was spelled out — same pattern as `LearningLanguageCode` below.
export const UI_LANGUAGE_CODES = ["nl", "en"] as const;
export type UiLanguageCode = (typeof UI_LANGUAGE_CODES)[number];

// Not every entry has an English translation yet (translations are added
// incrementally as content is authored/reviewed), so this is a partial map
// rather than requiring all `UiLanguageCode`s up front. `nl` is expected to
// always be present in practice since it's the source language for existing
// content, but that isn't enforced by the type itself.
export type Translations = Partial<Record<UiLanguageCode, string>>;

// The language whose vocabulary/grammar is being taught. Distinct from
// `UiLanguageCode`, which is the language the interface/translations are
// shown in (see issue #28). Defined as a const array (rather than a bare
// string-literal union) so a future third language is one addition here,
// not a hunt through every place the union was spelled out.
export const LEARNING_LANGUAGE_CODES = ["sarnami", "sranantongo"] as const;
export type LearningLanguageCode = (typeof LEARNING_LANGUAGE_CODES)[number];

export interface VocabItem {
  id: string;
  word: string;
  translations: Translations;
  audioUrl?: string;
  tags?: string[];
  notes?: string;
}

export interface ExampleSentence {
  id: string;
  word: string;
  translations: Translations;
  vocabRefs: string[];
}

interface ExerciseBase {
  id: string;
}

// Exercise kinds that embed prompt/option/answer text no longer carry that
// text inline (see issue #31) — they instead carry a `contentRef` id that's
// resolved against `ContentBundle.lessonContent.exerciseContent` (keyed by
// that same id) at render time. This keeps `src/data/units/*.ts` free of
// literal Sarnami/Dutch strings; the actual authored text lives in
// `server/content/sarnami/lessons/*.json`.
export interface MultipleChoiceExercise extends ExerciseBase {
  kind: "multiple-choice";
  contentRef: string;
  promptVocabRef?: string;
}

export interface WordBankExercise extends ExerciseBase {
  kind: "word-bank";
  contentRef: string;
}

export interface FillBlankExercise extends ExerciseBase {
  kind: "fill-blank";
  contentRef: string;
}

export interface MatchingExercise extends ExerciseBase {
  kind: "matching";
  contentRef: string;
}

// Flashcard carries no literal text of its own — `direction` is a structural
// enum, not translatable content, and the front/back text is resolved from
// `vocabRef` against the vocab pool (unchanged since issue #30). No
// `contentRef` is needed here.
export interface FlashcardExercise extends ExerciseBase {
  kind: "flashcard";
  vocabRef: string;
  direction: "target-to-native" | "native-to-target";
}

export type LessonExercise =
  | MultipleChoiceExercise
  | WordBankExercise
  | FillBlankExercise
  | MatchingExercise
  | FlashcardExercise;

// Content shapes below mirror the fields that used to live inline on the
// exercise types above. Keyed by the exercise's `contentRef` (== its `id` in
// all current content) in `LessonContentBundle.exerciseContent`.
export interface MultipleChoiceContent {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface WordBankContent {
  promptTranslations: Translations;
  correctTargetTokens: string[];
  distractorTokens?: string[];
}

export interface FillBlankContent {
  sentenceTemplate: string;
  correctAnswer: string;
  options: string[];
  translations: Translations;
}

export interface MatchingContent {
  pairs: { left: string; right: string }[];
}

export type ExerciseContent =
  | MultipleChoiceContent
  | WordBankContent
  | FillBlankContent
  | MatchingContent;

export interface GrammarNote {
  id: string;
  title: string;
  body: string;
  relatedVocab?: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  description: string;
  newVocab: string[];
  // Full ExampleSentence/GrammarNote objects are resolved from
  // ContentBundle.lessonContent by these ids (see issue #31).
  exampleSentenceRefs?: string[];
  grammarNoteRefs?: string[];
  exercises: LessonExercise[];
  xpReward: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  bookChapterRef?: string;
  lessons: Lesson[];
}

// Lesson-adjacent authored text (exercise prompts/options/answers, example
// sentences, grammar notes) resolved by id — the knowledge-base counterpart
// to `vocab` for lesson structure (issue #31). `exerciseContent` is keyed by
// `contentRef`.
export interface LessonContentBundle {
  exampleSentences: ExampleSentence[];
  grammarNotes: GrammarNote[];
  exerciseContent: Record<string, ExerciseContent>;
}

export interface ContentBundle {
  units: Unit[];
  vocab: VocabItem[];
  lessonContent: LessonContentBundle;
}

// A shade scale for one brand color role, keyed by the same shade numbers
// used by the corresponding `--color-{forest,flame,gold,cream}-{shade}`
// custom property in src/styles/index.css (e.g. `primary["500"]` <->
// `--color-forest-500`). Values are space-separated RGB triplet strings
// (e.g. "61 142 67"), not hex, so they can be written to
// `document.documentElement.style` and consumed by Tailwind's
// `rgb(var(--color-*) / <alpha-value>)` composition unchanged. Partial
// because not every role defines every shade (e.g. `danger`/`accent` have no
// "50"/"200"/"700" entries in the palette).
export type BrandColorScale = Partial<Record<string, string>>;

// Brand/theme metadata for a learning language, applied at runtime (issue
// #62) rather than baked into a build — see docs/api-contract.md's
// `branding` field on `GET /settings?lang=`. `colors` role names map onto
// this app's existing Suriname-flag-derived token names as follows:
// primary -> forest, danger -> flame, accent -> gold, background -> cream.
export interface LanguageBranding {
  appName: string;
  colors: {
    primary: BrandColorScale;
    danger: BrandColorScale;
    accent: BrandColorScale;
    background: BrandColorScale;
  };
  // Omitted entirely for languages with no distinct icon set authored yet
  // (e.g. sranantongo currently reuses Sarnami's icons) — callers must fall
  // back to the build-time defaults (public/favicon.svg, public/icons/*)
  // when this is undefined.
  icons?: {
    favicon: string;
    icon192: string;
    icon512: string;
    iconMaskable512: string;
  };
}

// Metadata *about* a learning language (romanization/diacritic rules,
// alphabet, script direction, audio config) — distinct from the lesson/vocab
// content itself. Shape matches `GET /settings?lang=` in
// docs/api-contract.md exactly, since the server serves its on-disk
// `language-settings.json` files verbatim.
export interface LanguageSettings {
  code: LearningLanguageCode;
  displayName: string;
  scriptDirection: "ltr" | "rtl";
  romanization: {
    scheme: string;
    diacritics: { char: string; description: string }[];
    notes: string;
  };
  alphabet: {
    vowels: string[];
    consonants: string[];
  };
  audio: {
    baseUrl: string;
    format: string;
    voice: string;
  };
  // Optional because it was added in issue #62, after the rest of this
  // shape (issue #32/#33) — older/local fallback data or a not-yet-updated
  // backend could in principle omit it, so callers must handle `undefined`
  // (falling back to build-time defaults) rather than assuming it's always
  // present.
  branding?: LanguageBranding;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LeitnerCard {
  box: number;
  lastReviewedAt: string;
}

export interface UserProgress {
  xp: number;
  streak: {
    count: number;
    lastCompletedDate: string | null;
  };
  hearts: {
    current: number;
    max: number;
  };
  completedLessons: Record<string, { stars: number; completedAt: string }>;
  leitnerBoxes: Record<string, LeitnerCard>;
  earnedBadges: string[];
}

export interface LessonResult {
  lessonId: string;
  mistakeCount: number;
  passed: boolean;
  vocabIntroduced: string[];
}
