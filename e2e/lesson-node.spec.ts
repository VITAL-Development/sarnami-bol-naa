import { test, expect } from "@playwright/test";

test("Lesson node: first node active (forest-600 badge), second node locked (stone badge + lock SVG)", async ({ page }) => {
  await page.goto("/");

  const nodes = page.locator(".rounded-2xl.border-2");

  // First node — active: forest-600 badge circle
  const firstNode = nodes.nth(0);
  await expect(firstNode.locator(".bg-forest-600")).toBeVisible();
  await expect(firstNode).toHaveClass(/border-forest-400/);

  // Second node — locked: stone-200 badge circle with a lock SVG icon
  const secondNode = nodes.nth(1);
  await expect(secondNode.locator(".bg-stone-200")).toBeVisible();
  await expect(secondNode).toHaveClass(/border-stone-200/);
  await expect(secondNode.locator("svg")).toBeVisible(); // lock icon (faLock)

  // Star ratings: no emoji star characters
  const starText = await page.locator(".flex.gap-0\\.5").allInnerTexts();
  starText.forEach((t) => {
    expect(t).not.toMatch(/[★☆]/);
  });
});
