/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'bg-zoom-loop': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        'bg-zoom-loop': 'bg-zoom-loop 15s ease-in-out infinite',
      },
      colors: {
        "custom-bg": "#2D2622",
        "custom-bg-text": "#61523A",
        "custom-green": "#7FA147",
        "custom-gray": "#5A5A5A",
        "custom-red": "#A74A39"
      }
    },
  },
  plugins: [],
}