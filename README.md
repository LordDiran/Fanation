# Fanation

One repo, three deployments. Creator-economy platform — marketing site, fan/creator app, admin console.

```
apps/landing     marketing site         1 page      fanation-creator.vercel.app
apps/web         fan + creator app      26 pages    fanation-app.vercel.app
apps/admin       admin console          11 pages    fanation-admin.vercel.app
packages/core    types, seed data, zustand stores
packages/ui      design tokens + primitives
```

All three are live and building green off `main`. pnpm workspaces + Turborepo. Node 22, pnpm 10.28.

> Vercel's build table reports 27 and 12 for `apps/web` and `apps/admin`. That is the page
> count plus Next.js's implicit `/_not-found`. 26 and 11 are the real route counts.

---

## 1. Running locally

```bash
pnpm install
pnpm dev            # all three at once
```

Or one at a time:

```bash
pnpm dev:landing    # :3000
pnpm dev:web        # :3000
pnpm dev:admin      # :3001
```

`pnpm build` builds all three through Turborepo.

---

## 2. The three Vercel projects

All three point at this same repo on branch `main`. The only thing that differs is Root
Directory.

| Project | Root Directory | URL | Status |
|---|---|---|---|
| `fanation` | `apps/landing` | `fanation-creator.vercel.app` | Live — public |
| `fanation-app` | `apps/web` | `fanation-app.vercel.app` | Live — public |
| `fanation-admin` | `apps/admin` | `fanation-admin.vercel.app` | Live — **see §7** |

Framework preset is Next.js on all three. Do not set a custom install or build command —
Vercel detects pnpm workspaces and Turborepo on its own.

`fanation` also answers on `fanation-black.vercel.app`.

Set **Settings → Git → Ignored Build Step** on each project so a change to one app does not
rebuild the other two:

| Project | Command |
|---|---|
| `fanation` | `npx turbo-ignore landing` |
| `fanation-app` | `npx turbo-ignore web` |
| `fanation-admin` | `npx turbo-ignore admin` |

Full deployment procedure and troubleshooting: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 3. What the landing app is

`apps/landing` is the existing marketing site, moved into the monorepo without a single
content change. Tailwind 3.4, its own `next.config.ts`, its own `vercel.json` cache headers.
It does not share the design system in `packages/ui` and it does not import from
`packages/core`. It is independent — treat it as finished.

---

## 4. What the platform apps are

`apps/web` and `apps/admin` are prototypes, verified with 27 Playwright assertions
(`smoke.js`). They share `packages/core` and `packages/ui`, which use plain CSS custom
properties rather than Tailwind. That is deliberate — the two styling systems never meet
because each app builds from its own root directory.

**Sign-in is mocked.** Any input on the login screens works. Auth state is in-memory by
design, so a hard refresh returns you to `/login`. That is the guard working, not a bug.

**No payment rails are wired.** Coins, tips, gifts and payouts move numbers in the zustand
store only.

---

## 5. Backend seam

One store action = one endpoint. The stores in `packages/core` are shaped so each action
maps to exactly one call:

| Store action | Endpoint |
|---|---|
| `toggleLike` | `POST /posts/:id/like` |
| `subscribe` | `POST /subscriptions` |
| `requestPayout` | `POST /payouts` |
| `setUserSt` | `PATCH /admin/users/:id` |
| `paySet` | `PATCH /admin/payouts/:id` |
| `log` | server-side audit write |

---

## 6. Admin governance rules

These are behavioural requirements, not UI decoration. The backend has to enforce them —
the UI enforcing them alone is not enforcement.

- Destructive actions are reason-gated — no free-text-only confirms
- Payouts at or above **$10,000** require a second admin to co-sign
- Three upheld strikes puts an account into **Under review** automatically
- The audit log is append-only
- A payout against a sanctioned account warns before it can be approved

---

## 7. Before the admin URL goes to anyone

`apps/admin` ships `noindex, nofollow` metadata, but **auth is mocked** — any input signs
you in. `noindex` keeps it out of search results. It does not keep anyone out.

`fanation-admin` → **Settings → Deployment Protection → Vercel Authentication** → Standard
Protection, on for Production → **Save**.

Toggling is not saving. Confirm it took by opening `fanation-admin.vercel.app` in a private
window: you should get a Vercel log-in wall, not the console.

Until that wall is up, anyone holding the URL is an admin over payouts, KYC and moderation.
