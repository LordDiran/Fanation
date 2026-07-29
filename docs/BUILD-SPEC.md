# Fanation — Build Specification

**Version 1.0 · 29 July 2026**
Prepared for: Folasayo Akinyosoye, Dami (infrastructure)
Repository: `github.com/LordDiran/Fanation`

---

## 1. Summary

Fanation ships as **three independent React applications** — `landing`, `client`, `admin`. Each is a standalone Vite + React + TypeScript project with its own `package.json`, its own `node_modules`, its own build, and its own deployment. There is no workspace, no shared build tool, no package manager linkage between them. Cloning the repo and running `npm install` inside any one folder gives you a working project without touching the other two.

This document covers what is built, how to run it, how to deploy it, and where the backend attaches. Sections 9 and 10 are written for infrastructure.

---

## 2. Framework — React

Confirmed. All three applications are React 19 with TypeScript, compiled by Vite. No meta-framework, no server runtime, no server-side rendering. Every build produces static HTML, JavaScript and CSS that any static host can serve.

The earlier build used Next.js. Next.js is React underneath — every component in it was a React component — but "built with React" reasonably means a plain React application without a framework wrapped around it, and that is now what this is. The conversion is complete and verified; details in section 12.

---

## 3. Repository structure

One repository, three projects, three deployments:

```
Fanation/
├── landing/          marketing site        → fanation.app
├── client/           fan + creator app     → app.fanation.app
├── admin/            internal console      → admin.fanation.app
├── docs/             this file + deployment and handover notes
├── tools/            verification scripts + brand asset generators
└── README.md
```

On the monorepo question: a single git repository holding several projects does not by itself force them into one deployment — the two are separate decisions. But separate deployments is both what you have today and what you want, so that is what has been built. Each project is independently installable, independently buildable, and independently deployable. Whether the three folders live in one repository or three is a repository-hosting preference at this point; splitting them later requires moving folders and pointing three deployment projects at three repos, and changes no application code.

What has been removed from the previous structure: the pnpm workspace, the Turborepo pipeline, the root `package.json`, and the `packages/*` shared libraries that were consumed through `workspace:*` dependencies. Those were the parts that coupled the three builds together.

---

## 4. Stack

| | `landing` | `client` | `admin` |
|---|---|---|---|
| Purpose | Marketing site | Fan + creator app | Internal console |
| React | 19.0 | 19.0 | 19.0 |
| TypeScript | 5.7.2 | 5.7.2 | 5.7.2 |
| Build tool | Vite 6.0.7 | Vite 6.0.7 | Vite 6.0.7 |
| Router | none — single page | react-router-dom 7.1.1 | react-router-dom 7.1.1 |
| State | none | zustand 5.0.2 | zustand 5.0.2 |
| CSS | Tailwind 3.4.17 | hand-written CSS | hand-written CSS |
| Fonts | @fontsource-variable/inter 5.1.1 | same | same |
| Package name | `fanation-landing` | `fanation-client` | `fanation-admin` |

Three things to note from that table. `landing` carries no router because it is one page with in-page anchors — adding a router to it would be dead weight. `landing` is the only project using Tailwind; it was written that way and rewriting it into the app's CSS system would have been churn without benefit. And `client` and `admin` share a hand-written stylesheet rather than a utility framework, which is what keeps their two builds visually identical.

Runtime dependencies are deliberately few. There is no UI component library, no icon package, no date library, no HTTP client. Icons are a single inline SVG component. That keeps the bundles small and leaves the backend team free to choose a data-fetching approach without unpicking one that is already there.

---

## 5. Project layout

All three follow the same shape:

