import type { VocabItem } from "@/domain/types";

// This is the frontend's own local/offline fallback copy, used by
// `LocalJsonContentRepository` when `VITE_API_BASE_URL` isn't set (see
// `src/services/index.ts`) — not a duplicate kept for backend-bundling
// purposes. `/server` now reads its own authored copy directly from
// `server/content/sarnami/vocab/adjectives.json` (issues #30/#33) instead of
// bundling this file. Keep the two in sync by hand if this content changes.
/** Verified against Sarnami Byākaran (Marhé, 1985), p.55-57. See docs/byakaran/adjective-verified.md. */
export const adjectivesVocab: VocabItem[] = [
  {
    id: "adj-chota",
    word: "choṭā",
    translations: { nl: "klein" },
    notes: "Lange vorm: chŏṭkā. Langere vorm: chŏṭkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-lal",
    word: "lāl",
    translations: { nl: "rood" },
    notes: "Lange vorm: lalkā. Langere vorm: lalkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-sojha",
    word: "sojhā",
    translations: { nl: "recht" },
    notes: "Lange vorm: sŏjhkā. Langere vorm: sŏjhkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-patar",
    word: "pātar",
    translations: { nl: "dun" },
    notes: "Lange vorm: patarkā. Langere vorm: patarkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-mitha",
    word: "mīṭhā",
    translations: { nl: "lekker" },
    notes: "Lange vorm: miṭhkā. Langere vorm: miṭhkāvā.",
    tags: ["adjective", "book-p55"],
  },
  {
    id: "adj-barka",
    word: "barkā",
    translations: { nl: "groot" },
    notes: "Komt alleen voor in de lange (barkā) en langere (barkāvā) vorm, geen kale stam.",
    tags: ["adjective", "book-p57"],
  },
  {
    id: "adj-lamma",
    word: "lammā",
    translations: { nl: "lang" },
    notes: "Lange vorm: lamkā. Langere vorm: lamkāvā.",
    tags: ["adjective", "book-p56"],
  },
  {
    id: "adj-barhimya",
    word: "barhimyā",
    translations: { nl: "goed" },
    notes: "Langere vorm: barhimkvā.",
    tags: ["adjective", "book-p56"],
  },
  {
    id: "adj-karikka",
    word: "karikkā",
    translations: { nl: "zwart" },
    notes: "Vrouwelijke vorm bij dieren/mensen: karikkī (koe), karikkanī (geit).",
    tags: ["adjective", "book-p57"],
  },
];
