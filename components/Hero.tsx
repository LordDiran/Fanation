'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const BG = [
  'photo-1514525253161-7a46d19cd819',
  'photo-1516280440614-37939bbacd81',
  'photo-1493225457124-a3eb161ffa5f',
  'photo-1598488035139-bdbb2231ce04',
]

const STATS = [
  { val: '12,000+', label: 'Active creators' },
  { val: '₦6.7B+', label: 'Paid to creators' },
  { val: '180+', label: 'Countries' },
  { val: '4.9/5', label: 'Creator rating' },
]

const AVATARS = [
  'photo-1531746020798-e6953c6e8e04',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1517841905240-472988babdf9',
  'photo-1507003211169-0a1dd7228f2d',
]

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % BG.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-24">
      {/* Carousel parallax background */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute" style={{ inset: '-40% 0', height: '180%' }}>
          {BG.map((id, i) => (
            <div
              key={id}
              className="absolute inset-0 transition-opacity duration-[2000ms]"
              style={{
                opacity: i === slide ? 1 : 0,
                backgroundImage: `url(https://images.unsplash.com/${id}?w=1440&q=80&fit=crop)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px) brightness(0.32) saturate(1.6)',
              }}
            />
          ))}
        </div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,.45) 0%,rgba(7,9,26,.1) 45%,rgba(7,9,26,.55) 100%)' }} />
      </div>

      {/* Radial brand glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 55% 40%,rgba(37,153,246,.14) 0%,transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-brand mb-8">
              <span className="w-2 h-2 rounded-full bg-brand pulse-dot" />
              Turn followers into fans. Turn fans into income.
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              Turn Your Audience Into<br />
              <span className="text-brand italic">a Community</span><br />
              That Pays You Back.
            </h1>

            <p className="text-muted text-lg leading-relaxed mb-10 max-w-md">
              Build a loyal fan community, earn recurring income, share exclusive content, host live experiences,
              and own your relationship with your audience — all from one platform.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#" className="bg-brand text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
                Start Creating Today →
              </a>
              <a href="#features" className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {AVATARS.map((id, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-navy overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/${id}?w=80&h=80&fit=crop&crop=faces`}
                      alt="Creator"
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">12,000+ creators</p>
                <p className="text-xs text-muted">influencers, educators, coaches &amp; entertainers</p>
              </div>
            </div>
          </div>

          {/* ── Right: floating creator cards ── */}
          <div className="relative hidden lg:block h-[500px]">
            {/* Card: Sofia */}
            <div className="absolute top-0 left-0 w-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface">
              <div className="relative h-52">
                <Image
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=360&h=450&fit=crop&crop=faces"
                  alt="Sofia" fill className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                  👥 478 subscribers
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-white">Sofia</p>
                <p className="text-xs text-muted">Lifestyle · Creator</p>
                <p className="text-xs text-emerald-400 mt-1">+₦8,000 from @priscilia</p>
              </div>
            </div>

            {/* Card: Elena LIVE */}
            <div className="absolute top-0 right-0 w-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface">
              <div className="relative h-52">
                <Image
                  src="https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=360&h=450&fit=crop&crop=faces"
                  alt="Elena" fill className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />LIVE
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                  4.2K watching
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-white">Elena</p>
                <p className="text-xs text-muted">Streamer · 4.2K watching</p>
              </div>
            </div>

            {/* Earnings badge */}
            <div className="absolute top-[230px] left-1/2 -translate-x-1/2 w-44 bg-surface border border-white/10 rounded-2xl p-4 text-center shadow-2xl">
              <p className="text-xs text-muted">💰 This month</p>
              <p className="text-2xl font-black text-white mt-1">₦7.1M</p>
              <p className="text-xs text-emerald-400 mt-0.5">↑ +31% vs last month</p>
            </div>

            {/* Card: Marcus */}
            <div className="absolute bottom-0 right-2 w-40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface">
              <div className="relative h-44">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=280&h=373&fit=crop&crop=faces"
                  alt="Marcus" fill className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                  🎙️ Pay-per-view
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-white">Marcus</p>
                <p className="text-xs text-muted">Podcaster</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/5 bg-white/[0.03] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.val} className="text-center">
              <p className="text-xl font-black text-white">{s.val}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
