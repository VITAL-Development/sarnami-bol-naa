import { test, expect } from "@playwright/test";

test("Profile: forest-600 XP, gold-600 streak — no emoji anywhere in main", async ({ page }) => {
  await page.goto("/profile");

  const main = page.locator("main");

  // XP stat uses forest-600
  await expect(main.locator(".text-forest-600").first()).toBeVisible();

  // Streak stat uses gold-600
  await expect(main.locator(".text-gold-600").first()).toBeVisible();

  // No emoji characters in the entire main content
  const mainText = await main.innerText();
  expect(mainText).not.toMatch(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u);

  // If any badges are shown, their icons must be SVG (not emoji text)
  const badgeGrid = main.locator(".grid.grid-cols-2");
  if (await badgeGrid.isVisible()) {
    const badgeIcons = badgeGrid.locator(".text-forest-600 svg, svg.text-forest-600");
    const count = await badgeIcons.count();
    expect(count).toBeGreaterThan(0);
  }
});
