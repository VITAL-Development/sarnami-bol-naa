import type { VocabItem } from "@/domain/types";

// This is the frontend's own local/offline fallback copy, used by
// `LocalJsonContentRepository` when `VITE_API_BASE_URL` isn't set (see
// `src/services/index.ts`) — not a duplicate kept for backend-bundling
// purposes. `/server` now reads its own authored copy directly from
// `server/content/sarnami/vocab/grammar.json` (issues #30/#33) instead of
// bundling this file. Keep the two in sync by hand if this content changes.
/** Verified against Sarnami Byākaran (Marhé, 1985), p.16, p.40, p.53, p.60, p.97-98. */
export const grammarVocab: VocabItem[] = [
  {
    id: "gram-hai",
    word: "hai",
    translations: { nl: "is / ben / bent (koppelwerkwoord 'zijn')" },
    notes: "Volledige vervoeging o.t.t.: ham hai, tū hai, ī/ū hai, ham log haim, tū log hai, āp ho, ī/ū sab haim.",
    tags: ["grammar", "verb", "book-p97"],
  },
  {
    id: "gram-na",
    word: "nā",
    translations: { nl: "niet" },
    tags: ["grammar", "negation", "book-p16"],
  },
  {
    id: "gram-kaham",
    word: "kahām",
    translations: { nl: "waar" },
    tags: ["grammar", "question-word", "book-p53"],
  },
  {
    id: "gram-se",
    word: "se",
    translations: { nl: "dan (bij vergelijking)" },
    notes: "Vormt de vergrotende trap: ...se barkā hai (is groter dan...).",
    tags: ["grammar", "comparison", "book-p60"],
  },
  {
    id: "gram-aur-compare",
    word: "aur",
    translations: { nl: "nog (meer)" },
    notes: "Versterkt de vergrotende trap samen met of in plaats van 'se'.",
    tags: ["grammar", "comparison", "book-p60"],
  },
  {
    id: "gram-jada",
    word: "jādā",
    translations: { nl: "meer" },
    notes: "Versterkt de vergrotende trap; sab se jādā vormt een sterke overtreffende trap.",
    tags: ["grammar", "comparison", "book-p60"],
  },
  {
    id: "gram-sabse",
    word: "sab se",
    translations: { nl: "de meest-" },
    notes: "Vormt de overtreffende trap: sab se dhanī (de rijkste).",
    tags: ["grammar", "comparison", "book-p60"],
  },
];
