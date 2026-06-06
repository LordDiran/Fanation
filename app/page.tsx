import Image from 'next/image'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'

// ─── Data ────────────────────────────────────────────────────────────────────

const TICKER = [
  { dot: '#22C55E', text: '@sofia earned ', bold: '₦2,480', rest: ' this month' },
  { dot: '#2599F6', text: '', bold: '8,247 fans', rest: ' watching live right now' },
  { dot: '#F5A623', text: '@marcusbeats unlocked ', bold: '₦1,800', rest: ' in 48 hrs' },
  { dot: '#22C55E', text: '', bold: '2.4M coins', rest: ' gifted today' },
  { dot: '#2599F6', text: '@priscilia hit ', bold: '10K subscribers', rest: '' },
  { dot: '#F5A623', text: '', bold: '₦4.2M+', rest: ' paid out to creators' },
  { dot: '#22C55E', text: 'New creator joined every ', bold: '4 minutes', rest: '' },
  { dot: '#2599F6', text: '@dembe earned ', bold: '₦3,100', rest: ' from one live stream' },
]

const STATS = [
  { val: '₦6.7B+', label: 'Paid to creators',    sub: 'and growing daily' },
  { val: '12K+',   label: 'Active creators',      sub: 'across 180+ countries' },
  { val: '2.4M',   label: 'Coins gifted daily',   sub: 'real-time gifting economy' },
  { val: '24h',    label: 'Payout turnaround',    sub: 'no 30-day holds' },
]

const STEPS = [
  { n: '01', icon: '✨', title: 'Create Your Creator Profile',  body: 'Set up your page, customise your profile, showcase your content, and tell your story. Takes under two minutes, no approvals.' },
  { n: '02', icon: '💰', title: 'Invite Your Audience',         body: 'Share your Fanation profile and bring your followers, supporters, and community into one place. Your existing fans, your new home.' },
  { n: '03', icon: '🚀', title: 'Monetize Your Community',      body: 'Earn through subscriptions, gifts, exclusive content, live sessions, and premium experiences. Multiple revenue streams from day one.' },
]

const LIVE_GIFTS = [
  { user: '@jayden', text: 'sent 500 coins' },
  { user: '@priscilia', text: 'sent ₦25 gift' },
  { user: '@marcus_t', text: 'sent 200 coins' },
]

const LIVE_CHECKS = [
  'Low-latency live video',
  'On-screen coin and gift notifications',
  'Earnings dashboard updates every second',
  'Save and monetise your stream replays',
]

const FEATURES = [
  { icon: '💳', bg: 'rgba(37,153,246,0.12)',   border: 'rgba(37,153,246,0.2)',   title: 'Earn Recurring Income',         body: 'Create subscription plans and generate predictable monthly revenue from your most loyal supporters.',                           pills: ['Monthly memberships', 'Annual plans', 'Tiered access'] },
  { icon: '🪙', bg: 'rgba(245,166,35,0.12)',   border: 'rgba(245,166,35,0.2)',   title: 'Go Live & Get Paid',             body: 'Host live sessions, interact in real time, and receive gifts and support directly from fans as it happens.',                   pills: ['Real-time gifts', 'Live interaction', 'Instant payouts'] },
  { icon: '🔴', bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.2)',    title: 'Own Your Community',             body: 'Build direct relationships through communities, messaging, and exclusive experiences. No algorithm between you and your fans.', pills: ['Direct messaging', 'Group communities', 'No algorithm'] },
  { icon: '🎬', bg: 'rgba(168,85,247,0.12)',   border: 'rgba(168,85,247,0.2)',   title: 'Sell Exclusive Content',         body: 'Offer premium videos, photos, audio, behind-the-scenes content, and subscriber-only experiences.',                            pills: ['Pay-per-view', 'Subscriber drops', 'Private media'] },
  { icon: '📈', bg: 'rgba(34,197,94,0.12)',    border: 'rgba(34,197,94,0.2)',    title: 'Grow Beyond Algorithms',         body: 'Stay connected with your audience without depending on social media reach or changing platform rules.',                         pills: ['Direct audience access', 'No feed throttling', 'You own your fans'] },
  { icon: '📊', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.2)',   title: 'Manage Your Creator Business',  body: 'Track earnings, monitor engagement, manage subscribers, and grow your brand with confidence.',                                 pills: ['Earnings dashboard', 'Subscriber analytics', 'Growth insights'] },
]

