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
      borderWidth: {
        12: '12px',
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
        // Dark Blue
        primary: {
          light: '#677e87',
          DEFAULT: '#264653',
          dark: '#1b313a',
        },
        // Dark Orange
        secondary: {
          light: '#b07363',
          DEFAULT: '#8E3720',
          dark: '#632716',
        },
        // Green/Grey
        tertiaryA: {
          light: '#878a80',
          DEFAULT: '#54584A',
          dark: '#3b3e34',
        },
        // Purple
        tertiaryB: {
          light: '#857689',
          DEFAULT: '#513B56',
          dark: '#39293c',
        },
        word: {
          light: '#6ABAB1',
          DEFAULT: '#2A9D8F',
          dark: '#1D6E64',
        },
        phrase: {
          light: '#D5A169',
          DEFAULT: '#C37829',
          dark: '#89541D',
        },
        song: {
          light: '#a84d7b',
          DEFAULT: '#830042',
          dark: '#5c002e',
        },
        story: {
          light: '#f0d697',
          DEFAULT: '#E9C46A',
          dark: '#a3894a',
        },
        wordText: {
          DEFAULT: '#264653',
        },
        phraseText: {
          DEFAULT: '#9A270A',
        },
        songText: {
          DEFAULT: '#830042',
        },
        storyText: {
          DEFAULT: '#8C5822',
        },
        'fv-charcoal': {
          light: '#54584A',
          DEFAULT: '#313133',
          dark: '#222224',
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
