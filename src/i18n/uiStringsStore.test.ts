import { afterEach, describe, expect, it, vi } from "vitest";
import { strings as nlStrings } from "./strings.nl";

const getUiStrings = vi.fn();

vi.mock("@/services", () => ({
  uiStringsRepository: {
    getUiStrings: (...args: unknown[]) => getUiStrings(...args),
  },
}));

async function importFreshStore() {
  vi.resetModules();
  return import("./uiStringsStore");
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("uiStringsStore", () => {
  it("starts out serving the bundled nl table before anything is fetched", async () => {
    const { getUiStringsSnapshot } = await importFreshStore();
    expect(getUiStringsSnapshot()).toEqual(nlStrings);
  });

  it("fetches via the shared uiStringsRepository, updates the snapshot, and notifies subscribers", async () => {
    const enStrings = { ...nlStrings, appName: "Sarnami Bol Naa (EN)" };
    getUiStrings.mockResolvedValueOnce(enStrings);
    const { ensureUiLanguageLoaded, getUiStringsSnapshot, subscribeUiStrings } =
      await importFreshStore();

    const listener = vi.fn();
    subscribeUiStrings(listener);

    await ensureUiLanguageLoaded("en");

    expect(getUiStrings).toHaveBeenCalledWith("en");
    expect(getUiStringsSnapshot()).toEqual(enStrings);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not re-fetch once a language is already loaded", async () => {
    getUiStrings.mockResolvedValue(nlStrings);
    const { ensureUiLanguageLoaded } = await importFreshStore();

    await ensureUiLanguageLoaded("nl");
    await ensureUiLanguageLoaded("nl");

    expect(getUiStrings).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent in-flight requests for the same load", async () => {
    let resolveFetch: (value: typeof nlStrings) => void = () => {};
    getUiStrings.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    const { ensureUiLanguageLoaded } = await importFreshStore();

    const first = ensureUiLanguageLoaded("en");
    const second = ensureUiLanguageLoaded("en");
    resolveFetch(nlStrings);
    await Promise.all([first, second]);

    expect(getUiStrings).toHaveBeenCalledTimes(1);
  });

  it("keeps serving the previous table and does not throw when the fetch fails", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    getUiStrings.mockRejectedValueOnce(new Error("network down"));
    const { ensureUiLanguageLoaded, getUiStringsSnapshot } = await importFreshStore();

    await expect(ensureUiLanguageLoaded("en")).resolves.toBeUndefined();
    expect(getUiStringsSnapshot()).toEqual(nlStrings);
    expect(warnSpy).toHaveBeenCalled();
  });
});
