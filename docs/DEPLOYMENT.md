# Deployment

Three Vercel projects, one repo, one branch. Vercel scope `timmydiran1-6323s-projects`
(Pro). Repo `LordDiran/Fanation`, branch `main`.

This is the record of how it is wired and how to change it. It is not a to-do list — all
three projects are already built and live.

---

## 1. How the three projects differ

They differ by **Root Directory** and nothing else.

| Project | Root Directory | Production URL |
|---|---|---|
| `fanation` | `apps/landing` | `fanation-creator.vercel.app`, `fanation-black.vercel.app` |
| `fanation-app` | `apps/web` | `fanation-app.vercel.app` |
| `fanation-admin` | `apps/admin` | `fanation-admin-git-main-timmydiran1-6323s-projects.vercel.app` — see §5 |

Framework preset Next.js on all three. Install command, build command and output directory
stay on default — Vercel detects pnpm workspaces and Turborepo without help. There are no
environment variables on any project.

One push to `main` triggers all three builds. Each build runs `pnpm install` at the
workspace root, then builds only its own app.

---

## 2. Where `vercel.json` lives

`apps/landing/vercel.json`, not the repo root.

Vercel reads `vercel.json` relative to the **Root Directory**, not the repository root. A
`vercel.json` at the top of this repo would be ignored by all three projects. The landing
page's cache headers are the only ones in play, and they sit in `apps/landing/`.

---

## 3. Adding a fourth app

1. Create the app under `apps/`. `pnpm-workspace.yaml` already globs `apps/*` — no edit
   needed.
2. Commit and push. The folder has to exist on the remote first; Vercel's Root Directory
   picker only offers paths it can see on GitHub.
3. Vercel → **Add New → Project → Import `LordDiran/Fanation`**.
4. Root Directory → **Edit** → point at `apps/<name>`.
5. Vercel warns the repo is already connected to another project. Accept it. That is the
   whole pattern.
6. Leave build, install and output settings on default. No environment variables.

**Push before you create the project, not after.** Doing it the other way round leaves the
Root Directory unselectable and the Application Preset falling back to "Other".

---

## 4. Build settings — stopping the three-way rebuild

A push to `main` touches one repo, and without this every push would rebuild all three
apps. Build CPU is metered on Pro, so a one-line landing-page tweak paying for three
builds is waste.

Everything needed sits under **Settings → Build and Deployment → Root Directory**. Confirm
both toggles below read Enabled on each of the three projects.

| Setting | Required state | Why |
|---|---|---|
| Include files outside the root directory in the Build Step | **Enabled** | Mandatory. Each app builds from its own root but still needs `pnpm-workspace.yaml`, `pnpm-lock.yaml` and `packages/`. Disable it and every build fails on install. |
| Skip deployments when there are no changes to the root directory or its dependencies | **Enabled** | Vercel skips the build when nothing in that app's dependency graph moved. |

It is dependency-aware, not path-matching. A change in `packages/core` still rebuilds
`web` and `admin`, because both depend on it. A change confined to `apps/landing` rebuilds
only `fanation`.

