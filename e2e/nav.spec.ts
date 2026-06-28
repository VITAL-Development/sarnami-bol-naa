import { test, expect } from "@playwright/test";

test("Bottom nav: FA SVG icons on all 3 links, active home link has forest-600 class", async ({ page }) => {
  await page.goto("/");

  const nav = page.locator("nav");

  // All 3 nav links should each contain an svg (FA icon — not an emoji span)
  const links = nav.getByRole("link");
  await expect(links).toHaveCount(3);

  for (let i = 0; i < 3; i++) {
    await expect(links.nth(i).locator("svg")).toBeVisible();
  }

  // Home link (href="/") is active → text-forest-600 class
  const homeLink = nav.locator('a[href="/"]');
  await expect(homeLink).toHaveClass(/text-forest-600/);

  // Review and profile links are inactive → text-stone-400
  const reviewLink = nav.locator('a[href="/review"]');
  await expect(reviewLink).toHaveClass(/text-stone-400/);

  // No emoji text in nav
  const navText = await nav.innerText();
  expect(navText).not.toMatch(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u);
});
