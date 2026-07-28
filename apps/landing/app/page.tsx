import Image from 'next/image'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import SocialIcons from '@/components/SocialIcons'

// ─── Data ────────────────────────────────────────────────────────────────────

const TICKER = [
  { dot: '#5DDD90', text: '@sofia earned ', bold: '$2,480', rest: ' this month' },
  { dot: '#2599F6', text: '', bold: '8,247 fans', rest: ' watching live right now' },
  { dot: '#FCA44B', text: '@marcusbeats unlocked ', bold: '$1,800', rest: ' in 48 hrs' },
  { dot: '#5DDD90', text: '', bold: '2.4M coins', rest: ' gifted today' },
  { dot: '#2599F6', text: '@priscilia hit ', bold: '10K subscribers', rest: '' },
  { dot: '#FCA44B', text: '', bold: '$4.2M+', rest: ' paid out to creators' },
  { dot: '#5DDD90', text: 'New creator joined every ', bold: '4 minutes', rest: '' },
  { dot: '#2599F6', text: '@dembe earned ', bold: '$3,100', rest: ' from one live stream' },
]

const STATS = [
  { val: '$4.2M+', label: 'Paid out to creators', sub: 'and growing daily' },
  { val: '12K+',   label: 'Active creators',       sub: 'across 180+ countries' },
  { val: '2.4M',   label: 'Coins gifted daily',    sub: 'real-time gifting economy' },
  { val: '24h',    label: 'Payout turnaround',     sub: 'no 30-day holds' },
]

const STEPS = [
  { n: '01', icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60B8FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>
      </svg>
    ), title: 'Create Your Creator Profile',  body: 'Set up your page, customise your profile, showcase your content, and tell your story. Takes under two minutes, no approvals.' },
  { n: '02', icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60B8FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ), title: 'Invite Your Audience',         body: 'Share your Fanation profile and bring your followers, supporters, and community into one place. Your existing fans, your new home.' },
  { n: '03', icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60B8FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ), title: 'Monetize Your Community',      body: 'Earn through subscriptions, gifts, exclusive content, live sessions, and premium experiences. Multiple revenue streams from day one.' },
]

const LIVE_GIFTS = [
  { user: '@jayden', text: 'sent 500 coins' },
  { user: '@priscilia', text: 'sent $25 gift' },
  { user: '@marcus_t', text: 'sent 200 coins' },
]

const LIVE_CHECKS = [
  'Low-latency live video with real-time chat',
  'On-screen coin and gift notifications',
  'Earnings dashboard updates every second',
  'Save and monetise your stream replays',
]

const FEATURES = [
  { icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60B8FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="22" height="16" x="1" y="4" rx="2" ry="2"/><line x1="1" x2="23" y1="10" y2="10"/>
      </svg>
    ), bg: 'rgba(37,153,246,0.12)',   border: 'rgba(37,153,246,0.2)',   title: 'Earn Recurring Income',        body: 'Create subscription plans and generate predictable monthly revenue from your most loyal supporters. Tiered access means fans choose what they value most.',                          pills: ['Monthly memberships', 'Annual plans', 'Tiered access'] },
  { icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FCA44B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/>
      </svg>
    ), bg: 'rgba(252,164,75,0.12)',   border: 'rgba(252,164,75,0.2)',   title: 'Go Live & Get Paid',            body: 'Host live sessions, interact in real time, and receive gifts and support directly from fans as it happens. The most addictive earn loop on Fanation.',                  pills: ['Real-time gifts', 'Live interaction', 'Instant payouts'] },
  { icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ), bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.2)',    title: 'Own Your Community',            body: 'Build direct relationships through communities, messaging, comments, and exclusive experiences. Your fans, your space — no algorithm between you and them.', pills: ['Direct messaging', 'Group communities', 'No algorithm'] },
  { icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ), bg: 'rgba(168,85,247,0.12)',   border: 'rgba(168,85,247,0.2)',   title: 'Sell Exclusive Content',        body: 'Offer premium videos, photos, audio, behind-the-scenes content, and subscriber-only experiences. Lock what\'s valuable and let fans pay to unlock.',                           pills: ['Pay-per-view', 'Subscriber drops', 'Private media'] },
  { icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5DDD90" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ), bg: 'rgba(93,221,144,0.12)',   border: 'rgba(93,221,144,0.2)',   title: 'Grow Beyond Algorithms',        body: 'Stay connected with your audience without depending on social media reach or changing platform rules. On Fanation, you own the relationship.',                        pills: ['Direct audience access', 'No feed throttling', 'You own your fans'] },
  { icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
      </svg>
    ), bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.2)',   title: 'Manage Your Creator Business', body: 'Track earnings, monitor engagement, manage subscribers, and grow your brand with confidence. Everything you need to run a serious creator business.',                                pills: ['Earnings dashboard', 'Subscriber analytics', 'Growth insights'] },
]

