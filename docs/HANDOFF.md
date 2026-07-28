# Developer handoff

What this is, what is real, what is not, and what has to be built.

---

## 1. What you are getting

| App | URL | What it is |
|---|---|---|
| `apps/landing` | `fanation-creator.vercel.app` | Marketing site. Finished. Do not restructure it. |
| `apps/web` | `fanation-app.vercel.app` | Fan + creator app. 26 routes. Prototype. |
| `apps/admin` | `fanation-admin.vercel.app` | Admin console. 11 routes. Prototype. Open — read §5. |

Repo: `github.com/LordDiran/Fanation` — apps under `apps/`, shared code under `packages/`.
pnpm workspaces + Turborepo. Node 22, pnpm 10.28.

```bash
pnpm install
pnpm dev
```

---

## 2. Read this before you file bugs

**Sign-in is mocked.** Any input on either login screen works. There is no credential check,
no session, no token.

**A hard refresh bounces you to `/login`.** Auth state is in-memory. That is the guard
working as designed, not a defect.

**No payment rails are wired.** Coins, tips, gifts, subscriptions and payouts move numbers
inside a zustand store. Nothing touches Paystack, Flutterwave, or any processor.

**Seed data is fabricated.** Users, earnings, payout queues and KYC submissions in
`packages/core` are fixtures for demonstrating flows.

Those four are the prototype's known boundaries. Everything else is fair game.

---

## 3. The backend seam

The stores in `packages/core` were shaped around one rule: **one store action = one
endpoint.** Replacing a mock with a real call should be a single-function change, not a
refactor.

| Store action | Endpoint to build |
|---|---|
| `toggleLike` | `POST /posts/:id/like` |
| `subscribe` | `POST /subscriptions` |
| `requestPayout` | `POST /payouts` |
| `setUserSt` | `PATCH /admin/users/:id` |
| `paySet` | `PATCH /admin/payouts/:id` |
| `log` | server-side audit write |

If you find yourself needing an endpoint that maps to half a store action or to two of
them, flag it — that means the seam is wrong and it is cheaper to fix now.

---

## 4. Admin rules the backend must enforce

The console implements these in the UI. **UI enforcement is not enforcement.** Every one of
these has to hold server-side, because the console is not the only thing that will ever
call the API.

- Destructive actions are reason-gated. Reject the request if no reason is supplied.
- Payouts at or above **$10,000** require a second admin to co-sign. Single-admin approval
  above that threshold must fail server-side.
- Three upheld strikes moves an account to **Under review** automatically. This is a state
  transition the server owns, not a button.
- The audit log is append-only. No update path, no delete path, no exceptions for admins.
- A payout against a sanctioned account warns before approval and records who overrode it.

---

## 5. Access

All three URLs are open. No Vercel log-in, no invite needed. Take them and start.

`fanation-admin.vercel.app` included — and that is a decision, not an oversight. It is
open because there is nothing behind it: mocked sign-in, no backend, no database, no
processor, fabricated fixtures. Access friction on a prototype costs more than it buys.

**This changes the moment you wire the first real API call into `apps/admin`.** Mocked
sign-in (§2) plus an open URL equals an unauthenticated administrator over payouts, KYC
and bans. So when you pick up the auth work:

1. Real sign-in and a real session land **before** the admin console talks to a live
   backend, not after. Not in the same PR — before it.
2. Flag it to Timmy when you start that work so the URL gets locked the same week.
   `README.md` §7 has both options and either takes under a minute.

Treat it as a hard sequencing constraint on the auth ticket. Do not build the admin API
against mock auth and plan to swap it later.

---

## 6. Deployment

Three Vercel projects off this one repo, separated by Root Directory. A push to `main`
deploys all three. Full detail, including how to add a fourth app: [`DEPLOYMENT.md`](DEPLOYMENT.md).

Do not add a `vercel.json` at the repo root — it will be ignored. Vercel reads it from each
project's Root Directory.

---

## 7. Open questions for the build team

These were left deliberately undecided at prototype stage:

1. **Session model** — JWT with refresh, or server sessions? The in-memory guard was chosen
   to avoid pre-empting this.
2. **Media storage and delivery** — where do uploads live, and what signs the URLs for
   paid/locked content?
3. **Payout rails** — which processor, and does the $10,000 co-sign gate live in our
   service or in the processor's approval flow?
4. **KYC provider** — the console models submission, review and rejection states, but no
   provider is chosen.
5. **Real-time** — live streams and messaging are mocked. WebSocket, SSE, or a third-party
   provider?

Answer 1 and 3 before writing code. The other three can follow.
