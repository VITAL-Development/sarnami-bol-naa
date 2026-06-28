import { test, expect, type Page } from "@playwright/test";

/** Advance through one exercise step, whatever type it is. */
async function advanceStep(page: Page): Promise<void> {
  // Flashcard: reveal then mark as known
  const showAnswer = page.getByRole("button", { name: "Toon antwoord" });
  if (await showAnswer.isVisible({ timeout: 800 }).catch(() => false)) {
    await showAnswer.click();
    await page.getByRole("button", { name: "Wist ik!" }).click();
    return;
  }

  // Multiple choice / fill-blank / word-bank: select a token/option, then check + continue
  const checkBtn = page.getByRole("button", { name: "Controleren" });
  const isCheckEnabled = await checkBtn.isEnabled({ timeout: 800 }).catch(() => false);

  if (!isCheckEnabled) {
    // Need to pick something first — click the first non-action enabled button
    const actionLabels = new Set(["Controleren", "Verder", "Toon antwoord", "Wist ik!", "Wist ik niet", "Opnieuw proberen", "Terug naar het pad"]);
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

  await page.getByRole("button", { name: "Controleren" }).click();
  await page.getByRole("button", { name: "Verder" }).click();
}

test("Lesson summary: shows FA icon (no emoji) for pass or fail state", async ({ page }) => {
  await page.goto("/lesson/u01-l01");

  const summaryHeading = page
    .getByText("Les voltooid!")
    .or(page.getByText("Geen levens meer — probeer het opnieuw."));

  // Click through up to 15 steps to reach the summary
  for (let i = 0; i < 15; i++) {
    if (await summaryHeading.isVisible({ timeout: 3000 }).catch(() => false)) break;
    await advanceStep(page);
  }

  await expect(summaryHeading).toBeVisible({ timeout: 5000 });

  // Summary card: either green circle-check (pass) or red heart-crack (fail)
  const summaryIcon = page.locator("svg.text-forest-600, svg.text-flame-600");
  await expect(summaryIcon.first()).toBeVisible();

  // No emoji in the summary card (the .text-center card)
  const summaryText = await page.locator(".text-center").first().innerText();
  expect(summaryText).not.toMatch(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u);
});
