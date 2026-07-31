import { useState } from "react";
import { useAdminStore } from "@/lib/core";
import { Icon, Menu, StatCard } from "@/lib/ui";

/** Presentational seed rows — flag/refund state lives in the admin store keyed by index. */
const FIN_TX = [
  { t: "Coin pack — 10,000", u: "@superfan", a: "$94.00", m: "Card · Paystack", d: "2m ago", st: "Settled" },
  { t: "Subscription — @sofiaa VIP", u: "@jay_88", a: "$25.00", m: "Card · Flutterwave", d: "18m ago", st: "Settled" },
  { t: "PPV unlock — @marcusbeats", u: "@mikew", a: "$4.90", m: "Coins", d: "44m ago", st: "Settled" },
  { t: "Coin pack — 5,000", u: "@priscilla", a: "$49.00", m: "Card · Paystack", d: "1h ago", st: "Failed" },
  { t: "Gift bundle — live stream", u: "@zaraali", a: "$18.00", m: "Coins", d: "2h ago", st: "Settled" },
  { t: "Subscription — @elenalive", u: "@noahk", a: "$15.00", m: "Card · Paystack", d: "3h ago", st: "Chargeback" },
  { t: "Coin pack — 1,000", u: "@amaraobi", a: "$9.99", m: "Apple Pay", d: "5h ago", st: "Settled" },
  { t: "Paid DM unlock — @sofiaa", u: "@superfan", a: "$2.00", m: "Coins", d: "6h ago", st: "Settled" },
];
const REFUND_REASONS = [
  "Duplicate charge",
  "Fraudulent card use confirmed",
  "Service not delivered (creator banned)",
  "Chargeback pre-emption",
  "Goodwill refund — support escalation",
];
const FILTERS = ["All", "Settled", "Failed", "Chargeback", "Flagged", "Refunded"];

export default function FinancePage() {
  const A = useAdminStore();
  const [f, setF] = useState("All");
  const eff = (i: number, st: string) => A.flags[i] ?? st; // store overrides seed status
  const rows = FIN_TX.map((r, i) => ({ ...r, i, show: eff(i, r.st) })).filter(
    (r) => f === "All" || r.show === f || (f === r.st && !A.flags[r.i]),
  );

  const chip = (s: string) =>
    s === "Settled" ? { color: "var(--mint-ink)", borderColor: "rgba(93,221,144,.3)" }
      : s === "Failed" ? { color: "var(--muted)", borderColor: "var(--line2)" }
        : s === "Refunded" ? { color: "var(--blueL-ink)", borderColor: "rgba(37,153,246,.35)" }
          : { color: "var(--coral-ink)", borderColor: "rgba(243,106,70,.3)" }; // Chargeback / Flagged

  const refund = (r: (typeof rows)[number]) => A.ask({
    title: `Refund ${r.a} — ${r.u}`,
    desc: `Returns the full amount to the payer's original method (${r.m}). Coins granted by this purchase are clawed back; the balance can go negative and blocks new spends until topped up.`,
    verb: "Issue refund", tone: "danger", reasons: REFUND_REASONS, requireReason: true,
    onGo: (why) => { A.refundTx(r.i); A.log(`Refunded ${r.a} to ${r.u} — ${r.t}`, "Finance", why); A.toast(`${r.a} refunded to ${r.u}`, "ok"); },
  });

  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">Finance</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => { A.toast("Exported transactions — finance_export.csv", "ok"); A.log("Exported transaction ledger", "Finance"); }}>
          <Icon n="chart" s={14} />Export ledger
        </button>
      </div>

      <div className="grid g4 gap16" style={{ marginBottom: 18 }}>
        <StatCard label="Gross volume · today" value="$48.2K" sub="+12% vs yesterday" icon="dollar" color="var(--mint-ink)" />
        <StatCard label="Platform fee (20%)" value="$9.64K" sub="today" icon="chart" />
        <StatCard label="Failed payments" value="3.1%" sub="Paystack retry queue: 14" icon="x" color="var(--amber-ink)" />
        <StatCard label="Open chargebacks" value="4" sub="$212 exposure" icon="flag" color="var(--coral-ink)" />
      </div>

      <div className="card row gap12" style={{ padding: "12px 16px", marginBottom: 16, borderColor: "rgba(252,164,75,.35)" }}>
        <Icon n="chart" s={18} c="var(--amber-ink)" />
        <div className="t13 muted grow">
          <b style={{ color: "var(--amber-ink)" }}>Payment spike:</b> coin-pack volume is 3× the 7-day average. Velocity rules tightened automatically — review flagged rows below.
        </div>
      </div>

      <div className="row gap8 wrap" style={{ marginBottom: 14 }}>
        {FILTERS.map((t) => (
          <span key={t} className={"tag" + (f === t ? " on" : "")} style={{ cursor: "pointer" }} onClick={() => setF(t)}>{t}</span>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row up muted" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ flex: 2 }}>Transaction</div><div style={{ flex: 1 }}>Payer</div><div style={{ flex: 0.8 }}>Amount</div>
          <div style={{ flex: 1.2 }}>Method</div><div style={{ flex: 0.8 }}>Time</div><div style={{ flex: 1 }}>Status</div><div style={{ width: 40 }} />
        </div>
        {rows.length === 0 && (
          <div className="col center gap6" style={{ padding: 40 }}>
            <div className="b7">No {f.toLowerCase()} transactions</div>
            <div className="muted t13">Switch the filter to see the rest of the ledger.</div>
          </div>
        )}
        {rows.map((r, idx) => (
          <div key={r.i} className="row" style={{ padding: "12px 18px", borderBottom: idx < rows.length - 1 ? "1px solid var(--line)" : "none" }}>
            <div style={{ flex: 2 }} className="b6 t14">{r.t}</div>
            <div style={{ flex: 1 }} className="muted t13">{r.u}</div>
            <div style={{ flex: 0.8 }} className="b7 t14">{r.a}</div>
            <div style={{ flex: 1.2 }} className="muted t13">{r.m}</div>
            <div style={{ flex: 0.8 }} className="muted t13">{r.d}</div>
            <div style={{ flex: 1 }} className="row gap6">
              <span className="tag" style={chip(r.show)}>{r.show}</span>
            </div>
            <div style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>
              <Menu items={[
                A.flags[r.i] !== "Refunded" && {
                  ic: "flag",
                  t: A.flags[r.i] === "Flagged" ? "Remove review flag" : "Flag for review",
                  fn: () => { A.flagTx(r.i); A.log(`${A.flags[r.i] === "Flagged" ? "Unflagged" : "Flagged"} tx — ${r.t} (${r.u})`, "Finance"); A.toast(A.flags[r.i] === "Flagged" ? "Flag removed" : "Flagged for review", "ok"); },
                },
                r.st !== "Failed" && A.flags[r.i] !== "Refunded" && { ic: "wallet", t: "Refund…", danger: true, fn: () => refund(r) },
                r.st === "Failed" && { ic: "repost", t: "Retry charge", fn: () => { A.toast(`Retry queued for ${r.u} — ${r.a}`, "ok"); A.log(`Queued payment retry — ${r.u} ${r.a}`, "Finance"); } },
                "-" as const,
                { ic: "doc", t: "Copy transaction ID", fn: () => A.toast(`tx_88${r.i}2f copied`, "ok") },
              ]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
