// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { HttpUiStringsRepository } from "./HttpUiStringsRepository";
import { strings } from "@/i18n/strings.nl";

const BASE_URL = "https://api.example.com";

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

describe("HttpUiStringsRepository.getUiStrings", () => {
  it("requests strings scoped to the given UI language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, strings)));
    const repo = new HttpUiStringsRepository(BASE_URL);
    const result = await repo.getUiStrings("nl");
    expect(result).toEqual(strings);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/ui-strings?lang=nl`);
  });

  it("scopes the request to a different UI language", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(200, strings)));
    const repo = new HttpUiStringsRepository(BASE_URL);
    await repo.getUiStrings("en");
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/ui-strings?lang=en`);
  });

  it("throws an error with the status code on a non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeResponse(404, null, "Not Found")));
    const repo = new HttpUiStringsRepository(BASE_URL);
    await expect(repo.getUiStrings("en")).rejects.toThrow("HTTP 404: Not Found");
  });
});
