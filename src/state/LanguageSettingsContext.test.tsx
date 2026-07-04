import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { LanguageSettingsProvider, useLanguageSettings } from "./LanguageSettingsContext";

// Minimal localStorage stub — no DOM storage required for pure logic tests
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

describe("LanguageSettingsContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("throws when used outside a LanguageSettingsProvider", () => {
    expect(() => renderHook(() => useLanguageSettings())).toThrow(
      "useLanguageSettings must be used within a LanguageSettingsProvider",
    );
  });

  it("defaults to sarnami/nl matching current app behaviour", () => {
    const { result } = renderHook(() => useLanguageSettings(), { wrapper });
    expect(result.current.learningLanguage).toBe("sarnami");
    expect(result.current.uiLanguage).toBe("nl");
  });

  it("persists learningLanguage and reads it back after a simulated remount", () => {
    const { result, unmount } = renderHook(() => useLanguageSettings(), { wrapper });

    act(() => {
      result.current.setLearningLanguage("sranantongo");
    });
    expect(result.current.learningLanguage).toBe("sranantongo");
    expect(JSON.parse(store["sarnami-language-settings-v1"]).learningLanguage).toBe("sranantongo");

    unmount();

    const { result: remounted } = renderHook(() => useLanguageSettings(), { wrapper });
    expect(remounted.current.learningLanguage).toBe("sranantongo");
    expect(remounted.current.uiLanguage).toBe("nl");
  });

  it("persists uiLanguage and reads it back after a simulated remount", () => {
    const { result, unmount } = renderHook(() => useLanguageSettings(), { wrapper });

    act(() => {
      result.current.setUiLanguage("en");
    });
    expect(result.current.uiLanguage).toBe("en");

    unmount();

    const { result: remounted } = renderHook(() => useLanguageSettings(), { wrapper });
    expect(remounted.current.uiLanguage).toBe("en");
    expect(remounted.current.learningLanguage).toBe("sarnami");
  });

  it("falls back to defaults if stored JSON is corrupt", () => {
    store["sarnami-language-settings-v1"] = "{{not-json}}";
    const { result } = renderHook(() => useLanguageSettings(), { wrapper });
    expect(result.current.learningLanguage).toBe("sarnami");
    expect(result.current.uiLanguage).toBe("nl");
  });
});
