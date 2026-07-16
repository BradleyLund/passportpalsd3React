/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path based on your project structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fbfaf8",
        ink: {
          DEFAULT: "#1a1918",
          secondary: "#52514c",
          muted: "#6f6d66",
        },
        hairline: "#e4e2db",
        navy: {
          DEFAULT: "#1f3a5f",
          soft: "#eef2f7",
        },
      },
      fontFamily: {
        sans: ["'Public Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
