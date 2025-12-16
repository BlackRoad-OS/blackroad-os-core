/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  reactStrictMode: true,
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use hash router for Cloudflare Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig
