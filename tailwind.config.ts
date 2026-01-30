import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ForeverCars Brand Colors (Logo officiel)
        brand: {
          black: "#131313",
          orange: "#fe904d",
          white: "#ffffff",
          "gray-dark": "#1c1c1c",
          "gray-medium": "#404040",
          "gray-light": "#E5E5E5",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
