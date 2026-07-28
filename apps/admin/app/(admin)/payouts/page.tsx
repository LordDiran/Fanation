"use client";
import { stChipStyle, useAdminStore } from "@fanation/core";
import type { AdminPayout } from "@fanation/core";
import { Avatar, Icon, Menu, StatCard } from "@fanation/ui";

const COSIGN_AT = 10000; // dual-control threshold in USD
const HOLD_REASONS = [
  "Awaiting KYC re-verification",
  "Chargeback investigation open",
  "Bank details changed within 48h",
  "Compliance review — manual",
];
const REJECT_REASONS = [
  "Fraud indicators on earning pattern",
  "Account sanctioned",
  "Invalid bank details",
  "Requested by creator",
];
const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default function PayoutsPage() {
  const A = useAdminStore();
  const queue = A.pay.filter((p) => p.st === "Pending" || p.st === "Awaiting co-sign" || p.st === "On hold");
  const done = A.pay.filter((p) => p.st === "Paid" || p.st === "Rejected");
  const pendingTotal = queue.reduce((s, p) => s + p.amt, 0);
  const sanctioned = (p: AdminPayout) => {
    const u = A.users.find((x) => x.n === p.n);
    return !!u && (u.st === "Suspended" || u.st === "Banned" || u.st === "Under review");
  };

  const approve = (p: AdminPayout) => {
    const big = p.amt >= COSIGN_AT;
    const warn = sanctioned(p) ? " ⚠ This creator's account is currently sanctioned — approving releases funds anyway and is flagged to compliance." : "";
    A.ask({
      title: big ? `Approve ${fmt(p.amt)} — 1 of 2 signatures` : `Approve payout ${fmt(p.amt)}`,
      desc: big
        ? `Payouts of ${fmt(COSIGN_AT)}+ require two admins. Your approval is recorded and the request moves to “Awaiting co-sign” until a second admin releases it.${warn}`
        : `Releases ${fmt(p.amt)} to ${p.n} via ${p.m}. Settlement usually lands within 24h.${warn}`,
      verb: big ? "Record first approval" : "Approve & pay",
      onGo: (why) => {
        A.paySet(p.id, big ? "Awaiting co-sign" : "Paid");
        A.log(`${big ? "First-approved" : "Approved"} payout ${fmt(p.amt)} — ${p.n}`, "Finance", why || (big ? "Dual-control: 1 of 2" : "—"));
        A.toast(big ? "First approval recorded — a second admin must co-sign" : `${fmt(p.amt)} released to ${p.n}`, "ok");
      },
    });
  };
  const cosign = (p: AdminPayout) => A.ask({
    title: `Co-sign & release ${fmt(p.amt)}`,
    desc: `You are acting as the second approver. Both signatures are written to the audit log and the transfer to ${p.n} (${p.m}) executes immediately.`,
    verb: "Co-sign & release",
    onGo: (why) => { A.paySet(p.id, "Paid"); A.log(`Co-signed payout ${fmt(p.amt)} — ${p.n} (2 of 2)`, "Finance", why || "Dual-control complete"); A.toast(`${fmt(p.amt)} released to ${p.n}`, "ok"); },
  });
  const hold = (p: AdminPayout) => A.ask({
    title: `Hold payout ${fmt(p.amt)} — ${p.n}`,
    desc: "Pauses the request without rejecting it. The creator sees “Under review” and support is notified with the reason.",
    verb: "Place hold", reasons: HOLD_REASONS, requireReason: true,
    onGo: (why) => { A.paySet(p.id, "On hold"); A.log(`Held payout ${fmt(p.amt)} — ${p.n}`, "Finance", why); A.toast(`Payout held — ${p.n}`, "ok"); },
  });
  const release = (p: AdminPayout) => A.ask({
    title: `Release hold — ${fmt(p.amt)}`,
    desc: "Returns the request to the pending queue for normal approval.",
    verb: "Release hold",
    onGo: (why) => { A.paySet(p.id, "Pending"); A.log(`Released hold on payout ${fmt(p.amt)} — ${p.n}`, "Finance", why); A.toast("Hold released — back in queue", "ok"); },
  });
  const reject = (p: AdminPayout) => A.ask({
    title: `Reject payout ${fmt(p.amt)} — ${p.n}`,
    desc: "Funds return to the creator's Fanation balance. The creator is notified with the reason and can contact support to appeal.",
    verb: "Reject payout", tone: "danger", reasons: REJECT_REASONS, requireReason: true,
    onGo: (why) => { A.paySet(p.id, "Rejected"); A.log(`Rejected payout ${fmt(p.amt)} — ${p.n}`, "Finance", why); A.toast(`Payout rejected — ${p.n}`, "err"); },
  });
  const bulkApprove = () => {
    const ok = queue.filter((p) => p.st === "Pending" && p.amt < COSIGN_AT && !sanctioned(p));
    const skipBig = queue.filter((p) => p.st === "Pending" && p.amt >= COSIGN_AT).length;
    const skipSanc = queue.filter((p) => p.st === "Pending" && p.amt < COSIGN_AT && sanctioned(p)).length;
    if (ok.length === 0) { A.toast("Nothing eligible — remaining requests need co-sign or manual review", "err"); return; }
    A.ask({
      title: `Approve ${ok.length} standard payouts — ${fmt(ok.reduce((s, p) => s + p.amt, 0))}`,
      desc: `Approves every pending payout under ${fmt(COSIGN_AT)}.${skipBig ? ` ${skipBig} request${skipBig > 1 ? "s" : ""} over the threshold ${skipBig > 1 ? "are" : "is"} skipped (co-sign required).` : ""}${skipSanc ? ` ${skipSanc} sanctioned-account request${skipSanc > 1 ? "s are" : " is"} skipped.` : ""} Each payout is individually audit-logged.`,
      verb: `Approve ${ok.length}`,
      onGo: (why) => {
        ok.forEach((p) => { A.paySet(p.id, "Paid"); A.log(`Approved payout ${fmt(p.amt)} — ${p.n} (batch)`, "Finance", why || "Weekly batch"); });
        A.toast(`${ok.length} payouts released${skipBig + skipSanc ? ` · ${skipBig + skipSanc} skipped for review` : ""}`, "ok");
      },
    });
  };

  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">Payouts</h2>
        <button className="btn btn-blue btn-sm" onClick={bulkApprove}><Icon n="check" s={14} />Approve standard batch</button>
      </div>

      <div className="grid g4 gap16" style={{ marginBottom: 18 }}>
        <StatCard label="In queue" value={fmt(pendingTotal)} sub={`${queue.length} requests`} icon="wallet" color="var(--amber)" />
        <StatCard label="Paid this week" value="$41.2K" sub="38 creators" icon="check" color="var(--mint)" />
        <StatCard label="Next auto-batch" value="Fri 10:00" sub="UTC · standard payouts" icon="cal" />
        <StatCard label="Co-sign threshold" value={fmt(COSIGN_AT)} sub="two admin signatures" icon="shield" color="var(--blueL)" />
      </div>

      {queue.length === 0 && (
        <div className="card col center gap8" style={{ padding: 46 }}>
          <Icon n="check" s={30} c="var(--mint)" />
          <div className="b7 t18">Payout queue is clear</div>
          <div className="muted t13">New withdrawal requests from creators appear here.</div>
        </div>
      )}

      <div className="col gap12">
        {queue.map((p) => {
          const big = p.amt >= COSIGN_AT;
          const sanc = sanctioned(p);
          return (
            <div key={p.id} className="card row gap14 wrap" style={{ padding: 16, borderColor: sanc ? "rgba(243,106,70,.4)" : undefined }}>
              <Avatar name={p.n} size={44} />
              <div className="col gap2" style={{ flex: 1.5, minWidth: 170 }}>
                <span className="b7 t15">{p.n}</span>
                <span className="muted t13">{p.m} · requested {p.t}</span>
                {sanc && <span className="coral t12 b6"><Icon n="flag" s={11} /> Account sanctioned — verify with compliance before release</span>}
              </div>
              <div className="col gap2" style={{ minWidth: 110 }}>
                <span className="up muted2">Amount</span>
                <span className="b7 t18">{fmt(p.amt)}</span>
              </div>
              <div className="col gap4" style={{ minWidth: 150 }}>
                <span className="tag" style={{ alignSelf: "flex-start", ...stChipStyle(p.st) }}>{p.st}</span>
                {big && <span className="muted2 t12">Dual-control: 2 signatures</span>}
              </div>
              <div className="row gap8">
                {p.st === "Pending" && <button className="btn btn-blue btn-sm" onClick={() => approve(p)}><Icon n="check" s={14} />{big ? "Approve (1 of 2)…" : "Approve & pay…"}</button>}
                {p.st === "Awaiting co-sign" && <button className="btn btn-blue btn-sm" onClick={() => cosign(p)}><Icon n="shield" s={14} />Co-sign & release…</button>}
                {p.st === "On hold" && <button className="btn btn-ghost btn-sm" onClick={() => release(p)}>Release hold…</button>}
                <Menu items={[
                  p.st !== "On hold" && { ic: "lock", t: "Hold…", fn: () => hold(p) },
                  { ic: "x", t: "Reject…", danger: true, fn: () => reject(p) },
                  "-" as const,
                  { ic: "doc", t: "View earning history", fn: () => A.toast(`Earning history for ${p.n} — last 90 days clean`, "ok") },
                ]} />
              </div>
            </div>
          );
        })}
      </div>

      {done.length > 0 && (
        <>
          <div className="b7" style={{ margin: "24px 0 12px" }}>Actioned this session · {done.length}</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {done.map((p, i) => (
              <div key={p.id} className="row gap12" style={{ padding: "12px 18px", borderBottom: i < done.length - 1 ? "1px solid var(--line)" : "none" }}>
                <Avatar name={p.n} size={34} />
                <div className="col grow"><span className="b6 t14">{p.n}</span><span className="muted t12">{p.m}</span></div>
                <span className="b7 t14">{fmt(p.amt)}</span>
                <span className="tag" style={stChipStyle(p.st)}>{p.st}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
