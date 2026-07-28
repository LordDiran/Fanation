import type { AdminPayout, AdminUser, Creator, KycApp, ModReport, NotifItem, Post, PostType, TxItem } from "./types";

/** Deterministic hash — drives generated numbers and mesh placeholder art. */
export function fhash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const CREATORS: Creator[] = [
  { id: "sofia", name: "Sofia Amara", handle: "sofiaa", tag: "Lifestyle · Creator", avg: "$5.2K", price: 12, v: true },
  { id: "elena", name: "Elena Rusk", handle: "elenalive", tag: "Streamer", avg: "$3.4K", price: 9, v: true, live: true },
  { id: "marcus", name: "Marcus T.", handle: "marcusbeats", tag: "Podcaster", avg: "$2.8K", price: 8, v: true },
  { id: "dembe", name: "Dembe O.", handle: "dembefit", tag: "Fitness Coach", avg: "$1.9K", price: 7, v: true },
  { id: "nadia", name: "Nadia K.", handle: "nadiak", tag: "Educator", avg: "$2.4K", price: 10, v: true },
  { id: "tobi", name: "Tobi A.", handle: "tobivlogs", tag: "Vlogger", avg: "$3.1K", price: 9, v: true },
  { id: "aisha", name: "Aisha Bello", handle: "aishab", tag: "Travel", avg: "$2.1K", price: 8, v: true },
  { id: "priscilla", name: "Priscilla N.", handle: "priscilla", tag: "Model · Creator", avg: "$4.6K", price: 15, v: true },
  { id: "jayden", name: "Jayden Cole", handle: "jaydenc", tag: "Musician", avg: "$3.8K", price: 11, v: true, live: true },
  { id: "kwame", name: "Kwame A.", handle: "kwamea", tag: "Comedy", avg: "$1.7K", price: 6, v: true },
  { id: "lena", name: "Lena Ortiz", handle: "lenaart", tag: "Digital Artist", avg: "$2.9K", price: 9, v: true },
  { id: "diego", name: "Diego Santos", handle: "diegoplays", tag: "Gaming", avg: "$3.3K", price: 8, v: true, live: true },
  { id: "amara", name: "Amara Obi", handle: "amaraobi", tag: "Beauty · Creator", avg: "$4.1K", price: 12, v: true },
  { id: "noah", name: "Noah Kim", handle: "noahk", tag: "Tech", avg: "$2.2K", price: 7, v: true },
  { id: "zara", name: "Zara Ali", handle: "zaraali", tag: "Dancer", avg: "$3.6K", price: 10, v: true, live: true },
  { id: "leo", name: "Leo Mensah", handle: "leochef", tag: "Chef", avg: "$1.8K", price: 6, v: true },
];

export const byHandle = (h: string): Creator =>
  CREATORS.find((c) => c.handle === h) ?? CREATORS[0];

const CAPS: Array<[string, PostType]> = [
  ["Behind the scenes from today's shoot 🌸 full set drops tonight for subscribers.", "image"],
  ["Going live in 30 — bring your questions and let's hang 💬", "video"],
  ["New locked drop just went up 🔒 subscribers only, unlock below.", "locked"],
  ["Which cover should I run for the next drop? 👀", "poll"],
  ["POV: you open the app and your favourite creator just went live 😂", "text"],
  ["Studio session snippet 🎶 full track drops Friday for VIPs.", "video"],
  ["Sunrise over Zanzibar 🌅 the full travel diary is up for subscribers.", "image"],
  ["Grateful for every single one of you 🙏 huge things coming this month.", "text"],
  ["Sneak peek at the collab dropping this weekend 👀", "image"],
  ["12-week transformation program starts Monday. Who's in? 💪", "image"],
  ["Late night live was unreal — thank you for all the gifts 🎁", "video"],
  ["Exclusive photo set is live 🔓 members unlock below.", "locked"],
  ["Vote: which city for the next meetup? ✈️", "poll"],
  ["New merch preview 👕 subscribers get 20% off at drop.", "image"],
  ["Answering your DMs live tonight 💬 drop them now.", "video"],
  ["Throwback to my very first stream vs now 🚀", "image"],
  ["Full recipe + workout posted in the members area.", "image"],
  ["Tips for growing without the algorithm — a thread 🧵", "text"],
  ["Locked BTS from the music video 🔒 VIP tier only.", "locked"],
  ["Big announcement tomorrow. Turn your notifications on 🔔", "text"],
];

