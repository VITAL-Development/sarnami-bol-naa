import type { VocabItem } from "@/domain/types";

/** Verified against Sarnami Byäkaran (Marhé, 1985), p.16, p.40, p.97-98, p.83. */
export const grammarVocab: VocabItem[] = [
  {
    id: "gram-hai",
    sarnami: "hai",
    dutch: "is / ben / bent (koppelwerkwoord 'zijn')",
    notes: "Volledige vervoeging o.t.t.: ham hai, tū hai, ī/ū hai, ham log haim, tū log hai, āp ho, ī/ū sab haim.",
    tags: ["grammar", "verb", "book-p97"],
  },
  {
    id: "gram-na",
    sarnami: "nā",
    dutch: "niet",
    tags: ["grammar", "negation", "book-p16"],
  },
  {
    id: "gram-kaham",
    sarnami: "kahām",
    dutch: "waar",
    tags: ["grammar", "question-word", "book-p53"],
  },
];
