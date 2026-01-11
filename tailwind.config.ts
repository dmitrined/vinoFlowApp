import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7e9',
          200: '#f9d2d9',
          300: '#f4afbc',
          400: '#ec8198',
          500: '#e05374',
          600: '#cb345a',
          700: '#aa2548',
          800: '#8e2140',
          900: '#791f3a',
          950: '#440c1b',
        },
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right, #791f3a, #440c1b)',
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;