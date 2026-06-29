// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { HttpContentRepository } from "./HttpContentRepository";
import type { ContentBundle } from "@/domain/types";

const BASE_URL = "https://api.example.com";

const mockBundle: ContentBundle = {
  units: [
    {
      id: "u01",
      title: "Unit 1",
      description: "First unit",
      order: 1,
      lessons: [],
    },
  ],
  vocab: [
    {
      id: "v01",
      sarnami: "naan",
      dutch: "nee",
    },
  ],
};

function makeResponse(status: number, body: unknown, statusText = ""): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HttpContentRepository.getContentBundle", () => {
  it("returns parsed JSON on a 200 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getContentBundle();
    expect(result).toEqual(mockBundle);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/content`);
  });

  it("throws an error with the status code on a 404 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpContentRepository(BASE_URL);
    await expect(repo.getContentBundle()).rejects.toThrow("HTTP 404: Not Found");
  });

  it("throws an error with the status code on a 500 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeResponse(500, null, "Internal Server Error")),
    );
    const repo = new HttpContentRepository(BASE_URL);
    await expect(repo.getContentBundle()).rejects.toThrow("HTTP 500: Internal Server Error");
  });
});

describe("HttpContentRepository.getUnit", () => {
  it("returns parsed unit on success", async () => {
    const unit = mockBundle.units[0];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, unit)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getUnit("u01");
    expect(result).toEqual(unit);
  });

  it("returns undefined on 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getUnit("missing");
    expect(result).toBeUndefined();
  });
});

describe("HttpContentRepository.getLesson", () => {
  it("returns parsed lesson on success", async () => {
    const lesson = mockBundle.units[0].lessons[0] ?? {
      id: "l01",
      unitId: "u01",
      order: 1,
      title: "L1",
      description: "",
      newVocab: [],
      exercises: [],
      xpReward: 10,
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, lesson)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getLesson("l01");
    expect(result).toEqual(lesson);
  });

  it("returns undefined on 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getLesson("missing");
    expect(result).toBeUndefined();
  });
});

describe("HttpContentRepository.getVocabItem", () => {
  it("returns parsed vocab item on success", async () => {
    const vocab = mockBundle.vocab[0];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, vocab)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getVocabItem("v01");
    expect(result).toEqual(vocab);
  });

  it("returns undefined on 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getVocabItem("missing");
    expect(result).toBeUndefined();
  });
});
