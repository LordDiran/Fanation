# Deployment

Three static sites, three deployments, no server runtime anywhere.

Each project builds to a folder of HTML, JavaScript and CSS. Nothing needs Node at request time, nothing needs environment variables at build time, and no project depends on another project's build. That means the hosting choice is open — Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, Azure Static Web Apps or Nginx serving a folder all work without changing application code.

Current hosting is Vercel. Everything below is written for Vercel first, with the equivalent for other hosts in §3.3.

---

## 1. The three projects

| Vercel project | Root directory | Build | Output | Production URL |
|---|---|---|---|---|
| `fanation` | `landing` | `npm run build` | `dist` | `fanation-creator.vercel.app` |
| `fanation-app` | `client` | `npm run build` | `dist` | `fanation-app.vercel.app` |
| `fanation-admin` | `admin` | `npm run build` | `dist` | `fanation-admin.vercel.app` |

`fanation-black.vercel.app` is an additional alias on the `fanation` project.

All three point at the same GitHub repository, `github.com/LordDiran/Fanation`, and differ only in **Root Directory**. Framework preset is **Vite** for all three; Vercel then infers the build command and output directory, and the committed `vercel.json` in each folder pins framework, install command, build command and output directory explicitly anyway. Root Directory is the one setting `vercel.json` cannot express — see §1.3.

### 1.1 Setting a project up from scratch

1. New Project → import `LordDiran/Fanation`.
2. **Root Directory** → `landing`, `client` or `admin`. This is the only setting that differs between the three.
3. Framework Preset → Vite. Build command `npm run build`, output directory `dist`, install command `npm install`.
4. Node version → 20 or later.
5. **Settings → Build and Deployment → Root Directory** → optionally turn *Include files outside the root directory in the Build Step* **off**, then Save. Both toggles sit in that one card and share one Save button. Neither is load-bearing: the committed `ignoreCommand` overrides both, proven in production on 29 July 2026. Turning this one off is hygiene — a smaller upload and one less leftover from the pnpm-workspace layout. Leave *Skip deployments* alone. See §1.2.
6. No environment variables. There are none yet; when the backend arrives the API base URL goes here, per environment, not in the repository.
7. Deploy.

One inherited record to correct on all three. Project Settings still reads **Framework Preset: Next.js** and **Node.js Version: 24.x** on `fanation`, `fanation-app` and `fanation-admin` — left over from the Next.js monorepo these projects were first imported as. Builds are unaffected, because each `vercel.json` pins `"framework": "vite"` and `vercel.json` overrides Project Settings (§1.3). The cost is a developer reading the dashboard and being told the wrong stack. Set the preset to **Vite** on all three. Node 24.x can stay — it only has to be 20 or later.

### 1.2 Stop the other two rebuilding

One repository feeding three projects means every push rebuilds all three unless something stops it, and nothing that works here is on by default.

Each `vercel.json` now carries:

```json
"ignoreCommand": "git diff --quiet HEAD^ HEAD -- ./"
```

Vercel runs it from the project's Root Directory. Exit 0 — nothing in this folder changed — cancels the build. Exit 1 — something changed — lets it proceed. A commit touching only `landing/` then rebuilds `fanation` alone.

It sits in `vercel.json` rather than in the dashboard on purpose. `ignoreCommand` is one of the six keys `vercel.json` overrides (§1.3), so the rule travels with the repository and cannot silently differ between the three projects. The dashboard equivalent is **Settings → Build and Deployment → Ignored Build Step** — *Build and Deployment*, not Settings → Git, where it used to live. Leave that field on **Automatic**; the committed command takes precedence over it.

All three live under **Settings → Build and Deployment**, not Settings → Git. The two Root Directory toggles share a single Save button. Dashboard state as checked on 29 July 2026, before this commit:

| Setting | Where | Found | Required |
|---|---|---|---|
| Ignored Build Step | Build and Deployment → Ignored Build Step | `Automatic` on all three — no custom command had ever been set | `Automatic`, with `ignoreCommand` committed |
| Include files outside the root directory in the Build Step | Build and Deployment → Root Directory | Enabled on all three | Optional. Hygiene only — no effect on skipping |
| Skip deployments when the root directory has no changes | Build and Deployment → Root Directory | Enabled on `fanation-app` and `fanation-admin`, **Disabled** on `fanation` | No action. `ignoreCommand` overrides it either way |

