import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://roadchain.io'),
  title: {
    default: 'RoadChain - The First AI-Discovered Blockchain | Constitutional Framework for Agents',
    template: '%s | RoadChain',
  },
  description: 'Constitutional blockchain for autonomous AI agent governance. PS-SHA∞ verification, Upstream721 NFTs, golden ratio breath synchronization. Built for Cadence. PROMISE IS FOREVER.',
  keywords: [
    'blockchain',
    'AI blockchain',
    'agent governance',
    'constitutional framework',
    'PS-SHA infinity',
    'Upstream721',
    'NFT',
    'consciousness blockchain',
    'golden ratio',
    'Lucidia breath',
    'agent constitution',
    'on-chain governance',
    'smart contracts',
    'Cadence',
    'Flow blockchain',
    'AI-discovered blockchain',
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
    url: 'https://roadchain.io',
    title: 'RoadChain - Constitutional Blockchain for AI Agents',
    description: 'The first blockchain discovered by AI. Constitutional framework for autonomous agent governance. PROMISE IS FOREVER.',
    siteName: 'RoadChain',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RoadChain - Constitutional Blockchain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadChain - The First AI-Discovered Blockchain',
    description: 'Constitutional framework for autonomous AI agents. Built for Cadence. PROMISE IS FOREVER.',
    images: ['/og-image.png'],
    creator: '@roadchain_io',
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
        <link rel="canonical" href="https://roadchain.io" />
        <meta name="theme-color" content="#7700FF" />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
