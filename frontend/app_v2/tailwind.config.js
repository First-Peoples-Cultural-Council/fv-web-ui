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
        primary: {
          light: '#93a3a9',
          DEFAULT: '#264653',
          dark: '#13232a',
        },
        secondary: {
          light: '#c79b90',
          DEFAULT: '#8E3720',
          dark: '#471c10',
        },
        tertiaryA: {
          light: '#aaaca5',
          DEFAULT: '#54584A',
          dark: '#3b3e34',
        },
        tertiaryB: {
          light: '#a89dab',
          DEFAULT: '#513B56',
          dark: '#291e2b',
        },
        word: {
          light: '#95cec7',
          DEFAULT: '#2A9D8F',
          dark: '#264653',
        },
        phrase: {
          DEFAULT: '#C37829',
          dark: '#9A270A',
        },
        song: {
          DEFAULT: '#830042',
          dark: '#830042',
        },
        story: {
          DEFAULT: '#E9C46A',
          dark: '#8C5822',
        },
        'fv-charcoal': {
          light: '#646363',
          DEFAULT: '#313133',
        },
        'fv-warning-red': {
          DEFAULT: '#D64A4A',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
