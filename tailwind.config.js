module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6'
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'Songti SC', 'SimSun', 'serif'],
        sans: ['Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      letterSpacing: {
        chinese: '0.05em',
        'chinese-wide': '0.1em'
      },
      lineHeight: {
        chinese: '1.8',
        'chinese-relaxed': '2'
      }
    }
  },
  plugins: []
};