const CREATORS = [
  { name: 'Marcus', role: 'Podcaster',         avg: '$2.8K avg/mo', photo: '/images/creator-marcus.jpg' },
  { name: 'Dembe',  role: 'Fitness Coach',     avg: '$1.9K avg/mo', photo: '/images/creator-dembe.jpg' },
  { name: 'Sofia',  role: 'Model · Creator',   avg: '$5.2K avg/mo', photo: '/images/creator-sofia.jpg' },
  { name: 'Aisha',  role: 'Travel Creator',    avg: '$3.1K avg/mo', photo: '/images/creator-aisha.jpg' },
  { name: 'Tobi',   role: 'Vlogger',           avg: '$2.4K avg/mo', photo: '/images/creator-tobi.jpg' },
  { name: 'Nadia',  role: 'Lifestyle Creator', avg: '$4.0K avg/mo', photo: '/images/creator-nadia.jpg' },
]

const EARN = [
  { n: '01', title: 'Fan Gifts & Coins',                body: 'Fans buy coins and send them on posts, in DMs, and during live streams. Receive gifts and support in real time. Cash out whenever you like.' },
  { n: '02', title: 'Subscriptions',                    body: 'Create recurring revenue through monthly or annual memberships. Subscriber tiers unlock exclusive posts, media, and private DMs.' },
  { n: '03', title: 'Exclusive Content',                body: 'Offer subscriber-only content your audience can\'t find anywhere else.' },
  { n: '04', title: 'VIP Communities & Premium Access', body: 'Create private communities for your most engaged fans, offer early access, and build special experiences that deepen loyalty and justify premium pricing.' },
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
  { name: 'Priscilia O.', handle: '@yummychill54', role: 'Lifestyle Creator', stat: '+$2,480', stat2: 'this month',  photo: '/images/creator-amara.jpg',  quote: "I left my old platform after three years of watching fees eat my income. Two months on Fanation and I've tripled what I made there — the live gifting alone covered my rent in one stream." },
  { name: 'Marcus T.',    handle: '@marcusbeats',  role: 'Musician',          stat: '+$1,800', stat2: 'in 48 hours', photo: '/images/creator-marcus.jpg', quote: "Pay-per-view drops changed everything. I put a track behind a paywall, promoted it on my feed, and made $1,800 in 48 hours. I was giving that music away for free before." },
  { name: 'Lara K.',      handle: '@laracreates',  role: 'Vlogger',           stat: '+$3,100', stat2: 'last month',  photo: '/images/creator-aisha.jpg',  quote: "My fans feel genuinely close to me here — the DMs and group chats feel different. And the payouts are fast. First withdrawal hit my account within 24 hours of signing up." },
]

