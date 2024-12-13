/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        '50': '50',
        '60': '60',
      }
    },
  },
  plugins: [],
}

