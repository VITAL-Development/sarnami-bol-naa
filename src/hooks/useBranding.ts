import { useEffect } from "react";
import type { LanguageBranding } from "@/domain/types";
import { contentRepository } from "@/services";
import { useLanguageSettings } from "@/state/LanguageSettingsContext";

// Maps `branding.colors` role names (as returned by `GET /settings?lang=`,
// see docs/api-contract.md and issue #62) onto this app's existing
// Suriname-flag-derived CSS custom-property prefixes (defined as static
// `:root` defaults in src/styles/index.css, consumed by tailwind.config.ts's
// `themeColor()` helper). Runtime values below override those defaults —
// no Tailwind config or rebuild is involved.
const COLOR_ROLE_TO_PREFIX: Record<keyof LanguageBranding["colors"], string> = {
  primary: "forest",
  danger: "flame",
  accent: "gold",
  background: "cream",
};

function applyBrandingColors(colors: LanguageBranding["colors"]): void {
  const root = document.documentElement.style;
  for (const role of Object.keys(COLOR_ROLE_TO_PREFIX) as (keyof LanguageBranding["colors"])[]) {
    const prefix = COLOR_ROLE_TO_PREFIX[role];
    const scale = colors[role];
    if (!scale) continue;
    for (const [shade, value] of Object.entries(scale)) {
      if (value) {
        root.setProperty(`--color-${prefix}-${shade}`, value);
      }
    }
  }
}

// Best-effort favicon swap: updates the existing `<link rel="icon">` in
// index.html to the brand's favicon when one is supplied. This is
// deliberately narrow — it does NOT touch the PWA manifest
// (`manifest.webmanifest`, generated at build time by vite-plugin-pwa from
// vite.config.ts) or the home-screen/maskable icons it declares. A fully
// dynamic manifest would need either a server-generated manifest endpoint
// (this app has no backend of its own — it's a static SPA) or a client-side
// `<link rel="manifest">` swap to a Blob-URL-constructed manifest, which
// does NOT retroactively update an already-installed PWA's home-screen icon
// anyway (only a fresh install/re-add-to-home-screen would pick it up).
// Given neither learning language currently has a distinct icon set
// (`sranantongo`'s settings omit `icons` entirely and fall back to
// Sarnami's), that added complexity isn't justified yet — this is
// explicitly deferred, see issue #62's PR description.
function applyFavicon(href: string | undefined): void {
  if (!href) return;
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (link) {
    link.href = href;
  }
}

// Applies brand/theme metadata (colors, app name, favicon) to the running
// page whenever the active learning language's settings load or change —
// the runtime counterpart to issue #61's static CSS-custom-property/
// Tailwind-config prep. This is a dedicated hook (rather than folding into
// `useContent`) because it's a distinct concern: `useContent` fetches
// lesson/vocab data for routes to render, while this fetches/applies
// document-level branding side effects that have nothing to do with a
// particular route. Call it once, high in the tree (AppShell), alongside
// the existing `useContent()` call it sits next to.
//
// Deliberately does NOT touch `t("appName")` (the header text rendered in
// AppShell) — that's a UI-language string (translated per issue #28's
// `uiLanguage` axis, e.g. shown in Dutch or English), whereas
// `branding.appName` is the brand identity string (tied to the
// `learningLanguage` axis, e.g. "Sarnami Bol Naa" vs. "Sranan Tongo Bol
// Naa"). Conflating them would mean the header text changes when switching
// the *learning* language, which isn't what issue #28 intended. Only
// `document.title` (the browser tab / OS-level app name) is driven by
// `branding.appName` here.
export function useBranding(): void {
  const { learningLanguage } = useLanguageSettings();

  useEffect(() => {
    let cancelled = false;
    contentRepository
      .getLanguageSettings(learningLanguage)
      .then((settings) => {
        if (cancelled) return;
        const branding = settings.branding;
        if (!branding) return;
        applyBrandingColors(branding.colors);
        document.title = branding.appName;
        applyFavicon(branding.icons?.favicon);
      })
      .catch(() => {
        // Best-effort: if branding metadata fails to load, the static
        // :root defaults from src/styles/index.css and index.html's
        // hardcoded <title> keep the app fully usable, so there's nothing
        // else to do here (no user-facing error state needed for a
        // cosmetic-only fetch).
      });
    return () => {
      cancelled = true;
    };
  }, [learningLanguage]);
}
