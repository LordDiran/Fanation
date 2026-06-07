'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Carousel: platform-consistent photos that look dramatic blurred
// Uses creators-section photos (different from hero mosaic) + atmospheric new additions
const CAROUSEL_PHOTOS = [
  { id: 'photo-1549476464-37392f717541', q: 60 }, // Dembe – dark, dramatic
  { id: 'photo-1517841905240-472988babdf9', q: 60 }, // Nadia – warm lifestyle
  { id: 'photo-1507003211169-0a1dd7228f2d', q: 60 }, // Tobi – warm natural
  { id: 'photo-1529626455594-4ff0802cfb7e', q: 60 }, // Sofia model – close-up dramatic
]

const AVATARS = [
  { id: 'photo-1531746020798-e6953c6e8e04', name: 'Amara' },
  { id: 'photo-1506794778202-cad84cf45f1d', name: 'James' },
  { id: 'photo-1573496359142-b8d87734a5a2', name: 'Priscilia' },
  { id: 'photo-1517841905240-472988babdf9', name: 'David' },
  { id: 'photo-1507003211169-0a1dd7228f2d', name: 'Sofia' },
]

const GIFTS = [
  { icon: '🎁', text: '+500 coins', user: '@jay_88',    delay: '0s' },
  { icon: '💎', text: '+$12.00',   user: '@superfan',  delay: '1.2s' },
  { icon: '⭐', text: '+$5.00',    user: '@priscilia', delay: '2.4s' },
]

