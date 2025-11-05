/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A73E8',
          hover: '#1557B0',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
        },
        text: {
          primary: '#202124',
          secondary: '#5F6368',
        },
        border: {
          DEFAULT: '#DADCE0',
        },
        hover: {
          DEFAULT: '#F1F3F4',
        },
        highlight: {
          bg: '#FEF3C7',
          text: '#92400E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'body': '14px',
        'title': '16px',
        'small': '12px',
        '10': '10px',
        '11': '11px',
        '12': '12px',
        '13': '13px',
      },
      transitionProperty: {
        'height': 'height, max-height',
      },
    },
  },
  plugins: [],
}
