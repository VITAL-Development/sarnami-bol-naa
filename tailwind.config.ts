import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Suriname flag colours
        forest: {
          50: "#f0f7f1",
          100: "#d4ebd5",
          200: "#aad5ac",
          400: "#5aad60",
          500: "#3d8e43",
          600: "#377E3F", // flag green (primary interactive)
          700: "#2a6131",
        },
        flame: {
          400: "#e05070",
          500: "#c8102e",
          600: "#B40A2D", // flag red (hearts / danger)
          700: "#8f071f",
        },
        gold: {
          100: "#fdf5c2",
          300: "#f5dc6a",
          400: "#ECC81D", // flag yellow (XP / streaks / stars)
          500: "#d4b019",
          600: "#b89200",
        },
        // Warm cream — retained from original design
        cream: {
          50: "#fdf6ec",
          100: "#f8e8c8",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
