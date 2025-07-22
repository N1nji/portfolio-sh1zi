/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnightBlue: '#1C2E4A',
        dustyBlue: '#52677D',
        ivory: '#BDC4D4',
        deepNavy: '#0F1A2B',
        buttercream: '#D1CFC9',
        eclipseBlack: '#1B1B1B',
        moonlightGray: '#A8A9AD',
        astralBlue: '#24476C',
        midnightNavy: '#0A122A',
        stardustWhite: '#E6E8E6',
      },
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        lobster: ['"Lobster"', 'cursive'],
        cursive: ['"Edu NSW ACT Cursive"', 'cursive'],
       }
      },
    },
  plugins: [],
}
