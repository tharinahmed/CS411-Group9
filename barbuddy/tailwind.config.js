/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: 
    ['node_modules/daisyui/dist/**/*.js', 'node_modules/react-daisyui/dist/**/*.js'],
  theme: {
    extend: {
      colors: {
        "background": "#294340", /**our main background color */
        "highlights": "D4D9B1"  /**lighter, highlight colors */
      },

    },
  },
  plugins: [require("daisyui")],
}
