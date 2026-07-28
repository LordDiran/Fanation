import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:   '#2599F6',
        'brand-d': '#1A80D8',
        'brand-l': '#60B8FA',
        navy:    '#07091A',
        surface: '#0C1121',
        card:    '#111830',
        card2:   '#18223C',
        surface2: '#111827',
        muted:   '#7A8FB8',
        gold:    '#F5A623',
        green:   '#22C55E',
      },
    },
  },
}

export default config
