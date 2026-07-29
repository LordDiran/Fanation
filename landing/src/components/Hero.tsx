import { useEffect, useRef, useState } from 'react'

// Carousel: platform-consistent photos that look dramatic blurred
// Uses creators-section photos (different from hero mosaic) + atmospheric new additions
const CAROUSEL_PHOTOS = [
  'creator-dembe.jpg',
  'creator-nadia.jpg',
  'creator-tobi.jpg',
  'creator-sofia.jpg',
]

const AVATARS = [
  { file: 'creator-amara.jpg',  name: 'Amara' },
  { file: 'creator-marcus.jpg', name: 'James' },
  { file: 'creator-aisha.jpg',  name: 'Priscilia' },
  { file: 'creator-tobi.jpg',   name: 'David' },
  { file: 'creator-nadia.jpg',  name: 'Sofia' },
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
            key={photo}
            ref={el => { slideEls.current[i] = el }}
            className={`hero-slide${i === slide ? ' active' : ''}`}
            style={{
              backgroundImage: `url('/images/${photo}')`,
            }}
          />
        ))}
        <div className="hero-carousel-overlay" />
      </div>

      {/* ── Mesh gradient ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: `radial-gradient(ellipse 60% 55% at 65% 45%,rgba(37,153,246,.09) 0%,transparent 60%),
                     radial-gradient(ellipse 50% 45% at 20% 70%,rgba(252,164,75,.06) 0%,transparent 55%),
                     radial-gradient(ellipse 40% 40% at 80% 10%,rgba(93,221,144,.05) 0%,transparent 50%),
                     radial-gradient(ellipse 50% 45% at 85% 80%,rgba(243,106,70,.13) 0%,transparent 55%)`
      }} />

      {/* ── Floating particles ── */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }} />

      <div className="max-w-[1180px] mx-auto px-6 relative w-full" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 items-center" style={{ gap: 60 }}>

          {/* ── Left copy ── */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold mb-7"
              style={{ background: 'rgba(243,106,70,0.08)', border: '1px solid rgba(243,106,70,0.28)', color: '#F8A98A', borderLeft: '2px solid #F36A46' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#F36A46', animation: 'blink 2s ease-in-out infinite' }} />
              Turn followers into fans. Turn fans into income.
            </div>

            <h1 className="font-black leading-[1.04] mb-6"
              style={{ fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '-0.04em' }}>
              Turn Your Audience Into<br />
              <em className="not-italic" style={{
                background: 'linear-gradient(90deg, #F36A46 0%, #2599F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>a Community</em><br />
              That Pays You Back.
            </h1>

            <p className="leading-[1.78] mb-10 max-w-[440px]" style={{ fontSize: 17, color: '#7A8FB8' }}>
              Build a loyal fan community, earn recurring income, share exclusive content, host live experiences,
              and own your relationship with your audience — all from one platform.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#"
                className="inline-flex items-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #2599F6 0%, #1e7fd4 100%)', fontSize: 16, padding: '17px 34px', borderRadius: '100px', transition: 'box-shadow .2s, transform .15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow='0 8px 32px rgba(37,153,246,0.45), 0 0 0 1px rgba(243,106,70,0.25)'; el.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow=''; el.style.transform=''; }}>
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
              {/* Apple App Store */}
              <a href="#"
                className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
                style={{ background: '#000', border: '1px solid rgba(255,255,255,0.18)', padding: '9px 18px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.459 2.208 3.09 3.792 3.029 1.52-.065 2.09-.987 3.925-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.391-2.376-2-.156-3.675 1.09-4.6 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span>
                  <p className="leading-none mb-1" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>Download on the</p>
                  <p className="font-bold text-white leading-none" style={{ fontSize: 14, letterSpacing: '-0.01em' }}>App Store</p>
                </span>
              </a>
              {/* Google Play */}
              <a href="#"
                className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
                style={{ background: '#000', border: '1px solid rgba(255,255,255,0.18)', padding: '9px 18px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                <svg width="20" height="22" viewBox="0 0 24 27" fill="none" aria-hidden="true">
                  <path d="M1.5 0.8L14.5 13.5L1.5 26.2C0.9 25.9 0.5 25.3 0.5 24.5V2.5C0.5 1.7 0.9 1.1 1.5 0.8Z" fill="#4285F4"/>
                  <path d="M19.5 9L14.5 13.5L19.5 18L22.8 16.2C23.7 15.7 23.7 14.8 23.7 13.5C23.7 12.2 23.7 11.3 22.8 10.8L19.5 9Z" fill="#FBBC05"/>
                  <path d="M1.5 0.8L14.5 13.5L19.5 9L4.2 0.1C3.1 -0.5 2 0 1.5 0.8Z" fill="#EA4335"/>
                  <path d="M1.5 26.2L14.5 13.5L19.5 18L4.2 26.9C3.1 27.5 2 27 1.5 26.2Z" fill="#34A853"/>
                </svg>
                <span>
                  <p className="leading-none mb-1" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>Get it on</p>
                  <p className="font-bold text-white leading-none" style={{ fontSize: 14, letterSpacing: '-0.01em' }}>Google Play</p>
                </span>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex">
                {AVATARS.map((a, i) => (
                  <div key={i} className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '2px solid #07091A', marginLeft: i === 0 ? 0 : -9 }}>
                    <img
                      src={`/images/${a.file}`}
                      alt={a.name}
                      loading="lazy"
                      decoding="async"
                      width={36}
                      height={36}
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
                        background: 'rgba(243,106,70,0.18)',
                        border: '1px solid rgba(243,106,70,0.38)',
                        backdropFilter: 'blur(6px)',
                        animation: `giftPop 3.6s ease-in-out ${g.delay} infinite`,
                      }}>
                      {g.icon} {g.text} from <span style={{ color: '#F36A46' }}>{g.user}</span>
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
                <img src="/images/creator-elena.jpg" alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 30%,rgba(7,9,26,0.9) 100%)' }} />
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white font-black rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: '#EF4444' }}>
                  <span style={{ fontSize: 8 }}>●</span>LIVE
                </div>
                <div className="absolute top-3 right-3 font-bold rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: 'rgba(93,221,144,0.15)', border: '1px solid rgba(93,221,144,0.32)', color: '#5DDD90' }}>
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
                <img src="/images/creator-marcus.jpg" alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 30%,rgba(7,9,26,0.9) 100%)' }} />
                <div className="absolute top-3 left-3 font-bold rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, background: 'rgba(252,164,75,0.15)', border: '1px solid rgba(252,164,75,0.3)', color: '#FCA44B' }}>
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
                border: '1px solid rgba(93,221,144,0.28)',
                borderRadius: 14,
                padding: '14px 18px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                minWidth: 200,
              }}>
              <span className="text-2xl leading-none">💰</span>
              <div>
                <p className="mb-0.5" style={{ fontSize: 11, color: '#7A8FB8' }}>This month&apos;s earnings</p>
                <p className="font-black leading-none" style={{ fontSize: 22, color: '#5DDD90', letterSpacing: '-0.02em' }}>$4,280.00</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
