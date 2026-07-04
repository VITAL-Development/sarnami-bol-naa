// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type { LanguageSettings } from "@/domain/types";

// Mock the @/services module so we control contentRepository, same pattern
// as useContent.test.tsx.
vi.mock("@/services", () => ({
  contentRepository: {
    getLanguageSettings: vi.fn(),
  },
}));

import { useBranding } from "./useBranding";
import { contentRepository } from "@/services";
import { LanguageSettingsProvider } from "@/state/LanguageSettingsContext";

const mockGetLanguageSettings = contentRepository.getLanguageSettings as ReturnType<typeof vi.fn>;

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k]);
  },
};
vi.stubGlobal("localStorage", localStorageMock);

function wrapper({ children }: { children: ReactNode }) {
  return <LanguageSettingsProvider>{children}</LanguageSettingsProvider>;
}

const settingsWithBranding: LanguageSettings = {
  code: "sarnami",
  displayName: "Sarnami Hindoestani",
  scriptDirection: "ltr",
  romanization: { scheme: "IAST-derived", diacritics: [], notes: "" },
  alphabet: { vowels: [], consonants: [] },
  audio: { baseUrl: "/audio/sarnami/", format: "mp3", voice: "single-speaker-tts" },
  branding: {
    appName: "Sarnami Bol Naa",
    colors: {
      primary: { "500": "61 142 67", "600": "55 126 63" },
      danger: { "600": "180 10 45" },
      accent: { "400": "236 200 29" },
      background: { "50": "253 246 236" },
    },
    icons: {
      favicon: "/brand/favicon.svg",
      icon192: "/brand/icon-192.png",
      icon512: "/brand/icon-512.png",
      iconMaskable512: "/brand/icon-maskable-512.png",
    },
  },
};

beforeEach(() => {
  localStorageMock.clear();
  document.title = "";
  document.documentElement.style.cssText = "";
  document.head.innerHTML = '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />';
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useBranding", () => {
  it("writes branding colors to document.documentElement as CSS custom properties", async () => {
    mockGetLanguageSettings.mockResolvedValue(settingsWithBranding);
    renderHook(() => useBranding(), { wrapper });

    await waitFor(() =>
      expect(document.documentElement.style.getPropertyValue("--color-forest-500")).toBe(
        "61 142 67",
      ),
    );
    expect(document.documentElement.style.getPropertyValue("--color-forest-600")).toBe(
      "55 126 63",
    );
    expect(document.documentElement.style.getPropertyValue("--color-flame-600")).toBe(
      "180 10 45",
    );
    expect(document.documentElement.style.getPropertyValue("--color-gold-400")).toBe(
      "236 200 29",
    );
    expect(document.documentElement.style.getPropertyValue("--color-cream-50")).toBe(
      "253 246 236",
    );
  });

  it("sets document.title to branding.appName", async () => {
    mockGetLanguageSettings.mockResolvedValue(settingsWithBranding);
    renderHook(() => useBranding(), { wrapper });

    await waitFor(() => expect(document.title).toBe("Sarnami Bol Naa"));
  });

  it("swaps the favicon link href when branding.icons.favicon is present", async () => {
    mockGetLanguageSettings.mockResolvedValue(settingsWithBranding);
    renderHook(() => useBranding(), { wrapper });

    await waitFor(() => {
      const link = document.querySelector('link[rel="icon"]');
      expect(link?.getAttribute("href")).toBe("/brand/favicon.svg");
    });
  });

  it("leaves the favicon untouched when branding.icons is undefined", async () => {
    mockGetLanguageSettings.mockResolvedValue({
      ...settingsWithBranding,
      icons: undefined,
      branding: { ...settingsWithBranding.branding!, icons: undefined },
    });
    renderHook(() => useBranding(), { wrapper });

    await waitFor(() => expect(mockGetLanguageSettings).toHaveBeenCalled());
    const link = document.querySelector('link[rel="icon"]');
    expect(link?.getAttribute("href")).toBe("/favicon.svg");
  });

  it("does nothing when branding is absent from the fetched settings", async () => {
    mockGetLanguageSettings.mockResolvedValue({
      ...settingsWithBranding,
      branding: undefined,
    });
    renderHook(() => useBranding(), { wrapper });

    await waitFor(() => expect(mockGetLanguageSettings).toHaveBeenCalled());
    expect(document.title).toBe("");
    expect(document.documentElement.style.getPropertyValue("--color-forest-500")).toBe("");
  });

  it("does not throw when the fetch rejects", async () => {
    mockGetLanguageSettings.mockRejectedValue(new Error("network error"));
    renderHook(() => useBranding(), { wrapper });

    await waitFor(() => expect(mockGetLanguageSettings).toHaveBeenCalled());
    // No assertion beyond "didn't throw" — this is a best-effort cosmetic
    // fetch with no user-facing error state (see useBranding.ts).
  });
});
