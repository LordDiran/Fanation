# Engineering handover

What is real, what is mocked, where the backend attaches, and what has to be decided before backend work starts.

Read `docs/BUILD-SPEC.md` first if you have not — it covers the stack, structure and hosting. This document is the part that matters once you are writing code against it.

---

## 1. The short version

Everything you can see works. Nothing you can see is connected to anything.

The three applications run entirely on seed data held in a zustand store. Every interaction — liking, subscribing, publishing, suspending a user, approving a payout — mutates that store and re-renders. It is a working product with a memory that lasts until you refresh.

That is deliberate, and it is the reason the handover is cheap: every action that will eventually hit an API is already isolated as **one function in one store file**. Wiring the backend means replacing function bodies, not restructuring components.

Two store files, both about 100–300 lines:

| File | Lines | Owns |
|---|---|---|
| `client/src/lib/core/app-store.ts` | 309 | Fan and creator state — feed, wallet, subscriptions, posts, messages |
| `admin/src/lib/core/admin-store.ts` | 111 | Console state — users, KYC, payouts, reports, audit log |

`types.ts` (144 lines) and `data.ts` (334 lines) are **byte-identical between the two projects** and hold the shared type definitions and the seed data respectively. Change one, change the other.

---

## 2. Backend seams

One store action, one endpoint. The action is the seam and is stable; **the paths below are proposals, not commitments** — name them however your API convention wants, the client only cares that one action maps to one call.

### 2.1 `client` — fan and creator

| Store action | Proposed endpoint | Notes |
|---|---|---|
| `setAuthed` | `POST /auth/login`, `POST /auth/logout` | Currently sets a boolean. See §5, open question 1 |
| `buyCoins` | `POST /wallet/purchases` | Payment provider goes behind this |
| `spend` | `POST /wallet/debits` | Internal — called by `unlockPost`, `tipUsd`, `unlockDm`. May not need its own endpoint if those three debit server-side |
| `tipUsd` | `POST /creators/:handle/tips` | |
| `requestPayout` | `POST /payouts` | See governance rule 2 |
| `toggleLike` | `POST` / `DELETE /posts/:id/like` | |
| `setReact` | `PUT /posts/:id/reaction` | Single reaction per user per post |
| `toggleSave` | `POST` / `DELETE /posts/:id/save` | |
| `vote` | `POST /posts/:id/poll/vote` | |
| `unlockPost` | `POST /posts/:id/unlock` | Debits coins and grants access. Must be atomic server-side |
| `subscribe` | `POST /subscriptions` | |
| `unsub` | `DELETE /subscriptions/:handle` | |
| `toggleFollow` | `POST` / `DELETE /creators/:handle/follow` | Follow is free; subscribe is paid. Separate concepts |
| `hide` | `POST /feed/hidden` | |
| `mute` | `POST /users/:handle/mute` | |
| `block` | `POST /users/:handle/block` | |
| `report` | `POST /reports` | Feeds the console's moderation queue |
| `addComment` | `POST /posts/:id/comments` | |
| `addPost` | `POST /posts` | Creator publish. Media upload is a separate concern — open question 2 |
| `delPost` | `DELETE /posts/:id` | |
| `markNotifsRead` | `POST /notifications/read` | |
| `sendDm` | `POST /threads/:key/messages` | |
| `unlockDm` | `POST /threads/:key/unlock` | Paid message unlock — debits coins |
| `feed` | `GET /feed` | Currently a selector over local data; becomes a fetch |

No endpoint, client-side only: `setTheme` (a user preference — persist it wherever preferences live), `toast`, `openModal`, `closeModal`, `payoutError`.

### 2.2 `admin` — console

| Store action | Proposed endpoint | Notes |
|---|---|---|
| `setAuthed` | `POST /admin/auth/login` | Admin auth must be separate from user auth |
| `log` | *server-side* | See §2.3 |
| `setUserSt`, `setUserStByHandle` | `PATCH /admin/users/:id` | Suspend, restore, flag. Reason-gated |
| `warn` | `POST /admin/users/:id/strikes` | Three upheld strikes → Under review. Governance rule 3 |
| `kycSet` | `PATCH /admin/kyc/:id` | Approve or reject a verification |
| `paySet` | `PATCH /admin/payouts/:id` | Approve, co-sign, reject. Governance rules 2 and 5 |
| `repSet` | `PATCH /admin/reports/:id` | Uphold or dismiss. Reason-gated on dismiss |
| `flagTx` | `POST /admin/transactions/:id/flag` | |
| `refundTx` | `POST /admin/transactions/:id/refund` | Moves money — needs the same care as a payout |
| `toggleFeature` | `PATCH /admin/creators/:handle` | Featured on `/explore` |
| `toggleFreeze` | `PATCH /admin/creators/:handle` | Frozen account — blocks payouts |

