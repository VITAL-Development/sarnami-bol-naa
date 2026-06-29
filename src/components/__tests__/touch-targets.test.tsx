/**
 * Touch-target size tests — verifies that interactive elements carry the
 * Tailwind classes that enforce a ≥44px minimum tap target, per WCAG 2.5.5
 * and iOS/Android HIG guidelines.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AppShell } from "@/components/layout/AppShell";
import { SkillNode } from "@/components/path/SkillNode";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { WordBank } from "@/components/exercises/WordBank";
import { Matching } from "@/components/exercises/Matching";
import { Flashcard } from "@/components/exercises/Flashcard";
import type { VocabItem } from "@/domain/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function hasMinTouchTarget(el: HTMLElement) {
  const cls = el.className;
  return cls.includes("min-h-[44px]") || cls.includes("h-11") || cls.includes("h-12");
}

function hasActiveState(el: HTMLElement) {
  return el.className.includes("active:");
}

const VOCAB_MAP = new Map<string, VocabItem>([
  ["v1", { id: "v1", sarnami: "aap", dutch: "aap" }],
]);

// ─── Button ─────────────────────────────────────────────────────────────────

describe("Button – touch friendliness", () => {
  it("has min-h-[44px] for an adequate tap target", () => {
    render(<Button>Tap me</Button>);
    const btn = screen.getByRole("button", { name: "Tap me" });
    expect(hasMinTouchTarget(btn)).toBe(true);
  });

  it("has an active: state for touch feedback (primary variant)", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole("button", { name: "Primary" });
    expect(hasActiveState(btn)).toBe(true);
  });

  it("has an active: state for touch feedback (secondary variant)", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button", { name: "Secondary" });
    expect(hasActiveState(btn)).toBe(true);
  });

  it("has an active: state for touch feedback (ghost variant)", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button", { name: "Ghost" });
    expect(hasActiveState(btn)).toBe(true);
  });

  it("preserves extra className passed as prop", () => {
    render(<Button className="extra-class">OK</Button>);
    const btn = screen.getByRole("button", { name: "OK" });
    expect(btn.className).toContain("extra-class");
  });
});

// ─── AppShell nav items ──────────────────────────────────────────────────────

describe("AppShell nav items – touch friendliness", () => {
  it("nav links have min-h-[44px] tap target", () => {
    render(
      <MemoryRouter>
        <AppShell>
          <div />
        </AppShell>
      </MemoryRouter>,
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach((link) => {
      expect(hasMinTouchTarget(link as HTMLElement)).toBe(true);
    });
  });

  it("nav links have active: state for touch feedback", () => {
    render(
      <MemoryRouter>
        <AppShell>
          <div />
        </AppShell>
      </MemoryRouter>,
    );
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(hasActiveState(link as HTMLElement)).toBe(true);
    });
  });
});

// ─── SkillNode ───────────────────────────────────────────────────────────────

describe("SkillNode – touch friendliness", () => {
  it("unlocked node has min-h-[44px] on its content area", () => {
    render(
      <MemoryRouter>
        <SkillNode title="Les 1" order={1} locked={false} completed={false} lessonId="l1" />
      </MemoryRouter>,
    );
    // The inner content div carries the class
    const contentDiv = document.querySelector(".min-h-\\[44px\\]") as HTMLElement | null;
    expect(contentDiv).not.toBeNull();
  });

  it("unlocked node has active: state for touch feedback", () => {
    render(
      <MemoryRouter>
        <SkillNode title="Les 1" order={1} locked={false} completed={false} lessonId="l1" />
      </MemoryRouter>,
    );
    const contentDiv = document.querySelector(".min-h-\\[44px\\]") as HTMLElement | null;
    expect(contentDiv).not.toBeNull();
    expect(hasActiveState(contentDiv!)).toBe(true);
  });
});

// ─── MultipleChoice ──────────────────────────────────────────────────────────

describe("MultipleChoice – touch friendliness", () => {
  const exercise = {
    id: "mc1",
    kind: "multiple-choice" as const,
    prompt: "Wat betekent 'aap'?",
    options: ["aap", "kat", "hond"],
    correctIndex: 0,
    promptVocabRef: undefined,
  };

  it("answer buttons have min-h-[44px] tap target", () => {
    render(
      <MultipleChoice exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />,
    );
    const buttons = screen
      .getAllByRole("button")
      .filter((b) => exercise.options.includes(b.textContent ?? ""));
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(hasMinTouchTarget(btn as HTMLElement)).toBe(true);
    });
  });

  it("answer buttons have active: state for touch feedback", () => {
    render(
      <MultipleChoice exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />,
    );
    const buttons = screen
      .getAllByRole("button")
      .filter((b) => exercise.options.includes(b.textContent ?? ""));
    buttons.forEach((btn) => {
      expect(hasActiveState(btn as HTMLElement)).toBe(true);
    });
  });
});

// ─── WordBank ────────────────────────────────────────────────────────────────

describe("WordBank – touch friendliness", () => {
  const exercise = {
    id: "wb1",
    kind: "word-bank" as const,
    promptDutch: "Bouw de zin",
    correctSarnamiTokens: ["mi", "jaa"],
    distractorTokens: ["naa"],
  };

  it("bank token buttons have min-h-[44px] tap target", () => {
    render(<WordBank exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />);
    // All non-submit buttons are token buttons
    const buttons = screen
      .getAllByRole("button")
      .filter((b) => !["Controleer", "Volgende", "Verdergaan"].some((t) => b.textContent?.includes(t)));
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(hasMinTouchTarget(btn as HTMLElement)).toBe(true);
    });
  });

  it("bank token buttons have active: state for touch feedback", () => {
    render(<WordBank exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />);
    const buttons = screen
      .getAllByRole("button")
      .filter((b) => !["Controleer", "Volgende", "Verdergaan"].some((t) => b.textContent?.includes(t)));
    buttons.forEach((btn) => {
      expect(hasActiveState(btn as HTMLElement)).toBe(true);
    });
  });
});

// ─── Matching ────────────────────────────────────────────────────────────────

describe("Matching – touch friendliness", () => {
  const exercise = {
    id: "m1",
    kind: "matching" as const,
    pairs: [
      { left: "aap", right: "aap" },
      { left: "kat", right: "kat" },
    ],
  };

  it("matching buttons have min-h-[44px] tap target", () => {
    render(<Matching exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(hasMinTouchTarget(btn as HTMLElement)).toBe(true);
    });
  });

  it("matching buttons have active: state for touch feedback", () => {
    render(<Matching exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(hasActiveState(btn as HTMLElement)).toBe(true);
    });
  });
});

// ─── Flashcard ───────────────────────────────────────────────────────────────

describe("Flashcard – touch friendliness", () => {
  const exercise = {
    id: "fc1",
    kind: "flashcard" as const,
    vocabRef: "v1",
    direction: "sarnami-to-dutch" as const,
  };

  it("the card reveal button has an active: state", () => {
    render(<Flashcard exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />);
    // The large card button (not the labelled action button)
    const buttons = screen.getAllByRole("button");
    const revealBtn = buttons.find((b) => b.className.includes("min-h-[10rem]")) as HTMLElement | undefined;
    expect(revealBtn).not.toBeUndefined();
    expect(hasActiveState(revealBtn!)).toBe(true);
  });

  it("action buttons (Show Answer) have min-h-[44px] tap target", () => {
    render(<Flashcard exercise={exercise} vocabById={VOCAB_MAP} onAnswer={() => {}} />);
    const actionBtns = screen.getAllByRole("button").filter((b) => b.textContent !== "");
    // The Button component wraps these; all should have min-h-[44px]
    const showAnswerBtn = actionBtns.find((b) =>
      b.className.includes("min-h-[44px]"),
    ) as HTMLElement | undefined;
    expect(showAnswerBtn).not.toBeUndefined();
  });
});
