import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
    ],
    // Cache optimised images for 1 year on Vercel's edge — avoids repeat round-trips to Unsplash
    minimumCacheTTL: 31536000,
    // Serve modern formats automatically (avif > webp > jpeg)
    formats: ['image/avif', 'image/webp'],
  },

  // Set long-lived cache headers for all static assets and Next.js chunks
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}

export default config