const CREATORS = [
  { name: 'Marcus', role: 'Podcaster',        avg: '₦4.5M avg/mo', photo: 'photo-1506794778202-cad84cf45f1d' },
  { name: 'Dembe',  role: 'Fitness Coach',    avg: '₦3.0M avg/mo', photo: 'photo-1549476464-37392f717541' },
  { name: 'Sofia',  role: 'Model · Creator',  avg: '₦8.3M avg/mo', photo: 'photo-1529626455594-4ff0802cfb7e' },
  { name: 'Aisha',  role: 'Travel Creator',   avg: '₦4.9M avg/mo', photo: 'photo-1573496359142-b8d87734a5a2' },
  { name: 'Tobi',   role: 'Vlogger',          avg: '₦3.8M avg/mo', photo: 'photo-1507003211169-0a1dd7228f2d' },
  { name: 'Nadia',  role: 'Lifestyle Creator',avg: '₦6.4M avg/mo', photo: 'photo-1517841905240-472988babdf9' },
]

const EARN = [
  { n: '01', title: 'Fan Gifts & Coins',                body: 'Fans buy coins and send them on posts, in DMs, and during live streams. Cash out whenever you like, no hold periods.' },
  { n: '02', title: 'Subscriptions',                    body: 'Create recurring revenue through monthly or annual memberships. Subscriber tiers unlock exclusive posts, media, and DMs.' },
  { n: '03', title: 'Exclusive Content',                body: "Unlock premium videos, photos, audio, and experiences for paying supporters. Content your audience can't find anywhere else." },
  { n: '04', title: 'VIP Communities & Premium Access', body: 'Create private communities for your most engaged fans, offer early access, and build special experiences that deepen loyalty.' },
]

const COMPARE_OTHER = [
  'Payouts delayed 7–30 days',
  'Algorithm decides who sees your content',
  'No live gifting or coin economy',
  'Platform takes 20–30%+ of your earnings',
  'Single revenue stream, no flexibility',
  'Pay-per-view drops not supported',
]

const COMPARE_FANATION = [
  'Same-day payouts, every time',
  'Direct access to fans — no algorithm tax',
  'Live streaming with real-time coins and gifts',
  'Creator-first revenue split, no surprises',
  'Subscriptions, PPV, live, coins — all in one',
  'Pay-per-view drops built in from day one',
]

const TESTIMONIALS = [
  { name: 'Priscilia O.', handle: '@yummychill54', role: 'Lifestyle Creator', stat: '+₦3.9M this month', photo: 'photo-1531746020798-e6953c6e8e04', quote: "I left my old platform after three years of watching fees eat my income. Two months on Fanation and I've tripled what I made there — the live gifting alone covered my rent in one stream." },
  { name: 'Marcus T.',    handle: '@marcusbeats',  role: 'Verified Creator',  stat: 'PPV drop earner',   photo: 'photo-1506794778202-cad84cf45f1d', quote: "Pay-per-view drops changed everything. I put a track behind a paywall, promoted it once, and woke up to eight figures. I'd been leaving money on the table for years." },
  { name: 'Lara K.',      handle: '@laracreates',  role: 'Verified Creator',  stat: 'Community builder', photo: 'photo-1573496359142-b8d87734a5a2', quote: 'The DMs and group chats keep my fans close. It feels personal, and the payouts are fast and reliable.' },
]