```
<project>/
├── index.html            entry document — title, meta, icons, OG tags
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json           deployment config — Vercel (see §9)
├── netlify.toml          the same config for Netlify
├── public/               static files served at the root
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png
│   ├── og.png            landing + client only
│   └── img/ or images/   photography and video posters
└── src/
    ├── main.tsx          React root
    ├── App.tsx           route table (client + admin only)
    ├── routes/           one file per page (client + admin only)
    ├── components/       shared components within the project
    └── lib/              design layer (client + admin only)
        ├── core/         types, seed data, zustand store
        ├── ui/           primitives + the full stylesheet
        └── brand/        logo, wordmark, colour tokens
```

File counts, current:

| | Route files | Component files | Design-layer files | Total `.tsx` / `.ts` |
|---|---|---|---|---|
| `client` | 26 | 3 | 13 | 45 |
| `admin` | 11 | 1 | 13 | 27 |
| `landing` | — | 3 | — | 6 |

### 5.1 The shared design layer

`client` and `admin` both need the same primitives — buttons, cards, modals, the toast system, the icon set, the colour tokens, the stylesheet. In the previous structure that lived in `packages/ui`, `packages/core` and `packages/brand` and was imported as `@fanation/ui`. A shared package is exactly the coupling that has been removed, so the layer is now **copied into each project** at `src/lib/{core,ui,brand}` and imported as `@/lib/ui`.

This is a deliberate trade. Two copies of a stylesheet is duplication, and duplication drifts. The alternative — a published package, or a workspace — reintroduces either a release step or the coupling. For a design layer that changes rarely and two applications that must look identical, copying is the cheaper of the two problems.

The discipline that goes with it: `client/src/lib/ui/styles.css` and `admin/src/lib/ui/styles.css` must stay byte-for-byte identical. A change to one is applied to the other in the same commit, and checked:

```bash
md5sum client/src/lib/ui/styles.css admin/src/lib/ui/styles.css   # both hashes must match
```

If this becomes painful — if the two start diverging in practice, or a third application appears — the answer is to publish `@fanation/ui` to a private registry and depend on a version number. That is a change worth making when the pain is real, not before.

`landing` shares none of this. It has its own Tailwind styling and its own components, and no `src/lib` at all.

---

## 6. Running locally

No global tooling. Node 20 or later, npm, nothing else.

```bash
git clone https://github.com/LordDiran/Fanation.git
cd Fanation/client        # or admin, or landing
npm install
npm run dev
```

Each project exposes the same four scripts:

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server with hot module replacement |
| `npm run build` | `tsc --noEmit && vite build` — typecheck first, then bundle to `dist/` |
| `npm run typecheck` | Types only, no bundle |
| `npm run preview` | Serves the built `dist/` locally — this is what the verification scripts drive |

Ports are fixed so all three can run at once:

| Project | Port | Local URL |
|---|---|---|
| `client` | 3000 | http://localhost:3000 |
| `admin` | 3001 | http://localhost:3001 |
| `landing` | 3002 | http://localhost:3002 |

The build fails on a type error. `tsc --noEmit` runs before Vite in every `build` script, so a broken type never reaches a deployment.

---

## 7. Routes

### 7.1 `client` — 27 route entries

Two of those are redirects; 25 are addressable pages.

| Path | Page | Shell |
|---|---|---|
| `/` | → redirects to `/feed` | — |
| `/login` | Sign in | none |
| `/signup` | Create account | none |
| `/feed` | Home feed | app |
| `/explore` | Creator discovery | app |
| `/reels` | Short-form video | app |
| `/live` | Live streams | app |
| `/messages` | Direct messages | app |
| `/notifications` | Notifications | app |
| `/collections` | Saved content | app |
| `/subscriptions` | Active subscriptions | app |
| `/wallet` | Coin balance and history | app |
| `/settings` | Account settings | app |
| `/creator/:handle` | Public creator profile | app |
| `/studio` | Creator dashboard | app |
| `/studio/earnings` | Earnings breakdown | app |
| `/studio/content` | Content library + composer | app |
| `/studio/vault` | Media vault | app |
| `/studio/tiers` | Subscription tiers | app |
| `/studio/fans` | Fan list and segments | app |
| `/studio/messages` | Mass messaging | app |
| `/studio/live` | Go live | app |
| `/studio/promos` | Promotions | app |
| `/studio/analytics` | Analytics | app |
| `/studio/payouts` | Payout requests | app |
| `/studio/verify` | Identity verification | app |
| `*` | → redirects to `/feed` | — |

