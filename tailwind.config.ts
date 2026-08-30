import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF4EC",
          100: "#FFE7D4",
          200: "#FFCBA5",
          300: "#FFA76B",
          400: "#FF8B3D",
          500: "#FF7A1A",
          600: "#F05E00",
          700: "#C74A00",
          800: "#9E3A02",
          900: "#7F3105",
        },
        navy: {
          50: "#F0F4FA",
          100: "#DCE6F2",
          200: "#B9CCE4",
          300: "#8FA9CB",
          400: "#6284AD",
          500: "#3F6391",
          600: "#2C4B75",
          700: "#1E3A5F",
          800: "#14263F",
          900: "#0A1628",
          950: "#060E1B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(10,22,40,0.10)",
        pop: "0 20px 50px -12px rgba(10,22,40,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(.92) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s ease both",
        "fade-in": "fade-in .4s ease both",
        "pop-in": "pop-in .25s cubic-bezier(.2,.9,.3,1.2) both",
      },
    },
  },
  plugins: [],
};
export default config;
