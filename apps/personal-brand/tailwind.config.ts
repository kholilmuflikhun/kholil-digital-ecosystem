import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const preset = require("@kholil/config/tailwind-preset");

const config: Config = {
  presets: [preset],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { maxWidth: { page: "72rem", prose: "40rem" } } },
  plugins: [],
};

export default config;
