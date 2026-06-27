import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sarnami: {
          50: "#fdf6ec",
          100: "#f8e8c8",
          400: "#e0a335",
          500: "#cb8526",
          600: "#b45309",
          700: "#92400e",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
