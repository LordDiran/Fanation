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

**1 and 3 are closed — reassigned 29 July 2026.** Not because they have an answer here, but because ownership moved: the dev team decides both inside the backend build rather than ahead of it. They stay written down so the choice gets made deliberately instead of by default, and so whoever makes it can see what the prototype already assumes. 2, 4 and 5 are still open and still need answers before the work they touch starts.

1. **Session model — JWT with refresh, or server sessions?** — **Closed 29 July 2026, dev team's call.**
   Decides how the client holds auth state, whether the in-memory approach is replaced or extended, and what happens on refresh. Everything in the client's auth path is a placeholder until this is settled.

   What the prototype commits to either way: `authed` lives in the Zustand store with no persist middleware, so a hard reload clears it and the route guard returns you to `/login` (§4, boundary 2). Server sessions add a cookie and a `/me` call on boot. JWT with refresh adds a token held out of `localStorage` and a refresh on 401. The guard itself and every screen behind it are untouched by the choice — this is a seam, not a rewrite.

2. **Media storage — where do uploads live, and are paid-tier assets served through signed URLs with expiry?**
   Affects the media components directly. If paid content is served from a public URL, the paywall is decorative — anyone who gets the URL keeps it forever. Signed URLs with a short expiry are the usual answer and they change how the components request images.

3. **Payout rails — which provider, and does the $10,000 co-sign gate live in our service or theirs?** — **Closed 29 July 2026, dev team's call.**
   If the provider enforces it, our job is to reflect their state. If we enforce it, we own the two-admin check and the audit trail around it. These are different builds.

   What the prototype commits to either way: the threshold is $10,000, a request above it needs two distinct approvals, the first moves the row to `Awaiting co-sign`, and both approvals land in the audit log as separate entries. That behaviour is in `admin/src/routes/payouts.tsx` and asserted by `tools/smoke.mjs`. If the provider owns the gate, that screen becomes a mirror of their state rather than the source of it — the states themselves do not change.

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

It must print `IDENTICAL` and nothing before it. The same applies to `types.ts` and `data.ts` — but note those two live in `lib/core`, not `lib/ui`:

```bash
diff client/src/lib/core/types.ts admin/src/lib/core/types.ts && echo IDENTICAL
diff client/src/lib/core/data.ts  admin/src/lib/core/data.ts  && echo IDENTICAL
```

(`md5sum` is Linux-only — it does not exist on macOS. `diff` does, on both.)

`lib/ui` and `lib/brand` are identical trees end to end: `diff -r` across either pair prints nothing, and nothing is the standard. **`lib/core` is the deliberate exception.** The client ships `app-store.ts`, the admin ships `admin-store.ts`, and each `index.ts` re-exports its own — so a recursive diff on `lib/core` reports exactly three differences on a healthy tree:

```
Only in admin/src/lib/core: admin-store.ts
Only in client/src/lib/core: app-store.ts
Files client/src/lib/core/index.ts and admin/src/lib/core/index.ts differ
```

Those three are correct by design. Anything beyond them is drift.

Change one, change the other, in the same commit. If this starts to hurt in practice, publish `@fanation/ui` to a private registry and depend on a version — but do that when the pain is real, not pre-emptively.

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
node tools/verify-media.mjs
```

Needs Playwright: `npm i -D playwright && npx playwright install chromium`.

| Script | Bar | Current |
|---|---|---|
| `verify-responsive.mjs` | 25 routes × 3 viewports: no overflow, navigation present, no console errors, no failed requests | **PASS** |
| `smoke.mjs` | 27 behavioural assertions across both applications | **27 / 0** |
| `verify-media.mjs` | All 181 paths in `lib/brand/media.ts` resolve against the builds; admin imagery and every `<video poster>` decode | **PASS** |

The three do not overlap and all three matter. The first asks whether every page fits and can be navigated. The second asks whether the product still works — that a suspend refuses to submit without a reason, that a $12,400 payout needs two approvals, that the audit log captured what just happened. The third asks whether the pictures are actually there — in the admin console, behind the video posters, and across the whole manifest rather than only the assets a visited route happened to paint. Layout regressions, logic regressions and missing media do not look alike and are not caught by the same check.

Two things to know about `verify-responsive.mjs`:

- It reports broken images by asking each `<img>` whether it **decoded**, not by watching for 404s. `vite preview` answers any unknown path with `index.html` and a 200, so a missing photograph arrives as a page of HTML rather than a failed request. The broken count must read **zero** — the media is committed and git-tracked, so that holds on any machine including a fresh clone.
- It walks the client only, and a `<video poster>` leaves no trace in `document.images`. Both gaps are `verify-media.mjs`'s job: it resolves all 181 paths in `lib/brand/media.ts` against both builds, walks the admin console's nine image-bearing routes, and decodes every poster through a fresh `Image()`. Run it alongside the other two, not instead of them.

`smoke.mjs` navigates client-side throughout — clicking the nav, never `goto` — because a hard reload logs you out (boundary 2). One assertion proves that deliberately, then signs in again.

### 6.5 The full gate

The three scripts above are the minimum. There is a longer gate that covers theme, contrast, motion, layout stability and payload, and it is what runs before a release rather than before a commit. Every tool takes its arguments in a fixed order and several of them disagree with each other about that order, so the list below is the reference — `lightaudit` takes the origin first, `onart` and `borderaudit` take the kind first.

```bash
for a in client admin landing; do ( cd $a && npx tsc --noEmit && npx vite build ); done

