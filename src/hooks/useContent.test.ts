// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
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

const mockGetContentBundle = contentRepository.getContentBundle as ReturnType<typeof vi.fn>;

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
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("useContent", () => {
  it("starts in loading state with no bundle and no error", () => {
    // Never resolves during this test
    mockGetContentBundle.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useContent());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.bundle).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("resolves to the bundle and clears loading on success", async () => {
    mockGetContentBundle.mockResolvedValue(mockBundle);
    const { result } = renderHook(() => useContent());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.bundle).toEqual(mockBundle);
    expect(result.current.error).toBeNull();
  });

  it("sets error and clears loading when the fetch rejects", async () => {
    const fetchError = new Error("HTTP 500: Internal Server Error");
    mockGetContentBundle.mockRejectedValue(fetchError);
    const { result } = renderHook(() => useContent());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("HTTP 500: Internal Server Error");
    expect(result.current.bundle).toBeNull();
  });

  it("wraps non-Error rejections in an Error object", async () => {
    mockGetContentBundle.mockRejectedValue("string error");
    const { result } = renderHook(() => useContent());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("string error");
    expect(result.current.bundle).toBeNull();
  });
});
