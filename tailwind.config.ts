import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#2599F6',
        navy: '#07091A',
        surface: '#0C1121',
        surface2: '#111827',
        muted: '#8892A4',
      },
    },
  },
}

export default config
