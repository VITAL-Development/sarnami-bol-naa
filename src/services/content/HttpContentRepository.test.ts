// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { HttpContentRepository } from "./HttpContentRepository";
import type { ContentBundle, LanguageSettings } from "@/domain/types";

const BASE_URL = "https://api.example.com";

const mockBundle: ContentBundle = {
  units: [
    {
      id: "u01",
      title: "Unit 1",
      description: "First unit",
      order: 1,
      lessons: [
        {
          id: "l01",
          unitId: "u01",
          order: 1,
          title: "L1",
          description: "",
          newVocab: [],
          exercises: [],
          xpReward: 10,
        },
      ],
    },
  ],
  vocab: [
    {
      id: "v01",
      word: "naan",
      translations: { nl: "nee" },
    },
  ],
  lessonContent: { exampleSentences: [], grammarNotes: [], exerciseContent: {} },
};

const mockSettings: LanguageSettings = {
  code: "sarnami",
  displayName: "Sarnami Hindoestani",
  scriptDirection: "ltr",
  romanization: { scheme: "IAST-derived", diacritics: [], notes: "" },
  alphabet: { vowels: [], consonants: [] },
  audio: { baseUrl: "/audio/sarnami/", format: "mp3", voice: "single-speaker-tts" },
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
  it("requests the bundle scoped to the given learning language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getContentBundle("sarnami");
    expect(result).toEqual(mockBundle);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/content?lang=sarnami`);
  });

  it("scopes the request to a different learning language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    await repo.getContentBundle("sranantongo");
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/content?lang=sranantongo`);
  });

  it("throws an error with the status code on a 404 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpContentRepository(BASE_URL);
    await expect(repo.getContentBundle("sarnami")).rejects.toThrow("HTTP 404: Not Found");
  });

  it("throws an error with the status code on a 500 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeResponse(500, null, "Internal Server Error")),
    );
    const repo = new HttpContentRepository(BASE_URL);
    await expect(repo.getContentBundle("sarnami")).rejects.toThrow(
      "HTTP 500: Internal Server Error",
    );
  });
});

describe("HttpContentRepository.getLanguageSettings", () => {
  it("requests settings scoped to the given learning language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockSettings)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getLanguageSettings("sarnami");
    expect(result).toEqual(mockSettings);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/settings?lang=sarnami`);
  });

  it("throws an error with the status code on a non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpContentRepository(BASE_URL);
    await expect(repo.getLanguageSettings("sranantongo")).rejects.toThrow("HTTP 404: Not Found");
  });
});

describe("HttpContentRepository.getUnit", () => {
  it("fetches the language-scoped bundle and resolves the unit locally", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(200, mockBundle));
    vi.stubGlobal("fetch", fetchMock);
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getUnit("sarnami", "u01");
    expect(result).toEqual(mockBundle.units[0]);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/content?lang=sarnami`);
  });

  it("returns undefined when the unit id isn't in the bundle", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getUnit("sarnami", "missing");
    expect(result).toBeUndefined();
  });
});

describe("HttpContentRepository.getLesson", () => {
  it("fetches the language-scoped bundle and resolves the lesson locally", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getLesson("sarnami", "l01");
    expect(result).toEqual(mockBundle.units[0].lessons[0]);
  });

  it("returns undefined when the lesson id isn't in the bundle", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getLesson("sarnami", "missing");
    expect(result).toBeUndefined();
  });
});

describe("HttpContentRepository.getVocabItem", () => {
  it("fetches the language-scoped bundle and resolves the vocab item locally", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getVocabItem("sarnami", "v01");
    expect(result).toEqual(mockBundle.vocab[0]);
  });

  it("returns undefined when the vocab id isn't in the bundle", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockBundle)));
    const repo = new HttpContentRepository(BASE_URL);
    const result = await repo.getVocabItem("sarnami", "missing");
    expect(result).toBeUndefined();
  });
});
