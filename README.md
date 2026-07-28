# Fanation

One repo, three deployments. Creator-economy platform — marketing site, fan/creator app, admin console.

```
apps/landing     marketing site        fanation-creator.vercel.app   (live)
apps/web         fan + creator app     27 routes
apps/admin       admin console         12 routes
packages/core    types, seed data, zustand stores
packages/ui      design tokens + primitives
```

pnpm workspaces + Turborepo. Node 22, pnpm 10.28.

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

All three point at this same repo. The only thing that differs is Root Directory.

| Project | Root Directory | URL |
|---|---|---|
| `fanation` | `apps/landing` | `fanation-creator.vercel.app` |
| `fanation-app` | `apps/web` | `fanation-app.vercel.app` |
| `fanation-admin` | `apps/admin` | `fanation-admin.vercel.app` |

Framework preset is Next.js on all three. Do not set a custom install or build command —
Vercel detects pnpm workspaces and Turborepo on its own.

Set **Ignored Build Step** to `npx turbo-ignore` on each project so a change to one app
does not rebuild the other two.

---

## 3. What the landing app is

`apps/landing` is the existing marketing site, moved without a single content change.
Tailwind 3.4, its own `next.config.ts`, its own `vercel.json` cache headers. It does not
share the design system in `packages/ui` and it does not import from `packages/core`.
It is independent — treat it as finished.

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

These are behavioural requirements, not UI decoration. The backend has to enforce them.

- Destructive actions are reason-gated — no free-text-only confirms
- Payouts at or above **$10,000** require a second admin to co-sign
- Three upheld strikes puts an account into **Under review** automatically
- The audit log is append-only
- A payout against a sanctioned account warns before it can be approved

---

## 7. Before the admin URL goes to anyone

`apps/admin` ships `noindex` metadata, but auth is mocked. Put Vercel Deployment
Protection (Settings → Deployment Protection → Vercel Authentication) in front of
`fanation-admin` before sharing the URL.
