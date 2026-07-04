// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type { ContentBundle } from "@/domain/types";

// Mock the @/services module so we control contentRepository
vi.mock("@/services", () => ({
  contentRepository: {
    getContentBundle: vi.fn(),
  },
}));

// Import after mocking so the hook picks up the mock
import { useContent } from "./useContent";
import { contentRepository } from "@/services";
import { LanguageSettingsProvider } from "@/state/LanguageSettingsContext";

const mockGetContentBundle = contentRepository.getContentBundle as ReturnType<typeof vi.fn>;

// Minimal localStorage stub so LanguageSettingsProvider (which useContent
// now reads `learningLanguage` from) can load/save its settings under jsdom.
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
  vocab: [],
  lessonContent: { exampleSentences: [], grammarNotes: [], exerciseContent: {} },
};

beforeEach(() => {
  localStorageMock.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useContent", () => {
  it("starts in loading state with no bundle and no error", () => {
    // Never resolves during this test
    mockGetContentBundle.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useContent(), { wrapper });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.bundle).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("resolves to the bundle and clears loading on success", async () => {
    mockGetContentBundle.mockResolvedValue(mockBundle);
    const { result } = renderHook(() => useContent(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.bundle).toEqual(mockBundle);
    expect(result.current.error).toBeNull();
  });

  it("passes the current learningLanguage from LanguageSettingsContext (default sarnami)", async () => {
    mockGetContentBundle.mockResolvedValue(mockBundle);
    const { result } = renderHook(() => useContent(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetContentBundle).toHaveBeenCalledWith("sarnami");
  });

  it("re-fetches when learningLanguage changes", async () => {
    mockGetContentBundle.mockResolvedValue(mockBundle);
    localStorageMock.setItem(
      "sarnami-language-settings-v1",
      JSON.stringify({ learningLanguage: "sranantongo", uiLanguage: "nl" }),
    );

    const { result } = renderHook(() => useContent(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetContentBundle).toHaveBeenCalledWith("sranantongo");
  });

  it("sets error and clears loading when the fetch rejects", async () => {
    const fetchError = new Error("HTTP 500: Internal Server Error");
    mockGetContentBundle.mockRejectedValue(fetchError);
    const { result } = renderHook(() => useContent(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("HTTP 500: Internal Server Error");
    expect(result.current.bundle).toBeNull();
  });

  it("wraps non-Error rejections in an Error object", async () => {
    mockGetContentBundle.mockRejectedValue("string error");
    const { result } = renderHook(() => useContent(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("string error");
    expect(result.current.bundle).toBeNull();
  });
});
