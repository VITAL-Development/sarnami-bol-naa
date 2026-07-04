// Dependency-free JSON-file persistence for the single-user progress store
// (issue #69). Kept in its own module (rather than inline in server.mjs) so
// server.test.mjs can exercise load/save directly against a scratch
// directory without spinning up the HTTP server, and so a "simulated
// restart" can be expressed as just calling `loadProgress` again against the
// same file, rather than actually restarting the Node process.
//
// Design: write the *entire* progress object to disk on every mutation
// (PUT /progress, POST /progress/lesson-completion, POST
// /progress/review-result). This is simplest to reason about for a
// documented single-user/no-auth prototype (docs/api-contract.md) — no
// migrations, no partial updates, no query language. Durability: writes go
// to a temp file in the same directory, then `rename()` over the real path,
// which is atomic on POSIX filesystems — a crash mid-write leaves the old
// file intact rather than a half-written/corrupt one. See README.md for the
// guarantees this does and doesn't provide.
import { mkdir, readFile, rename, writeFile, unlink } from "node:fs/promises";
import { dirname } from "node:path";

const DEFAULT_PROGRESS_FILE = new URL("./data/progress.json", import.meta.url).pathname;

/**
 * Loads persisted progress from disk, if present. Returns `undefined` if the
 * file doesn't exist (fresh install) or fails to parse (corrupt file) — the
 * caller is expected to fall back to `createInitialProgress()` in that case,
 * same as the pre-#69 in-memory-only default.
 */
export async function loadProgress(filePath = DEFAULT_PROGRESS_FILE) {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return undefined;
    // Corrupt/unreadable file: don't crash startup over stale/bad state —
    // log and fall back to the default, same as "no file yet".
    console.error(`progress-store: failed to read ${filePath}, starting fresh:`, err);
    return undefined;
  }
}

/**
 * Persists `progress` to disk, creating the containing directory if it
 * doesn't exist yet (e.g. first run). Writes to a sibling temp file and
 * renames it into place so a crash mid-write can't leave a half-written
 * `progress.json` behind.
 */
export async function saveProgress(progress, filePath = DEFAULT_PROGRESS_FILE) {
  await mkdir(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmpPath, JSON.stringify(progress), "utf-8");
  try {
    await rename(tmpPath, filePath);
  } catch (err) {
    await unlink(tmpPath).catch(() => {});
    throw err;
  }
}

export { DEFAULT_PROGRESS_FILE };
