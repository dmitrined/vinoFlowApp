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
        // Современная палитра "Tech SaaS"
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dae3fd',
          300: '#bfc9fb',
          400: '#9ba4f8',
          500: '#7e7cf2',
          600: '#6453e9',
          700: '#5342d4',
          800: '#4536ac',
          900: '#3b3189',
          950: '#231d51',
        },
        slate: {
          950: '#020617', // Почти черный для глубоких фонов
        }
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #6453e9 0%, #7e7cf2 100%)',
        'dark-mesh': 'radial-gradient(at 0% 0%, rgba(100, 83, 233, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(126, 124, 242, 0.1) 0px, transparent 50%)',
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;