const COINS = ['🪙', '💎', '⭐', '🎁', '💰', '✨']

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const slideEls = useRef<(HTMLDivElement | null)[]>([])
  const particlesRef = useRef<HTMLDivElement>(null)

  // Auto-advance carousel every 5s
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % CAROUSEL_PHOTOS.length), 5000)
    return () => clearInterval(id)
  }, [])

  // Parallax on scroll
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY
          slideEls.current.forEach(s => {
            if (s) s.style.transform = `translateY(${y * 0.35}px) translateZ(0)`
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Floating particles
  useEffect(() => {
    const container = particlesRef.current
    if (!container) return
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span')
      el.className = 'particle'
      el.textContent = COINS[Math.floor(Math.random() * COINS.length)]
      el.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${8+Math.random()*12}s;--del:${Math.random()*10}s;font-size:${10+Math.random()*10}px;`
      container.appendChild(el)
    }
    return () => { if (container) container.innerHTML = '' }
  }, [])

  return (
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden">

      {/* ── Blurred carousel background ── */}
      <div className="hero-carousel-bg">
        {CAROUSEL_PHOTOS.map((photo, i) => (
          <div
            key={photo.id}
            ref={el => { slideEls.current[i] = el }}
            className={`hero-slide${i === slide ? ' active' : ''}`}
            style={{
              backgroundImage: `url('https://images.unsplash.com/${photo.id}?w=800&h=600&fit=crop&q=${photo.q}')`,
            }}
          />
        ))}
        <div className="hero-carousel-overlay" />
      </div>

      {/* ── Mesh gradient ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: `radial-gradient(ellipse 60% 55% at 65% 45%,rgba(37,153,246,.09) 0%,transparent 60%),
                     radial-gradient(ellipse 50% 45% at 20% 70%,rgba(245,166,35,.05) 0%,transparent 55%),
                     radial-gradient(ellipse 40% 40% at 80% 10%,rgba(34,197,94,.04) 0%,transparent 50%)`
      }} />

      {/* ── Floating particles ── */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }} />

      <div className="max-w-[1180px] mx-auto px-6 relative w-full" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 items-center" style={{ gap: 60 }}>

          {/* ── Left copy ── */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold mb-7"
              style={{ background: 'rgba(37,153,246,0.1)', border: '1px solid rgba(37,153,246,0.22)', color: '#60B8FA' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-brand" style={{ animation: 'blink 2s ease-in-out infinite' }} />
              Turn followers into fans. Turn fans into income.
            </div>

            <h1 className="font-black leading-[1.04] mb-6"
              style={{ fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '-0.04em' }}>
              Turn Your Audience Into<br />
              <em className="not-italic" style={{ color: '#2599F6' }}>a Community</em><br />
              That Pays You Back.
            </h1>

            <p className="leading-[1.78] mb-10 max-w-[440px]" style={{ fontSize: 17, color: '#7A8FB8' }}>
              Build a loyal fan community, earn recurring income, share exclusive content, host live experiences,
              and own your relationship with your audience — all from one platform.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#"
                className="inline-flex items-center text-white font-bold"
                style={{ background: '#2599F6', fontSize: 16, padding: '17px 34px', borderRadius: '100px', transition: 'background .2s, box-shadow .2s, transform .15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='#1A80D8'; el.style.boxShadow='0 8px 32px rgba(37,153,246,0.4)'; el.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='#2599F6'; el.style.boxShadow=''; el.style.transform=''; }}>
                Start Creating Today →
              </a>
              <a href="#features"
                className="inline-flex items-center text-white font-semibold"
                style={{ fontSize: 16, padding: '17px 34px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', transition: 'border-color .2s, background .2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.35)'; el.style.background='rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.15)'; el.style.background=''; }}>
                See How It Works
              </a>
            </div>

            {/* App store badges */}
            <div className="hidden sm:flex items-center gap-3 flex-wrap mb-10">
              <span className="text-xs mr-1" style={{ color: '#7A8FB8' }}>Available on</span>
              {[
                { icon: '🍎', sub: 'Download on the', name: 'App Store' },
                { icon: '▶', sub: 'Get it on', name: 'Google Play' },
              ].map(b => (
                <a key={b.name} href="#"
                  className="inline-flex items-center gap-2.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '9px 16px', borderRadius: 12, transition: 'background .2s, border-color .2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.1)'; el.style.borderColor='rgba(255,255,255,0.22)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.06)'; el.style.borderColor='rgba(255,255,255,0.1)'; }}>
                  <span className="text-xl leading-none">{b.icon}</span>
                  <span>
                    <p className="leading-none mb-0.5" style={{ fontSize: 10, color: '#7A8FB8' }}>{b.sub}</p>
                    <p className="font-bold text-white leading-none" style={{ fontSize: 14 }}>{b.name}</p>
                  </span>
                </a>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex">
                {AVATARS.map((a, i) => (
                  <div key={i} className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '2px solid #07091A', marginLeft: i === 0 ? 0 : -9 }}>
                    <Image
                      src={`https://images.unsplash.com/${a.id}?w=72&h=72&fit=crop&crop=faces&q=70`}
                      alt={a.name}
                      width={36}
                      height={36}
                      quality={70}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">12,000+ creators</p>
                <p className="text-xs" style={{ color: '#7A8FB8' }}>creators, influencers, educators, coaches &amp; entertainers</p>
              </div>
            </div>
          </div>

          {/* ── Right: creator mosaic grid ──
              Layout matches HTML exactly:
                Col 1 (LEFT): Sofia — tall, spans both rows
                Col 2 (RIGHT): Elena (top) + Marcus (bottom)
          ── */}
          <div className="relative hidden lg:block" style={{ paddingBottom: 72 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

              {/* Card A: Sofia — col1, rows 1-2 (LEFT TALL) */}
              <div className="relative rounded-[18px] overflow-hidden"
                style={{ gridRow: '1/span 2', gridColumn: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creator-amara.jpg" alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 40%,rgba(7,9,26,0.92) 100%)' }} />
                <div className="absolute top-3 left-3 font-bold rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: 'rgba(37,153,246,0.15)', border: '1px solid rgba(37,153,246,0.3)', color: '#60B8FA' }}>
                  8,400 subscribers
                </div>
                {/* Gift stream */}
                <div className="absolute flex flex-col gap-2 items-end z-10" style={{ right: 10, bottom: 56 }}>
                  {GIFTS.map((g, i) => (
                    <div key={i}
                      className="flex items-center gap-1.5 text-white font-bold whitespace-nowrap rounded-full px-2.5 py-1.5"
                      style={{
                        fontSize: 11,
                        background: 'rgba(245,166,35,0.18)',
                        border: '1px solid rgba(245,166,35,.35)',
                        backdropFilter: 'blur(6px)',
                        animation: `giftPop 3.6s ease-in-out ${g.delay} infinite`,
                      }}>
                      {g.icon} {g.text} from <span style={{ color: '#F5A623' }}>{g.user}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <p className="font-bold text-white" style={{ fontSize: 13 }}>Sofia</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Lifestyle · Creator</p>
                </div>
              </div>

              {/* Card B: Elena LIVE — col2, row 1 (RIGHT TOP) */}
              <div className="relative rounded-[18px] overflow-hidden"
                style={{ gridRow: 1, gridColumn: 2, height: 250 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creator-elena.jpg" alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 30%,rgba(7,9,26,0.9) 100%)' }} />
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white font-black rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: '#EF4444' }}>
                  <span style={{ fontSize: 8 }}>●</span>LIVE
                </div>
                <div className="absolute top-3 right-3 font-bold rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
                  +$340 today
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <p className="font-bold text-white" style={{ fontSize: 13 }}>Elena</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Streamer · 4.2K watching</p>
                </div>
              </div>

              {/* Card C: Marcus — col2, row 2 (RIGHT BOTTOM) */}
              <div className="relative rounded-[18px] overflow-hidden"
                style={{ gridRow: 2, gridColumn: 2, height: 200 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creator-marcus.jpg" alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 30%,rgba(7,9,26,0.9) 100%)' }} />
                <div className="absolute top-3 left-3 font-bold rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)', color: '#F5A623' }}>
                  🪙 12,400 coins earned
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <p className="font-bold text-white" style={{ fontSize: 13 }}>Marcus</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Podcaster · Pay-per-view drops</p>
                </div>
              </div>
            </div>

            {/* Earnings widget — bottom left, overlaps Sofia card */}
            <div className="absolute flex items-center gap-3"
              style={{
                bottom: 8, left: 0, zIndex: 10,
                background: '#18223C',
                border: '1px solid rgba(34,197,94,0.28)',
                borderRadius: 14,
                padding: '14px 18px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                minWidth: 200,
              }}>
              <span className="text-2xl leading-none">💰</span>
              <div>
                <p className="mb-0.5" style={{ fontSize: 11, color: '#7A8FB8' }}>This month&apos;s earnings</p>
                <p className="font-black leading-none" style={{ fontSize: 22, color: '#22C55E', letterSpacing: '-0.02em' }}>$4,280.00</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
