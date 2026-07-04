import { describe, it, expect, vi, afterEach } from "vitest";
import { LocalJsonContentRepository } from "./LocalJsonContentRepository";
import { contentBundle } from "@/data";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LocalJsonContentRepository.getContentBundle", () => {
  it("returns the bundled sarnami content for the default learning language", async () => {
    const repo = new LocalJsonContentRepository();
    const result = await repo.getContentBundle("sarnami");
    expect(result).toEqual(contentBundle);
  });

  it("falls back to the bundled sarnami content and warns for an unsupported learning language", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const repo = new LocalJsonContentRepository();
    const result = await repo.getContentBundle("sranantongo");
    expect(result).toEqual(contentBundle);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("sranantongo"));
  });
});

describe("LocalJsonContentRepository.getLanguageSettings", () => {
  it("returns per-language settings matching the requested code", async () => {
    const repo = new LocalJsonContentRepository();
    const sarnami = await repo.getLanguageSettings("sarnami");
    const sranantongo = await repo.getLanguageSettings("sranantongo");
    expect(sarnami.code).toBe("sarnami");
    expect(sranantongo.code).toBe("sranantongo");
    expect(sarnami).not.toEqual(sranantongo);
  });
});

describe("LocalJsonContentRepository.getUnit/getLesson/getVocabItem", () => {
  it("resolves a unit, lesson, and vocab item from the bundled content", async () => {
    const repo = new LocalJsonContentRepository();
    const unit = contentBundle.units[0];
    const lesson = unit.lessons[0];
    const vocab = contentBundle.vocab[0];

    await expect(repo.getUnit("sarnami", unit.id)).resolves.toEqual(unit);
    await expect(repo.getLesson("sarnami", lesson.id)).resolves.toEqual(lesson);
    await expect(repo.getVocabItem("sarnami", vocab.id)).resolves.toEqual(vocab);
  });

  it("returns undefined for unknown ids", async () => {
    const repo = new LocalJsonContentRepository();
    await expect(repo.getUnit("sarnami", "missing")).resolves.toBeUndefined();
    await expect(repo.getLesson("sarnami", "missing")).resolves.toBeUndefined();
    await expect(repo.getVocabItem("sarnami", "missing")).resolves.toBeUndefined();
  });
});
