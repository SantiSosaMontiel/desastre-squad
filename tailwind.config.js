/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'age-red': '#ff0000',
        'age-dark': '#1a1a1a',
        'age-darker': '#0d0d0d',
        'age-gray': '#333333',
        'age-light-gray': '#666666',
        'age-text': '#cccccc',
      },
      backgroundImage: {
        'age-bg': "url('fondo.jpg')",
      },
      fontFamily: {
        'age': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        'age-red': '0 4px 15px rgba(255,0,0,0.2)',
        'age-red-hover': '0 6px 20px rgba(255,0,0,0.4)',
        'age-dark': '0 10px 30px rgba(0,0,0,0.8)',
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
} 