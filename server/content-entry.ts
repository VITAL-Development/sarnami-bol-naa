// Bundling entry point for build-content.mjs.
//
// This is the one place `/server` reaches outside its own nested repo and
// into the frontend's `src/` tree. It exists because content migration
// (issues #30/#31/#32) hasn't happened yet — see README.md's "Transitional
// state" section. Every export here is re-bundled by esbuild into a single
// ESM module the server loads at startup; nothing here is re-implemented,
// only re-exported, per issue #29's instruction not to duplicate
// gamification/Leitner logic.
export { contentBundle } from "../src/data";
export {
  createInitialProgress,
  computeXpReward,
  updateStreak,
  todayDateString,
} from "../src/domain/gamification";
export { createLeitnerCard, reviewLeitnerCard } from "../src/domain/leitner";
export { evaluateBadges } from "../src/data/badges";
