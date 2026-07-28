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
| `fanation-admin` | `apps/admin` | `fanation-admin.vercel.app` |

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

## 4. Ignored Build Step

Every push currently rebuilds all three apps. Build CPU is metered on Pro, so a one-line
landing-page tweak paying for three builds is waste.

**Settings → Git → Ignored Build Step → Custom:**

| Project | Command |
|---|---|
| `fanation` | `npx turbo-ignore landing` |
| `fanation-app` | `npx turbo-ignore web` |
| `fanation-admin` | `npx turbo-ignore admin` |

`turbo-ignore` compares the current commit against the last successful deploy and exits
non-zero when nothing in that app's dependency graph changed. Because the apps depend on
`packages/core` and `packages/ui`, a change to either still correctly rebuilds `web` and
`admin` — it is dependency-aware, not path-matching.

---

## 5. Deployment Protection on `fanation-admin`

Sign-in in the prototype is mocked. Any input signs you in. That is acceptable behind
Vercel Authentication and unacceptable on an open URL, because the admin console is where
payouts, KYC decisions and bans live.

**Settings → Deployment Protection → Vercel Authentication → Standard Protection → on for
Production → Save.**

Two things to watch:

- The toggle does not persist until you click **Save**. If Save reads greyed out, the
  setting has not changed from what is stored — reload the page and check the toggle's
  actual state before assuming it is on.
- Verify from outside. Open `fanation-admin.vercel.app` in a private window. A Vercel
  log-in wall means it is on. The admin console loading means it is not.

`noindex, nofollow` is set in the app's metadata. That is a search-engine instruction, not
access control.

---

## 6. Custom domains — optional

The `.vercel.app` URLs are production-grade and fine to hand to the devs. For real
subdomains, add each in **Project → Settings → Domains** and point DNS at Vercel:

```
app     CNAME  cname.vercel-dns.com     ->  fanation-app
admin   CNAME  cname.vercel-dns.com     ->  fanation-admin
```

Leave the apex alone — that is the landing page.

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

---

## 8. Housekeeping

`fanation-deploy-check` (`prj_fCfVG8u6C0vwW0P0JbJsYqR4jGrT`) is scratch from diagnostics. No
repo attached, serves nothing. **Settings → bottom of the page → Delete Project.**

The five ERROR deployments on `fanation-admin` predate the Git connection and are from
upload-based attempts. None is a rollback candidate, no alias ever pointed at one. Ignore
them or leave them; they cost nothing.
