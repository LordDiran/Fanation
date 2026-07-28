/* Fanation platform smoke test — drives production builds of web (:3000) and admin (:3001).
   All post-login navigation is CLIENT-SIDE (clicking nav links) because auth state is
   in-memory by design — a hard reload resets the store and bounces to /login. */
const { chromium } = require("playwright");

let passed = 0, failed = 0;
const ok = (name, cond) => {
  if (cond) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ FAIL " + name); }
};

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => errors.push("web: " + e.message));

  console.log("— WEB (fan/creator) —");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  ok("unauthenticated / redirects to /login", page.url().includes("/login"));

  await page.click("text=Sign in");
  await page.waitForURL("**/feed", { timeout: 8000 });
  ok("mock sign-in lands on /feed", page.url().includes("/feed"));
  ok("feed renders creator posts", (await page.locator("text=@sofiaa").count()) > 0);

  // hard reload → store resets → guard bounces back to login (by design)
  await page.goto("http://localhost:3000/wallet", { waitUntil: "networkidle" });
  ok("hard reload logs out (guard works)", page.url().includes("/login"));
  await page.click("text=Sign in");
  await page.waitForURL("**/feed");

  // client-side nav: explore
  await page.click(".side >> text=Explore");
  await page.waitForURL("**/explore");
  ok("explore renders creator cards", (await page.locator("text=Subscribe").count()) > 1);

  // wallet via sidebar
  await page.click(".side >> text=Wallet");
  await page.waitForURL("**/wallet");
  ok("wallet shows coin balance", (await page.locator("text=12,400").count()) > 0);

  // studio via topbar pill
  await page.click(".topbar >> text=Studio");
  await page.waitForURL("**/studio");
  ok("studio pill switches surface", page.url().endsWith("/studio"));
  ok("studio dashboard renders", (await page.locator("text=/Go live|Earnings|Dashboard/i").count()) > 0);

  // content studio publish flow
  await page.click(".side >> text=Content");
  await page.waitForURL("**/studio/content");
  await page.fill("textarea", "Smoke test post");
  await page.click("button:has-text('Publish')");
  await page.waitForTimeout(300);
  ok("publish adds to Your content", (await page.locator("text=Just now").count()) > 0);

  // back to fan surface, like a post
  await page.click(".topbar >> text=Browse");
  await page.waitForURL("**/feed");
  const firstHeart = page.locator(".card button.row.gap6").first();
  const t0 = await firstHeart.textContent();
  await firstHeart.click();
  await page.waitForTimeout(200);
  const t1 = await firstHeart.textContent();
  ok(`like toggles count (${t0.trim()} → ${t1.trim()})`, t0 !== t1);

  console.log("— ADMIN —");
  const admin = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  admin.on("pageerror", (e) => errors.push("admin: " + e.message));

  await admin.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  ok("admin unauthed redirects to /login", admin.url().includes("/login"));
  await admin.click("button:has-text('Sign in')");
  await admin.waitForURL("**/overview", { timeout: 8000 });
  ok("admin sign-in lands on /overview", admin.url().includes("/overview"));
  ok("overview needs-attention renders", (await admin.locator("text=/open reports|payout|KYC/i").count()) > 0);

  // Users: suspend flow with reason gate
  await admin.click(".side >> text=Users");
  await admin.waitForURL("**/users");
  ok("users table renders", (await admin.locator("text=@baduser").count()) > 0);
  const jayRow = admin.locator(".card > div", { hasText: "@jay_88" }).first();
  await jayRow.locator("button").last().click();
  await admin.waitForTimeout(250);
  await admin.locator(".menu >> text=Suspend…").click();
  await admin.waitForTimeout(250);
  const goBtn = admin.locator(".modal button", { hasText: "Suspend account" });
  ok("suspend confirm is reason-gated", await goBtn.isDisabled());
  await admin.locator(".modal label", { hasText: "Harassment" }).first().click();
  ok("picking a reason enables confirm", !(await goBtn.isDisabled()));
  await admin.locator(".modal .tag", { hasText: "7 days" }).click();
  await goBtn.click();
  await admin.waitForTimeout(400);
  ok("suspend toast fires", (await admin.locator("text=/@jay_88 suspended/i").count()) > 0);

  // Payouts: co-sign flow on $12,400 + sanctioned warning
  await admin.click(".side >> text=Payouts");
  await admin.waitForURL("**/payouts");
  ok("payout queue renders $12,400 request", (await admin.locator("text=$12,400").count()) > 0);
  ok("sanctioned-account warning shows", (await admin.locator("text=/Account sanctioned/i").count()) > 0);
  const bigRow = admin.locator(".card", { hasText: "$12,400" }).first();
  await bigRow.locator("button", { hasText: "Approve (1 of 2)" }).click();
  await admin.waitForTimeout(250);
  await admin.locator(".modal button", { hasText: "Record first approval" }).click();
  await admin.waitForTimeout(400);
  ok("first approval → Awaiting co-sign", (await admin.locator("text=Awaiting co-sign").count()) > 0);
  await admin.locator(".card", { hasText: "$12,400" }).first().locator("button", { hasText: "Co-sign & release" }).click();
  await admin.waitForTimeout(250);
  await admin.locator(".modal button", { hasText: "Co-sign & release" }).click();
  await admin.waitForTimeout(400);
  ok("co-sign → Paid in session list", (await admin.locator("text=Actioned this session").count()) > 0);

  // KYC approve
  await admin.click(".side >> text=KYC review");
  await admin.waitForURL("**/kyc");
  await admin.locator(".card", { hasText: "@dembefit" }).locator("button", { hasText: "Approve" }).click();
  await admin.waitForTimeout(250);
  await admin.locator(".modal button", { hasText: "Approve verification" }).click();
  await admin.waitForTimeout(400);
  ok("KYC approve → processed list", (await admin.locator("text=Processed this session").count()) > 0);

  // Moderation dismiss with reason
  await admin.click(".side >> text=Moderation");
  await admin.waitForURL("**/moderation");
  await admin.locator("button", { hasText: "Review" }).first().click();
  await admin.waitForTimeout(200);
  await admin.locator("button", { hasText: "Dismiss…" }).click();
  await admin.waitForTimeout(200);
  const dg = admin.locator(".modal button", { hasText: "Dismiss report" });
  ok("dismiss is reason-gated", await dg.isDisabled());
  await admin.locator(".modal label", { hasText: "Duplicate report" }).click();
  await dg.click();
  await admin.waitForTimeout(400);
  ok("report lands in resolved list", (await admin.locator("text=Resolved this session").count()) > 0);

  // Audit log captured everything
  await admin.click(".side >> text=Audit log");
  await admin.waitForURL("**/audit");
  const justNow = await admin.locator("text=Just now").count();
  ok(`audit captured session actions (${justNow} new)`, justNow >= 4);
  await admin.locator(".tag", { hasText: "Finance" }).first().click();
  await admin.waitForTimeout(200);
  ok("audit category filter works", (await admin.locator("text=/payout/i").count()) > 0);

  // Sidebar badges reflect live state (KYC went 4 → 3)
  const kycNav = await admin.locator(".navi", { hasText: "KYC review" }).textContent();
  ok("sidebar KYC badge decremented to 3", kycNav.includes("3"));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (errors.length) { console.log("PAGE ERRORS:"); errors.slice(0, 10).forEach((e) => console.log("  " + e)); }
  await browser.close();
  process.exit(failed > 0 || errors.length > 0 ? 1 : 0);
})();
