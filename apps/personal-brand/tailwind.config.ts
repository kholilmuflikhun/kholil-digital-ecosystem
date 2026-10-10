import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        quiet: "rgb(var(--quiet) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        cyan: "rgb(var(--cyan) / <alpha-value>)",
        magenta: "rgb(var(--magenta) / <alpha-value>)",
        link: "rgb(var(--link) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque Variable'", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["'Source Serif 4 Variable'", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: { page: "72rem", prose: "38rem" },
    },
  },
  plugins: [],
};

export default config;
