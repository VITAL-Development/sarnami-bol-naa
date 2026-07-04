import type { VocabItem } from "@/domain/types";

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
