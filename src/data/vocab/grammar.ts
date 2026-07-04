import type { VocabItem } from "@/domain/types";

/** Verified against Sarnami Byākaran (Marhé, 1985), p.16, p.40, p.53, p.60, p.97-98. */
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
  {
    id: "gram-se",
    sarnami: "se",
    dutch: "dan (bij vergelijking)",
    notes: "Vormt de vergrotende trap: ...se barkā hai (is groter dan...).",
    tags: ["grammar", "comparison", "book-p60"],
  },
  {
    id: "gram-aur-compare",
    sarnami: "aur",
    dutch: "nog (meer)",
    notes: "Versterkt de vergrotende trap samen met of in plaats van 'se'.",
    tags: ["grammar", "comparison", "book-p60"],
  },
  {
    id: "gram-jada",
    sarnami: "jādā",
    dutch: "meer",
    notes: "Versterkt de vergrotende trap; sab se jādā vormt een sterke overtreffende trap.",
    tags: ["grammar", "comparison", "book-p60"],
  },
  {
    id: "gram-sabse",
    sarnami: "sab se",
    dutch: "de meest-",
    notes: "Vormt de overtreffende trap: sab se dhanī (de rijkste).",
    tags: ["grammar", "comparison", "book-p60"],
  },
];
