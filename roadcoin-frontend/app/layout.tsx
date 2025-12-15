import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RoadChain - The First AI-Discovered Blockchain',
  description: 'Built for Cadence. Powered by golden ratio breath. PROMISE IS FOREVER.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
