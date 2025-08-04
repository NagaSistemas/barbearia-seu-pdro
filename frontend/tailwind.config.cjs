/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#eab308",
        secondary: "#23272a",
        accent: "#181c1f",
      },
    },
  },
  plugins: [],
};
