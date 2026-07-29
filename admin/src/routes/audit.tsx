import { useState } from "react";
import { useAdminStore } from "@/lib/core";
import { Icon } from "@/lib/ui";

const CATS = ["All", "Users", "Creators", "Moderation", "Finance", "KYC"];

export default function AuditPage() {
  const A = useAdminStore();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const rows = A.audit.filter(
    (a) => (cat === "All" || a.cat === cat) &&
      (!q || `${a.act} ${a.why} ${a.who}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">Audit log</h2>
        <div className="row gap10">
          <div className="search" style={{ maxWidth: 260 }}>
            <Icon n="search" s={16} />
            <input placeholder="Search actions, reasons, admins…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && <button className="muted" onClick={() => setQ("")}><Icon n="x" s={14} /></button>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { A.toast(`Exported ${rows.length} entries — audit_export.csv`, "ok"); A.log(`Exported audit log (${rows.length} entries)`, "Users"); }}>
            <Icon n="chart" s={14} />Export
          </button>
        </div>
      </div>

      <div className="card row gap12" style={{ padding: "12px 16px", marginBottom: 16 }}>
        <Icon n="lock" s={17} c="var(--blueL)" />
        <div className="t13 muted">
          Append-only and immutable. Every admin action is written here with actor, reason, and timestamp — entries cannot be edited or deleted, including by super admins.
        </div>
      </div>

      <div className="row gap8 wrap" style={{ marginBottom: 14 }}>
        {CATS.map((t) => (
          <span key={t} className={"tag" + (cat === t ? " on" : "")} style={{ cursor: "pointer" }} onClick={() => setCat(t)}>
            {t}{t !== "All" && ` · ${A.audit.filter((a) => a.cat === t).length}`}
          </span>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {rows.length === 0 && (
          <div className="col center gap6" style={{ padding: 40 }}>
            <div className="b7">No entries match</div>
            <div className="muted t13">Try a different category or search term.</div>
          </div>
        )}
        {rows.map((a, i) => (
          <div key={i} className="row gap14" style={{
            padding: "13px 18px",
            borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none",
            borderLeft: a.time === "Just now" ? "3px solid var(--mint)" : "3px solid transparent",
          }}>
            <div className="col" style={{ width: 84 }}>
              <span className={"t12 " + (a.time === "Just now" ? "mint b7" : "muted")}>{a.time}</span>
            </div>
            <div className="col gap2 grow">
              <span className="b6 t14">{a.act}</span>
              <span className="muted t12">{a.who} · {a.why}</span>
            </div>
            <span className="tag" style={{ alignSelf: "center", fontSize: 11 }}>{a.cat}</span>
          </div>
        ))}
      </div>
      <div className="muted2 t12" style={{ marginTop: 12 }}>
        {rows.length} entr{rows.length === 1 ? "y" : "ies"} · retained 7 years for compliance · BACKEND SEAM: GET /admin/audit?cat=&q=
      </div>
    </div>
  );
}
