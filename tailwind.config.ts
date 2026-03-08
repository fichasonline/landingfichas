import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#06060b",
        midnight: "#0d0d18",
        panel: "rgba(17, 17, 32, 0.78)",
        violet: "#8f75ff",
        "violet-soft": "#c6bbff",
        cyan: "#7cf7ff",
        line: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: [
          "\"Space Grotesk\"",
          "\"Avenir Next\"",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "\"Space Grotesk\"",
          "\"Avenir Next Condensed\"",
          "\"Avenir Next\"",
          "sans-serif",
        ],
        mono: ["\"IBM Plex Mono\"", "\"SFMono-Regular\"", "monospace"],
      },
      boxShadow: {
        card: "0 24px 60px rgba(5, 7, 18, 0.45)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 60px rgba(143, 117, 255, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
