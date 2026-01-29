/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        beige: "#f1eeeb",
        pink: "#c39d97",
        latte: "#a09086",
      },
    },
  },
  plugins: [],
};
