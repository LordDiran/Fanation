'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { href: '#features',  label: 'Features' },
  { href: '#creators',  label: 'For creators' },
  { href: '#earn',      label: 'Earn' },
  { href: '#faq',       label: 'FAQ' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: '#0C1121' }}>
        <svg viewBox="80 40 240 245" xmlns="http://www.w3.org/2000/svg" className="w-[34px] h-[34px]">
          <g fill="#2599F6">
            <path d="M 279.3 68.36 L 275.0 64.06 L 268.75 60.16 L 261.72 57.42 L 254.30 56.25 L 247.27 56.64 L 238.48 59.18 L 231.25 63.48 L 225.59 69.14 L 218.75 79.10 L 214.45 90.82 L 212.89 103.52 L 213.87 116.21 L 216.40 125.0 L 220.70 133.20 L 218.75 134.96 L 211.52 141.02 L 206.05 148.24 L 201.95 156.64 L 200.19 165.82 L 200.97 175.0 L 204.29 183.98 L 209.76 191.99 L 217.38 198.44 L 226.56 202.54 L 236.91 203.91 L 247.27 201.95 L 255.86 196.87 L 259.57 192.77 L 262.11 195.70 L 265.62 198.63 L 271.09 201.17 L 277.34 202.54 L 283.39 202.54 L 290.62 199.61 L 296.87 195.31 L 301.56 188.67 L 304.10 181.05 L 303.90 173.24 L 301.36 165.82 L 296.87 159.57 L 290.42 154.88 L 287.30 153.71 L 291.21 145.51 L 293.55 138.09 L 294.14 130.66 L 293.16 123.83 L 290.62 117.38 L 286.71 111.91 L 281.25 107.22 L 279.88 106.25 L 282.81 97.07 L 283.39 88.09 Z M 257.42 87.11 L 261.52 90.43 L 264.84 95.12 L 266.79 101.17 L 266.60 107.81 L 264.06 114.45 L 259.18 119.92 L 252.54 123.24 L 245.51 124.02 L 238.87 122.27 L 233.20 118.16 L 229.30 112.30 L 227.73 105.86 L 228.52 99.02 L 231.64 93.36 L 236.52 89.06 L 242.77 86.91 L 249.80 86.52 Z M 253.32 160.35 L 258.20 163.87 L 261.13 168.75 L 261.91 174.41 L 260.15 180.08 L 256.45 184.18 L 251.17 186.72 L 245.51 187.11 L 240.04 185.35 L 235.74 181.64 L 233.20 176.37 L 232.81 170.51 L 234.57 165.23 L 238.09 161.13 L 243.16 158.59 L 248.83 157.81 Z" />
            <path d="M 245.31 147.66 L 237.5 141.02 L 229.3 137.5 L 225.78 136.91 L 227.73 133.79 L 229.49 129.10 L 230.27 123.83 L 229.30 117.38 L 229.88 117.38 L 237.30 119.92 L 245.51 120.90 L 253.71 119.92 L 261.13 117.38 L 261.13 117.57 L 260.35 124.02 L 261.52 129.88 L 264.45 135.16 L 261.91 135.74 L 254.69 139.26 Z" />
          </g>
        </svg>
      </div>
      <span className="font-black text-[19px] text-white" style={{ letterSpacing: '-0.01em' }}>Fanation</span>
    </div>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(7,9,26,0.96)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      } : {}}>
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between" style={{ height: 70 }}>
        <Link href="/"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: '#7A8FB8' }}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: '#7A8FB8' }}>
            Log in
          </a>
          <a href="#"
            className="text-[13px] font-bold px-5 py-2.5 rounded-full text-white whitespace-nowrap transition-all"
            style={{ background: '#2599F6' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#1A80D8'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(37,153,246,0.35)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '#2599F6'
              ;(e.currentTarget as HTMLElement).style.boxShadow = ''
            }}>
            Start Creating
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
          aria-label="Menu">
          <span className="block w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={open ? { transform: 'translateY(7px) rotate(45deg)' } : {}} />
          <span className="block w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={open ? { opacity: 0 } : {}} />
          <span className="block w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={open ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}} />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 flex flex-col items-center justify-center gap-9 z-[400] transition-opacity duration-300"
        style={{ background: 'rgba(7,9,26,0.98)', opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}
            className="text-[28px] font-black text-white transition-colors"
            style={{ letterSpacing: '-0.02em' }}>
            {l.label}
          </a>
        ))}
        <a href="#" className="mt-4 text-white text-lg font-bold px-10 py-4 rounded-full"
          style={{ background: '#2599F6' }}>
          Start Creating →
        </a>
      </div>
    </header>
  )
}
