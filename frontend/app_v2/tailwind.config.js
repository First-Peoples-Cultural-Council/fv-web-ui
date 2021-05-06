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
      animation: {
        'pulse-blur': 'pulse-blur 2.5s linear infinite',
      },
      borderRadius: {
        '4xl': '3rem',
      },
      fontSize: {
        xxs: '.5rem',
      },
      keyframes: {
        'pulse-blur': {
          '0%, 50%, 100%': {
            transform: 'scale(1)',
            filter: 'blur(0px)',
          },
          '25%': {
            transform: 'scale(0.6)',
            filter: 'blur(2px)',
          },
          '75%': {
            transform: 'scale(1.4)',
            filter: 'blur(2px)',
          },
        },
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
          light: '#c2dedc',
          DEFAULT: '#35928A',
          dark: '#2a756e',
        },
        'fv-purple': {
          light: '#785d72',
          DEFAULT: '#56354f',
          dark: '#452a3f',
        },
        'fv-charcoal': {
          light: '#646363',
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
