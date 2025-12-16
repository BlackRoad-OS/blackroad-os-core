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
        road: {
          orange: '#FF6B00',
          pink: '#FF0066',
          purple: '#7700FF',
          blue: '#0066FF',
        },
      },
    },
  },
  plugins: [],
}
export default config
