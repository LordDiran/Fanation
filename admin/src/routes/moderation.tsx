import { useState } from "react";
import { POLICY, stChipStyle, useAdminStore } from "@/lib/core";
import type { ModReport } from "@/lib/core";
import { Avatar, Icon } from "@/lib/ui";

const DISMISS_REASONS = [
  "No policy violation found",
  "Reported in bad faith",
  "Duplicate report",
  "Insufficient evidence",
];
const DURATIONS = ["24 hours", "7 days", "30 days", "Indefinite"];

const sevStyle = (sev: string) =>
  sev === "High"
    ? { color: "var(--coral-ink)", borderColor: "rgba(243,106,70,.3)" }
    : sev === "Medium"
      ? { color: "var(--amber-ink)", borderColor: "rgba(252,164,75,.3)" }
      : { color: "var(--muted)", borderColor: "var(--line2)" };

export default function ModerationPage() {
  const A = useAdminStore();
  const [open, setOpen] = useState<number | null>(null);
  const queue = A.reps.filter((r) => r.st === "Open");
  const closed = A.reps.filter((r) => r.st !== "Open");
  const targetUser = (r: ModReport) => A.users.find((u) => u.h === r.target);

  const dismiss = (r: ModReport) => A.ask({
    title: `Dismiss report — ${r.t}`,
    desc: "Closes the report with no action against the content or account. Reporters are notified that the content was reviewed.",
    verb: "Dismiss report", reasons: DISMISS_REASONS, requireReason: true,
    onGo: (why) => { A.repSet(r.id, "Dismissed", "No action"); A.log(`Dismissed report #${r.id} — ${r.t}`, "Moderation", why); A.toast("Report dismissed — no action taken", "ok"); setOpen(null); },
  });
  const removeContent = (r: ModReport, alsoWarn: boolean) => A.ask({
    title: alsoWarn ? `Remove content + warn @${r.target}` : `Remove content — ${r.t}`,
    desc: alsoWarn
      ? "Takes the content out of circulation and adds a strike to the account. 3 strikes place the account under review automatically."
      : "Takes the content out of circulation everywhere (feed, profile, search). The author is notified with the policy cited and can appeal.",
    verb: alsoWarn ? "Remove + add strike" : "Remove content", tone: "danger", reasons: POLICY, requireReason: true,
    onGo: (why) => {
      const u = targetUser(r);
      A.repSet(r.id, "Resolved", alsoWarn ? "Removed + strike" : "Content removed");
      if (alsoWarn && u) A.warn(u.id);
      A.log(`Removed content on report #${r.id} — ${r.t}${alsoWarn ? ` · strike for @${r.target}` : ""}`, "Moderation", why);
      A.toast(alsoWarn ? `Content removed · strike recorded for @${r.target}` : "Content removed from circulation", "err");
      setOpen(null);
    },
  });
  const suspendTarget = (r: ModReport) => A.ask({
    title: `Suspend @${r.target} from this report`,
    desc: "Freezes the account: no posting, earning, or messaging. The report is marked resolved and both actions share one audit entry.",
    verb: "Suspend account", tone: "danger", reasons: POLICY, requireReason: true, durations: DURATIONS,
    onGo: (why, dur) => {
      A.setUserStByHandle(r.target, "Suspended");
      A.repSet(r.id, "Resolved", "User suspended");
      A.log(`Suspended @${r.target} via report #${r.id} · ${dur}`, "Moderation", why);
      A.toast(`@${r.target} suspended · ${dur}`, "err");
      setOpen(null);
    },
  });
  const escalate = (r: ModReport) => A.ask({
    title: `Escalate report #${r.id} to Trust & Safety`,
    desc: "Moves the case to the T&S specialist queue for legal or high-risk review. The content stays live unless you also remove it.",
    verb: "Escalate",
    onGo: (why) => { A.repSet(r.id, "Escalated", "With Trust & Safety"); A.log(`Escalated report #${r.id} to T&S`, "Moderation", why); A.toast("Escalated to Trust & Safety", "ok"); setOpen(null); },
  });

  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">Moderation</h2>
        <span className="tag">{queue.length} open</span>
      </div>

      {queue.length === 0 && (
        <div className="card col center gap8" style={{ padding: 46 }}>
          <Icon n="shield" s={30} c="var(--mint-ink)" />
          <div className="b7 t18">Moderation queue is clear</div>
          <div className="muted t13">New reports from users and AI flags land here in real time.</div>
        </div>
      )}

      <div className="col gap12">
        {queue.map((r) => {
          const u = targetUser(r);
          const isOpen = open === r.id;
          return (
            <div key={r.id} className="card" style={{ padding: 0, overflow: "hidden", borderColor: isOpen ? "var(--blue-ink)" : undefined }}>
              <div className="row gap14 wrap" style={{ padding: 16, cursor: "pointer" }} onClick={() => setOpen(isOpen ? null : r.id)}>
                <div className="feature-ic" style={{ width: 40, height: 40, background: "var(--fill)" }}><Icon n="flag" s={17} c={r.sev === "High" ? "var(--coral-ink)" : "var(--amber-ink)"} /></div>
                <div className="col gap2" style={{ flex: 1.6, minWidth: 170 }}>
                  <span className="b7 t15">{r.t}</span>
                  <span className="muted t13">Reported by {r.who} · {r.n} {r.n === 1 ? "report" : "reports"}</span>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}><span className="b6 t14">{r.reason}</span></div>
                <span className="tag" style={sevStyle(r.sev)}>{r.sev}</span>
                <button className="btn btn-ghost btn-sm">{isOpen ? "Close" : "Review"}</button>
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--line)" }}>
                  <div className="hair t13" style={{ padding: "12px 14px", borderRadius: 12, margin: "14px 0", lineHeight: 1.55 }}>
                    <span className="up muted2" style={{ display: "block", marginBottom: 6 }}>Reported content preview</span>
                    {r.prev}
                  </div>
                  <div className="row gap10 wrap" style={{ marginBottom: 14 }}>
                    <div className="row gap8 hair" style={{ padding: "8px 12px", borderRadius: 10 }}>
                      <Avatar name={u?.n ?? r.target} size={26} />
                      <span className="b6 t13">@{r.target}</span>
                      {u && <span className="tag" style={{ fontSize: 11, ...stChipStyle(u.st) }}>{u.st}</span>}
                      {u && u.strikes > 0 && <span className="amber t12 b6">{u.strikes} strike{u.strikes > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                  <div className="row gap8 wrap">
                    <button className="btn btn-ghost btn-sm" onClick={() => dismiss(r)}><Icon n="check" s={14} />Dismiss…</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => escalate(r)}><Icon n="arrow" s={14} />Escalate to T&S…</button>
                    <div className="grow" />
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral-ink)" }} onClick={() => removeContent(r, false)}><Icon n="x" s={14} />Remove content…</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral-ink)" }} onClick={() => removeContent(r, true)}><Icon n="flag" s={14} />Remove + warn…</button>
                    <button className="btn btn-sm" style={{ background: "var(--red)", color: "#fff" }} onClick={() => suspendTarget(r)}><Icon n="lock" s={14} />Suspend @{r.target}…</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {closed.length > 0 && (
        <>
          <div className="b7" style={{ margin: "24px 0 12px" }}>Resolved this session · {closed.length}</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {closed.map((r, i) => (
              <div key={r.id} className="row gap12" style={{ padding: "12px 18px", borderBottom: i < closed.length - 1 ? "1px solid var(--line)" : "none" }}>
                <Icon n="check" s={15} c="var(--mint-ink)" />
                <div className="col grow"><span className="b6 t14">{r.t}</span><span className="muted t12">{r.reason} · {r.outcome}</span></div>
                <span className="tag" style={r.st === "Dismissed" ? { color: "var(--muted)", borderColor: "var(--line2)" } : stChipStyle(r.st === "Resolved" ? "Approved" : r.st)}>{r.st}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