const TIMES = ["1h", "2h", "3h", "4h", "6h", "8h", "10h", "12h", "14h", "18h", "1d", "1d", "2d", "2d", "3d"];
const DURS = ["0:45", "1:20", "3:04", "8:12", "12:40"];
const POLL_A = ["Sunset series", "Beach shoot", "Live replay", "Studio A"];
const POLL_B = ["Studio series", "City shoot", "Full VOD", "Studio B"];

/** 42-post generated seed feed — replace with GET /feed at integration. */
export const SEED_FEED: Post[] = Array.from({ length: 42 }).map((_, i) => {
  const cap = CAPS[i % CAPS.length];
  const c = CREATORS[(i * 3 + 1) % CREATORS.length];
  const p: Post = {
    id: String(i + 1),
    who: c.name,
    h: c.handle,
    t: TIMES[i % TIMES.length],
    v: c.v,
    text: cap[0],
    type: cap[1],
    seed: (cap[1] === "video" ? "vid" : "post") + i,
    likes: 140 + (fhash(cap[0] + i) % 2600),
    comments: 6 + (fhash(c.handle + i) % 210),
    coins: 15 + (fhash("c" + i) % 280),
  };
  if (cap[1] === "locked") p.price = [80, 120, 150, 200][i % 4];
  if (cap[1] === "video") p.dur = DURS[i % 5];
  if (cap[1] === "poll") {
    const a = 44 + (fhash("poll" + i) % 26);
    p.poll = [
      { label: POLL_A[i % 4], pct: a },
      { label: POLL_B[i % 4], pct: 100 - a },
    ];
  }
  return p;
});

export const NOTIF_SEED: NotifItem[] = [
  { icon: "coin", color: "var(--amber)", text: "@jay_88 sent you 500 coins", time: "2m ago" },
  { icon: "heart", color: "var(--coral)", text: "Sofia Amara liked your comment", time: "9m ago" },
  { icon: "user", color: "var(--blue)", text: "@superfan subscribed to you · VIP tier", time: "18m ago" },
  { icon: "gift", color: "var(--mint)", text: "@priscilla sent a $25 gift on your live", time: "32m ago" },
  { icon: "comment", color: "var(--blueL)", text: "Marcus T. replied to your comment", time: "51m ago" },
  { icon: "live", color: "var(--coral)", text: "Elena Rusk is live now — go watch", time: "1h ago" },
  { icon: "lock", color: "var(--amber)", text: "@mikew unlocked your PPV post · +150 coins", time: "2h ago" },
  { icon: "coin", color: "var(--amber)", text: "@zaraali tipped you 1,000 coins", time: "3h ago" },
  { icon: "user", color: "var(--blue)", text: "@noahk started following you", time: "4h ago" },
  { icon: "repost", color: "var(--mint)", text: "Diego Santos reposted your video", time: "5h ago" },
  { icon: "star", color: "var(--mint)", text: "You reached 8,400 subscribers 🎉", time: "7h ago" },
  { icon: "dollar", color: "var(--mint)", text: "Your $2,480 payout was sent", time: "1d ago" },
];

export const TX_SEED: TxItem[] = [
  { t: "Coin pack — 5,000 coins", s: "Card · Paystack", a: "-$49.00", d: "Today", coin: "+5,000" },
  { t: "Gift to Elena on live", s: "Coins", a: "", d: "Today", coin: "-500" },
  { t: "Subscription — Sofia Amara", s: "Card · monthly", a: "-$12.00", d: "Yesterday", coin: "" },
  { t: "Unlock PPV — Marcus T.", s: "Coins", a: "", d: "2d ago", coin: "-150" },
];