An earlier revision of this section described the ignore step as configured. It never was, on any of the three — which is why every push since the repository was restructured rebuilt all three projects, and why no deployment before `3504a98` is marked `CANCELED`.

*Include files outside the root directory* is a leftover from the pnpm-workspace layout these projects no longer use. With it enabled the whole repository sits inside every project's build context, which makes every upload larger than it needs to be and would defeat Vercel's *native* path-based skip. The three folders are self-contained today — each with its own `package-lock.json`, no import crossing a folder boundary, `@` aliased to `./src` and nothing else — so turning it off is safe. It is hygiene, not a fix. The committed `ignoreCommand` runs regardless of either Root Directory toggle.

Proved in production on 29 July 2026. Commit `3504a98` touched `docs/` only, and all three projects canceled within the same second:

| Project | Deployment | Result |
|---|---|---|
| `fanation` | `dpl_AASyjuoz6uFn6ULFeb7mKxzLAY59` | `CANCELED` |
| `fanation-app` | `dpl_Dohkqnomx9EhETNaw8eKMWnMTADD` | `CANCELED` |
| `fanation-admin` | `dpl_3rH8tstTTwddhRHbEEZthfhiRq4A` | `CANCELED` |

Commit `e3832ec` directly beneath it touched all three folders and went `READY` on all three, so the rule discriminates rather than refusing everything. The decisive detail: `fanation` canceled with *Skip deployments* still **Disabled** and *Include files outside the root directory* still **Enabled**. Nothing in the dashboard could have produced that cancellation. Only the committed `ignoreCommand` could — which is what establishes that neither toggle is load-bearing.

Two things to watch. The ignore command compares against the previous commit only, so a squashed merge or a force-push can make a folder look unchanged when it is not; if a deployment goes missing after an unusual git operation, redeploy that project by hand rather than debugging the ignore step. And the commit that introduces `ignoreCommand` still rebuilds all three — it touches all three folders, and a `vercel.json` change has to build once before it applies. The saving starts on the push after it.

Netlify expresses the same rule as `ignore` under `[build]`, committed alongside, same convention — exit 0 cancels. It compares `$CACHED_COMMIT_REF` against `$COMMIT_REF`, the last commit Netlify actually built rather than the previous commit in history, so the squash and force-push caveat above does not apply there.

### 1.3 Root Directory is dashboard-only

`vercel.json` overrides Project Settings for `framework`, `buildCommand`, `outputDirectory`, `installCommand`, `devCommand` and `ignoreCommand`. **Root Directory has no `vercel.json` equivalent.** It exists only in the dashboard, and nothing in the repository can correct it.

That asymmetry has one practical consequence: renaming or moving a project folder in git breaks the deployment until someone changes the setting by hand, in three places. The failure is immediate and happens *before* the build — Vercel clones, looks for the configured directory, does not find it, and stops. There is no build log to read, because no build ran.

Two things make this survivable. A failed deployment never replaces the live one, so the previous deployment keeps serving while the setting is wrong. And the fix is Settings → Build & Deployment → Root Directory, then redeploy **with the build cache unchecked** — a cached install from the old path will otherwise be restored on top of the new one.

If the three folders are ever renamed again, treat the three dashboard updates as part of that commit's checklist, not as follow-up work.

### 1.4 Build machine, and what a push costs

Three projects and one push is three billed builds. The machine they run on is a team-wide default that has nothing to do with this repository, and it was set to the largest one available.

Rates, from Team Settings → Build and Deployment:

| Machine | Spec | Rate |
|---|---|---|
| Elastic | dynamic vCPU and memory | from $0.0035 per CPU minute |
| **Standard — team default since 29 July 2026** | 4 vCPU, 8 GB | **$0.014 per build minute** |
| Enhanced | 8 vCPU, 16 GB | $0.028 per build minute |
| Turbo | 30 vCPU, 60 GB | $0.105 per build minute |

