import type { Config } from "tailwindcss";

// Builds a Tailwind color entry that reads its RGB triplet from a CSS custom
// property (defined in src/styles/index.css) instead of a hardcoded hex
// value. The `rgb(var(...) / <alpha-value>)` form preserves support for
// Tailwind's opacity modifiers (e.g. `bg-forest-500/50`).
//
// This is prep for #62: a future runtime-branding mechanism can override the
// `--color-*` custom properties per learning-language/brand without a
// rebuild — the config itself no longer needs to change.
function themeColor(name: string): string {
  return `rgb(var(--color-${name}) / <alpha-value>)`;
}

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Suriname flag colours — values defined as CSS custom properties
        // in src/styles/index.css
        forest: {
          50: themeColor("forest-50"),
          100: themeColor("forest-100"),
          200: themeColor("forest-200"),
          400: themeColor("forest-400"),
          500: themeColor("forest-500"),
          600: themeColor("forest-600"), // flag green (primary interactive)
          700: themeColor("forest-700"),
        },
        flame: {
          400: themeColor("flame-400"),
          500: themeColor("flame-500"),
          600: themeColor("flame-600"), // flag red (hearts / danger)
          700: themeColor("flame-700"),
        },
        gold: {
          100: themeColor("gold-100"),
          300: themeColor("gold-300"),
          400: themeColor("gold-400"), // flag yellow (XP / streaks / stars)
          500: themeColor("gold-500"),
          600: themeColor("gold-600"),
        },
        // Warm cream — retained from original design
        cream: {
          50: themeColor("cream-50"),
          100: themeColor("cream-100"),
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