export const SEED_COMMENTS: Array<[string, string, string]> = [
  ["Jay Adeyemi", "jay_88", "This is 🔥🔥"],
  ["Priscilla N.", "priscilla", "You're the best 💕"],
  ["Superfan X", "superfan", "Take my coins 😂"],
  ["Mike W.", "mikew", "Unreal quality"],
  ["Zara Ali", "zaraali", "Obsessed 😍"],
  ["Noah Kim", "noahk", "Instant classic"],
  ["Amara Obi", "amaraobi", "The consistency 👏"],
  ["Leo Mensah", "leochef", "Chef's kiss 🤌"],
];

export const seedCommentsFor = (postId: string) => {
  const h = fhash("c" + postId);
  return [SEED_COMMENTS[h % SEED_COMMENTS.length], SEED_COMMENTS[(h + 3) % SEED_COMMENTS.length]];
};

export const REPORT_REASONS = [
  "Nudity or sexual content policy",
  "Harassment or bullying",
  "Spam or scam",
  "Copyright / stolen content",
  "Underage safety concern",
  "Self-harm or dangerous acts",
  "Other",
];

export const DM_THREADS: Array<{ handle: string; name: string; preview: string; locked: boolean; unread: boolean }> = [
  { handle: "sofiaa", name: "Sofia Amara", preview: "Sent you a locked message", locked: true, unread: true },
  { handle: "marcusbeats", name: "Marcus T.", preview: "Thanks for the tip! 🙏", locked: false, unread: true },
  { handle: "elenalive", name: "Elena Rusk", preview: "See you on live at 8!", locked: false, unread: false },
  { handle: "nadiak", name: "Nadia K.", preview: "New drop is up", locked: false, unread: false },
];

export const DM_OPENERS: Record<string, string> = {
  sofiaa: "Hey! So glad you subscribed 💕",
  marcusbeats: "Yo! New episode drops tonight 🎙️",
  elenalive: "See you on live at 8! 🎥",
  nadiak: "New drop is up — check the feed 📚",
};

export const FAN_SEED: Array<[string, string, string, string, string, boolean]> = [
  ["Jay Adeyemi", "jay_88", "VIP", "$420", "Active", true],
  ["Priscilla N.", "priscilla", "Premium", "$180", "Active", false],
  ["Superfan X", "superfan", "VIP", "$1,240", "Active", true],
  ["Mike W.", "mikew", "Basic", "$64", "Expiring", false],
  ["Tobi A.", "tobivlogs", "Premium", "$96", "Expired", false],
  ["Zara Ali", "zaraali", "Basic", "$38", "Active", false],
  ["Noah Kim", "noahk", "Premium", "$210", "Expiring", false],
];

export const LIVE_NAMES = ["@jayden", "@priscilla", "@marcus_t", "@superfan", "@zara_ali", "@kofi_beats", "@lena.b", "@diego_p", "@amara_j", "@noah_k", "@leo_r", "@sofia_m", "@mikew", "@bigfan22", "@tolu_a", "@nadia.x"];

export const LIVE_LINES: Array<[string, string]> = [
  ["joined the stream", ""],
  ["sent 500 coins", "coin"],
  ["sent 200 coins", "coin"],
  ["sent a $25 gift 🎁", "gift"],
  ["sent a $10 gift 🌹", "gift"],
  ["dropped a 🔥🔥", "msg"],
  ["just subscribed!", "sub"],
  ["sent 1,000 coins", "coin"],
  ["says hi from Lagos 🇳🇬", "msg"],
  ["sent a Diamond 💎", "gift"],
  ["this set is insane 😍", "msg"],
  ["sent 50 coins", "coin"],
];

/* ---------------- Admin seeds ---------------- */

export const POLICY = [
  "Harassment or bullying",
  "Nudity / sexual content policy",
  "Spam or platform manipulation",
  "Scam or impersonation",
  "Underage safety",
  "Payment fraud",
  "Copyright violation",
  "Other",
];

