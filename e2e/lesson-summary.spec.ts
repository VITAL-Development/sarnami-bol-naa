import { test, expect, type Page } from "@playwright/test";

const SHORT = 300;

/** Advance through one exercise step, whatever type it is. */
async function advanceStep(page: Page): Promise<void> {
  // Already in post-check feedback state → just continue
  const verder = page.getByRole("button", { name: "Verder" });
  if (await verder.isVisible({ timeout: SHORT }).catch(() => false)) {
    await verder.click();
    return;
  }

  // Flashcard: reveal then mark known
  const toon = page.getByRole("button", { name: "Toon antwoord" });
  if (await toon.isVisible({ timeout: SHORT }).catch(() => false)) {
    await toon.click();
    await page.getByRole("button", { name: "Wist ik!" }).click();
    return;
  }

  // MC / word-bank / fill-blank: Controleren must be visible
  const check = page.getByRole("button", { name: "Controleren" });
  if (!await check.isVisible({ timeout: SHORT }).catch(() => false)) {
    return; // Summary screen or unknown state — bail out
  }

  // Select an answer if Controleren is still disabled
  if (!await check.isEnabled({ timeout: SHORT }).catch(() => false)) {
    const actionLabels = new Set([
      "Controleren", "Verder", "Toon antwoord", "Wist ik!", "Wist ik niet",
      "Opnieuw proberen", "Terug naar het pad",
    ]);
    const buttons = page.getByRole("button");
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isDisabled()) continue;
      const label = ((await btn.textContent()) ?? "").trim();
      if (!actionLabels.has(label)) {
        await btn.click();
        break;
      }
    }
  }

  // Wait up to 2s for Controleren to become enabled, then submit
  await expect(check).toBeEnabled({ timeout: 2000 });
  await check.click();
  await verder.click();
}

test("Lesson summary: shows FA icon (no emoji) for pass or fail state", async ({ page }) => {
  test.setTimeout(60000);

  await page.goto("/lesson/u01-l01");

  const summaryHeading = page
    .getByText("Les voltooid!")
    .or(page.getByText("Geen levens meer — probeer het opnieuw."));

  // Click through up to 15 steps to reach the summary
  for (let i = 0; i < 15; i++) {
    if (await summaryHeading.isVisible({ timeout: 100 }).catch(() => false)) break;
    await advanceStep(page);
  }

  // Wait for summary to render after the last exercise
  await expect(summaryHeading).toBeVisible({ timeout: 10000 });

  // Summary card: either green circle-check (pass) or red heart-crack (fail)
  const summaryIcon = page.locator("svg.text-forest-600, svg.text-flame-600");
  await expect(summaryIcon.first()).toBeVisible();

  // No emoji in the summary card (the .text-center card)
  const summaryText = await page.locator(".text-center").first().innerText();
  expect(summaryText).not.toMatch(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u);
});