No endpoint: `setTheme`, `toast`, `ask`, `closeConfirm`.

### 2.3 The audit log is not a client concern

Right now `log()` appends an entry to a local array, because there is nowhere else to put it. **In production the client must not author audit records.** Every mutating admin endpoint writes its own audit entry server-side, from the authenticated identity on the request — not from a field the client sent. A client that can write the audit log can also write a flattering one.

`GET /admin/audit` then reads it back, and `log()` disappears from the store entirely.

---

## 3. Governance rules the server must enforce

All five are implemented in the console's interface today. **The interface is not the enforcement point.** A disabled button is a courtesy to the operator, not a control — anyone with the network tab can send the request anyway. Every rule below has to exist again on the server.

1. **Destructive actions are reason-gated.** Suspend, dismiss and reject each require a reason code. The server rejects the request without one, and stores the reason on the audit entry.
2. **Payouts of $10,000 or more require two distinct admins.** The first approval records intent and moves the payout to *Awaiting co-sign*; it does not release funds. The co-sign must come from a different admin identity — the server checks that, not the interface.
3. **Three upheld strikes moves an account to *Under review* automatically.** Counted server-side, applied on the third `POST /admin/users/:id/strikes` that is upheld.
4. **The audit log is append-only.** No edit, no delete, no administrative exception. If it is stored in a table anyone can `UPDATE`, it is not an audit log.
5. **A payout against a sanctioned account warns before it proceeds and records the override** — the amount, the account, the admin, the timestamp, and the fact that the warning was shown and dismissed.

Rule 2 is the one to build first. It is the only one where a bug moves money.

---

## 4. Prototype boundaries

Four, all deliberate. Anyone demonstrating this needs to know all four before someone in the room notices.

1. **Sign-in is mocked.** Any credentials are accepted; the button sets `authed: true`. There is no authentication, no session, no password check.
2. **A hard refresh signs you out.** `authed` lives in memory with no persistence middleware, so a full page load clears it and the route guard returns you to `/login`. This is correct for a prototype with no real session, and `tools/smoke.mjs` asserts it deliberately rather than working around it. It is also the first thing that changes once open question 1 is answered.
3. **No payment rails.** Coin balances, subscription prices, payout amounts, revenue figures — all seed data. Nothing moves money, nothing calls a provider.
4. **All data is fabricated.** Users, creators, posts, comments, reports, KYC submissions, transactions. Written to be realistic enough to demonstrate, derived from nothing real.

### 4.1 One interface limit

**`admin` has no navigation below 900px.** The console is desktop-only by design — an internal tool used at a desk. Building a phone layout for a nine-column payout approval table would have cost real time for no demonstrable benefit. If mobile console access becomes a requirement, that is a scoped piece of work, not a bug fix.

`client` and `landing` are fully responsive from 390px up and verified at 390, 768 and 1440.

---

## 5. Open questions

Answer 1 and 3 before writing backend code. The other three can wait but not indefinitely.

1. **Session model — JWT with refresh, or server sessions?**
   Decides how the client holds auth state, whether the in-memory approach is replaced or extended, and what happens on refresh. Everything in the client's auth path is a placeholder until this is settled.

2. **Media storage — where do uploads live, and are paid-tier assets served through signed URLs with expiry?**
   Affects the media components directly. If paid content is served from a public URL, the paywall is decorative — anyone who gets the URL keeps it forever. Signed URLs with a short expiry are the usual answer and they change how the components request images.

3. **Payout rails — which provider, and does the $10,000 co-sign gate live in our service or theirs?**
   If the provider enforces it, our job is to reflect their state. If we enforce it, we own the two-admin check and the audit trail around it. These are different builds.

4. **KYC provider — which vendor, and is the review queue ours or theirs?**
   Determines whether `/kyc` stays a working approval queue or becomes a read-only status view over the vendor's decisions.