export const ADM_USERS: AdminUser[] = [
  { id: 1, n: "Sofia Amara", h: "sofiaa", role: "Creator", st: "Active", j: "Jul 2025", spend: "$28.9K", strikes: 0 },
  { id: 2, n: "Jay Adeyemi", h: "jay_88", role: "Fan", st: "Active", j: "Aug 2025", spend: "$1.2K", strikes: 0 },
  { id: 3, n: "Marcus T.", h: "marcusbeats", role: "Creator", st: "Active", j: "Jun 2025", spend: "$21.4K", strikes: 0 },
  { id: 4, n: "Priscilla N.", h: "priscilla", role: "Fan", st: "Suspended", j: "Sep 2025", spend: "$860", strikes: 2 },
  { id: 5, n: "Dembe O.", h: "dembefit", role: "Creator", st: "Pending KYC", j: "Oct 2025", spend: "$9.8K", strikes: 0 },
  { id: 6, n: "Nadia K.", h: "nadiak", role: "Creator", st: "Active", j: "Nov 2025", spend: "$12.1K", strikes: 0 },
  { id: 7, n: "Mike W.", h: "mikew", role: "Fan", st: "Active", j: "Jan 2026", spend: "$430", strikes: 1 },
  { id: 8, n: "Bad User", h: "baduser", role: "Fan", st: "Under review", j: "Mar 2026", spend: "$0", strikes: 3 },
  { id: 9, n: "Tobi A.", h: "tobivlogs", role: "Creator", st: "Active", j: "Feb 2026", spend: "$7.7K", strikes: 0 },
  { id: 10, n: "Superfan X", h: "superfan", role: "Fan", st: "Active", j: "Dec 2025", spend: "$4.9K", strikes: 0 },
  { id: 11, n: "Elena Rusk", h: "elenalive", role: "Creator", st: "Active", j: "May 2025", spend: "$31.2K", strikes: 0 },
  { id: 12, n: "Diego Santos", h: "diegoplays", role: "Creator", st: "Active", j: "Apr 2026", spend: "$5.4K", strikes: 1 },
];

export const ADM_KYC: KycApp[] = [
  { id: 1, n: "Dembe O.", h: "dembefit", doc: "Driver's licence", risk: "Low", t: "2h ago", st: "Pending" },
  { id: 2, n: "Nadia K.", h: "nadiak", doc: "Passport", risk: "Low", t: "5h ago", st: "Pending" },
  { id: 3, n: "Tobi A.", h: "tobivlogs", doc: "National ID", risk: "Doc blur — flagged", t: "1d ago", st: "Pending" },
  { id: 4, n: "Leo Mensah", h: "leochef", doc: "Passport", risk: "Low", t: "1d ago", st: "Pending" },
];

export const ADM_PAY: AdminPayout[] = [
  { id: 1, n: "Sofia Amara", amt: 2480, m: "Bank · Paystack", t: "2h ago", st: "Pending" },
  { id: 2, n: "Marcus T.", amt: 1800, m: "Card", t: "5h ago", st: "Pending" },
  { id: 3, n: "Elena Rusk", amt: 3120, m: "Bank transfer", t: "1d ago", st: "Pending" },
  { id: 4, n: "Priscilla N.", amt: 12400, m: "Bank transfer", t: "1d ago", st: "Pending" },
  { id: 5, n: "Diego Santos", amt: 940, m: "Bank · Paystack", t: "2d ago", st: "Pending" },
];

export const ADM_REPORTS: ModReport[] = [
  { id: 1, t: "Post by @baduser", who: "@sofiaa +11 others", n: 12, reason: "Harassment", sev: "High", prev: "Comment thread targeting a creator with sustained abusive language across 6 posts.", st: "Open", target: "baduser" },
  { id: 2, t: "Comment thread", who: "@jay_88 +2", n: 3, reason: "Spam", sev: "Medium", prev: "Repeated promo links to an off-platform gambling site in replies.", st: "Open", target: "mikew" },
  { id: 3, t: "Live replay clip", who: "AI flag · system", n: 1, reason: "Nudity policy", sev: "High", prev: "Automated frame-scan confidence 0.91 on restricted content in a public stream.", st: "Open", target: "priscilla" },
  { id: 4, t: "Profile @fakegiveaway", who: "@mikew +7", n: 8, reason: "Scam / impersonation", sev: "High", prev: "Impersonates @sofiaa and requests coin transfers for a fake giveaway.", st: "Open", target: "baduser" },
  { id: 5, t: "PPV post pricing", who: "@superfan +1", n: 2, reason: "Misleading content", sev: "Low", prev: "PPV thumbnail implies video content; unlock is a single photo.", st: "Open", target: "diegoplays" },
];