const FAQS = [
  { q: 'Is Fanation free to join?',            a: 'Yes. Creating an account and setting up your profile costs nothing. Fanation earns when you earn — we take a small percentage of transactions only when money actually moves. You never pay to get started.' },
  { q: 'When do I get paid?',                   a: 'Withdrawals are processed within 24 hours and hit your bank account within 1–3 business days depending on your region and payment method. There are no 30-day payout windows.' },
  { q: 'What kind of content can I post?',      a: 'Photos, videos, audio, text posts, and live streams. Fanation supports every format your fans want to engage with, across every creator category — lifestyle, fitness, music, adult content, gaming, education, and more.' },
  { q: 'Is there a minimum payout amount?',     a: 'Yes — the minimum withdrawal is $20. There is no maximum. As long as your balance is above $20, you can cash out at any time.' },
  { q: 'Can fans follow me for free?',          a: 'Yes. Fans can follow your public profile and see your free posts at no cost. Subscribers pay to unlock your exclusive content, private messages, and subscriber-only feed. You control what\'s free and what\'s locked.' },
  { q: 'What does Fanation charge?',            a: 'Full fee details will be confirmed at launch; early creators will have access to the most competitive rate available.' },
  { q: 'Do I need a large following to earn?',  a: 'No. Many Fanation creators earn consistently with a few hundred dedicated fans. A smaller, engaged audience who subscribes and gifts is often more valuable than a large passive following on traditional social platforms.' },
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
        <section className="section-pad-stats">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.val} className="text-center px-5"
                  data-stat-idx={i}
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
        <section id="features" className="section-pad" style={{ background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>How it works</SectionTag>
              <SectionHead>Start Earning In Three Simple Steps</SectionHead>
              <p className="mt-4 max-w-xl mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Whether you&apos;re just starting out or already have a thriving audience, Fanation gets you earning from day one — no agency, no approval, no guesswork.
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-stretch gap-5 md:gap-0">
              {/* Step 01 */}
              <div className="how-step rounded-[22px] p-9 relative md:flex-1" style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                <div className="text-xs font-black tracking-[0.1em] mb-5" style={{ color: '#2599F6', textTransform: 'uppercase' }}>Step {STEPS[0].n}</div>
                <div className="flex items-center justify-center rounded-2xl mb-5 text-[26px]" style={{ width: 56, height: 56, background: 'rgba(37,153,246,0.1)', border: '1px solid rgba(37,153,246,0.18)' }}>{STEPS[0].icon}</div>
                <h3 className="font-black text-white mb-2.5" style={{ fontSize: 19, letterSpacing: '-0.02em' }}>{STEPS[0].title}</h3>
                <p style={{ fontSize: 14, color: '#7A8FB8', lineHeight: 1.72 }}>{STEPS[0].body}</p>
              </div>
              {/* Arrow — hidden on mobile (display:none in flex is fine; siblings are unaffected) */}
              <div className="hidden md:flex flex-none items-center justify-center" style={{ width: 40, color: 'rgba(37,153,246,0.3)', fontSize: 24 }}>→</div>
              {/* Step 02 */}
              <div className="how-step rounded-[22px] p-9 relative md:flex-1" style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                <div className="text-xs font-black tracking-[0.1em] mb-5" style={{ color: '#2599F6', textTransform: 'uppercase' }}>Step {STEPS[1].n}</div>
                <div className="flex items-center justify-center rounded-2xl mb-5 text-[26px]" style={{ width: 56, height: 56, background: 'rgba(37,153,246,0.1)', border: '1px solid rgba(37,153,246,0.18)' }}>{STEPS[1].icon}</div>
                <h3 className="font-black text-white mb-2.5" style={{ fontSize: 19, letterSpacing: '-0.02em' }}>{STEPS[1].title}</h3>
                <p style={{ fontSize: 14, color: '#7A8FB8', lineHeight: 1.72 }}>{STEPS[1].body}</p>
              </div>
              {/* Arrow */}
              <div className="hidden md:flex flex-none items-center justify-center" style={{ width: 40, color: 'rgba(37,153,246,0.3)', fontSize: 24 }}>→</div>
              {/* Step 03 */}
              <div className="how-step rounded-[22px] p-9 relative md:flex-1" style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                <div className="text-xs font-black tracking-[0.1em] mb-5" style={{ color: '#2599F6', textTransform: 'uppercase' }}>Step {STEPS[2].n}</div>
                <div className="flex items-center justify-center rounded-2xl mb-5 text-[26px]" style={{ width: 56, height: 56, background: 'rgba(37,153,246,0.1)', border: '1px solid rgba(37,153,246,0.18)' }}>{STEPS[2].icon}</div>
                <h3 className="font-black text-white mb-2.5" style={{ fontSize: 19, letterSpacing: '-0.02em' }}>{STEPS[2].title}</h3>
                <p style={{ fontSize: 14, color: '#7A8FB8', lineHeight: 1.72 }}>{STEPS[2].body}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Live Gifting Section ───────────────────────────────────────── */}
        <section className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 20% 50%,rgba(37,153,246,0.06) 0%,transparent 60%)' }} />
          <div className="max-w-[1180px] mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">

              {/* Left: phone mockup */}
              <div className="relative" style={{ width: '100%', maxWidth: 320, margin: '0 auto', height: 560 }}>
                <div className="absolute inset-0 rounded-[28px] overflow-hidden"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.65)',
                  }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/creator-live.jpg"
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
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
                        style={{ fontSize: 12, fontWeight: 600, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#5DDD90' }} />
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
                              WebkitBackdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              animation: `giftPop 4s ease-in-out ${i * 1.4}s infinite`,
                            }}>
                            <span className="font-black" style={{ color: '#FCA44B' }}>{g.user}</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{g.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5 rounded-[14px] p-3.5"
                        style={{ background: 'rgba(7,9,26,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(93,221,144,0.25)' }}>
                        <span className="text-xl">💰</span>
                        <div>
                          <p style={{ fontSize: 11, color: '#7A8FB8' }}>Earned this stream</p>
                          <p className="font-black" style={{ fontSize: 24, color: '#5DDD90', letterSpacing: '-0.02em' }}>$1,240.00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Float stat badge — positioned relative to outer container */}
                <div className="absolute text-center rounded-[14px] px-4 py-3.5"
                  style={{ top: 20, right: 12, background: '#18223C', border: '1px solid rgba(252,164,75,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', minWidth: 130 }}>
                  <p style={{ fontSize: 11, color: '#7A8FB8', marginBottom: 4 }}>Coins sent today</p>
                  <p className="font-black" style={{ fontSize: 26, color: '#FCA44B', letterSpacing: '-0.02em' }}>2.4M 🪙</p>
                </div>
              </div>

              {/* Right: copy */}
              <div>
                <SectionTag color="#F36A46">● Live Streaming</SectionTag>
                <h2 className="font-black text-white mb-5" style={{ fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
                  Go Live. Connect Instantly.
                </h2>
                <p className="mb-8 leading-[1.78]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                  While you stream, fans send coins and gifts — you see the notifications fly in, they see you react. It&apos;s the TikTok Live experience, built for every type of creator, without the algorithm cutting your reach.
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
        <section className="section-pad" style={{ background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>Everything in one place</SectionTag>
              <SectionHead>One platform for posting,<br />streaming, and earning</SectionHead>
              <p className="mt-4 max-w-xl mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Fanation brings your feed, live streams, messages, and money together — so you focus on creating, not juggling apps.
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
        <section id="creators" className="section-pad">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Header: left-aligned heading + right-side CTA */}
            <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
              <div>
                <SectionTag>Built for every creator</SectionTag>
                <SectionHead>Built For Every Type Of Creator</SectionHead>
                <p className="mt-3 max-w-[480px] leading-[1.72]" style={{ fontSize: 16, color: '#7A8FB8' }}>
                  No matter your niche, Fanation helps you connect, engage, and earn from your audience. Musicians, coaches, educators, entertainers — all welcome.
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
                    src={c.photo}
                    alt={c.name}
                    fill
                    quality={90}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,9,26,0) 40%,rgba(7,9,26,0.92) 100%)' }} />
                  {/* Earnings badge */}
                  <div className="absolute top-3 right-3 z-10 font-bold rounded-full px-2.5 py-1"
                    style={{ fontSize: 11, color: '#5DDD90', background: 'rgba(7,9,26,0.72)', backdropFilter: 'blur(8px)', border: `1px solid ${BORDER}` }}>
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
        <section id="earn" className="section-pad" style={{ background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag color="#F36A46">Monetize your work</SectionTag>
              <SectionHead>More Ways To Earn<br />From What You Create</SectionHead>
              <p className="mt-4 max-w-xl mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Your audience supports you in different ways. Fanation gives you multiple revenue streams — mix and match what fits how you create.
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
        <section className="section-pad">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag>Why Fanation</SectionTag>
              <SectionHead>Built for creators,<br />not the platform.</SectionHead>
              <p className="mt-4 max-w-lg mx-auto leading-[1.75]" style={{ fontSize: 17, color: '#7A8FB8' }}>
                Most creator tools were designed around the platform&apos;s business model. Fanation is designed around yours.
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
        <section className="section-pad" style={{ background: '#0C1121' }}>
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="text-center mb-16">
              <SectionTag color="#FCA44B">Real creators, real income</SectionTag>
              <SectionHead>Hear from the people<br />building their living on Fanation</SectionHead>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map(t => (
                <div key={t.handle} className="t-card rounded-[22px] p-[34px] flex flex-col"
                  style={{ background: '#111830', border: `1px solid ${BORDER}` }}>
                  <div className="mb-4" style={{ color: '#FCA44B', fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
                  <p className="flex-1 mb-7 italic leading-[1.78]"
                    style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={t.photo}
                        alt={t.name}
                        width={44}
                        height={44}
                        quality={90}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white" style={{ fontSize: 14 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: '#7A8FB8' }}>{t.handle} · {t.role}</p>
                    </div>
                    <div className="ml-auto text-right flex-shrink-0">
                      <p className="font-black" style={{ fontSize: 15, color: '#5DDD90' }}>{t.stat}</p>
                      <p style={{ fontSize: 11, color: '#7A8FB8' }}>{t.stat2}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ — sidebar layout ───────────────────────────────────────── */}
        <section id="faq" className="section-pad">
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
                  Still unsure? These are the questions every creator asks before their first post.
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
        <section className="section-pad-cta">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%,rgba(37,153,246,0.1) 0%,transparent 65%),
                         radial-gradient(ellipse 40% 40% at 20% 80%,rgba(252,164,75,0.07) 0%,transparent 55%),
                         radial-gradient(ellipse 45% 40% at 85% 20%,rgba(243,106,70,0.13) 0%,transparent 55%)`
          }} />
          <div className="max-w-[1180px] mx-auto px-6 relative z-10">
            <h2 className="font-black text-white mb-5 leading-[1.06]"
              style={{ fontSize: 'clamp(34px,5vw,68px)', letterSpacing: '-0.04em' }}>
              Ready To Build Something<br />
              <em className="not-italic" style={{
                background: 'linear-gradient(90deg, #F36A46 0%, #2599F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Bigger Than Followers?</em>
            </h2>
            <p className="mb-3 mx-auto max-w-xl" style={{ fontSize: 18, color: '#7A8FB8' }}>
              Your audience already believes in you. Now give them a place to belong.
            </p>
            <p className="mb-12 mx-auto max-w-xl" style={{ fontSize: 18, color: '#7A8FB8' }}>
              Join creators who are building communities, creating meaningful fan relationships, and earning directly from the value they create.
            </p>

            {/* CTA buttons */}
            <div className="cta-buttons flex flex-wrap justify-center gap-4 mb-5">
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

            {/* Footnote */}
            <p className="mb-10" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              No credit card required. Free to join. No platform lock-in.
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

            {/* App badges */}
            <div className="flex items-center justify-center flex-wrap gap-3 pt-10" style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }}>
              <span style={{ fontSize: 13, color: '#7A8FB8' }}>Download the app</span>
              {/* Apple App Store */}
              <a href="#" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
                style={{ background: '#000', border: '1px solid rgba(255,255,255,0.18)', padding: '10px 20px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.459 2.208 3.09 3.792 3.029 1.52-.065 2.09-.987 3.925-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.391-2.376-2-.156-3.675 1.09-4.6 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span>
                  <p className="leading-none mb-1" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>Download on the</p>
                  <p className="font-bold text-white leading-none" style={{ fontSize: 16, letterSpacing: '-0.01em' }}>App Store</p>
                </span>
              </a>
              {/* Google Play */}
              <a href="#" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
                style={{ background: '#000', border: '1px solid rgba(255,255,255,0.18)', padding: '10px 20px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <svg width="22" height="24" viewBox="0 0 24 27" fill="none" aria-hidden="true">
                  <path d="M1.5 0.8L14.5 13.5L1.5 26.2C0.9 25.9 0.5 25.3 0.5 24.5V2.5C0.5 1.7 0.9 1.1 1.5 0.8Z" fill="#4285F4"/>
                  <path d="M19.5 9L14.5 13.5L19.5 18L22.8 16.2C23.7 15.7 23.7 14.8 23.7 13.5C23.7 12.2 23.7 11.3 22.8 10.8L19.5 9Z" fill="#FBBC05"/>
                  <path d="M1.5 0.8L14.5 13.5L19.5 9L4.2 0.1C3.1 -0.5 2 0 1.5 0.8Z" fill="#EA4335"/>
                  <path d="M1.5 26.2L14.5 13.5L19.5 18L4.2 26.9C3.1 27.5 2 27 1.5 26.2Z" fill="#34A853"/>
                </svg>
                <span>
                  <p className="leading-none mb-1" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>Get it on</p>
                  <p className="font-bold text-white leading-none" style={{ fontSize: 16, letterSpacing: '-0.01em' }}>Google Play</p>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid rgba(255,255,255,0.07)`, padding: '64px 0 32px', background: '#07091A' }}>
        <div className="max-w-[1180px] mx-auto px-6">
          {/* Top 4-col grid */}
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
            {/* Brand col */}
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center overflow-hidden" style={{ background: '#0C1121' }}>
                  <svg viewBox="80 40 240 245" xmlns="http://www.w3.org/2000/svg" className="w-[34px] h-[34px]">
                    <g fill="#2599F6">
                      <path d="M 279.3 68.36 L 275.0 64.06 L 268.75 60.16 L 261.33 57.81 L 255.47 57.42 L 150.78 57.81 L 139.84 60.94 L 128.52 67.97 L 124.61 71.88 L 119.14 79.69 L 115.62 87.89 L 114.06 94.92 L 114.06 205.47 L 121.09 195.31 L 128.52 186.72 L 128.12 100.39 L 128.52 96.09 L 130.86 88.67 L 133.59 83.98 L 137.89 79.3 L 144.92 74.61 L 153.12 72.27 L 258.98 72.27 L 265.23 75.0 L 268.75 78.52 L 270.7 82.42 L 271.09 90.62 L 269.53 94.53 L 264.84 99.61 L 258.2 102.34 L 175.39 102.34 L 166.41 106.25 L 160.16 113.67 L 158.2 120.31 L 158.2 160.55 L 172.27 151.17 L 172.66 121.48 L 173.83 119.14 L 176.56 117.19 L 260.55 116.8 L 268.36 114.45 L 275.39 110.16 L 281.64 102.73 L 285.55 92.58 L 285.94 85.94 L 284.77 78.52 Z"/>
                      <path d="M 245.31 147.66 L 237.5 141.02 L 229.3 137.5 L 225.78 136.72 L 212.89 137.5 L 202.73 141.41 L 182.81 152.34 L 165.23 164.06 L 153.12 173.44 L 138.28 186.72 L 129.3 196.09 L 122.66 204.69 L 116.41 216.41 L 114.06 225.0 L 114.06 235.16 L 115.62 240.62 L 121.09 249.61 L 126.56 254.3 L 132.42 257.42 L 141.02 259.38 L 148.83 258.98 L 155.86 256.64 L 165.23 249.61 L 170.7 240.62 L 172.66 231.64 L 171.88 185.94 L 158.2 197.27 L 158.2 231.25 L 156.64 236.72 L 151.95 242.19 L 146.88 244.53 L 141.8 244.92 L 137.5 243.75 L 133.59 241.41 L 130.08 237.11 L 128.52 233.59 L 128.12 228.52 L 130.08 221.09 L 139.06 207.03 L 160.16 186.33 L 183.2 169.14 L 209.38 154.3 L 217.58 151.17 L 224.61 151.17 L 230.08 153.52 L 234.38 157.42 L 237.11 162.11 L 238.28 169.14 L 236.72 175.0 L 230.86 182.03 L 222.66 185.16 L 215.62 184.38 L 205.08 179.69 L 191.8 171.88 L 178.91 180.86 L 199.22 192.97 L 213.67 198.83 L 218.36 199.61 L 228.12 198.83 L 236.33 195.7 L 241.8 191.8 L 246.88 186.33 L 249.61 181.64 L 251.95 175.0 L 252.73 168.75 L 251.95 161.33 L 250.39 156.25 Z"/>
                    </g>
                  </svg>
                </div>
                <span className="font-black text-[18px] text-white" style={{ letterSpacing: '-0.01em' }}>Fanation</span>
              </div>
              <p className="mb-5 leading-[1.7] max-w-[260px]" style={{ fontSize: 14, color: '#7A8FB8' }}>
                Fanation empowers creators to own their audience, deepen fan relationships, and build sustainable income through community, content, and meaningful engagement.
              </p>
              {/* Social icons */}
              <SocialIcons />
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
