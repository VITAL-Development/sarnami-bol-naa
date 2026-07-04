import type { VocabItem } from "@/domain/types";

// This is the frontend's own local/offline fallback copy, used by
// `LocalJsonContentRepository` when `VITE_API_BASE_URL` isn't set (see
// `src/services/index.ts`) — not a duplicate kept for backend-bundling
// purposes. `/server` now reads its own authored copy directly from
// `server/content/sarnami/vocab/pronouns.json` (issues #30/#33) instead of
// bundling this file. Keep the two in sync by hand if this content changes.
/** Verified against Sarnami Byäkaran (Marhé, 1985), p.68-70 and p.97-98. */
export const pronounsVocab: VocabItem[] = [
  {
    id: "pron-ham",
    sarnami: "ham",
    translations: { nl: "ik" },
    tags: ["pronoun", "book-p68"],
  },
  {
    id: "pron-tu",
    sarnami: "tū",
    translations: { nl: "jij (informeel)" },
    tags: ["pronoun", "book-p69"],
  },
  {
    id: "pron-ap",
    sarnami: "āp",
    translations: { nl: "u (beleefdheidsvorm)" },
    tags: ["pronoun", "book-p69"],
  },
  {
    id: "pron-u",
    sarnami: "ū",
    translations: { nl: "hij / zij" },
    notes: "Sarnami kent geen onderscheid in geslacht bij de 3e persoon (boek p.23).",
    tags: ["pronoun", "book-p23"],
  },
  {
    id: "pron-hamlog",
    sarnami: "ham log",
    translations: { nl: "wij" },
    tags: ["pronoun", "book-p68"],
  },
];