`/login` and `/signup` render outside the application shell — no navigation, by design, because there is nowhere to navigate to before sign-in. Everything else renders inside it.

### 7.2 `admin` — 12 route entries

Two redirects, 10 addressable pages.

| Path | Page |
|---|---|
| `/` | → redirects to `/overview` |
| `/login` | Admin sign in |
| `/overview` | Needs-attention dashboard |
| `/users` | User management, suspend / restore |
| `/creators` | Creator management |
| `/kyc` | Identity verification queue |
| `/moderation` | Reported content queue |
| `/finance` | Revenue and fee summary |
| `/payouts` | Payout approval queue |
| `/reports` | User reports |
| `/audit` | Audit log |
| `*` | → redirects to `/overview` |

### 7.3 `landing` — single page

No router. `src/main.tsx` mounts `src/Landing.tsx` directly. Navigation within the page is in-page anchors. There is no client-side routing to configure and no rewrite rule needed on the host.

---

## 8. Build output

Measured on the current source. Numbers will move as content changes; the shape will not.

| | JavaScript | CSS | Total `dist/` |
|---|---|---|---|
| `client` | 381 KB raw / **113 KB gzip** | 15.4 KB raw / 4.2 KB gzip | 685 KB |
| `admin` | 316 KB raw / **99 KB gzip** | 15.4 KB raw / 4.2 KB gzip | 550 KB |
| `landing` | 255 KB raw / **77 KB gzip** | 18.7 KB raw / 5.0 KB gzip | 565 KB |

`dist/` totals include the Inter variable font subsets (~220 KB across seven `.woff2` files, of which a browser downloads only the subsets it needs — typically the Latin one, 48 KB). Source maps are generated and add roughly 1.5 MB per project; they are not counted above and can be turned off per project in `vite.config.ts` (`build.sourcemap: false`) if you would rather not publish them.

Each build is a single JS bundle. No route-level code splitting is configured. At 113 KB gzip for the largest of the three that is a reasonable place to be, and splitting can be added later with `React.lazy` on the studio routes if first-load becomes a concern.

---

## 9. Deployment — for infrastructure

### 9.1 What each project needs from a host

Three static sites. No Node process, no server runtime, no serverless functions, no environment variables at build time, no build-time dependency between projects. Each is `npm install`, `npm run build`, serve `dist/`.

That means any of these work without modification: Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront, Azure Static Web Apps, Nginx serving a folder.

### 9.2 The one host requirement — SPA rewrite

`client` and `admin` are single-page applications with client-side routing. A user who loads `app.fanation.app/wallet` directly, or refreshes on it, sends a request for `/wallet` to the host. There is no file at that path. **The host must answer with `index.html`** and let React Router resolve the path in the browser. Without this rule, every URL except the root returns 404 on direct load and refresh.

`landing` does not need this — it is one page.

The rule is already committed twice in `client/` and `admin/` — once as `vercel.json`, once as `netlify.toml`. A host reads only the file that belongs to it, so shipping both means either platform deploys these projects without an edit.

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Equivalents on other hosts:

| Host | Configuration |
|---|---|
| Vercel | `vercel.json` — **already committed** |
| Netlify | `netlify.toml` — **already committed** |
| Cloudflare Pages | Automatic for SPA projects; otherwise `_redirects`: `/*  /index.html  200` |
| Nginx | `try_files $uri $uri/ /index.html;` |
| Azure Static Web Apps | `staticwebapp.config.json` → `navigationFallback.rewrite: "/index.html"` |
| S3 + CloudFront | Error document `index.html`, error responses 403 and 404 → `/index.html` with status 200 |