node tools/darkdiff.mjs      http://localhost:4300 http://localhost:4200 client
node tools/lightaudit.mjs    http://localhost:4200 client
node tools/onart.mjs         client http://localhost:4200
node tools/borderaudit.mjs   client http://localhost:4200 --theme=dark,light
node tools/verify-theme.mjs
node tools/verify-media.mjs
node tools/verify-responsive.mjs
node tools/smoke.mjs
node tools/motioncheck.mjs   http://localhost:4202
node tools/hero-probe.mjs    http://localhost:4202 light
node tools/clsprobe.mjs      http://localhost:4200 /login /signup
node tools/variants.mjs --check
node tools/perfaudit.mjs     landing
```

Preview servers run on 4200 (client), 4201 (admin), 4202 (landing). `perfaudit.mjs` defaults to 3000–3002, which are dead — export `BASE_CLIENT`, `BASE_ADMIN` and `BASE_LANDING` or it will report nothing at all. `darkdiff` needs a second set of servers on 4300–4302 built from the commit you are comparing against.

Results at the head of this branch:

| Check | Result |
|---|---|
| `tsc --noEmit` and `vite build`, all three apps | RC 0, zero warnings |
| `darkdiff` client / admin | 7832 and 2129 elements, **0 differing** |
| `darkdiff` landing | 737 elements, **4 differing** — the four authorised carousel `backgroundImage` URLs moving from `.jpg` to `.webp` |
| `lightaudit` client / admin / landing | 1.4.3 and 1.4.11 both **0 failing** on all three |
| `onart` client / admin / landing | **0 of 366**, **0 of 204**, **0 of 116** below bar |
| `borderaudit` client / admin / landing | **0 of 284**, **0 of 70**, **0 of 20** gated edges failing |
| `verify-theme` | 166 passed, 0 failed |
| `verify-media` | 181 manifest paths, 42 admin images, 3 posters — 0 unresolved |
| `verify-responsive` (client) | PASS, 0 images failed to decode |
| `smoke` | 27 passed, 0 failed |
| `motioncheck` | PASS, 13 checks |
| `hero-probe` light | PASS, 0 of 10 below bar — H1 at 9.46:1, ghost CTA at 10.09:1 |
| `clsprobe` `/login`, `/signup`, landing `/` | CLS 0.0000 on all three |
| `variants --check` | 490 rungs present, 0 missing |
| `perfaudit` cold — client / admin / landing | 260.5 KB / 167.9 KB / 354.8 KB, CLS 0 |

### 6.6 What the gate does not cover

Four gaps, stated as gaps rather than buried as passes.

**Focus and selection states are unmeasured.** Every `borderaudit` report has zero `focus` rows because the prober reads the resting DOM and never clicks or tabs. That matters most on `/studio/vault`, where a selected tile carries `outline: 2px solid var(--blue-ink)` and nothing has ever checked that outline against the tile behind it in either theme. Someone has to either teach the prober to tab through and re-measure, or check it by hand.

**`verify-responsive.mjs` is client-only by construction, not by accident.** Its route table is 25 client paths and it signs in at `/login` and waits for `/feed`. Pointed at 4201 or 4202 it times out — that is the tool refusing a job it was never built for, not a regression in admin or landing. Admin and landing responsive layout is therefore unverified by any automated check.

**Landing ships as one JavaScript chunk** and `perfaudit` flags it every run. For a single page with no routes that is the correct shape, and splitting it would add a request to save nothing. The line in the report is noise, but it is permanent noise, so read past it rather than fixing it.

**Accent edges are design debt.** 167 of 202 labelled accent edges on the client, 200 of 200 on admin and 26 of 30 on landing score below 3:1 against their backgrounds. None of these are 1.4.11 failures — in every case the label text carries the meaning and the edge only decorates it, which is why the gated count is zero. But a colour-blind user gets less from those edges than the design intends, and the number is large enough to be worth a deliberate decision rather than a silent one.

**One more thing to look at with your eyes.** The contrast tools score text against whatever is behind it, so flooding white over a photograph until the text passes will produce a clean report and an invisible photograph. That is exactly what happened to the light-mode landing hero and the client auth mosaic, and three separate audits called it a pass. Automated scores are a floor. Take a 1440×900 screenshot in both themes and look at it before you believe the table above.

---

## 7. Security

**The repository is public.** No credential, key, token or connection string in it — not in code, not in a comment, not in `.env.example`, not in a commit message. Secrets live in the hosting platform's environment variables.

Anything prefixed `VITE_` is **inlined into the client bundle at build time** and is public by definition. Use it only for values that are genuinely public: an API base URL, a publishable key. A secret with a `VITE_` prefix is a published secret.

If a key is committed by accident: tell Timmy so it can be rotated. Do not force-push over it — the commit is already in clones, in build caches and possibly in a fork. Rotation closes the hole; rewriting history only removes the evidence that it was open.

**And the standing one:** the admin console is currently reachable by anyone with the URL. It is behind `noindex` headers, which are not access control. It must be closed before the first real API call is wired in — see `docs/DEPLOYMENT.md` §4 for the three options.
