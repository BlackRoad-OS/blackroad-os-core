import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://roadcoin.io'),
  title: {
    default: 'RoadCoin - The Agent Economy Token | Power the BlackRoad Ecosystem',
    template: '%s | RoadCoin',
  },
  description: 'Utility token powering the BlackRoad AI agent ecosystem. Agent compute credits, governance rights, and staking rewards. Built on RoadChain. Buy $ROAD today.',
  keywords: [
    'cryptocurrency',
    'AI token',
    'agent economy',
    'utility token',
    'RoadCoin',
    '$ROAD',
    'compute credits',
    'governance token',
    'staking rewards',
    'blockchain token',
    'AI cryptocurrency',
    'agent token',
    'DeFi',
    'Web3',
    'crypto presale',
    'ICO',
    'token sale',
  ],
  authors: [{ name: 'BlackRoad Systems', url: 'https://blackroad.io' }],
  creator: 'BlackRoad Systems',
  publisher: 'BlackRoad Systems',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://roadcoin.io',
    title: 'RoadCoin - The Agent Economy Token',
    description: 'Power the future of AI agents. Agent compute credits, governance, staking. Built on RoadChain.',
    siteName: 'RoadCoin',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RoadCoin - Agent Economy Token',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadCoin - The Agent Economy Token',
    description: 'Utility token for the BlackRoad AI agent ecosystem. Compute credits, governance, staking.',
    images: ['/og-image.png'],
    creator: '@roadcoin_io',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://roadcoin.io" />
        <meta name="theme-color" content="#D600AA" />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
