import Image from 'next/image'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  { n: '01', icon: '✨', title: 'Create Your Creator Profile', body: 'Set up your page, customise your profile, showcase your content, and tell your story. Takes under two minutes, no approvals.' },
  { n: '02', icon: '📣', title: 'Invite Your Audience', body: 'Share your Fanation profile and bring your followers, supporters, and community into one place. Your existing fans, your new home.' },
  { n: '03', icon: '💰', title: 'Monetize Your Community', body: 'Earn through subscriptions, gifts, exclusive content, live sessions, and premium experiences. Multiple revenue streams from day one.' },
]

const FEATURES = [
  { icon: '💳', bg: 'bg-blue-500/10', color: 'text-blue-400',    title: 'Earn Recurring Income',           body: 'Create subscription plans and generate predictable monthly revenue from your most loyal supporters.',                           pills: ['Monthly memberships', 'Annual plans', 'Tiered access'] },
  { icon: '🪙', bg: 'bg-yellow-500/10', color: 'text-yellow-400', title: 'Go Live & Get Paid',              body: 'Host live sessions, interact in real time, and receive gifts and support directly from fans as it happens.',                   pills: ['Real-time gifts', 'Live interaction', 'Instant payouts'] },
  { icon: '🔴', bg: 'bg-red-500/10',    color: 'text-red-400',    title: 'Own Your Community',              body: 'Build direct relationships through communities, messaging, and exclusive experiences. No algorithm between you and your fans.', pills: ['Direct messaging', 'Group communities', 'No algorithm'] },
  { icon: '🎬', bg: 'bg-purple-500/10', color: 'text-purple-400', title: 'Sell Exclusive Content',          body: 'Offer premium videos, photos, audio, behind-the-scenes content, and subscriber-only experiences.',                            pills: ['Pay-per-view', 'Subscriber drops', 'Private media'] },
  { icon: '📈', bg: 'bg-emerald-500/10',color: 'text-emerald-400',title: 'Grow Beyond Algorithms',         body: 'Stay connected with your audience without depending on social media reach or changing platform rules.',                         pills: ['Direct audience access', 'No feed throttling', 'You own your fans'] },
  { icon: '📊', bg: 'bg-amber-500/10',  color: 'text-amber-400',  title: 'Manage Your Creator Business',   body: 'Track earnings, monitor engagement, manage subscribers, and grow your brand with confidence.',                                 pills: ['Earnings dashboard', 'Subscriber analytics', 'Growth insights'] },
]

const CREATORS = [
  { name: 'Marcus',  role: 'Podcaster',        avg: '₦4.5M avg/mo', photo: 'photo-1506794778202-cad84cf45f1d' },
  { name: 'Dembe',   role: 'Fitness Coach',     avg: '₦3.0M avg/mo', photo: 'photo-1549476464-37392f717541' },
  { name: 'Sofia',   role: 'Model · Creator',   avg: '₦8.3M avg/mo', photo: 'photo-1529626455594-4ff0802cfb7e' },
  { name: 'Aisha',   role: 'Travel Creator',    avg: '₦4.9M avg/mo', photo: 'photo-1573496359142-b8d87734a5a2' },
  { name: 'Tobi',    role: 'Vlogger',           avg: '₦3.8M avg/mo', photo: 'photo-1507003211169-0a1dd7228f2d' },
  { name: 'Nadia',   role: 'Lifestyle Creator', avg: '₦6.4M avg/mo', photo: 'photo-1517841905240-472988babdf9' },
]

