const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/index.html', './src/**/*.js', './src/**/*.svelte', './src/**/*.css'],
  darkMode: 'class',
  theme: {
    // Some useful comment
    fontFamily: {
      'sans': ['Roboto', ...defaultTheme.fontFamily.sans],
      'serif': [...defaultTheme.fontFamily.serif],
      'mono': [...defaultTheme.fontFamily.mono]
    },
    extend: {
      colors: {
        sspyellow: '#F9ED32',
        background: '#2B2B2B',
        activered: '#FF7F79',
        activeredborder: '#FF5E56',
        vacantgreen: '#15DAA2',
        vacantgreenborder: '#00B894',
        tableleft: '#EAEAEA',
        tablecell: '#DDDDDD',
        tableheader: '#818587',
        blacktext: '#221F20',
        primary: '#4C5356',
        primaryinactive: '#DDDDDD',
        secondary: '#A9A9A9',
        nameplategreen: '#00C09A',
        nameplatered: '#FF5E57',
        nameplateblue: '#0084EA',
        secondary2: '#6E6E6E'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}