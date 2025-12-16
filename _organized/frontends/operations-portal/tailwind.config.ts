import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blackroad: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Company brand colors
        brand: {
          orange: '#FF6B00',
          pink: '#FF0066',
          purple: '#7700FF',
          blue: '#0066FF',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-blackroad': 'linear-gradient(135deg, #FF6B00 0%, #FF0066 25%, #D600AA 50%, #7700FF 75%, #0066FF 100%)',
      },
    },
  },
  plugins: [],
}
export default config
