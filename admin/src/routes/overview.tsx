import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/lib/core";
import { Icon, StatCard } from "@/lib/ui";

export default function OverviewPage() {
  const A = useAdminStore();
  const navigate = useNavigate();
  const openReps = A.reps.filter((r) => r.st === "Open").length;
  const pendPay = A.pay.filter((p) => p.st === "Pending" || p.st === "Awaiting co-sign").length;
  const pendKyc = A.kyc.filter((k) => k.st === "Pending" || k.st === "Info requested").length;
  const attention: Array<[string, string, string, string]> = [
    ["var(--coral)", `${openReps} open moderation reports`, "Review the queue before SLA breach", "/moderation"],
    ["var(--amber)", `${pendPay} payouts awaiting action`, "Includes 1 above the $10k co-sign threshold", "/payouts"],
    ["var(--amber)", `${pendKyc} KYC applications pending`, "1 flagged for document quality", "/kyc"],
  ];
  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 20, gap: 12 }}>
        <div className="col gap4">
          <h2 className="display t32">Overview</h2>
          <span className="muted">Platform health at a glance.</span>
        </div>
        <span className="chip-mint"><span className="dot" style={{ background: "var(--mint)" }} />Systems normal</span>
      </div>
      <div className="grid g4 gap16" style={{ marginBottom: 18 }}>
        <StatCard label="Total users" value="52,140" sub="+1,284 this week" icon="users" color="var(--blue-ink)" />
        <StatCard label="Active creators" value="12,006" sub="+96 this week" icon="star" color="var(--amber-ink)" />
        <StatCard label="Revenue (mo)" value="$212K" sub="platform take" icon="dollar" color="var(--mint-ink)" />
        <StatCard label="Coins in economy" value="8.4M" sub="≈ $84K liability" icon="coin" color="var(--coral-ink)" />
      </div>
      <div className="grid g2 gap16">
        <div className="card" style={{ padding: 18 }}>
          <div className="row gap8" style={{ marginBottom: 14 }}><Icon n="flag" s={18} c="var(--amber-ink)" /><span className="b7">Needs attention</span></div>
          {attention.map((a, i) => (
            <div key={i} className="row gap10" style={{ padding: "10px 0", cursor: "pointer" }} onClick={() => navigate(a[3])}>
              <span className="dot" style={{ background: a[0], marginTop: 7 }} />
              <div className="grow"><div className="t14 b6">{a[1]}</div><div className="muted2 t12">{a[2]}</div></div>
              <Icon n="arrow" s={15} c="var(--muted2)" />
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <span className="b7">Recent admin actions</span>
            <span className="blue t13 b6" style={{ cursor: "pointer" }} onClick={() => navigate("/audit")}>Full audit log</span>
          </div>
          {A.audit.slice(0, 4).map((a, i) => (
            <div key={i} className="row between" style={{ padding: "10px 0" }}>
              <div className="row gap10"><span className="t14 b6">{a.act}</span><span className="tag">{a.cat}</span></div>
              <span className="muted2 t12">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