Turbo was the team default until 29 July 2026, so all three projects were building on 30 vCPUs at 7.5× the Standard rate. It is **Standard** now. The workload could never use Turbo. `npm run build` is `tsc --noEmit && vite build`: `tsc` is single-threaded, and a rollup build at this module count gains nothing measurable past four cores. A production build of `client` measured 10 seconds of billed machine time end to end — deployment `dpl_G4RQWWy6sTfwJWZuoFjpdpCPdtki`, 11:15:38 to 11:15:48.

At ten seconds a build, that is:

| Configuration | Builds per push | Billed minutes | Cost per push |
|---|---|---|---|
| Turbo, no ignore step — as found, 29 July 2026 | 3 | 0.50 | $0.0525 |
| Standard, no ignore step | 3 | 0.50 | $0.0070 |
| **Standard, ignore step working, one folder touched — current** | 1 | 0.17 | **$0.0023** |

Roughly 22× between the first row and the last, for identical output. Both levers are pulled. The machine was set to Standard on 29 July 2026 at **Team Settings → Build and Deployment → Build Machines → All projects**, which applies to every project on the team including any added later; per-project overrides exist and are not needed, because three Vite builds of this size have no case for anything above Standard. A docs-only push now costs effectively nothing — the ignore step cancels before `npm install` runs.

---

## 2. Committed configuration

Each project carries its own `vercel.json` **and** its own `netlify.toml`. A host reads only the file that belongs to it, so shipping both costs nothing and means these projects deploy on either platform with no dashboard configuration and no edit. The two files express the same five things: the build command, the output directory, the build-ignore rule (§1.2), the SPA rewrite, and caching headers.

Everything below describes `vercel.json`; `netlify.toml` is the same rules in TOML.

### 2.1 `client/vercel.json` and `admin/vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

This is the one rule the hosting must get right — see §3.

`admin/vercel.json` additionally sets three headers on every response:

| Header | Value | Why |
|---|---|---|
| `X-Robots-Tag` | `noindex, nofollow` | Keeps the console out of search results |
| `X-Frame-Options` | `DENY` | No embedding the console in an iframe |
| `Referrer-Policy` | `no-referrer` | Console URLs do not leak to third parties |

**None of these is access control.** See §4.

### 2.2 Caching, all three

```json
"/assets/(.*)"  → Cache-Control: public, max-age=31536000, immutable
"/index.html"   → Cache-Control: no-cache
```

Vite content-hashes every filename in `assets/`, so a one-year immutable cache is safe — a changed file gets a new name. `index.html` is the only file whose name is stable, so it must not be cached, or a deployment is invisible until the browser gives up on its copy.

---

## 3. The SPA rewrite — the rule that matters

`client` and `admin` route in the browser. A user who opens `app.fanation.app/wallet` directly, or presses refresh while on it, sends a request for `/wallet` to the host. There is no file at that path.

**The host must answer with `index.html` and a 200.** React Router then reads the URL and renders the right page. Without this rule, every URL except the root 404s on direct load and on refresh — the application works perfectly while you click around and breaks the moment anyone shares a link.

`landing` does not need this. One page, no router.

### 3.1 Verifying it

After any hosting change, load a deep route directly rather than clicking to it:

```
https://app.fanation.app/studio/analytics     ← must render, not 404
https://admin.fanation.app/audit              ← must render, not 404
```

Then refresh on each. Both must survive.

### 3.2 The failure mode to expect in local preview

`vite preview` answers *any* unknown path with `index.html` and a 200 — including a missing image. **So does production**, on `client` and `admin`, and for the same reason: the rewrite in §2.1 is a catch-all, so it swallows a request for a missing asset exactly as it swallows a request for a route. Verified live — `GET /assets/does-not-exist.png` on `fanation-app.vercel.app` returns `200 text/html`, not a 404. So a broken image URL comes back as a page of HTML with a 200 status rather than a 404, and any check that watches status codes will report a clean run over a site with no pictures in it. `tools/verify-responsive.mjs` was rewritten to ask each `<img>` whether it decoded for exactly this reason. Do not trust status codes for asset checks — not against a preview server and not against production. Two checks are honest: `HTMLImageElement.decode()`, or a `fetch` whose response `content-type` is asserted to start with `image/`.