`landing` ships both files too, deliberately without the rewrite — an unknown path on a one-page marketing site should return a real 404 rather than quietly render the homepage under the wrong URL.

### 9.3 Host settings per project

Whichever host is used, three projects are configured, each pointing at one folder:

| Project | Root directory | Build command | Output | Framework preset |
|---|---|---|---|---|
| `fanation` | `landing` | `npm run build` | `dist` | Vite |
| `fanation-app` | `client` | `npm run build` | `dist` | Vite |
| `fanation-admin` | `admin` | `npm run build` | `dist` | Vite |

If all three stay in one repository, set each project's root directory to its folder and — where the host supports it — an ignored-build step so a change to `landing` does not rebuild `client`. On Vercel that is the *Ignored Build Step* field:

```bash
git diff --quiet HEAD^ HEAD -- ./
```

Committed caching headers, already in each `vercel.json`: `/assets/*` is immutable for one year (safe — Vite content-hashes every filename), `index.html` is `no-cache` so a deployment is picked up on the next load.

### 9.4 Admin access control — open item

`admin` ships three headers: `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`. **None of those is access control.** They keep the console out of search results; they do not stop anyone who has the URL.

The console is currently reachable by URL. That is acceptable for a prototype holding fabricated data. **It must be closed before the first real API call is wired in.** Options, cheapest first: put the console behind the host's deployment protection with no production-domain exemption; drop the public domain and use the protected preview URL; or put it behind an IP allowlist or VPN. This is a decision for infrastructure and it needs making before, not after, real user data is behind it.

---

## 10. Backend integration points

The applications run entirely on seed data held in a zustand store. Every action that will eventually hit an API is already isolated as a single store action, so wiring the backend means replacing the body of one function per row below — no component changes.

| Store action | Expected endpoint | Effect |
|---|---|---|
| `toggleLike` | `POST /posts/:id/like` | Like / unlike a post |
| `subscribe` | `POST /subscriptions` | Subscribe to a creator tier |
| `requestPayout` | `POST /payouts` | Creator requests a payout |
| `setUserSt` | `PATCH /admin/users/:id` | Suspend, restore, or flag a user |
| `paySet` | `PATCH /admin/payouts/:id` | Approve, co-sign, or reject a payout |
| `log` | server-side audit write | Append an entry to the audit log |

### 10.1 Governance rules the backend must enforce

These are implemented in the console's interface. **The interface is not the enforcement point** — every one of them has to be re-implemented server-side, because a client-side check is a suggestion.

1. Destructive actions are reason-gated. Suspend, dismiss and reject all require a reason code before the confirm button enables.
2. Payouts of **$10,000 or more require a second admin to co-sign**. The first approval records intent; it does not release funds.
3. Three upheld strikes against an account moves it to **Under review** automatically.
4. The audit log is **append-only**. No edit, no delete, no exceptions for administrators.
5. A payout against a sanctioned account warns before it proceeds and records the override, including who made it.

### 10.2 Open questions — answer 1 and 3 before writing backend code

1. **Session model.** JWT with refresh, or server sessions? This decides how the client stores auth state and whether the current in-memory approach is replaced or extended.
2. **Media storage.** Where do uploads live, and are paid-tier assets served through signed URLs with expiry? Affects the media components directly.
3. **Payout rails.** Which provider, and does the $10,000 co-sign gate live in our service or theirs? Affects the payout flow and the audit trail.
4. **KYC provider.** Which vendor, and is the review queue ours or theirs? Determines whether `/kyc` stays a working queue or becomes a status view.
5. **Real-time transport.** WebSocket, SSE, or polling for messages, live streams and notifications? Nothing depends on this yet; everything real-time is currently static.

---

## 11. Prototype boundaries

Four things behave as a prototype and are documented rather than hidden. Anyone demonstrating this needs to know all four.

