/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6fc',
          100: '#e8ecf9',
          200: '#cbd4f1',
          300: '#a1b1e6',
          400: '#7188d8',
          500: '#4f68cc',
          600: '#3c4ebb',
          700: '#313e9a',
          800: '#2c357f',
          900: '#28306b',
        },
        slate: {
          950: '#0b0f19'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