const EARN = [
  { n: '01', title: 'Fan Gifts & Coins',                 body: 'Fans buy coins and send them on posts, in DMs, and during live streams. Cash out whenever you like, no hold periods.' },
  { n: '02', title: 'Subscriptions',                     body: 'Create recurring revenue through monthly or annual memberships. Subscriber tiers unlock exclusive posts, media, and DMs.' },
  { n: '03', title: 'Exclusive Content',                 body: 'Unlock premium videos, photos, audio, and experiences for paying supporters. Content your audience can\'t find anywhere else.' },
  { n: '04', title: 'VIP Communities & Premium Access',  body: 'Create private communities for your most engaged fans, offer early access, and build special experiences that deepen loyalty.' },
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
  { name: 'Priscilia O.', handle: '@yummychill54', role: 'Lifestyle Creator', stat: '+₦3.9M this month', photo: 'photo-1531746020798-e6953c6e8e04', quote: 'I left my old platform after three years of watching fees eat my income. Two months on Fanation and I\'ve tripled what I made there — the live gifting alone covered my rent in one stream.' },
  { name: 'Marcus T.',    handle: '@marcusbeats',   role: 'Verified Creator',  stat: 'PPV drop earner',   photo: 'photo-1506794778202-cad84cf45f1d', quote: 'Pay-per-view drops changed everything. I put a track behind a paywall, promoted it once, and woke up to eight figures. I\'d been leaving money on the table for years.' },
  { name: 'Lara K.',      handle: '@laracreates',   role: 'Verified Creator',  stat: 'Community builder', photo: 'photo-1573496359142-b8d87734a5a2', quote: 'The DMs and group chats keep my fans close. It feels personal, and the payouts are fast and reliable.' },
]

const FAQS = [
  { q: 'Is Fanation free to join?',                a: 'Yes — signing up is completely free. You only pay when you earn. There are no monthly platform fees or setup costs.' },
  { q: 'How and when do I get paid?',              a: 'Fanation processes payouts within 24 hours. No 30-day holds, no delays. Earnings from subscriptions, gifts, and PPV are available quickly.' },
  { q: 'Do I need a large following to earn?',     a: 'No. Many creators earn consistently with a few hundred dedicated fans. A smaller, engaged audience who subscribes and gifts is often more valuable than a large passive following.' },
  { q: 'What types of content can I share?',       a: 'Posts, photos, videos, live streams, audio, behind-the-scenes media, and subscriber-only collections. If you create it, Fanation supports it.' },
  { q: 'What does Fanation charge?',               a: 'Fanation takes a small percentage of transactions — no monthly fees, no setup costs. You only pay when you earn. Early creators will have access to the most competitive rate available.' },
]

// ─── Section helpers ─────────────────────────────────────────────────────────

