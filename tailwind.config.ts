import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.ts',
    './app/plugins/**/*.ts',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        charcoal: '#2a2a2a',
        'link-blue': '#0066cc',
        'gray-icon': '#A5A5A5',
        'gray-border': '#e0e0e0',
        'gray-bg': '#f5f5f5',
        'gray-text': '#666666',
        'dark-text': '#333333',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
} satisfies Config
