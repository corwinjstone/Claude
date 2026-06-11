import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Indigo/purple gradient palette from reference screens
        bg: "#2E2A8E",            // primary deep indigo
        bgTop: "#3F3AB8",         // top of gradient (slightly lighter/blue)
        bgBottom: "#6A8AE6",      // bottom of gradient (washed blue)
        surface: "#171A4A",       // dark navy card
        elevated: "#1F2358",      // hover/elevated card
        border: "rgba(255,255,255,0.10)",
        muted: "rgba(255,255,255,0.65)",
        subtle: "rgba(255,255,255,0.45)",
        text: "#FFFFFF",
        accent: "#4ADE80",        // green for wins / active
        accentDim: "#22C55E",
        cta: "#3B82F6",           // blue bottom CTA bar
        win: "#4ADE80",
        lose: "#FF5A6E",
        warn: "#F59E0B",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      backgroundImage: {
        "sidebet-gradient":
          "linear-gradient(180deg, #3F3AB8 0%, #2E2A8E 35%, #3850B8 75%, #6A8AE6 100%)",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