const FAQS = [
  { q: 'Is Fanation free to join?',            a: 'Yes — signing up is completely free. You only pay when you earn. There are no monthly platform fees or setup costs.' },
  { q: 'How and when do I get paid?',           a: 'Fanation processes payouts within 24 hours. No 30-day holds, no delays. Earnings from subscriptions, gifts, and PPV are available quickly.' },
  { q: 'What types of content can I share?',    a: 'Posts, photos, videos, live streams, audio, behind-the-scenes media, and subscriber-only collections. If you create it, Fanation supports it.' },
  { q: 'Is there a minimum payout amount?',     a: 'Yes — the minimum payout is ₦20,000 (or equivalent in your local currency). Most active creators hit this within their first week.' },
  { q: 'Can fans follow me for free?',          a: "Yes. Fans can follow your profile for free and see your public content. They subscribe or gift to access premium content and support you directly." },
  { q: 'What does Fanation charge?',            a: 'Fanation takes a small percentage of transactions — no monthly fees, no setup costs. You only pay when you earn. Early creators will have access to the most competitive rate available.' },
  { q: 'Do I need a large following to earn?',  a: 'No. Many creators earn consistently with a few hundred dedicated fans. A smaller, engaged audience who subscribes and gifts is often more valuable than a large passive following.' },
]

const TRUST = [
  { icon: '🔒', text: 'SSL secure & encrypted' },
  { icon: '✅', text: 'GDPR compliant' },
  { icon: '⚡', text: '24h payout guarantee' },
  { icon: '🌍', text: '180+ countries supported' },
]

// ─── Section helpers ─────────────────────────────────────────────────────────

function SectionTag({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="text-xs font-extrabold uppercase block mb-4" style={{ letterSpacing: '0.12em', color: color || '#2599F6' }}>
      {children}
    </span>
  )
}

function SectionHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-black leading-[1.1] tracking-tight ${className}`}
      style={{ fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.03em' }}>
      {children}
    </h2>
  )
}

function CheckIcon() {
  return (
    <span className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
      style={{ minWidth: 22, height: 22, background: 'rgba(37,153,246,0.12)', border: '1px solid rgba(37,153,246,0.28)', color: '#2599F6', fontSize: 11, fontWeight: 900 }}>
      ✓
    </span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const BORDER = 'rgba(255,255,255,0.07)'

  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* ── Marquee Ticker Strip ───────────────────────────────────────── */}
        <div className="overflow-hidden" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: '#0C1121', padding: '16px 0' }}>
          <div className="flex marquee-ticker-track whitespace-nowrap" style={{ width: 'max-content' }}>
            {[...TICKER, ...TICKER].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-2 flex-shrink-0"
                style={{ padding: '0 32px', borderRight: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, color: '#7A8FB8' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                <span>
                  {item.text}
                  <strong className="text-white">{item.bold}</strong>
                  {item.rest}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats Section ─────────────────────────────────────────────── */}
        <section style={{ padding: '64px 0' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.val} className="text-center px-5"
                  style={{ borderRight: i < STATS.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <p className="stat-gradient-text font-black leading-none mb-2"
                    style={{ fontSize: 'clamp(40px,4.5vw,56px)', letterSpacing: '-0.04em' }}>
                    {s.val}
                  </p>
                  <p style={{ fontSize: 14, color: '#7A8FB8', fontWeight: 500 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section id="features" style={{ padding: '100px 0', background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>How it works</SectionTag>
              <SectionHead>Start Earning In Three Simple Steps</SectionHead>
              <p className="mt-4 max-w-xl mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Whether you&apos;re just starting out or already have a thriving audience, Fanation gets you earning from day one.
              </p>
            </div>
            <div className="grid md:grid-cols-[1fr_40px_1fr_40px_1fr] items-center">
              {STEPS.map((s, i) => (
                <>
                  <div key={s.n} className="how-step rounded-[22px] p-9 relative"
                    style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                    <div className="text-xs font-black tracking-[0.1em] mb-5" style={{ color: '#2599F6', textTransform: 'uppercase' }}>
                      Step {s.n}
                    </div>
                    <div className="flex items-center justify-center rounded-2xl mb-5 text-[26px]"
                      style={{ width: 56, height: 56, background: 'rgba(37,153,246,0.1)', border: '1px solid rgba(37,153,246,0.18)' }}>
                      {s.icon}
                    </div>
                    <h3 className="font-black text-white mb-2.5" style={{ fontSize: 19, letterSpacing: '-0.02em' }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#7A8FB8', lineHeight: 1.72 }}>{s.body}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div key={`arrow-${i}`} className="hidden md:flex items-center justify-center" style={{ color: 'rgba(37,153,246,0.3)', fontSize: 24 }}>
                      →
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </section>

        {/* ── Live Gifting Section ───────────────────────────────────────── */}
        <section style={{ padding: '110px 0', position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 20% 50%,rgba(37,153,246,0.06) 0%,transparent 60%)' }} />
          <div className="max-w-[1180px] mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">

              {/* Left: phone mockup */}
              <div className="relative hidden lg:block" style={{ maxWidth: 340, margin: '0 auto' }}>
                <div className="relative rounded-[28px] overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.65)' }}>
                  <div className="relative" style={{ aspectRatio: '9/16' }}>
                    <Image
                      src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=360&h=640&fit=crop"
                      alt="Creator live streaming"
                      fill className="object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0.1) 0%,rgba(7,9,26,0.7) 100%)' }} />
                    {/* Phone UI */}
                    <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: '20px 16px' }}>
                      {/* Top row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-white font-black rounded-full px-3 py-1"
                          style={{ fontSize: 12, background: '#EF4444', letterSpacing: '0.06em' }}>
                          <span style={{ fontSize: 8 }}>●</span> LIVE
                        </div>
                        <div className="flex items-center gap-1.5 text-white rounded-full px-3 py-1"
                          style={{ fontSize: 12, fontWeight: 600, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                          8,247 watching
                        </div>
                      </div>
                      {/* Bottom: gifts + earnings */}
                      <div>
                        <div className="flex flex-col gap-2 mb-2">
                          {LIVE_GIFTS.map((g, i) => (
                            <div key={i} className="flex items-center gap-2 text-white rounded-full px-3.5 py-2"
                              style={{
                                fontSize: 12, fontWeight: 600,
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                animation: `giftPop 4s ease-in-out ${i * 1.4}s infinite`,
                              }}>
                              <span className="font-black" style={{ color: '#F5A623' }}>{g.user}</span>
                              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{g.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2.5 rounded-[14px] p-3.5"
                          style={{ background: 'rgba(7,9,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(34,197,94,0.25)' }}>
                          <span className="text-xl">💰</span>
                          <div>
                            <p style={{ fontSize: 11, color: '#7A8FB8' }}>Earned this stream</p>
                            <p className="font-black" style={{ fontSize: 24, color: '#22C55E', letterSpacing: '-0.02em' }}>₦1,240,000</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Float stat badge */}
                <div className="absolute text-center rounded-[14px] px-4 py-3.5"
                  style={{ top: 20, right: -24, background: '#18223C', border: '1px solid rgba(245,166,35,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', minWidth: 140 }}>
                  <p style={{ fontSize: 11, color: '#7A8FB8', marginBottom: 4 }}>Coins sent today</p>
                  <p className="font-black" style={{ fontSize: 26, color: '#F5A623', letterSpacing: '-0.02em' }}>2.4M 🪙</p>
                </div>
              </div>

              {/* Right: copy */}
              <div>
                <SectionTag color="#EF4444">● Live Streaming</SectionTag>
                <h2 className="font-black text-white mb-5" style={{ fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
                  Go Live. Connect Instantly.
                </h2>
                <p className="mb-8 leading-[1.78]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                  Start a stream in seconds, watch coins and gifts roll in from your fans, and see your earnings update in real time — all while building real connection with your community.
                </p>
                <ul className="flex flex-col gap-3.5 mb-10">
                  {LIVE_CHECKS.map(item => (
                    <li key={item} className="flex items-start gap-3 leading-[1.55]"
                      style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)' }}>
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#"
                  className="inline-flex items-center text-white font-bold"
                  style={{ background: '#2599F6', fontSize: 15, padding: '15px 30px', borderRadius: '100px', transition: 'background .2s, box-shadow .2s' }}>
                  Start your first stream →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Cards ─────────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>Everything in one place</SectionTag>
              <SectionHead>One platform for posting,<br />streaming, and earning</SectionHead>
              <p className="mt-4 max-w-xl mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Whether you&apos;re just starting out or already have a thriving audience, Fanation gives you the tools to grow, engage, and monetize.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(f => (
                <div key={f.title} className="feat-card rounded-[22px] p-9 flex flex-col gap-5"
                  style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-center rounded-[15px] text-[26px]"
                    style={{ width: 54, height: 54, background: f.bg, border: `1px solid ${f.border}` }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-white mb-3" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{f.title}</h3>
                    <p style={{ fontSize: 15, color: '#7A8FB8', lineHeight: 1.72 }}>{f.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {f.pills.map(p => (
                      <span key={p} className="font-semibold rounded-full px-3 py-1"
                        style={{ fontSize: 12, color: '#7A8FB8', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Creator Types — static mosaic grid ────────────────────────── */}
        <section id="creators" style={{ padding: '100px 0' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Header: left-aligned heading + right-side CTA */}
            <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
              <div>
                <SectionTag>Built for every creator</SectionTag>
                <SectionHead>Built For Every Type Of Creator</SectionHead>
                <p className="mt-3 max-w-[480px] leading-[1.72]" style={{ fontSize: 16, color: '#7A8FB8' }}>
                  No matter your niche, Fanation helps you connect, engage, and earn from your audience.
                </p>
              </div>
              <a href="#"
                className="inline-flex items-center text-white font-semibold flex-shrink-0"
                style={{ fontSize: 15, padding: '15px 30px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', transition: 'border-color .2s, background .2s' }}>
                Explore all categories →
              </a>
            </div>
            {/* 3-col mosaic grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              {CREATORS.map(c => (
                <div key={c.name} className="ctype-card relative rounded-[20px] overflow-hidden"
                  style={{ aspectRatio: '3/4', background: 'linear-gradient(145deg,#111830,#18223C)' }}>
                  <Image
                    src={`https://images.unsplash.com/${c.photo}?w=280&h=373&fit=crop&crop=faces`}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 40%,rgba(7,9,26,0.92) 100%)' }} />
                  {/* Earnings badge */}
                  <div className="absolute top-3 right-3 z-10 font-bold rounded-full px-2.5 py-1"
                    style={{ fontSize: 11, color: '#22C55E', background: 'rgba(7,9,26,0.72)', backdropFilter: 'blur(8px)', border: `1px solid ${BORDER}` }}>
                    {c.avg}
                  </div>
                  {/* Name + role */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                    <p className="font-black text-white mb-0.5" style={{ fontSize: 16 }}>{c.name}</p>
                    <p className="flex items-center gap-1.5" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                      <span style={{ color: '#2599F6', fontSize: 10 }}>✳</span>{c.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Creator type labels */}
            <p className="text-center mt-10" style={{ fontSize: 13, color: '#7A8FB8' }}>
              Musicians · Influencers · Podcasters · Educators · Coaches · Athletes · Artists · Streamers · Entertainers · Lifestyle Creators · Fitness Creators · Travel Creators
            </p>
          </div>
        </section>

        {/* ── Earn ──────────────────────────────────────────────────────── */}
        <section id="earn" style={{ padding: '100px 0', background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>Monetize your work</SectionTag>
              <SectionHead>More Ways To Earn<br />From What You Create</SectionHead>
              <p className="mt-4 max-w-xl mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Your audience supports you in different ways. Fanation gives you multiple revenue streams — mix and match what fits how you create.
              </p>
              <p className="mt-3 font-semibold" style={{ fontSize: 14, color: 'rgba(37,153,246,0.7)' }}>
                🌍 Creators are paid in their local currency — NGN, USD, GBP, EUR, KES, GHS, and more.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {EARN.map(e => (
                <div key={e.n} className="earn-card flex gap-5 items-start rounded-[22px] p-9"
                  style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                  <div className="font-black leading-none flex-shrink-0" style={{ fontSize: 48, color: 'rgba(37,153,246,0.16)', width: 52, letterSpacing: '-0.03em' }}>
                    {e.n}
                  </div>
                  <div>
                    <h3 className="font-black text-white mb-2.5" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{e.title}</h3>
                    <p style={{ fontSize: 15, color: '#7A8FB8', lineHeight: 1.7 }}>{e.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 0' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>Why Fanation</SectionTag>
              <SectionHead>Built for creators,<br />not the platform.</SectionHead>
              <p className="mt-4 max-w-lg mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Every other platform forces a trade-off. Fanation is the only platform where live gifting, subscriptions, coins, and content all work together.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional platforms */}
              <div className="rounded-[20px] p-9" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
                <p className="font-bold pb-5 mb-7" style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', borderBottom: `1px solid ${BORDER}`, letterSpacing: '-0.01em' }}>
                  Traditional creator platforms
                </p>
                <ul className="flex flex-col gap-4">
                  {COMPARE_OTHER.map(item => (
                    <li key={item} className="flex items-start gap-3" style={{ fontSize: 14, color: '#7A8FB8' }}>
                      <span className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                        style={{ minWidth: 20, height: 20, background: 'rgba(255,255,255,0.07)', color: '#7A8FB8', fontSize: 12, fontWeight: 700 }}>
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Fanation */}
              <div className="rounded-[20px] p-9" style={{ background: 'rgba(37,153,246,0.07)', border: '1px solid rgba(37,153,246,0.25)' }}>
                <p className="font-bold pb-5 mb-7" style={{ fontSize: 17, color: '#2599F6', borderBottom: '1px solid rgba(37,153,246,0.2)', letterSpacing: '-0.01em' }}>
                  Fanation
                </p>
                <ul className="flex flex-col gap-4">
                  {COMPARE_FANATION.map(item => (
                    <li key={item} className="flex items-start gap-3 text-white" style={{ fontSize: 14 }}>
                      <span className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                        style={{ minWidth: 20, height: 20, background: 'rgba(37,153,246,0.2)', color: '#2599F6', fontSize: 12, fontWeight: 700 }}>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>Real creators, real income</SectionTag>
              <SectionHead>Hear from the people<br />building their living on Fanation</SectionHead>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map(t => (
                <div key={t.handle} className="t-card rounded-[22px] p-[34px] flex flex-col"
                  style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                  <div className="mb-4" style={{ color: '#F5A623', fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
                  <p className="flex-1 mb-7 italic leading-[1.78]"
                    style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={`https://images.unsplash.com/${t.photo}?w=88&h=88&fit=crop&crop=faces`}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white" style={{ fontSize: 14 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: '#7A8FB8' }}>{t.handle} · {t.role}</p>
                    </div>
                    <div className="ml-auto text-right flex-shrink-0">
                      <p className="font-black" style={{ fontSize: 15, color: '#22C55E' }}>{t.stat}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ — sidebar layout ───────────────────────────────────────── */}
        <section id="faq" style={{ padding: '100px 0' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid lg:grid-cols-[1fr_1.6fr] gap-20 items-start">
              {/* Sidebar */}
              <div>
                <SectionTag>Questions</SectionTag>
                <h2 className="font-black text-white mb-4 leading-[1.1]"
                  style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-0.03em' }}>
                  Everything you want to know
                </h2>
                <p className="mb-7 leading-[1.75]" style={{ fontSize: 16, color: '#7A8FB8' }}>
                  Can&apos;t find what you&apos;re looking for? Our team is here to help you get started and keep earning.
                </p>
                <a href="#"
                  className="inline-flex items-center text-white font-semibold"
                  style={{ fontSize: 15, padding: '15px 30px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', transition: 'border-color .2s, background .2s' }}>
                  Contact support →
                </a>
              </div>
              {/* FAQ accordion */}
              <div className="flex flex-col gap-2.5">
                {FAQS.map(f => (
                  <details key={f.q} className="faq-item group rounded-[14px] overflow-hidden"
                    style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                    <summary className="flex items-center justify-between px-5 py-5 cursor-pointer list-none font-bold select-none"
                      style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                      {f.q}
                      <span className="flex items-center justify-center rounded-full flex-shrink-0 ml-4 transition-transform duration-200 group-open:rotate-45"
                        style={{ width: 24, height: 24, background: 'rgba(37,153,246,0.1)', border: '1px solid rgba(37,153,246,0.2)', fontSize: 18, color: '#2599F6', fontWeight: 300, lineHeight: 1 }}>
                        +
                      </span>
                    </summary>
                    <p className="faq-body px-5 pb-5 leading-[1.78]" style={{ fontSize: 14, color: '#7A8FB8' }}>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section style={{ padding: '130px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%,rgba(37,153,246,0.1) 0%,transparent 65%),
                         radial-gradient(ellipse 40% 40% at 20% 80%,rgba(245,166,35,0.05) 0%,transparent 55%)`
          }} />
          <div className="max-w-[1180px] mx-auto px-6 relative z-10">
            <SectionTag>Get started</SectionTag>
            <h2 className="font-black text-white mb-5 leading-[1.06]"
              style={{ fontSize: 'clamp(34px,5vw,68px)', letterSpacing: '-0.04em' }}>
              Ready To Build Something<br />
              <em className="not-italic" style={{ color: '#2599F6' }}>Bigger Than Followers?</em>
            </h2>
            <p className="mb-3 mx-auto max-w-xl" style={{ fontSize: 18, color: '#7A8FB8' }}>
              Join creators who are building communities, creating meaningful fan relationships, and earning directly from the value they create.
            </p>
            <p className="mb-12 mx-auto" style={{ fontSize: 13, color: '#7A8FB8' }}>
              Your audience already believes in you. Now give them a place to belong.
            </p>

            {/* Trust strip */}
            <div className="flex items-center justify-center flex-wrap gap-6 mb-10">
              {TRUST.map(t => (
                <div key={t.text} className="flex items-center gap-2"
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a href="#"
                className="inline-flex items-center text-white font-bold"
                style={{ background: '#2599F6', fontSize: 17, padding: '18px 40px', borderRadius: '100px', transition: 'background .2s, box-shadow .2s' }}>
                Start Creating For Free →
              </a>
              <a href="#features"
                className="inline-flex items-center text-white font-semibold"
                style={{ fontSize: 17, padding: '18px 40px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', transition: 'border-color .2s, background .2s' }}>
                Explore Fanation
              </a>
            </div>

            {/* App badges */}
            <div className="flex items-center justify-center flex-wrap gap-3 pt-10" style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }}>
              <span style={{ fontSize: 13, color: '#7A8FB8' }}>Download the app</span>
              {[
                { icon: '🍎', sub: 'Download on the', name: 'App Store' },
                { icon: '▶', sub: 'Get it on', name: 'Google Play' },
              ].map(b => (
                <a key={b.name} href="#"
                  className="inline-flex items-center gap-2.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '11px 20px', borderRadius: 12 }}>
                  <span className="text-xl leading-none">{b.icon}</span>
                  <span>
                    <p className="leading-none mb-0.5" style={{ fontSize: 10, color: '#7A8FB8' }}>{b.sub}</p>
                    <p className="font-bold text-white leading-none" style={{ fontSize: 15 }}>{b.name}</p>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid rgba(255,255,255,0.07)`, padding: '64px 0 32px', background: '#07091A' }}>
        <div className="max-w-[1180px] mx-auto px-6">
          {/* Top 4-col grid */}
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
            {/* Brand col */}
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center overflow-hidden" style={{ background: '#0C1121' }}>
                  <svg viewBox="80 40 240 245" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                    <g fill="#2599F6">
                      <path d="M 279.3 68.36 L 275.0 64.06 L 268.75 60.16 L 261.72 57.42 L 254.30 56.25 L 247.27 56.64 L 238.48 59.18 L 231.25 63.48 L 225.59 69.14 L 218.75 79.10 L 214.45 90.82 L 212.89 103.52 L 213.87 116.21 L 216.40 125.0 L 220.70 133.20 L 218.75 134.96 L 211.52 141.02 L 206.05 148.24 L 201.95 156.64 L 200.19 165.82 L 200.97 175.0 L 204.29 183.98 L 209.76 191.99 L 217.38 198.44 L 226.56 202.54 L 236.91 203.91 L 247.27 201.95 L 255.86 196.87 L 259.57 192.77 L 262.11 195.70 L 265.62 198.63 L 271.09 201.17 L 277.34 202.54 L 283.39 202.54 L 290.62 199.61 L 296.87 195.31 L 301.56 188.67 L 304.10 181.05 L 303.90 173.24 L 301.36 165.82 L 296.87 159.57 L 290.42 154.88 L 287.30 153.71 L 291.21 145.51 L 293.55 138.09 L 294.14 130.66 L 293.16 123.83 L 290.62 117.38 L 286.71 111.91 L 281.25 107.22 L 279.88 106.25 L 282.81 97.07 L 283.39 88.09 Z M 257.42 87.11 L 261.52 90.43 L 264.84 95.12 L 266.79 101.17 L 266.60 107.81 L 264.06 114.45 L 259.18 119.92 L 252.54 123.24 L 245.51 124.02 L 238.87 122.27 L 233.20 118.16 L 229.30 112.30 L 227.73 105.86 L 228.52 99.02 L 231.64 93.36 L 236.52 89.06 L 242.77 86.91 L 249.80 86.52 Z M 253.32 160.35 L 258.20 163.87 L 261.13 168.75 L 261.91 174.41 L 260.15 180.08 L 256.45 184.18 L 251.17 186.72 L 245.51 187.11 L 240.04 185.35 L 235.74 181.64 L 233.20 176.37 L 232.81 170.51 L 234.57 165.23 L 238.09 161.13 L 243.16 158.59 L 248.83 157.81 Z" />
                      <path d="M 245.31 147.66 L 237.5 141.02 L 229.3 137.5 L 225.78 136.91 L 227.73 133.79 L 229.49 129.10 L 230.27 123.83 L 229.30 117.38 L 229.88 117.38 L 237.30 119.92 L 245.51 120.90 L 253.71 119.92 L 261.13 117.38 L 261.13 117.57 L 260.35 124.02 L 261.52 129.88 L 264.45 135.16 L 261.91 135.74 L 254.69 139.26 Z" />
                    </g>
                  </svg>
                </div>
                <span className="font-black text-[18px] text-white" style={{ letterSpacing: '-0.01em' }}>Fanation</span>
              </div>
              <p className="mb-5 leading-[1.7] max-w-[260px]" style={{ fontSize: 14, color: '#7A8FB8' }}>
                Fanation empowers creators to own their audience, deepen fan relationships, and build sustainable income through community, content, and meaningful engagement.
              </p>
              {/* Social icons */}
              <div className="flex gap-2.5">
                {[
                  { label: 'X/Twitter', path: 'M18 6.48l-4.96 5.52L18 18h-3.36l-3.24-3.84L8.16 18H5.04l5.28-5.88L5.04 6h3.36l2.88 3.48L14.64 6H18z' },
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { label: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.21 8.21 0 004.79 1.52V6.55a4.85 4.85 0 01-1.02.14z' },
                  { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
                ].map(s => (
                  <a key={s.label} href="#" aria-label={s.label}
                    className="flex items-center justify-center rounded-[9px] transition-all"
                    style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.07)`, color: '#7A8FB8' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-black uppercase tracking-[0.1em] mb-4" style={{ fontSize: 12, color: '#7A8FB8' }}>Product</h4>
              <ul className="flex flex-col gap-3">
                {['Features', 'Go Live', 'Subscriptions', 'Coins & Gifting', 'Mobile App'].map(l => (
                  <li key={l}><a href="#" className="transition-colors hover:text-white" style={{ fontSize: 14, color: '#7A8FB8' }}>{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Creator links */}
            <div>
              <h4 className="font-black uppercase tracking-[0.1em] mb-4" style={{ fontSize: 12, color: '#7A8FB8' }}>Creators</h4>
              <ul className="flex flex-col gap-3">
                {['Become a Creator', 'Creator Academy', 'Payouts', 'Success Stories'].map(l => (
                  <li key={l}><a href="#" className="transition-colors hover:text-white" style={{ fontSize: 14, color: '#7A8FB8' }}>{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-black uppercase tracking-[0.1em] mb-4" style={{ fontSize: 12, color: '#7A8FB8' }}>Company</h4>
              <ul className="flex flex-col gap-3">
                {['About', 'Careers', 'Press', 'Contact'].map(l => (
                  <li key={l}><a href="#" className="transition-colors hover:text-white" style={{ fontSize: 14, color: '#7A8FB8' }}>{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6" style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }}>
            <p style={{ fontSize: 13, color: '#7A8FB8' }}>© {new Date().getFullYear()} Fanation. All rights reserved.</p>
            <div className="flex gap-5">
              {['Terms of Service', 'Privacy', 'Cookie Notice'].map(l => (
                <a key={l} href="#" className="transition-colors hover:text-white" style={{ fontSize: 13, color: '#7A8FB8' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
