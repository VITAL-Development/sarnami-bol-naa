import { describe, it, expect, vi, afterEach } from "vitest";
import { LocalUiStringsRepository } from "./LocalUiStringsRepository";
import { strings } from "@/i18n/strings.nl";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LocalUiStringsRepository.getUiStrings", () => {
  it("returns the bundled Dutch strings table for nl", async () => {
    const repo = new LocalUiStringsRepository();
    const result = await repo.getUiStrings("nl");
    expect(result).toEqual(strings);
  });

  it("falls back to the Dutch strings table and warns for a language with no bundled table", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const repo = new LocalUiStringsRepository();
    const result = await repo.getUiStrings("en");
    expect(result).toEqual(strings);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("en"));
  });
});
