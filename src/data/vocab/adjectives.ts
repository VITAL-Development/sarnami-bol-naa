import type { VocabItem } from "@/domain/types";

// TODO(remove once /server's /content endpoint reads from server/content/
// directly instead of bundling ../src/data): the source of truth for this
// data is now server/content/sarnami/vocab/adjectives.json (issue #30). This
// file stays in place until server.mjs's content-serving logic is rewired
// (issue #33) and the frontend's LocalJsonContentRepository offline fallback
// is reconsidered.
/** Verified against Sarnami Byākaran (Marhé, 1985), p.55-57. See docs/byakaran/adjective-verified.md. */
export const adjectivesVocab: VocabItem[] = [
  {
    id: "adj-chota",
    sarnami: "choṭā",
    translations: { nl: "klein" },
    notes: "Lange vorm: chŏṭkā. Langere vorm: chŏṭkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-lal",
    sarnami: "lāl",
    translations: { nl: "rood" },
    notes: "Lange vorm: lalkā. Langere vorm: lalkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-sojha",
    sarnami: "sojhā",
    translations: { nl: "recht" },
    notes: "Lange vorm: sŏjhkā. Langere vorm: sŏjhkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-patar",
    sarnami: "pātar",
    translations: { nl: "dun" },
    notes: "Lange vorm: patarkā. Langere vorm: patarkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-mitha",
    sarnami: "mīṭhā",
    translations: { nl: "lekker" },
    notes: "Lange vorm: miṭhkā. Langere vorm: miṭhkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-barka",
    sarnami: "barkā",
    translations: { nl: "groot" },
    notes: "Komt alleen voor in de lange (barkā) en langere (barkāvā) vorm, geen kale stam.",
    tags: ["adjective", "book-p57"],
  },
  {
    id: "adj-lamma",
    sarnami: "lammā",
    translations: { nl: "lang" },
    notes: "Lange vorm: lamkā. Langere vorm: lamkāvā.",
    tags: ["adjective", "book-p56"],
  },
  {
    id: "adj-barhimya",
    sarnami: "barhimyā",
    translations: { nl: "goed" },
    notes: "Langere vorm: barhimkvā.",
    tags: ["adjective", "book-p56"],
  },
  {
    id: "adj-karikka",
    sarnami: "karikkā",
    translations: { nl: "zwart" },
    notes: "Vrouwelijke vorm bij dieren/mensen: karikkī (koe), karikkanī (geit).",
    tags: ["adjective", "book-p57"],
  },
];
