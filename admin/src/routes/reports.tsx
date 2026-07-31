import { useAdminStore } from "@/lib/core";
import { Avatar, Icon, StatCard } from "@/lib/ui";

const REV_SRC: Array<[string, number, string]> = [
  ["Subscriptions", 58, "var(--mint)"],
  ["Pay-per-view", 22, "var(--blueL)"],
  ["Gifts & tips", 14, "var(--amber)"],
  ["Paid messages", 6, "var(--coral)"],
];
const MONTHS: Array<[string, number]> = [
  ["Feb", 44], ["Mar", 52], ["Apr", 61], ["May", 58], ["Jun", 74], ["Jul", 88],
];
const TOP: Array<[string, string, string, string]> = [
  ["Elena Rusk", "elenalive", "12.4K subs", "$31.2K"],
  ["Sofia Amara", "sofiaa", "9.8K subs", "$28.9K"],
  ["Marcus T.", "marcusbeats", "8.1K subs", "$21.4K"],
  ["Nadia K.", "nadiak", "5.3K subs", "$12.1K"],
  ["Dembe O.", "dembefit", "4.4K subs", "$9.8K"],
];

export default function ReportsPage() {
  const A = useAdminStore();
  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">Reports</h2>
        <div className="row gap8">
          <button className="btn btn-ghost btn-sm" onClick={() => { A.toast("Weekly summary scheduled — Mondays 08:00 to admin@fanation.app", "ok"); A.log("Scheduled weekly report email", "Finance"); }}>
            <Icon n="cal" s={14} />Schedule weekly email
          </button>
          <button className="btn btn-blue btn-sm" onClick={() => { A.toast("Exported platform report — fanation_jul.csv", "ok"); A.log("Exported platform report (Jul)", "Finance"); }}>
            <Icon n="chart" s={14} />Export CSV
          </button>
        </div>
      </div>

      <div className="grid g4 gap16" style={{ marginBottom: 18 }}>
        <StatCard label="MRR" value="$128.4K" sub="+9.1% month on month" icon="dollar" color="var(--mint-ink)" />
        <StatCard label="Paying fans" value="24.8K" sub="+1,120 this month" icon="users" />
        <StatCard label="ARPPU" value="$18.60" sub="avg revenue / paying fan" icon="coin" color="var(--amber-ink)" />
        <StatCard label="Churn" value="3.2%" sub="-0.4pt vs June" icon="chart" color="var(--blueL-ink)" />
      </div>

      <div className="grid gmain-13 gap16" style={{ marginBottom: 18 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="b7" style={{ marginBottom: 16 }}>Gross volume · last 6 months</div>
          <div className="row gap10" style={{ alignItems: "flex-end", height: 150 }}>
            {MONTHS.map(([m, v]) => (
              <div key={m} className="col center gap6 grow">
                <div className="t12 muted">${v}K</div>
                <div style={{ width: "100%", height: v * 1.4, borderRadius: "8px 8px 4px 4px", background: m === "Jul" ? "linear-gradient(180deg,var(--mint),rgba(93,221,144,.25))" : "var(--fill2)" }} />
                <div className={"t12 " + (m === "Jul" ? "b7" : "muted")}>{m}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="b7" style={{ marginBottom: 16 }}>Revenue by source</div>
          <div className="col gap12">
            {REV_SRC.map(([label, pct, color]) => (
              <div key={label} className="col gap6">
                <div className="row between t13"><span className="b6">{label}</span><span className="muted">{pct}%</span></div>
                <div style={{ height: 8, borderRadius: 6, background: "var(--fill)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="muted2 t12" style={{ marginTop: 14 }}>Platform fee is 20% across all sources.</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row between" style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="b7">Top creators · 30 days</span>
          <span className="muted t12">by gross revenue</span>
        </div>
        {TOP.map(([n, h, subs, rev], i) => (
          <div key={h} className="row gap12" style={{ padding: "12px 18px", borderBottom: i < TOP.length - 1 ? "1px solid var(--line)" : "none" }}>
            <span className="muted b7 t14" style={{ width: 22 }}>{i + 1}</span>
            <Avatar name={n} size={34} />
            <div className="col grow"><span className="b6 t14">{n}</span><span className="muted t12">@{h}</span></div>
            <span className="muted t13">{subs}</span>
            <span className="b7 t14 mint" style={{ width: 70, textAlign: "right" }}>{rev}</span>
          </div>
        ))}
      </div>

      <div className="grid g3 gap16" style={{ marginTop: 18 }}>
        {([
          ["Moderation load", `${A.reps.filter((r) => r.st === "Open").length} open / ${A.reps.length} total`, "flag"],
          ["KYC throughput", `${A.kyc.filter((k) => k.st === "Approved").length} approved this session`, "shield"],
          ["Payouts released", `${A.pay.filter((p) => p.st === "Paid").length} of ${A.pay.length} requests`, "wallet"],
        ] as Array<[string, string, string]>).map(([label, val, ic]) => (
          <div key={label} className="card row gap12" style={{ padding: 16 }}>
            <div className="feature-ic" style={{ width: 38, height: 38, background: "var(--fill)" }}><Icon n={ic} s={16} c="var(--muted)" /></div>
            <div className="col"><span className="muted t12">{label}</span><span className="b7 t15">{val}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
