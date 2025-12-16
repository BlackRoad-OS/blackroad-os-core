import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://roadwork.blackroad.io'),
  title: {
    default: 'RoadWork - Your AI Career Co-Pilot | Automated Job Applications',
    template: '%s | RoadWork',
  },
  description: 'Automated job applications across 30+ platforms including Indeed, LinkedIn, Glassdoor. AI-powered resume customization, Tinder-style job matching. Get 10x more interviews while you sleep.',
  keywords: [
    'job search automation',
    'automated job applications',
    'AI career co-pilot',
    'job hunting bot',
    'resume builder',
    'career automation',
    'Indeed automation',
    'LinkedIn job search',
    'Glassdoor applications',
    'Monster jobs',
    'ZipRecruiter automation',
    'AI resume writer',
    'job application bot',
    'automated cover letters',
    'job matching AI',
    'career assistant',
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
    url: 'https://roadwork.blackroad.io',
    title: 'RoadWork - Automated Job Applications Across 30+ Platforms',
    description: 'AI-powered job hunting on autopilot. Apply to hundreds of jobs daily with customized resumes. Tinder-style matching. Get 10x more interviews.',
    siteName: 'RoadWork',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RoadWork - Your AI Career Co-Pilot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadWork - Your AI Career Co-Pilot',
    description: 'Automated job applications across 30+ platforms. Get 10x more interviews while you sleep.',
    images: ['/og-image.png'],
    creator: '@roadwork_ai',
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
        <link rel="canonical" href="https://roadwork.blackroad.io" />
        <meta name="theme-color" content="#FF6B00" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
