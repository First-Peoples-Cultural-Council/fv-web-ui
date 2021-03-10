module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontSize: {
        xxs: '.5rem',
      },
      colors: {
        'fv-red': {
          light: '#b36e54',
          DEFAULT: '#A04A29',
          dark: '#803b21',
        },
        'fv-orange': {
          light: '#e09938',
          DEFAULT: '#D87F06',
          dark: '#ad6605',
        },
        'fv-blue': {
          light: '#1870A7',
          DEFAULT: '#3A6880',
          dark: '#2e5366',
        },
        'fv-turquoise': {
          light: '#5da8a1',
          DEFAULT: '#35928A',
          dark: '#2a756e',
        },
        'fv-purple': {
          light: '#785d72',
          DEFAULT: '#56354f',
          dark: '#452a3f',
        },
        'fv-charcoal': {
          light: '#5D5858',
          DEFAULT: '#313133',
        },
        'fv-green': {
          DEFAULT: '#7EC71A',
        },
        'fv-warning-red': {
          DEFAULT: '#D64A4A',
        },
        'fv-yellow': {
          DEFAULT: '#F4E31E',
        },
      },
      borderRadius: {
        50: '3.13rem',
        25: '1.6rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
