import { CREATORS, POLICY, stChipStyle, useAdminStore } from "@/lib/core";
import { Avatar, Menu, Verified } from "@/lib/ui";

export default function CreatorsPage() {
  const A = useAdminStore();
  const creators = A.users.filter((u) => u.role === "Creator");
  const meta = (h: string) => CREATORS.find((c) => c.handle === h) ?? { tag: "Creator", avg: "$2.1K", v: true };
  return (
    <div className="content">
      <h2 className="display t32" style={{ marginBottom: 18 }}>Creators</h2>
      <div className="grid g3 gap16">
        {creators.map((u) => {
          const c = meta(u.h);
          const reps = A.reps.filter((r) => r.target === u.h && r.st === "Open").length;
          return (
            <div key={u.id} className="card" style={{ padding: 16, borderColor: u.st !== "Active" ? "rgba(243,106,70,.35)" : A.featured[u.h] ? "rgba(252,164,75,.4)" : "var(--line)" }}>
              <div className="row between">
                <div className="row gap12">
                  <Avatar name={u.n} size={44} />
                  <div className="col">
                    <div className="row gap6 b7 t14">{u.n} {c.v && <Verified s={13} />}</div>
                    <div className="muted t12">{c.tag}</div>
                  </div>
                </div>
                <Menu items={[
                  { ic: "star", t: A.featured[u.h] ? "Unfeature" : "Feature on Explore", fn: () => { const was = A.featured[u.h]; A.toggleFeature(u.h); A.log(`${was ? "Unfeatured" : "Featured"} @${u.h}`, "Creators"); A.toast(was ? `@${u.h} removed from featured` : `@${u.h} now featured on Explore`, "ok"); } },
                  { ic: "wallet", t: A.frozen[u.h] ? "Unfreeze payouts" : "Freeze payouts…", danger: !A.frozen[u.h], fn: () => {
                    if (A.frozen[u.h]) { A.toggleFreeze(u.h); A.log(`Unfroze payouts for @${u.h}`, "Creators"); A.toast(`Payouts unfrozen for @${u.h}`, "ok"); return; }
                    A.ask({ title: `Freeze payouts for @${u.h}`, desc: "All pending and future payouts are held until unfrozen. The creator keeps earning; nothing leaves the platform.", verb: "Freeze payouts", tone: "danger", reasons: ["Payment fraud investigation", "Chargeback spike", "KYC mismatch", "Court / regulatory order", "Other"], requireReason: true, onGo: (why) => { A.toggleFreeze(u.h); A.log(`Froze payouts for @${u.h}`, "Creators", why); A.toast(`Payouts frozen for @${u.h}`, "err"); } });
                  } },
                  { ic: "verified", t: "Revoke verification…", danger: true, fn: () => A.ask({ title: `Revoke verification for @${u.h}`, desc: "Removes the verified badge everywhere. The creator must re-apply through KYC.", verb: "Revoke badge", tone: "danger", reasons: ["Identity mismatch", "Fraudulent application", "Policy violation", "Other"], requireReason: true, onGo: (why) => { A.log(`Revoked verification for @${u.h}`, "Creators", why); A.toast(`Verification revoked for @${u.h}`, "err"); } }) },
                  "-",
                  u.st === "Active"
                    ? { ic: "lock", t: "Suspend creator…", danger: true, fn: () => A.ask({ title: `Suspend @${u.h}`, desc: "Page goes dark for fans; subscriptions pause and don't bill during suspension.", verb: "Suspend", tone: "danger", reasons: POLICY, requireReason: true, durations: ["24 hours", "7 days", "30 days", "Indefinite"], onGo: (why, dur) => { A.setUserSt(u.id, "Suspended"); A.log(`Suspended creator @${u.h} · ${dur}`, "Creators", why); A.toast(`@${u.h} suspended · ${dur}`, "err"); } }) }
                    : { ic: "check", t: "Reinstate", fn: () => { A.setUserSt(u.id, "Active"); A.log(`Reinstated creator @${u.h}`, "Creators"); A.toast(`@${u.h} reinstated`, "ok"); } },
                ]} />
              </div>
              <div className="row gap6 wrap" style={{ marginTop: 10 }}>
                <span className="tag" style={stChipStyle(u.st)}>{u.st}</span>
                {A.featured[u.h] && <span className="chip-coin" style={{ padding: "3px 9px" }}>★ Featured</span>}
                {A.frozen[u.h] && <span className="tag" style={{ color: "var(--coral-ink)", borderColor: "rgba(243,106,70,.35)" }}>Payouts frozen</span>}
              </div>
              <div className="grid g3 gap10" style={{ marginTop: 12 }}>
                <div><div className="muted t12">Subs</div><div className="b7 t14">8.4K</div></div>
                <div><div className="muted t12">Earnings</div><div className="b7 t14 mint">{c.avg}/mo</div></div>
                <div><div className="muted t12">Open reports</div><div className={"b7 t14" + (reps > 0 ? " coral" : "")}>{reps}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
