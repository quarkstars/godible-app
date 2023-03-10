module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 1px var(--tw-shadow-color)',
        DEFAULT: '1px 2px 2px var(--tw-shadow-color)',
        lg: '4px 8px 8px var(--tw-shadow-color)',
      },
      colors: {
        primary: '#61db92',
        'primary-shade': '#55c180',
        'primary-tint': '#71df9d',

        secondary: '#4fe8c2',
        'secondary-shade': '#46ccab',
        'secondary-tint': '#61eac8',

        tertiary: '#38d7ff',
        'tertiary-shade': '#31bde0',
        'tertiary-tint': '#4cdbff',

        success: '#2dd36f',

        warning: '#ffc409',

        danger: '#eb445a',

        dark: '#f4f5f8',
        'dark-shade': '#d7d8da',
        'dark-tint': '#f5f6f9',

        medium: '#989aa2',
        'medium-shade': '#86888f',
        'medium-tint': '#a2a4ab',

        light: '#222428',
        'light-shade': '#1e2023',
        'light-tint': '#383a3e',
      },
    },
    fontFamily: {
      serif: ['"Noto Serif"', 'Georgia', 'Times New Roman'],
    },
    screens: {
      mobile: '376px',

      xs: '576px',

      sm: '768px',

      md: '996px',

      lg: '1200px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
