# Fanation

One repo, three deployments. Creator-economy platform — marketing site, fan/creator app, admin console.

```
apps/landing     marketing site         1 page      fanation-creator.vercel.app
apps/web         fan + creator app      26 pages    fanation-app.vercel.app
apps/admin       admin console          11 pages    fanation-admin.vercel.app  (open — §7)
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
| `fanation-admin` | `apps/admin` | `fanation-admin.vercel.app` | Live — open, see §7 |

Framework preset is Next.js on all three. Do not set a custom install or build command —
Vercel detects pnpm workspaces and Turborepo on its own.

`fanation` also answers on `fanation-black.vercel.app`.

Two settings under **Settings → Build and Deployment → Root Directory** matter and both are
already on. Leave them on:

- **Include files outside the root directory in the Build Step.** Required. Each app builds
  from its own root but needs the workspace root — `pnpm-workspace.yaml`, `pnpm-lock.yaml`,
  `packages/`. Turn this off and every build fails.
- **Skip deployments when there are no changes to the root directory or its dependencies.**
  This is what stops a tweak inside `apps/landing` from rebuilding all three apps. It is
  dependency-aware, so a change in `packages/core` still correctly rebuilds `web` and
  `admin`. Changes at the repo root — this file, `docs/`, `turbo.json`, the lockfile —
  rebuild all three regardless. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) §4.

Leave **Ignored Build Step** on *Automatic*. Do not put `npx turbo-ignore` there —
Vercel deprecated it in favour of the Skip Deployments toggle above, and the dashboard
warns you if you try.

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

## 7. Reaching the admin console

```
fanation-admin.vercel.app
```

Open, no log-in required. That is a deliberate call for the prototype stage — read the
rest of this section before assuming it is protected, because it is not.

### What is actually exposed

Nothing that matters yet. Auth is mocked, there is no backend, no database, no processor
and no real user. Every record you see is a fixture in `packages/core`. The console moves
numbers in a zustand store and nothing else. The business logic it reveals — payout
thresholds, moderation rules, ban states — is in this repo anyway.

### Why it is open, mechanically

Vercel Authentication is on at **Standard Protection**, which protects every deployment URL
and branch URL but **exempts the project's production domain by design**. Its own dropdown
says so: *"Protect all except production Custom Domains for your project."* Closing that
last gap needs the *All Deployments* mode, a $150/month add-on. So `fanation-admin.vercel.app`
is open while everything else on the project is not:

| URL | Unauthenticated result |
|---|---|
| `fanation-admin.vercel.app` | serves the console |
| `fanation-admin-timmydiran1-6323s-projects.vercel.app` | 302 → Vercel log-in |
| `fanation-admin-git-main-timmydiran1-…vercel.app` | 302 → Vercel log-in |
| per-deployment URLs | 302 → Vercel log-in |

`apps/admin` ships `noindex, nofollow`. That keeps it out of search results. It is not
access control.

### When this has to change

**Before the first real API call is wired into `apps/admin`.** The day this console talks
to a live backend, an open URL plus mocked sign-in means anyone who types the hostname is
an administrator over payouts, KYC and bans. Mock auth is the only thing standing between
those two states, and replacing it is a deliberate task — it will not happen by accident,
and neither will closing this.

Two ways to close it when the time comes, both reversible in under a minute:

1. **Settings → Domains → remove `fanation-admin.vercel.app`.** Free. Everyone moves to
   `fanation-admin-git-main-timmydiran1-6323s-projects.vercel.app`, which is already
   protected, and access is granted per person under **Settings → Project Members**.
2. **Deployment Protection → All Deployments.** $150/month, keeps the clean URL.

Do not add a custom domain such as `admin.fanation.com` and assume it is protected — custom
production domains carry the same exemption.
