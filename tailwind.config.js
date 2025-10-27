/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zaku-blue': '#1e3a8a',
        'zaku-light-blue': '#4fc3f7',
        'zaku-green': '#2d6a4f',
        'zaku-light-green': '#52b788',
        'zaku-accent': '#ff6b6b',
        'zaku-dark': '#0f1419',
        'zaku-gray': '#2c3e50',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'tech': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #2d6a4f, 0 0 10px #2d6a4f' },
          '100%': { boxShadow: '0 0 20px #2d6a4f, 0 0 30px #2d6a4f' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}