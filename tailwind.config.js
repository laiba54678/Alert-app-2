/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#111827',
          border: '#1F2937',
          foreground: '#E5E7EB',
          accent: '#1F2937',
          'accent-foreground': '#FFFFFF',
          primary: '#EF4444',
        },
        muted: {
          DEFAULT: '#374151',
          foreground: '#9CA3AF',
        },
      },
    },
  },
  plugins: [],
};


