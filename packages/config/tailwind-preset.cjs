/** Preset Tailwind bersama: warna dari token CSS, mode gelap berbasis class, font Inter. */
const c = (name) => `hsl(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: c("background"),
        foreground: c("foreground"),
        card: c("card"),
        "card-foreground": c("card-foreground"),
        muted: c("muted"),
        "muted-foreground": c("muted-foreground"),
        border: c("border"),
        input: c("input"),
        primary: c("primary"),
        "primary-foreground": c("primary-foreground"),
        ring: c("ring"),
        success: c("success"),
        warning: c("warning"),
        danger: c("danger"),
      },
      fontFamily: {
        sans: ['"Inter Variable"', "ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px hsl(222 47% 11% / 0.05), 0 4px 16px hsl(222 47% 11% / 0.05)",
        lift: "0 2px 4px hsl(222 47% 11% / 0.06), 0 12px 32px hsl(222 47% 11% / 0.10)",
      },
      borderRadius: { xl: "1rem", lg: "0.75rem", md: "0.5rem", sm: "0.375rem" },
    },
  },
};