function SectionTag({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-widest text-brand block mb-3">{children}</span>
}

function SectionHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-4xl lg:text-5xl font-black tracking-tight leading-tight ${className}`}>{children}</h2>
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section id="features" className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionTag>How it works</SectionTag>
              <SectionHead>Start Earning In Three Simple Steps</SectionHead>
              <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
                Whether you&apos;re just starting out or already have a thriving audience, Fanation gets you earning from day one.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <div key={s.n} className="relative bg-surface border border-white/6 rounded-2xl p-8">
                  <div className="text-xs font-bold text-brand mb-4 tracking-widest">Step {s.n}</div>
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-muted leading-relaxed">{s.body}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-center text-muted text-lg z-10">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Cards ─────────────────────────────────────────────── */}
        <section className="py-28 px-6 bg-surface/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionTag>Everything you need</SectionTag>
              <SectionHead>Build A Creator Business,<br />Not Just An Audience</SectionHead>
              <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
                Whether you&apos;re just starting out or already have a thriving audience, Fanation gives you the tools to grow, engage, and monetize.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-surface border border-white/6 rounded-2xl p-7 flex flex-col gap-4">
                  <div className={`w-11 h-11 rounded-xl ${f.bg} ${f.color} flex items-center justify-center text-xl`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{f.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {f.pills.map(p => (
                      <span key={p} className="text-xs bg-white/5 border border-white/8 text-muted px-3 py-1 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Creator Types ─────────────────────────────────────────────── */}
        <section id="creators" className="py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
            <SectionTag>Built for every creator</SectionTag>
            <SectionHead>Built For Every Type Of Creator</SectionHead>
            <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
              No matter your niche, Fanation helps you connect, engage, and earn from your audience.
            </p>
          </div>
          {/* Marquee */}
          <div className="relative overflow-hidden">
            <div className="flex marquee-track gap-6 w-max">
              {[...CREATORS, ...CREATORS].map((c, i) => (
                <div key={i} className="w-52 flex-shrink-0 bg-surface border border-white/6 rounded-2xl overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={`https://images.unsplash.com/${c.photo}?w=280&h=373&fit=crop&crop=faces`}
                      alt={c.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand font-semibold">{c.avg}</p>
                    <p className="text-sm font-bold text-white mt-1">{c.name}</p>
                    <p className="text-xs text-muted">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-muted text-sm mt-10 px-6">
            Musicians · Influencers · Podcasters · Educators · Coaches · Athletes · Artists · Streamers · Entertainers · Lifestyle Creators · Fitness Creators · Travel Creators
          </p>
        </section>

        {/* ── Earn ──────────────────────────────────────────────────────── */}
        <section id="earn" className="py-28 px-6 bg-surface/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionTag>Monetize your work</SectionTag>
              <SectionHead>More Ways To Earn<br />From What You Create</SectionHead>
              <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
                Your audience supports you in different ways. Fanation gives you multiple revenue streams — mix and match what fits how you create.
              </p>
              <p className="text-sm text-brand/70 mt-3">
                🌍 Creators are paid in their local currency — NGN, USD, GBP, EUR, KES, GHS, and more.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {EARN.map(e => (
                <div key={e.n} className="flex gap-6 bg-surface border border-white/6 rounded-2xl p-7">
                  <div className="text-3xl font-black text-brand/30 font-mono leading-none flex-shrink-0">{e.n}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{e.title}</h3>
                    <p className="text-muted leading-relaxed">{e.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ────────────────────────────────────────────────── */}
        <section className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <SectionTag>Why Fanation</SectionTag>
              <SectionHead>Built for creators,<br />not the platform.</SectionHead>
              <p className="text-muted text-lg mt-4 max-w-lg mx-auto">
                Every other platform forces a trade-off. Fanation is the only platform where live gifting, subscriptions, coins, and content all work together.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Other platforms */}
              <div className="bg-white/[0.03] border border-white/7 rounded-2xl p-9">
                <p className="text-base font-bold text-white/60 mb-7 pb-5 border-b border-white/8">Traditional creator platforms</p>
                <ul className="space-y-4">
                  {COMPARE_OTHER.map(item => (
                    <li key={item} className="flex items-start gap-3 text-muted text-sm">
                      <span className="w-5 h-5 rounded-full bg-white/7 text-muted flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Fanation */}
              <div className="bg-brand/7 border border-brand/25 rounded-2xl p-9">
                <p className="text-base font-bold text-brand mb-7 pb-5 border-b border-brand/20">Fanation</p>
                <ul className="space-y-4">
                  {COMPARE_FANATION.map(item => (
                    <li key={item} className="flex items-start gap-3 text-white text-sm">
                      <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section className="py-28 px-6 bg-surface/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionTag>Real creators, real income</SectionTag>
              <SectionHead>Hear From The People<br />Building Their Living On Fanation</SectionHead>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => (
                <div key={t.handle} className="bg-surface border border-white/6 rounded-2xl p-7 flex flex-col gap-5">
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-white/80 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={`https://images.unsplash.com/${t.photo}?w=88&h=88&fit=crop&crop=faces`}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-muted">{t.handle} · {t.role}</p>
                    </div>
                    <div className="ml-auto text-xs text-emerald-400 font-semibold text-right">{t.stat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section id="faq" className="py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <SectionTag>FAQ</SectionTag>
              <SectionHead>Everything you want to know</SectionHead>
            </div>
            <div className="space-y-3">
              {FAQS.map(f => (
                <details key={f.q} className="group bg-surface border border-white/6 rounded-2xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-white">
                    {f.q}
                    <span className="text-muted text-xl group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <p className="faq-body px-6 pb-6 text-muted leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(37,153,246,.12) 0%,transparent 60%)' }} />
          <div className="max-w-3xl mx-auto relative z-10">
            <SectionTag>Get started</SectionTag>
            <SectionHead className="mb-6">Ready To Build Something<br /><span className="text-brand">Bigger Than Followers?</span></SectionHead>
            <p className="text-muted text-lg mb-3">
              Join creators who are building communities, creating meaningful fan relationships, and earning directly from the value they create.
            </p>
            <p className="text-muted/70 text-base mb-10">Your audience already believes in you. Now give them a place to belong.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a href="#" className="bg-brand text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-500 transition-colors">
                Start Creating For Free →
              </a>
              <a href="#features" className="border border-white/20 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:border-white/40 transition-colors">
                Explore Fanation
              </a>
            </div>
            <p className="text-xs text-muted">No credit card required · Free to join · No platform lock-in</p>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 bg-surface/50 px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-[9px] bg-navy flex items-center justify-center overflow-hidden flex-shrink-0">
                <svg viewBox="80 40 240 245" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <g fill="#2599F6">
                    <path d="M 279.3 68.36 L 275.0 64.06 L 268.75 60.16 L 261.72 57.42 L 254.30 56.25 L 247.27 56.64 L 238.48 59.18 L 231.25 63.48 L 225.59 69.14 L 218.75 79.10 L 214.45 90.82 L 212.89 103.52 L 213.87 116.21 L 216.40 125.0 L 220.70 133.20 L 218.75 134.96 L 211.52 141.02 L 206.05 148.24 L 201.95 156.64 L 200.19 165.82 L 200.97 175.0 L 204.29 183.98 L 209.76 191.99 L 217.38 198.44 L 226.56 202.54 L 236.91 203.91 L 247.27 201.95 L 255.86 196.87 L 259.57 192.77 L 262.11 195.70 L 265.62 198.63 L 271.09 201.17 L 277.34 202.54 L 283.39 202.54 L 290.62 199.61 L 296.87 195.31 L 301.56 188.67 L 304.10 181.05 L 303.90 173.24 L 301.36 165.82 L 296.87 159.57 L 290.42 154.88 L 287.30 153.71 L 291.21 145.51 L 293.55 138.09 L 294.14 130.66 L 293.16 123.83 L 290.62 117.38 L 286.71 111.91 L 281.25 107.22 L 279.88 106.25 L 282.81 97.07 L 283.39 88.09 Z M 257.42 87.11 L 261.52 90.43 L 264.84 95.12 L 266.79 101.17 L 266.60 107.81 L 264.06 114.45 L 259.18 119.92 L 252.54 123.24 L 245.51 124.02 L 238.87 122.27 L 233.20 118.16 L 229.30 112.30 L 227.73 105.86 L 228.52 99.02 L 231.64 93.36 L 236.52 89.06 L 242.77 86.91 L 249.80 86.52 Z M 253.32 160.35 L 258.20 163.87 L 261.13 168.75 L 261.91 174.41 L 260.15 180.08 L 256.45 184.18 L 251.17 186.72 L 245.51 187.11 L 240.04 185.35 L 235.74 181.64 L 233.20 176.37 L 232.81 170.51 L 234.57 165.23 L 238.09 161.13 L 243.16 158.59 L 248.83 157.81 Z" />
                    <path d="M 245.31 147.66 L 237.5 141.02 L 229.3 137.5 L 225.78 136.91 L 227.73 133.79 L 229.49 129.10 L 230.27 123.83 L 229.30 117.38 L 229.88 117.38 L 237.30 119.92 L 245.51 120.90 L 253.71 119.92 L 261.13 117.38 L 261.13 117.57 L 260.35 124.02 L 261.52 129.88 L 264.45 135.16 L 261.91 135.74 L 254.69 139.26 Z" />
                  </g>
                </svg>
              </div>
              <span className="font-bold text-white tracking-tight">Fanation</span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Fanation empowers creators to own their audience, deepen fan relationships, and build sustainable income through community, content, and meaningful engagement.
            </p>
            <p className="text-xs text-muted/60">© {new Date().getFullYear()} Fanation. All rights reserved.</p>
          </div>

          {[
            { heading: 'Product',  links: ['Features', 'Go Live', 'Subscriptions', 'Coins & Gifting', 'Mobile App'] },
            { heading: 'Creators', links: ['Become a Creator', 'Creator Academy', 'Payouts', 'Success Stories'] },
            { heading: 'Company',  links: ['About', 'Careers', 'Press', 'Contact'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-sm font-bold text-white mb-4">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm text-muted hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-muted">Turn Followers Into Fans. Turn Fans Into Income.</p>
          <div className="flex gap-6">
            {['Terms of Service', 'Privacy', 'Cookie Notice'].map(l => (
              <a key={l} href="#" className="text-xs text-muted hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