1. **Sign-in is mocked.** Any credentials are accepted; the button sets a flag. There is no authentication.
2. **A hard refresh signs you out.** Auth state is in memory with no persistence, so a full page load clears it and the route guard returns you to `/login`. This is deliberate for a prototype with no real session — it is not a bug, and it is the first thing that changes when the session model is decided.
3. **No payment rails.** Coin balances, subscription prices, payouts and revenue figures are seed data. Nothing moves money.
4. **All data is fabricated.** Users, creators, posts, reports, KYC submissions, transactions. It is written to be realistic enough to demonstrate and is not derived from anything real.

One interface limitation worth stating plainly: **`admin` has no navigation below 900px wide.** The console is desktop-only by design — it is an internal tool used at a desk, and building a phone layout for a nine-column payout table would have cost real time for no demonstrable benefit. `client` and `landing` are fully responsive from 390px up.

---

## 12. Verification

Three scripts in `tools/`, all runnable against production builds. Playwright is the only development dependency they need (`npm i -D playwright && npx playwright install chromium`).

| Script | Checks | Current result |
|---|---|---|
| `tools/verify-responsive.mjs` | 25 client routes × 3 viewports (390, 768, 1440): no horizontal overflow, navigation present, no console errors, no failed requests. Plus the phone More-drawer and the two-pane messenger. | **PASS** — 75 route/viewport combinations |
| `tools/smoke.mjs` | 27 behavioural assertions across `client` and `admin`: sign-in, route guard, feed rendering, publish, like toggle, reason-gated suspend, the $10,000 co-sign flow, KYC approval, report dismissal, audit capture, sidebar badge decrement. | **27 passed, 0 failed** |
| `tools/diag-overflow.mjs` | Diagnostic. Given a route and a width, names the specific element causing an overflow and prints the computed property responsible. | On demand |

To run them:

```bash
cd client && npm run build && npm run preview     # terminal one
cd admin  && npm run build && npm run preview     # terminal two
node tools/verify-responsive.mjs                  # terminal three
node tools/smoke.mjs
```

All three projects typecheck and build clean.

One caveat on `verify-responsive.mjs`: it reports broken images by asking each `<img>` whether it decoded, and it reports rather than fails. On a machine with the media present that count must read zero. A `<video poster>` that fails leaves no trace in `document.images` and is not covered — nine files, checked by eye.

---

## 13. Assumptions

1. Node 20 or later on every machine that builds this.
2. Hosting supports the SPA rewrite in §9.2 for `client` and `admin`.
3. The three applications continue to deploy separately. Nothing here prevents combining them; doing so would mean choosing a routing strategy across three roots and is not planned.
4. `admin` stays desktop-only.
5. The design layer stays copied rather than published, until a third consumer exists or the two copies start to drift in practice.

## 14. Dependencies on your side

| Item | Owner | Needed by |
|---|---|---|
| Confirm hosting platform and that SPA rewrite is supported | Dami | Before first deployment |
| Confirm domain assignments for the three projects | Folasayo / Dami | Before first deployment |
| Decide how `admin` is access-controlled | Dami | Before the first real API call |
| Answer open questions 1 and 3 (§10.2) | Backend lead | Before backend work starts |
| Provide API base URLs per environment | Backend lead | At integration |

## 15. Out of scope for this build

Backend services, database, authentication, payment processing, media upload and transcoding, email and push notifications, analytics instrumentation, internationalisation, automated CI, and unit tests. The verification scripts in §12 are end-to-end browser checks, not a unit test suite.

---

## 16. Open items on our side

Carried openly rather than closed quietly:

1. **Open Graph tags hard-code `fanation.app` and `app.fanation.app`.** Each `index.html` carries an absolute `og:image` URL and canonical metadata. If the production domains differ, three files need one edit each before launch.
2. **No route-level code splitting.** Noted in §8. A decision to defer, not an oversight.
3. **Source maps are published by default.** One line per `vite.config.ts` to change if that is not wanted on production.
