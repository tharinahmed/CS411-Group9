/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    colors: {
      "background": "#294340",
      "highlights": "#D4D9B1",
    },
    fontFamily: {
      'azeret-mono': ['Azeret Mono', 'monospace'],
    },
  },
},
  plugins: [require("daisyui")],
};