5. **Real-time transport — WebSocket, SSE, or polling?**
   For messages, live streams and notifications. Nothing depends on this yet; everything real-time is currently static. Worth deciding before the messaging work starts rather than during it.

---

## 6. Working in this codebase

### 6.1 Adding a route

`client` and `admin` both keep one file per page in `src/routes/` and one route table in `src/App.tsx`.

1. Create `src/routes/thing.tsx` exporting a default component.
2. Import it in `src/App.tsx` and add a `<Route path="/thing" element={<ThingPage />} />` inside the shell.
3. If it needs navigation, add it to the nav array in `src/routes/_shell.tsx`.
4. Add it to `ROUTES` in `tools/verify-responsive.mjs` so it is covered at all three widths.

Step 4 is the one people skip. A route that is not in that array is a route nobody is checking.

### 6.2 The design layer discipline

`client/src/lib/{core,ui,brand}` and `admin/src/lib/{core,ui,brand}` are copies, not a shared package — see the README for why. The rule:

```bash
diff client/src/lib/ui/styles.css admin/src/lib/ui/styles.css && echo IDENTICAL
```

It must print `IDENTICAL` and nothing before it, and the same applies to `types.ts` and `data.ts`. (`md5sum` is Linux-only — it does not exist on macOS. `diff` does, on both.) Change one, change the other, in the same commit. If this starts to hurt in practice, publish `@fanation/ui` to a private registry and depend on a version — but do that when the pain is real, not pre-emptively.

### 6.3 CSS notes worth having

Three things cost real time on this codebase and will cost it again:

- **An inline `style={{ width }}` or `style={{ gridTemplateColumns }}` beats every media query**, no matter how specific the query. Three responsive bugs here were exactly this and none of them are visible in the stylesheet. `tools/diag-overflow.mjs` prints computed values for this reason.
- **A flex item defaults to `min-width: auto`** and will refuse to shrink below its own content. The original 368px overflow on every fan route at 390px wide was a search field doing this.
- **`align-items: flex-start` in a column flex container shrink-wraps children to their content width.** Usually not what you wanted.

### 6.4 Verification before you push

```bash
cd client && npm run build && npm run preview     # terminal one
cd admin  && npm run build && npm run preview     # terminal two
node tools/verify-responsive.mjs                  # terminal three
node tools/smoke.mjs
```

Needs Playwright: `npm i -D playwright && npx playwright install chromium`.

| Script | Bar | Current |
|---|---|---|
| `verify-responsive.mjs` | 25 routes × 3 viewports: no overflow, navigation present, no console errors, no failed requests | **PASS** |
| `smoke.mjs` | 27 behavioural assertions across both applications | **27 / 0** |

The two do not overlap and both matter. One asks whether every page fits and can be navigated; the other asks whether the product still works — that a suspend refuses to submit without a reason, that a $12,400 payout needs two approvals, that the audit log captured what just happened. Layout regressions and logic regressions do not look alike.

Two things to know about `verify-responsive.mjs`:

- It reports broken images by asking each `<img>` whether it **decoded**, not by watching for 404s. `vite preview` answers any unknown path with `index.html` and a 200, so a missing photograph arrives as a page of HTML rather than a failed request. On a machine with the media present, the broken count must read **zero**.
- A `<video poster>` that fails leaves no trace in `document.images` and is not covered. Nine files, checked by eye.

`smoke.mjs` navigates client-side throughout — clicking the nav, never `goto` — because a hard reload logs you out (boundary 2). One assertion proves that deliberately, then signs in again.

---

## 7. Security

**The repository is public.** No credential, key, token or connection string in it — not in code, not in a comment, not in `.env.example`, not in a commit message. Secrets live in the hosting platform's environment variables.

Anything prefixed `VITE_` is **inlined into the client bundle at build time** and is public by definition. Use it only for values that are genuinely public: an API base URL, a publishable key. A secret with a `VITE_` prefix is a published secret.

If a key is committed by accident: tell Timmy so it can be rotated. Do not force-push over it — the commit is already in clones, in build caches and possibly in a fork. Rotation closes the hole; rewriting history only removes the evidence that it was open.

**And the standing one:** the admin console is currently reachable by anyone with the URL. It is behind `noindex` headers, which are not access control. It must be closed before the first real API call is wired in — see `docs/DEPLOYMENT.md` §4 for the three options.
