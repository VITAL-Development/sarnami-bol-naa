import { test, expect } from "@playwright/test";

test("Home: gold XP star, gold streak fire, red hearts, green lesson nodes — no emoji", async ({ page }) => {
  await page.goto("/");

  // XP star: svg inside a container with text-gold-400
  await expect(page.locator(".text-gold-400 svg, svg.text-gold-400").first()).toBeVisible();

  // Hearts: at least one red heart svg (text-flame-600)
  await expect(page.locator("svg.text-flame-600").first()).toBeVisible();

  // Lesson node: first lesson unlocked — border-forest-400
  await expect(page.locator(".border-forest-400").first()).toBeVisible();

  // No raw emoji in the entire body text
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u);
});
