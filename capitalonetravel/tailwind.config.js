/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#004879",
          "blue-dark": "#003560",
          "blue-light": "#005F9E",
          coral: "#D22E1E",
          "coral-dark": "#B0261A",
          "coral-light": "#E8432F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.10)",
        "card-hover": "0 8px 28px rgba(0,0,0,0.16)",
        widget: "0 4px 24px rgba(0,0,0,0.18)",
      },
      maxWidth: {
        site: "1280px",
      },
      borderRadius: {
        widget: "12px",
      },
    },
  },
  plugins: [],
};
