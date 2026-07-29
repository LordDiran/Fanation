# Fanation

Creator subscription platform. Three independent React applications in one repository.

| Folder | What it is | Runs on | Deploys to |
|---|---|---|---|
| `landing/` | Marketing site | :3002 | `fanation.app` |
| `client/` | Fan + creator app | :3000 | `app.fanation.app` |
| `admin/` | Internal console | :3001 | `admin.fanation.app` |

Each is a standalone Vite + React 19 + TypeScript project with its own `package.json` and its own build. There is no workspace, no shared build tool and no package linkage between them — clone the repo, `cd` into one folder, `npm install`, and that project works without the other two.

---

## Quick start

Node 20 or later. Nothing global to install.

```bash
git clone https://github.com/LordDiran/Fanation.git
cd Fanation/client        # or admin, or landing
npm install
npm run dev
```

Ports are fixed so all three can run at the same time: client 3000, admin 3001, landing 3002.

Scripts, identical in all three:

```bash
npm run dev          # dev server, hot reload
npm run build        # tsc --noEmit && vite build → dist/
npm run typecheck    # types only
npm run preview      # serve the built dist/ locally
```

The build typechecks first. A type error fails the build before Vite runs, so a broken type never reaches a deployment.

Sign-in is mocked — any credentials work. On `client` you land on `/feed`; on `admin`, `/overview`.

---

## Layout

```
Fanation/
├── landing/          single page, Tailwind, no router
├── client/           26 routes, react-router-dom + zustand
├── admin/            11 routes, react-router-dom + zustand
├── docs/
│   ├── BUILD-SPEC.md     what is built, for the client team and infrastructure
│   ├── DEPLOYMENT.md     hosting runbook — projects, domains, headers, secrets
│   └── HANDOFF.md        engineering handover — seams, boundaries, open questions
├── tools/
│   ├── verify-responsive.mjs   75 route/viewport layout checks
│   ├── smoke.mjs               27 behavioural assertions
│   ├── diag-overflow.mjs       names the element causing an overflow
│   ├── playwright-env.mjs      browser path resolution for the three above
│   └── brand-assets/           logo sources + icon/OG generators
└── README.md
```

### The shared design layer

`client` and `admin` need the same primitives — buttons, cards, modals, toasts, icons, colour tokens, the stylesheet. Rather than a shared package (which would couple the two builds back together), that layer is **copied into each project** at `src/lib/{core,ui,brand}` and imported as `@/lib/ui`.

The rule that makes this safe: **`client/src/lib/ui/styles.css` and `admin/src/lib/ui/styles.css` are byte-identical.** Change one, change the other in the same commit, and check:

```bash
md5sum client/src/lib/ui/styles.css admin/src/lib/ui/styles.css
```

Both hashes must match. If this starts to hurt — a third consumer appears, or the copies drift in practice — publish `@fanation/ui` to a private registry and depend on a version. Not before.

`landing` shares none of this. Its own Tailwind styling, its own components, no `src/lib`.

---

## Verification

```bash
cd client && npm run build && npm run preview     # terminal one
cd admin  && npm run build && npm run preview     # terminal two
node tools/verify-responsive.mjs                  # terminal three
node tools/smoke.mjs
```

Needs Playwright: `npm i -D playwright && npx playwright install chromium`.

**Current state: responsive PASS across 25 routes × 3 viewports; smoke 27 passed, 0 failed; all three projects build clean.**

`verify-responsive.mjs` checks that nothing overflows horizontally at 390, 768 and 1440, that navigation is present on every route that should have it, and that no console errors or failed requests occur. `smoke.mjs` checks that the product still works — that a suspend refuses to submit without a reason, that a $12,400 payout needs two approvals, that the audit log captured what just happened. Layout regressions and logic regressions do not look alike and are not caught by the same check.

`diag-overflow.mjs` is the diagnostic for when the first one fails:

```bash
node tools/diag-overflow.mjs --width 390 /feed /creator/sofia
```

---

## What this is not, yet

Four boundaries, all deliberate, all documented in `docs/HANDOFF.md`:

1. Sign-in is mocked. There is no authentication.
2. A hard refresh signs you out — auth state is in memory by design.
3. No payment rails. Every figure is seed data.
4. All data is fabricated.

And one interface limit: **`admin` has no navigation below 900px.** Desktop-only by design. `client` and `landing` are responsive from 390px up.

---

## Security

**This repository is public.** No credential, key, token or connection string goes in it — not in a commit, not in a comment, not in a `.env.example`. Secrets live in the hosting platform's environment variables.

If a key does get committed: tell Timmy so it can be rotated. Do not force-push over it. The commit is already in clones and in the platform's build cache; rotating the key is what actually closes it, and a rewritten history just hides the evidence.

---

## Documents

- **`docs/BUILD-SPEC.md`** — the full specification: stack, structure, routes, build output, hosting requirements, backend integration points. This is the document for the client team and for infrastructure.
- **`docs/DEPLOYMENT.md`** — hosting runbook: project configuration, domains, rewrite rules, caching headers, the admin access-control problem.
- **`docs/HANDOFF.md`** — engineering handover: where the backend attaches, governance rules the server has to enforce, prototype boundaries, open questions.
