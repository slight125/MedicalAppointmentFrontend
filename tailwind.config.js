/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px',  // 4K
        '6xl': '7680px',  // 8K
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        medical: {
          "primary": "#0f766e",
          "secondary": "#06b6d4", 
          "accent": "#10b981",
          "neutral": "#374151",
          "base-100": "#ffffff",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
    ],
  },
}
