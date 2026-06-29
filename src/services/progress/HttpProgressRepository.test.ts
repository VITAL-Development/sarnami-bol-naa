// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { HttpProgressRepository } from "./HttpProgressRepository";
import type { LessonResult, UserProgress } from "@/domain/types";

const BASE_URL = "https://api.example.com";

const mockProgress: UserProgress = {
  xp: 100,
  streak: { count: 3, lastCompletedDate: "2026-06-28" },
  hearts: { current: 5, max: 5 },
  completedLessons: {},
  leitnerBoxes: {},
  earnedBadges: [],
};

const mockLessonResult: LessonResult = {
  lessonId: "l01",
  mistakeCount: 1,
  passed: true,
  vocabIntroduced: ["v01"],
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

describe("HttpProgressRepository.getProgress", () => {
  it("returns parsed progress on a 200 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockProgress)));
    const repo = new HttpProgressRepository(BASE_URL);
    const result = await repo.getProgress();
    expect(result).toEqual(mockProgress);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/progress`);
  });

  it("throws on 404 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpProgressRepository(BASE_URL);
    await expect(repo.getProgress()).rejects.toThrow("HTTP 404: Not Found");
  });

  it("throws on 500 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeResponse(500, null, "Internal Server Error")),
    );
    const repo = new HttpProgressRepository(BASE_URL);
    await expect(repo.getProgress()).rejects.toThrow("HTTP 500: Internal Server Error");
  });
});

describe("HttpProgressRepository.saveProgress", () => {
  it("resolves without error on 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, null)));
    const repo = new HttpProgressRepository(BASE_URL);
    await expect(repo.saveProgress(mockProgress)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/progress`,
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("throws on 500 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeResponse(500, null, "Internal Server Error")),
    );
    const repo = new HttpProgressRepository(BASE_URL);
    await expect(repo.saveProgress(mockProgress)).rejects.toThrow(
      "HTTP 500: Internal Server Error",
    );
  });
});

describe("HttpProgressRepository.recordLessonCompletion", () => {
  it("returns updated progress on success", async () => {
    const updated: UserProgress = { ...mockProgress, xp: 110 };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, updated)));
    const repo = new HttpProgressRepository(BASE_URL);
    const result = await repo.recordLessonCompletion(mockLessonResult);
    expect(result).toEqual(updated);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/progress/lesson-completion`,
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("throws on 404 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpProgressRepository(BASE_URL);
    await expect(repo.recordLessonCompletion(mockLessonResult)).rejects.toThrow(
      "HTTP 404: Not Found",
    );
  });
});

describe("HttpProgressRepository.recordReviewResult", () => {
  it("returns updated progress on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, mockProgress)));
    const repo = new HttpProgressRepository(BASE_URL);
    const result = await repo.recordReviewResult("v01", true);
    expect(result).toEqual(mockProgress);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/progress/review-result`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ vocabId: "v01", correct: true }),
      }),
    );
  });

  it("throws on 500 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeResponse(500, null, "Internal Server Error")),
    );
    const repo = new HttpProgressRepository(BASE_URL);
    await expect(repo.recordReviewResult("v01", false)).rejects.toThrow(
      "HTTP 500: Internal Server Error",
    );
  });
});
