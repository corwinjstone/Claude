/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Optimist", "sans-serif"],
      },
      colors: {
        midnight: "#00132b",
        atlantic: "#013d5b",
        pacific: "#a6cbd6",
        surf: "#d6e8ea",
        "digitalblue-65": "#16597a",
        "digitalgray-10": "#e9e9e9",
        "digitalgray-25": "#b5b5b5",
        "digitalgray-75": "#525252",
        "oat-25": "#fcf9f4",
        "oat-50": "#f7f3eb",
        "oat-100": "#ebe6dd",
        brick: "#bf5347",
        fern: "#7a9a01",
      },
      maxWidth: {
        "content-full": "1440px",
        site: "1280px",
      },
      screens: {
        ph: "768px",
        xlv2: "1200px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.10)",
        "card-hover": "0 8px 28px rgba(0,0,0,0.16)",
      },
    },
  },
  plugins: [],
};
