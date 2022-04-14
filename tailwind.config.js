module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'landingButtonBg': 'rgb(43, 63, 242, .2)',
        'landingButtonBgHover': 'rgb(43, 63, 242, .4)',
        'landingButtonBorder': 'rgb(43, 63, 242)',
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}