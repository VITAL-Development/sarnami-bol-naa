import { test, expect } from "@playwright/test";

// Covers the learning-language picker (issue #35) added to AppShell's header.
// The Playwright build here runs without VITE_API_BASE_URL (see
// playwright.config.ts's `vite preview`), so it exercises
// LocalJsonContentRepository — which always serves the bundled Sarnami
// content regardless of the selected learning language (see
// src/services/index.ts / LocalJsonContentRepository.ts), since Sranan
// Tongo's real content (added in issue #37) lives server-side only and
// isn't bundled into the frontend's local/offline fallback. That means this
// suite can't assert a visible *content* change end-to-end (that's verified
// manually against a real backend, see PR description) — it asserts the
// picker itself is visible/functional and that switching to Sranantongo
// doesn't crash the app.
test("Language picker: visible in header, lists both learning languages, switching doesn't crash", async ({
  page,
}) => {
  await page.goto("/");

  const picker = page.getByRole("combobox", { name: "Leertaal" });
  await expect(picker).toBeVisible();

  const optionLabels = await picker.locator("option").allTextContents();
  expect(optionLabels).toEqual(["Sarnami Hindoestani", "Sranan Tongo"]);

  // Defaults to Sarnami.
  await expect(picker).toHaveValue("sarnami");

  // Switching to Sranantongo doesn't crash the app (no uncaught error page).
  await picker.selectOption("sranantongo");
  await expect(picker).toHaveValue("sranantongo");
  await expect(page.locator("body")).toBeVisible();

  // No raw emoji anywhere on the page after switching.
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u);

  // Switching back to Sarnami restores the default selection.
  await picker.selectOption("sarnami");
  await expect(picker).toHaveValue("sarnami");
});
