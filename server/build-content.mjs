// Bundles the frontend's TS content/domain logic (src/data, src/domain) into
// a single ESM module the plain Node `http` server can `import()`.
//
// Why esbuild instead of just requiring the .ts files: this server is
// dependency-free at *runtime* except esbuild itself, and Node can't import
// .ts files with path aliases (`@/...`) directly. esbuild both strips types
// and resolves the `@` -> `src` alias (see resolveAliasPlugin below), the
// same alias configured in the frontend's vite.config.ts.
//
// This is a transitional trick (see README.md's "Transitional state"
// section) — once content ownership moves fully into `/server` (issues
// #30/#31/#32), this file and content-entry.ts go away and content is
// authored/read directly inside `/server`.
import { fileURLToPath } from "node:url";
import path from "node:path";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const frontendSrc = path.join(repoRoot, "src");
const entryPoint = path.join(__dirname, "content-entry.ts");
const outfile = path.join(__dirname, "dist", "content-bundle.mjs");

/** Resolves the frontend's `@/foo` alias (see vite.config.ts) to `<repoRoot>/src/foo`. */
const resolveAliasPlugin = {
  name: "resolve-frontend-alias",
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => ({
      path: path.join(frontendSrc, args.path.slice(2)),
    }));
  },
};

let cachedModulePromise = null;

/**
 * Bundles content-entry.ts (which re-exports the frontend's content bundle
 * and gamification/Leitner/badge functions) and returns the loaded module.
 * Cached after the first call — the bundle is rebuilt only on server
 * restart, not per-request.
 */
export function loadContentModule() {
  if (!cachedModulePromise) {
    cachedModulePromise = build().then((builtOutfile) => import(builtOutfile));
  }
  return cachedModulePromise;
}

async function build() {
  await esbuild.build({
    entryPoints: [entryPoint],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node18",
    plugins: [resolveAliasPlugin],
    logLevel: "warning",
  });
  // esbuild's ESM output needs a cache-busting URL per real rebuild so a
  // `--watch`'d dev server picks up changes; fine to import the plain path
  // for a single process lifetime.
  return `${outfile}?t=${Date.now()}`;
}
