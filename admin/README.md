# Fanation — admin

The internal operations console: moderation queue, payouts, creator vetting,
platform settings. Standalone React single-page app — Vite 6, React 19, React
Router 7, Zustand. Shares no build, no dependency graph and no deploy with the
client app or the landing site.

```bash
npm install
npm run dev        # http://localhost:3001
npm run build      # typecheck, then dist/
npm run preview    # serve dist/ exactly as a host would
```

Port 3001, not 3000, so this and `client` can run side by side.

## What is in here

| Path | What it is |
| --- | --- |
| `src/App.tsx` | Every URL in the console, in one list |
| `src/main.tsx` | Mounts React into `#root` and wraps it in `BrowserRouter` |
| `src/routes/_shell.tsx` | The layout route — sidebar, topbar, and the auth guard |
| `src/routes/login.tsx` | Mock staff sign-in, deliberately outside the shell |
| `src/routes/**` | One file per page |
| `src/components/**` | Pieces used by more than one page |
| `src/lib/core` | Store, seed data, types |
| `src/lib/ui` | Design system: components, `styles.css`, media resolvers |
| `src/lib/brand` | Colour tokens, the logo, the generated media table |
| `public/img` | The photographs the queue and creator rows render |

`src/lib` is vendored, not a package. The client app carries its own copy of
`ui` and `brand`. That is deliberate — neither project depends on the other, so
either can be deployed, rolled back or handed to a different team without
touching the other. The cost is that a change to the design system has to be
made twice. `src/lib/ui/styles.css` says so at the top of the file.

The store here is `admin-store.ts` only. The fan-facing `app-store.ts` is not
vendored into this project, because nothing in the console reads it.

## Routing

React Router in `BrowserRouter` mode: real paths, no hash. `/` and any unmatched
URL redirect to `/overview` — a wrong path in an internal console should land on
the dashboard, not a dead end.

`/login` sits **outside** `AdminLayout` rather than inside it. The shell
redirects unauthenticated staff to `/login`, so nesting the login page under the
shell would put the redirect inside the thing it redirects to and loop.

## Screen size

**Desktop only, by design.** Below 900px the sidebar is `display:none` and this
project has no bottom tab bar to replace it — unlike `client`, which does. A
moderator working a queue on a phone is not a flow anyone asked for, and the
tables in `/payouts` and `/creators` do not survive a 390px viewport without a
card-per-row rewrite.

If the console ever needs to work on a phone, the shape is already proven next
door: `client/src/components/nav.ts` exports `FAN_TABS`/`STUDIO_TABS` and
`client/src/routes/_shell.tsx` renders the tab bar plus the More drawer. The
`.tabbar`, `.tabi`, `.navdrawer` and `.only-mobile` rules are already in this
project's `styles.css` — the two copies are byte-identical — so the work is
wiring, not CSS. Add an `ADMIN_TABS` const and the same block of markup.

Until then, treat anything under 900px as unsupported rather than broken.

## Deploying

The one thing a single-page app needs from its host: **every path must serve
`index.html`**. The files under `dist/` are `index.html` and `assets/` — there is
no `payouts/index.html`, and there never will be. Without a rewrite rule the
first page load works and a hard refresh on any inner page returns 404.

`vercel.json` and `netlify.toml` are both in this folder; each host reads only
its own. Both also set `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options:
DENY` and `Referrer-Policy: no-referrer` on every response, which the client app
does not. For anything else:

**Cloudflare Pages** — create `public/_redirects`:

```
/*  /index.html  200
```

**nginx**

```nginx
root /var/www/fanation-admin/dist;

add_header X-Robots-Tag "noindex, nofollow" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "no-referrer" always;

location / {
  try_files $uri $uri/ /index.html;
}

location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

**Apache** — `dist/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

Header always set X-Robots-Tag "noindex, nofollow"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "no-referrer"
```

Cache `assets/*` forever — Vite fingerprints every file in it. Never cache
`index.html`; it is the only file that knows the current fingerprints.

Put the deployed console behind whatever the org already uses for internal
tools — Cloudflare Access, a VPN, an IP allowlist. The `noindex` headers keep it
out of search results; they are not access control.

## Regenerating media

The photographs and the `src/lib/brand/media.ts` lookup table are produced by
`tools/brand-assets/build.mjs` at the repo root, which writes into both this
project and `client`. Run it from the repo root:

```bash
node tools/brand-assets/build.mjs
```

## Regenerating icons

```bash
npm install -g sharp                          # once
node tools/brand-assets/generate-icons.mjs    # from the repo root
```

Writes `favicon.svg`, `favicon.ico` and `apple-touch-icon.png` into `public/`. Vite injects no
tags, so every one of those files is declared by hand in `index.html` — add a
file, add its tag.

## Not built yet

**Auth is a mock and must not be mistaken for one.** `authed` is a boolean in
`admin-store.ts`; the sign-in button sets it to `true` and navigates, without
reading the email field, the password field, or the two-factor row the form
displays. The guard in `_shell.tsx` is a `useEffect` that redirects when the
boolean is false — client-side only, so it hides the UI and protects nothing.
The page says "Protected by SSO · every action is audit-logged" and neither
clause is true yet.

There are also no roles. Every signed-in session sees every route, including
`/payouts` and `/audit`. A real console needs at least moderator, finance and
superadmin separated, and the routes that move money separated hardest.

Both of those close at integration, together, against real SSO with role claims
in the token — and the guard has to move server-side, because a `useEffect` is
a rendering decision, not an authorisation one. Until then this is a demo, not
an internal tool, and it should not be pointed at production data. Every store
action that would hit an endpoint is marked `BACKEND SEAM`.