One more trap in the same family, in the other direction: an `<img>` below the fold with `loading="lazy"` reports `naturalWidth === 0` until it scrolls into view. Counting broken images on a long page without scrolling it first reports failures that do not exist. Scroll to the bottom, scroll back, *then* count.

### 3.3 Equivalents on other hosts

| Host | Configuration |
|---|---|
| Vercel | `vercel.json` → `rewrites` — **committed** |
| Netlify | `netlify.toml` → `[[redirects]]` — **committed** |
| Cloudflare Pages | Automatic for SPA projects; otherwise `_redirects` in `public/`: `/*  /index.html  200` |
| Nginx | `location / { try_files $uri $uri/ /index.html; }` |
| Azure Static Web Apps | `staticwebapp.config.json` → `navigationFallback.rewrite: "/index.html"` |
| S3 + CloudFront | Error document `index.html`; custom error responses mapping 403 and 404 → `/index.html` with response code 200 |
| Apache | `.htaccess` → `FallbackResource /index.html` |

---

## 4. Admin access control — open, and it must be closed

The console is currently reachable by anyone with the URL.

The `noindex` header keeps it out of Google. It does nothing against a shared link, a browser history, or a guess. For a prototype holding fabricated data that is a tolerable position. **It stops being tolerable the moment the first real API call is wired in**, and that is the deadline.

Why it is open today: Vercel's Standard Protection covers preview deployments but exempts the production domain by design. Extending protection to production requires the *All Deployments* setting, which sits behind an add-on at roughly **$150/month**.

Three ways to close it, cheapest first:

1. **Remove the `fanation-admin.vercel.app` production domain.** The project keeps deploying; admins use the git-branch URL, which Standard Protection already covers. Free. Costs a slightly uglier URL.
2. **IP allowlist or VPN** in front of the console. Free to cheap depending on what already exists. Costs flexibility for anyone working from an unexpected network.
3. **Buy All Deployments.** ~$150/month. Costs money and nothing else.

Option 1 is the right first move. Whichever is chosen, it is a decision for infrastructure and it needs making before real user data sits behind that URL.

---

## 5. Secrets

**The repository is public.**

No credential, API key, token, connection string or private URL goes into it. Not in a source file, not in a comment, not in a `.env.example`, not in a commit message. When the backend arrives, every secret lives in **Vercel → Settings → Environment Variables**, scoped per environment, and reaches the build as an environment variable.

Note that anything prefixed `VITE_` is inlined into the client bundle at build time and is therefore public by definition. Use that prefix only for values that are genuinely public — an API base URL, a publishable key. A secret with a `VITE_` prefix is a secret you have published.

**If a key is committed by accident:** tell Timmy so it can be rotated. Do not force-push over it. The commit already exists in every clone, in the platform's build cache and quite possibly in a fork; rotating the key is what actually closes the hole, and rewriting history only removes the evidence that it was open.

---

## 6. Rollback

Vercel keeps every deployment. To roll back: project → Deployments → find the last known-good one → **Promote to Production**. Instant, no rebuild, no git operation.

Because the three projects deploy independently, rolling one back does not touch the other two. If a change spanned two projects, roll both back.

---

## 7. Pre-deployment checklist

Run through this before promoting anything to a real domain.

- [ ] `npm run build` clean in all three projects — the build typechecks first, so this covers types too
- [ ] `md5sum client/src/lib/ui/styles.css admin/src/lib/ui/styles.css` — hashes match
- [ ] `node tools/verify-responsive.mjs` — PASS, and **zero** broken images (a non-zero count means media is missing from the build)
- [ ] `node tools/smoke.mjs` — 27 passed, 0 failed
- [ ] Deep routes load directly on the deployed URL, not just by clicking (§3.1)
- [ ] If any project folder was renamed or moved in this change, all three **Root Directory** settings re-checked in the dashboard (§1.3)
- [ ] Open Graph tags in each `index.html` point at the real production domain — **currently hard-coded to `fanation.app` and `app.fanation.app`**, and `og:image` must be an absolute URL
- [ ] Framework Preset reads **Vite**, not Next.js, on all three projects (§1.1)
- [ ] `admin` access control decided and applied (§4) if any real API is connected
- [ ] No secret anywhere in the diff (§5)
