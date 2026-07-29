# Fanation — landing

The public marketing site. Standalone React single-page app — Vite 6, React 19.
One page, no router, no store, three dependencies.

```bash
npm install
npm run dev        # http://localhost:3002
npm run build      # typecheck, then dist/
npm run preview    # serve dist/ exactly as a host would
```

Port 3002, so all three projects can run at once — client on 3000, admin on
3001.

## What is in here

| Path | What it is |
| --- | --- |
| `src/Landing.tsx` | The whole page — every band, in order, top to bottom |
| `src/main.tsx` | Mounts React into `#root`, imports Inter and `globals.css` |
| `src/globals.css` | Every style the site has |
| `src/components/Hero.tsx` | The hero: photo carousel, parallax, floating gift particles |
| `src/components/Nav.tsx` | Sticky header and the mobile menu |
| `src/components/SocialIcons.tsx` | Footer social row |
| `public/images/` | Nine creator portraits |
| `public/favicon.svg` etc. | Generated icons and the OG card |

This project does **not** carry `src/lib`. There is no store, no seeded data and
no design-system component here — the landing page is its own visual language,
and it holds its own copy of the brand hex and the two mark paths inline in
`Nav.tsx`. That is deliberate and it is written down in
`tools/brand-assets/README.md` §7: a code dependency on the app's brand layer
would mean every token change redeploys the live marketing site. It is why this
is the smallest of the three projects by a wide margin.

## No router

The four header links are hash anchors to sections further down the same page —
`#features`, `#creators`, `#earn`, `#faq`. There is no React Router and no
client-side navigation, which is why this project ships **no catch-all rewrite**
while `client` and `admin` both do. An unknown path here should return a real
404; quietly rendering the homepage under `/pricing` would be worse, because it
hides a broken link instead of surfacing it. `netlify.toml` says the same in a
comment so nobody adds the rule back by pattern-matching against the other two.

## Images

Nine portraits in `public/images`, referenced by root-absolute path
(`/images/creator-sofia.jpg`). Four of them — sofia, marcus, tobi, amara — are
also read as **inputs** by `tools/brand-assets/build.mjs`, which squares them
into avatars for `client` and `admin` so the same face appears under the same
name on the marketing site and in the app. `manifest.json` names them by path.
Move or rename one of those four and the media build breaks; the other five are
landing-only.

The hero is a cross-fading, heavily blurred carousel of four of those photos
with a parallax transform on scroll — not video. Nothing on this site loads a
video file, which is the right call for a first paint on a Nigerian mobile
connection.

## Deploying

`vercel.json` and `netlify.toml` are both in this folder; each host reads only
its own. Both set cache headers and nothing else — no rewrite rules needed.
Anywhere else, point the host at `dist/` as a plain static directory.

Cache `assets/*` forever — Vite fingerprints every file in it. Never cache
`index.html`; it is the only file that knows the current fingerprints. Files in
`public/` are served under their own names and are **not** fingerprinted, so the
nine portraits and `og.png` get no immutable header — swap one without renaming
it and you are waiting on a CDN purge.

`index.html` hard-codes `https://fanation.app` in the `og:*` tags, because
`og:image` has to be absolute or every unfurler renders a blank card. Change
that host when the site moves.

## Regenerating icons

```bash
npm install -g sharp                          # once
node tools/brand-assets/generate-icons.mjs    # from the repo root
```

Writes `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` and `og.png` into
`public/`. Vite injects no tags, so every one of those files is declared by hand
in `index.html` — add a file, add its tag.

## Responsive behaviour

Three breakpoints in `globals.css`: `min-width: 768px`, `min-width: 1024px`, and
`max-width: 767px`. The site is built mobile-first, which is the opposite of
`client` and `admin` — they are desktop-first with a 900px breakpoint. Do not
copy a media query from one to the other without re-reading which direction it
is written in.

Below 768px the header collapses into the full-screen menu in `Nav.tsx`.

## Not built yet

Seventeen links on this page are `href="#"` placeholders: every sign-in and
sign-up CTA, the whole footer, and the social row. They render and they do
nothing. Before this goes in front of anyone outside a demo, the CTAs need to
point at the deployed `client` app and the footer needs real destinations or
fewer links.

Nothing here talks to a backend. There is no waitlist capture, no analytics and
no email collection — the page is presentation only.