**What it does not skip: anything at the repo root.** Commit `8de1bd9` touched only
`README.md` and `docs/` — no app directory, no package — and all three projects built
anyway. That is consistent, not a bug: with *Include files outside the root directory*
enabled, the repo root is part of every project's build context, so a root-level change
counts as a change for all three. `turbo.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
and the root `package.json` behave the same way, and for those it is the correct answer.

The saving is real but narrower than it sounds: it applies to work done inside one app's
own folder, which is most day-to-day work. Documentation commits will rebuild everything.
If that becomes annoying, batch doc changes rather than trying to defeat the toggle.

**Ignored Build Step stays on *Automatic*.** Do not put `npx turbo-ignore` in that field.
Vercel deprecated it in favour of the Skip Deployments toggle above and the dashboard
throws a banner if you try: *"`turbo-ignore` is deprecated. Use the built-in Skip
Deployments feature instead."* If a custom command is sitting there from an earlier
attempt, set **Behavior → Automatic**, clear the field, and save.

One trap worth naming: the argument to `turbo-ignore` was the workspace name, so
`npx turbo-ignore landing` on the **admin** project would have told Vercel to watch the
wrong app entirely. The native toggle takes no argument — it reads the project's own Root
Directory. That is one fewer thing to get wrong.

Node.js version is **24.x** on all three. Leave it.

---

## 5. Deployment Protection on `fanation-admin`

Sign-in in the prototype is mocked. Any input signs you in. That is acceptable behind
Vercel Authentication and unacceptable on an open URL, because the admin console is where
payouts, KYC decisions and bans live.

**Settings → Deployment Protection → Vercel Authentication → Standard Protection.** This
is already on and stored.

### What Standard Protection actually covers

Vercel exposes three modes. The API field is `ssoProtection.deploymentType`:

| Dashboard label | API value | Covers | Cost |
|---|---|---|---|
| Standard Protection | `prod_deployment_urls_and_all_previews` | Every deployment URL and every branch URL. **Exempts the project's production domain by design.** | included |
| All Deployments | `all` | Everything, production domain included | $150/month add-on |
| Only Preview Deployments | `preview` | Previews only | included |

Standard Protection is the mode in use, and its own dropdown text says what it does:
*"Protect all except production Custom Domains for your project."* That exemption is not
a misconfiguration and it is not something a Save button fixes — `fanation-admin.vercel.app`
is the production domain, so it is deliberately left open.

Verified against the live projects with unauthenticated requests:

| URL | Result |
|---|---|
| `fanation-admin.vercel.app` | **200 — serves the console** |
| `fanation-admin-timmydiran1-6323s-projects.vercel.app` | 302 → `vercel.com/login` |
| `fanation-admin-git-main-timmydiran1-6323s-projects.vercel.app` | 302 → `vercel.com/login` |
| per-deployment URLs (`fanation-admin-<hash>-…`) | 302 → `vercel.com/login` |
| `fanation-app-git-main-…vercel.app` | 302 → `vercel.com/login` |

One hole, and it is the pretty alias.

### The fix, without paying $150/month

**Settings → Domains → `fanation-admin.vercel.app` → Remove.** Then hand people the
branch URL:

```
fanation-admin-git-main-timmydiran1-6323s-projects.vercel.app
```

It tracks the latest `main` build, so it never goes stale, and it sits behind the log-in
wall. Grant access per person under **Project → Settings → Project Members**.

### Two things that will mislead you

- **A greyed-out Save button means nothing is pending.** It does not mean the change
  failed to save. If you toggle a setting and Save stays grey, the value on screen already
  matches what is stored.
- **`mcp__Vercel__web_fetch_vercel_url` and a browser you are already logged into both
  bypass protection.** The only honest test is a private window, logged out — or curl.

`noindex, nofollow` is set in the app's metadata. That is a search-engine instruction, not
access control.

### If a custom domain is added later

A custom domain on `fanation-admin` inherits the same exemption — Standard Protection
protects everything *except* production custom domains. Adding `admin.fanation.com` would
re-open exactly the hole removing the `.vercel.app` alias just closed. Either stay on the
branch URL, or budget for All Deployments.

---

## 6. Custom domains — optional

Nothing on any of the three projects uses a custom domain today. Everything is
`.vercel.app`, including the landing page at `fanation-creator.vercel.app`. Those URLs are
production-grade and fine to hand to the devs — this section is only relevant once a
domain is actually bought.

When it is: add each subdomain in **Project → Settings → Domains**, then create the
records at the registrar (Namecheap, Cloudflare — wherever the apex lives):

| Host | Type | Value | Project |
|---|---|---|---|
| `app` | CNAME | `cname.vercel-dns.com` | `fanation-app` |
| `admin` | CNAME | `cname.vercel-dns.com` | `fanation-admin` |

Vercel shows the exact value to use on the Domains page and issues the certificate itself
once the record resolves — usually minutes, occasionally an hour if the registrar's TTL is
long. Leave the apex alone; that is the landing page.

**Do not put a custom domain on `fanation-admin` without reading §5 first.** Standard
Protection exempts production custom domains, so `admin.fanation.com` would be publicly
readable the moment DNS resolves.

---

## 7. Troubleshooting

**A build fails and the site goes down.** It does not. Vercel never promotes a failed build;
the previous deployment keeps serving. Fix and redeploy at your own pace.

**`fanation` builds but the landing page looks wrong.** Root Directory is not
`apps/landing` — no leading slash, no trailing slash — so `apps/landing/vercel.json` never
loaded and the cache headers are missing. Fix the setting, then **Deployments → the failed
one → Redeploy**.

**A build fails on `pnpm install`.** Do not override the install command; the default is
correct. Read the log — a lockfile mismatch means `pnpm-lock.yaml` was not committed
alongside a `package.json` change.

**`git push` is rejected as non-fast-forward.** Someone else pushed. `git pull --rebase`,
resolve, push again. Do not force push over a deployed tip.

**Saving a project setting did not deploy anything.** Correct — settings changes never
trigger a build. Push, or **Deployments → ⋯ → Redeploy**.

**Save is greyed out and the setting looks wrong.** Greyed means nothing is pending, not
that the save failed. What is on screen is what is stored.

**A deploy was skipped and shows no build log.** Expected — that is the Skip Deployments
toggle in §4 doing its job. Nothing in that app's dependency graph changed. Force one
anyway with **Deployments → ⋯ → Redeploy** if you need it.

**The dashboard warns that `turbo-ignore` is deprecated.** Something is sitting in Ignored
Build Step. Set **Behavior → Automatic** and clear the field. §4 has the replacement.

---

## 8. Housekeeping

`fanation-deploy-check` (`prj_fCfVG8u6C0vwW0P0JbJsYqR4jGrT`) is scratch from diagnostics. No
repo attached, serves nothing. **Settings → bottom of the page → Delete Project.**

The five ERROR deployments on `fanation-admin` predate the Git connection and are from
upload-based attempts. None is a rollback candidate, no alias ever pointed at one. Ignore
them or leave them; they cost nothing.
