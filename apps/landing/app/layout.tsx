import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

/**
 * Absolute base for `og:image` and `twitter:image`. Without it Next falls back to
 * `https://${VERCEL_URL}` — the *deployment-specific* hostname, which changes on every
 * push and 404s once that deployment is pruned. `VERCEL_PROJECT_PRODUCTION_URL` is the
 * production alias (and becomes the custom domain the moment one is attached), so the
 * card keeps resolving. Set at build time by Vercel; localhost is the local fallback.
 */
const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Fanation — Turn Followers Into Fans. Turn Fans Into Income.',
  description:
    'Fanation is the creator monetization and community platform where creators build direct relationships with their audience, generate recurring income, and own their communities.',
  openGraph: {
    title: 'Fanation — Turn Followers Into Fans. Turn Fans Into Income.',
    description:
      'Build a loyal fan community, earn recurring income, and own your relationship with your audience — all from one platform.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
