import type { VocabItem } from "@/domain/types";

/** Verified against Sarnami Byäkaran (Marhé, 1985), p.68-70 and p.97-98. */
export const pronounsVocab: VocabItem[] = [
  {
    id: "pron-ham",
    sarnami: "ham",
    dutch: "ik",
    tags: ["pronoun", "book-p68"],
  },
  {
    id: "pron-tu",
    sarnami: "tū",
    dutch: "jij (informeel)",
    tags: ["pronoun", "book-p69"],
  },
  {
    id: "pron-ap",
    sarnami: "āp",
    dutch: "u (beleefdheidsvorm)",
    tags: ["pronoun", "book-p69"],
  },
  {
    id: "pron-u",
    sarnami: "ū",
    dutch: "hij / zij",
    notes: "Sarnami kent geen onderscheid in geslacht bij de 3e persoon (boek p.23).",
    tags: ["pronoun", "book-p23"],
  },
  {
    id: "pron-hamlog",
    sarnami: "ham log",
    dutch: "wij",
    tags: ["pronoun", "book-p68"],
  },
];
