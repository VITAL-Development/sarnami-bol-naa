import type { VocabItem } from "@/domain/types";

// TODO(remove once /server's /content endpoint reads from server/content/
// directly instead of bundling ../src/data): the source of truth for this
// data is now server/content/sarnami/vocab/pronouns.json (issue #30). This
// file stays in place until server.mjs's content-serving logic is rewired
// (issue #33) and the frontend's LocalJsonContentRepository offline fallback
// is reconsidered.
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
