import type { strings } from "./strings.nl";

// Shared shape for UI string tables, split out from `t.ts` into its own
// module so both `uiStringsStore.ts` (which needs the type but must not
// import `t.ts`, to avoid a runtime import cycle: t.ts -> uiStringsStore.ts
// -> t.ts) and the repositories under `src/services/uiStrings/` can import
// it without depending on `t.ts` itself.
//
// `GET /ui-strings?lang=` (see docs/api-contract.md) mirrors this shape
// exactly — the bundled `strings.nl.ts` table is authoritative for the type,
// and the backend's `en`/`nl` JSON tables are expected to match its keys.
export type Strings = typeof strings;
