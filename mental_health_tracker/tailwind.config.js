/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4a6fa5',
        secondary: '#6b8cbe', 
        tertiary: '#edf2f7',
        accent: '#e53e3e',
        success: '#48bb78',
        lightBg: '#f7fafc',
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#f7fafc',
            a: {
              color: '#4a6fa5',
              '&:hover': {
                color: '#6b8cbe',
              },
            },
            h1: {
              color: '#f7fafc',
            },
            h2: {
              color: '#f7fafc',
            },
            h3: {
              color: '#f7fafc',
            },
            h4: {
              color: '#f7fafc',
            },
            strong: {
              color: '#f7fafc',
            },
            blockquote: {
              color: '#e2e8f0',
            },
            code: {
              color: '#e2e8f0',
            },
            figcaption: {
              color: '#a0aec0',
            },
          },
        },
      },
    },
  },
  plugins: [
    // Will add back after proper installation
  ],
} 