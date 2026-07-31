import { useState } from "react";
import { POLICY, stChipStyle, useAdminStore } from "@/lib/core";
import type { AdminUser } from "@/lib/core";
import { Avatar, Icon, Menu } from "@/lib/ui";

const DURATIONS = ["24 hours", "7 days", "30 days", "Indefinite"];

export default function UsersPage() {
  const A = useAdminStore();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [sel, setSel] = useState<Record<number, boolean>>({});
  const [view, setView] = useState<AdminUser | null>(null);
  const rows = A.users.filter(
    (u) => (role === "All" || u.role === role || (role === "Actioned" && u.st !== "Active")) &&
      (!q || `${u.n}${u.h}`.toLowerCase().includes(q.toLowerCase())),
  );
  const nSel = rows.filter((u) => sel[u.id]).length;
  const live = (u: AdminUser) => A.users.find((x) => x.id === u.id) ?? u;

  const doWarn = (u: AdminUser) => A.ask({
    title: `Warn @${u.h}`,
    desc: "Sends a formal policy warning and adds a strike. 3 strikes place the account under review automatically.",
    verb: "Send warning", reasons: POLICY, requireReason: true,
    onGo: (why) => { A.warn(u.id); A.log(`Warned @${u.h} (strike ${u.strikes + 1})`, "Users", why); A.toast(`Warning sent to @${u.h} — strike ${u.strikes + 1} recorded`, "ok"); },
  });
  const doSuspend = (u: AdminUser) => A.ask({
    title: `Suspend @${u.h}`,
    desc: "Account is frozen: no posting, earning, or messaging. Content is hidden but not deleted. The user is notified with the reason and can appeal.",
    verb: "Suspend account", tone: "danger", reasons: POLICY, requireReason: true, durations: DURATIONS,
    onGo: (why, dur) => { A.setUserSt(u.id, "Suspended"); A.log(`Suspended @${u.h} · ${dur}`, "Users", why); A.toast(`@${u.h} suspended · ${dur}`, "err"); },
  });
  const doBan = (u: AdminUser) => A.ask({
    title: `Permanently ban @${u.h}`,
    desc: "Irreversible without a director override. Content is removed from circulation, pending payouts are frozen for compliance review, and the email/device is blocklisted.",
    verb: "Ban permanently", tone: "danger", reasons: POLICY, requireReason: true, confirmText: u.h,
    onGo: (why) => { A.setUserSt(u.id, "Banned"); A.log(`Banned @${u.h} permanently`, "Users", why); A.toast(`@${u.h} permanently banned`, "err"); },
  });
  const doReinstate = (u: AdminUser) => A.ask({
    title: `Reinstate @${u.h}`,
    desc: "Restores full account access immediately. Strike history is retained.",
    verb: "Reinstate",
    onGo: (why) => { A.setUserSt(u.id, "Active"); A.log(`Reinstated @${u.h}`, "Users", why); A.toast(`@${u.h} reinstated`, "ok"); },
  });
  const acts = (u: AdminUser) => [
    { ic: "eye", t: "View profile", fn: () => setView(u) },
    { ic: "msg", t: "Send password reset", fn: () => { A.toast(`Reset link sent to @${u.h}'s email`, "ok"); A.log(`Sent password reset to @${u.h}`, "Users"); } },
    "-" as const,
    (u.st === "Suspended" || u.st === "Banned") && { ic: "check", t: "Reinstate", fn: () => doReinstate(u) },
    u.st !== "Banned" && { ic: "flag", t: "Warn (add strike)", fn: () => doWarn(u) },
    u.st !== "Suspended" && u.st !== "Banned" && { ic: "lock", t: "Suspend…", danger: true, fn: () => doSuspend(u) },
    u.st !== "Banned" && { ic: "x", t: "Ban permanently…", danger: true, fn: () => doBan(u) },
  ];

  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">Users</h2>
        <div className="row gap10">
          <div className="search" style={{ maxWidth: 280 }}>
            <Icon n="search" s={16} />
            <input placeholder="Search name or @handle…" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && <button className="muted" onClick={() => setQ("")}><Icon n="x" s={14} /></button>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { A.toast(`Exported ${rows.length} users — users_export.csv`, "ok"); A.log(`Exported user list (${rows.length} rows)`, "Users"); }}>
            <Icon n="chart" s={14} />Export
          </button>
        </div>
      </div>
      <div className="row gap8 wrap" style={{ marginBottom: 14 }}>
        {["All", "Creator", "Fan", "Actioned"].map((t) => (
          <span key={t} className={"tag" + (role === t ? " on" : "")} style={{ cursor: "pointer" }} onClick={() => setRole(t)}>{t}</span>
        ))}
      </div>
      {nSel > 0 && (
        <div className="card row gap12" style={{ padding: "10px 16px", marginBottom: 14, borderColor: "var(--blue)" }}>
          <span className="b7 t14">{nSel} selected</span>
          <div className="grow" />
          <button className="btn btn-ghost btn-sm" onClick={() => A.ask({
            title: `Suspend ${nSel} accounts`,
            desc: "Applies the same reason and duration to every selected account. Each one is individually audit-logged.",
            verb: `Suspend ${nSel}`, tone: "danger", reasons: POLICY, requireReason: true, durations: DURATIONS.slice(0, 3),
            onGo: (why, dur) => {
              rows.filter((u) => sel[u.id]).forEach((u) => { A.setUserSt(u.id, "Suspended"); A.log(`Suspended @${u.h} · ${dur} (bulk)`, "Users", why); });
              A.toast(`${nSel} accounts suspended · ${dur}`, "err");
              setSel({});
            },
          })}><Icon n="lock" s={14} />Suspend selected…</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { A.toast(`${nSel} users exported`, "ok"); setSel({}); }}>Export</button>
          <button className="muted t13" onClick={() => setSel({})}>Clear</button>
        </div>
      )}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row up muted" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ width: 30 }} /><div style={{ flex: 2 }}>User</div><div style={{ flex: 0.8 }}>Role</div>
          <div style={{ flex: 1 }}>Status</div><div style={{ flex: 0.7 }}>Strikes</div><div style={{ flex: 0.9 }}>Lifetime</div>
          <div style={{ flex: 0.9 }}>Joined</div><div style={{ width: 40 }} />
        </div>
        {rows.length === 0 && (
          <div className="col center gap6" style={{ padding: 40 }}>
            <div className="b7">No users match &ldquo;{q || role}&rdquo;</div>
            <div className="muted t13">Adjust the search or filter.</div>
          </div>
        )}
        {rows.map((u, i) => (
          <div key={u.id} className="row" style={{ padding: "12px 18px", borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none", background: sel[u.id] ? "rgba(37,153,246,.05)" : "" }}>
            <div style={{ width: 30 }}>
              <input type="checkbox" checked={!!sel[u.id]} onChange={() => setSel((m) => ({ ...m, [u.id]: !m[u.id] }))} />
            </div>
            <div style={{ flex: 2, cursor: "pointer" }} className="row gap12" onClick={() => setView(u)}>
              <Avatar name={u.n} size={36} />
              <div className="col"><span className="b6 t14">{u.n}</span><span className="muted t12">@{u.h}</span></div>
            </div>
            <div style={{ flex: 0.8 }}><span className="tag">{u.role}</span></div>
            <div style={{ flex: 1 }}><span className="tag" style={stChipStyle(u.st)}>{u.st}</span></div>
            <div style={{ flex: 0.7 }} className={u.strikes > 0 ? "amber b7 t14" : "muted t14"}>{u.strikes || "—"}</div>
            <div style={{ flex: 0.9 }} className="b6 t14 mint">{u.spend}</div>
            <div style={{ flex: 0.9 }} className="muted t13">{u.j}</div>
            <div style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>
              <Menu items={acts(u)} />
            </div>
          </div>
        ))}
      </div>
      {view && (
        <>
          <div className="scrim" onClick={() => setView(null)} />
          <div className="drawer">
            <div className="row between" style={{ marginBottom: 18 }}>
              <span className="up muted">User profile</span>
              <button className="muted" onClick={() => setView(null)}><Icon n="x" s={18} /></button>
            </div>
            <div className="row gap14" style={{ marginBottom: 16 }}>
              <Avatar name={view.n} size={62} />
              <div className="col gap4">
                <div className="b7 t20">{view.n}</div>
                <div className="muted t13">@{view.h} · {view.role}</div>
                <span className="tag" style={{ alignSelf: "flex-start", ...stChipStyle(live(view).st) }}>{live(view).st}</span>
              </div>
            </div>
            <div className="grid g2 gap10" style={{ marginBottom: 16 }}>
              {([["Lifetime spend", view.spend], ["Strikes", String(live(view).strikes)], ["Joined", view.j], ["Reports against", String(A.reps.filter((r) => r.target === view.h).length)]] as const).map((r, i) => (
                <div key={i} className="hair" style={{ padding: "11px 13px", borderRadius: 12 }}>
                  <div className="muted t12">{r[0]}</div>
                  <div className="b7" style={{ marginTop: 2 }}>{r[1]}</div>
                </div>
              ))}
            </div>
            <div className="up muted" style={{ marginBottom: 10 }}>Quick actions</div>
            <div className="col gap8" style={{ marginBottom: 18 }}>
              {live(view).st === "Suspended" || live(view).st === "Banned" ? (
                <button className="btn btn-ghost btn-block btn-sm" onClick={() => doReinstate(view)}><Icon n="check" s={14} />Reinstate account</button>
              ) : (
                <>
                  <button className="btn btn-ghost btn-block btn-sm" onClick={() => doWarn(view)}><Icon n="flag" s={14} />Warn — add strike</button>
                  <button className="btn btn-ghost btn-block btn-sm" style={{ color: "var(--coral-ink)" }} onClick={() => doSuspend(view)}><Icon n="lock" s={14} />Suspend…</button>
                  <button className="btn btn-ghost btn-block btn-sm" style={{ color: "var(--coral-ink)" }} onClick={() => doBan(view)}><Icon n="x" s={14} />Ban permanently…</button>
                </>
              )}
            </div>
            <div className="up muted" style={{ marginBottom: 10 }}>Audit trail for this user</div>
            <div className="col gap8">
              {A.audit.filter((a) => a.act.includes(`@${view.h}`)).slice(0, 6).map((a, i) => (
                <div key={i} className="hair" style={{ padding: "10px 12px", borderRadius: 10 }}>
                  <div className="t13 b6">{a.act}</div>
                  <div className="muted2 t12">{a.time} · {a.who} · {a.why}</div>
                </div>
              ))}
              {A.audit.filter((a) => a.act.includes(`@${view.h}`)).length === 0 && (
                <div className="muted t13">No admin actions recorded yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
