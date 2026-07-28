import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
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
