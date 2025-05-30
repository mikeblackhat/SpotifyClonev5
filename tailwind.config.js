/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#121212',
          darkGray: '#282828',
          lightGray: '#B3B3B3',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}