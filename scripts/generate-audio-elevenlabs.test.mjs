// Unit tests for scripts/generate-audio-elevenlabs.mjs -- issue #300 (PR-B).
//
// Scope is deliberately narrow: this only checks that failure paths are
// handled the way D7 requires -- loudly, via a thrown Error carrying an
// actionable message, and (at the top level) a console.error + non-zero
// process.exitCode. It does NOT cover ASR/audio-quality verification (out of
// scope, see #300 Step 3) or a real network/ElevenLabs call (fetch is
// stubbed throughout).
//
// This script is a headless CLI/CI tool, not part of the rarelang-pwa
// frontend, so there is no modal to surface errors in -- console + exit code
// is the full error-reporting surface here, unlike a UI component that would
// also need a user-facing error state.

import { test } from "node:test";
import assert from "node:assert/strict";

import { parseArgs, fetchOne, reportFatalError } from "./generate-audio-elevenlabs.mjs";

// --- parseArgs ---------------------------------------------------------

test("parseArgs applies the default delay when --delay-ms is omitted", () => {
  const args = parseArgs(["--server", "http://rarelang-server:8787"]);
  assert.equal(args.server, "http://rarelang-server:8787");
  assert.equal(args.out, null);
  assert.equal(args.ids, null);
  assert.equal(args.delayMs, 300);
});

test("parseArgs parses --out, --ids (comma-split + trimmed), and --delay-ms", () => {
  const args = parseArgs([
    "--server",
    "http://rarelang-server:8787",
    "--out",
    "scratch/x",
    "--ids",
    "about-girmit, adj-sojha ,int-oho",
    "--delay-ms",
    "50",
  ]);
  assert.equal(args.out, "scratch/x");
  assert.deepEqual(args.ids, ["about-girmit", "adj-sojha", "int-oho"]);
  assert.equal(args.delayMs, 50);
});

test("parseArgs throws (loudly, not silently ignoring) on an unrecognized flag", () => {
  assert.throws(
    () => parseArgs(["--server", "http://x", "--bogus", "y"]),
    /Unrecognized argument: --bogus/,
  );
});

// --- fetchOne: fetch stubbing helper -------------------------------------

async function withStubbedFetch(response, run) {
  const original = globalThis.fetch;
  globalThis.fetch = async () => response;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

function fakeResponse({ status = 200, cacheHeader = "MISS-ELEVENLABS", contentType = "audio/mpeg", body = "x" }) {
  return {
    status,
    headers: {
      get: (name) => {
        const lower = name.toLowerCase();
        if (lower === "x-tts-cache") return cacheHeader;
        if (lower === "content-type") return contentType;
        return null;
      },
    },
    arrayBuffer: async () => new TextEncoder().encode(body).buffer,
  };
}

// --- fetchOne: success ---------------------------------------------------

test("fetchOne resolves with the cache header and body bytes on a valid ElevenLabs response", async () => {
  await withStubbedFetch(fakeResponse({ cacheHeader: "HIT-ELEVENLABS", body: "mp3-bytes" }), async () => {
    const { cacheHeader, bytes } = await fetchOne("http://rarelang-server:8787", "ghar");
    assert.equal(cacheHeader, "HIT-ELEVENLABS");
    assert.equal(bytes.toString(), "mp3-bytes");
  });
});

// --- fetchOne: each failure mode must throw with an actionable message ---

test("fetchOne throws on a non-200 response, naming the status, word, and url", async () => {
  await withStubbedFetch(fakeResponse({ status: 500 }), async () => {
    await assert.rejects(
      () => fetchOne("http://rarelang-server:8787", "ghar"),
      /HTTP 500 for "ghar" \(http:\/\/rarelang-server:8787\/audio\/tts\?lang=sarnami&text=ghar\)/,
    );
  });
});

test("fetchOne throws on an unexpected Content-Type", async () => {
  await withStubbedFetch(fakeResponse({ contentType: "text/plain" }), async () => {
    await assert.rejects(() => fetchOne("http://rarelang-server:8787", "ghar"), /Unexpected Content-Type "text\/plain"/);
  });
});

test("fetchOne throws on a zero-length body", async () => {
  await withStubbedFetch(fakeResponse({ body: "" }), async () => {
    await assert.rejects(() => fetchOne("http://rarelang-server:8787", "ghar"), /Zero-length body for "ghar"/);
  });
});

test("fetchOne throws when X-Tts-Cache indicates the Piper fallback answered instead of ElevenLabs (D7)", async () => {
  await withStubbedFetch(fakeResponse({ cacheHeader: "MISS" }), async () => {
    await assert.rejects(() => fetchOne("http://rarelang-server:8787", "ghar"), (err) => {
      assert.match(err.message, /X-Tts-Cache "MISS" does not contain ELEVENLABS for "ghar"/);
      // The message must be actionable, not just "it failed" -- it should
      // point at the three gates #300 documents (settings, key, key scope).
      assert.match(err.message, /elevenLabsVoiceId/);
      assert.match(err.message, /ELEVENLABS_API_KEY/);
      assert.match(err.message, /text_to_speech/);
      return true;
    });
  });
});

test("fetchOne treats a present-but-empty X-Tts-Cache header the same as a Piper fallback", async () => {
  await withStubbedFetch(fakeResponse({ cacheHeader: "" }), async () => {
    await assert.rejects(() => fetchOne("http://rarelang-server:8787", "ghar"), /does not contain ELEVENLABS/);
  });
});

// --- reportFatalError: the top-level console.error + exit-code contract --

test("reportFatalError logs an ABORTED message to console.error and sets a non-zero exit code", () => {
  const originalError = console.error;
  const originalExitCode = process.exitCode;
  const logged = [];
  console.error = (...args) => logged.push(args.join(" "));
  process.exitCode = undefined;
  try {
    reportFatalError(new Error("X-Tts-Cache \"MISS\" does not contain ELEVENLABS for \"ghar\""));
    assert.equal(logged.length, 1);
    assert.match(logged[0], /^\nABORTED: /);
    assert.match(logged[0], /does not contain ELEVENLABS for "ghar"/);
    assert.equal(process.exitCode, 1);
  } finally {
    console.error = originalError;
    process.exitCode = originalExitCode;
  }
});
