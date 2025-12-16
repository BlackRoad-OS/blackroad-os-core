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
        roadwork: {
          dark: '#2D3436',
          orange: '#FF6B00',
          yellow: '#FFD700',
          green: '#00D084',
        },
      },
      backgroundImage: {
        'roadwork-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF0066 100%)',
        'blackroad-gradient': 'linear-gradient(135deg, #FF9D00 0%, #FF6B00 25%, #FF0066 50%, #D600AA 75%, #7700FF 100%)',
      },
    },
  },
  plugins: [],
}

export default config
