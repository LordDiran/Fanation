import { stChipStyle, useAdminStore } from "@/lib/core";
import type { KycApp } from "@/lib/core";
import { Avatar, Icon, Menu } from "@/lib/ui";

const INFO_REASONS = [
  "Document photo is blurred / unreadable",
  "Name mismatch with account details",
  "Document expired",
  "Selfie / liveness check failed",
  "Address proof missing",
];
const REJECT_REASONS = [
  "Document appears forged or tampered",
  "Identity mismatch",
  "Applicant under 18",
  "Sanctions / watchlist hit",
  "Duplicate application",
];

export default function KycPage() {
  const A = useAdminStore();
  const queue = A.kyc.filter((k) => k.st === "Pending" || k.st === "Info requested");
  const done = A.kyc.filter((k) => k.st === "Approved" || k.st === "Rejected");

  const approve = (k: KycApp) => A.ask({
    title: `Approve KYC — ${k.n}`,
    desc: `Verifies @${k.h} as a creator: unlocks payouts, live streaming, and the verified badge. Identity documents were checked via the KYC provider.`,
    verb: "Approve verification",
    onGo: (why) => {
      A.kycSet(k.id, "Approved");
      A.setUserStByHandle(k.h, "Active");
      A.log(`Approved KYC @${k.h}`, "KYC", why || "Docs verified");
      A.toast(`@${k.h} verified — payouts enabled`, "ok");
    },
  });
  const requestInfo = (k: KycApp) => A.ask({
    title: `Request more information — ${k.n}`,
    desc: "The applicant is notified with the reason and can resubmit documents. The application stays in the queue as “Info requested”.",
    verb: "Send request", reasons: INFO_REASONS, requireReason: true,
    onGo: (why) => {
      A.kycSet(k.id, "Info requested");
      A.log(`Requested info for KYC @${k.h}`, "KYC", why);
      A.toast(`Info request sent to @${k.h}`, "ok");
    },
  });
  const reject = (k: KycApp) => A.ask({
    title: `Reject KYC — ${k.n}`,
    desc: "The applicant cannot earn or receive payouts. They are notified with the reason and may appeal with new documents after 7 days.",
    verb: "Reject application", tone: "danger", reasons: REJECT_REASONS, requireReason: true,
    onGo: (why) => {
      A.kycSet(k.id, "Rejected");
      A.log(`Rejected KYC @${k.h}`, "KYC", why);
      A.toast(`KYC rejected for @${k.h}`, "err");
    },
  });

  return (
    <div className="content">
      <div className="row between wrap" style={{ marginBottom: 18, gap: 12 }}>
        <h2 className="display t32">KYC review</h2>
        <span className="tag">{queue.length} in queue</span>
      </div>

      <div className="card row gap12" style={{ padding: "12px 16px", marginBottom: 16 }}>
        <Icon n="shield" s={18} c="var(--blueL-ink)" />
        <div className="t13 muted">
          Identity checks run through the KYC provider before landing here. Approval enables payouts and the verified badge — every decision is audit-logged with a reason.
        </div>
      </div>

      {queue.length === 0 && (
        <div className="card col center gap8" style={{ padding: 46 }}>
          <Icon n="check" s={30} c="var(--mint-ink)" />
          <div className="b7 t18">KYC queue is clear</div>
          <div className="muted t13">New applications appear here the moment creators submit documents.</div>
        </div>
      )}

      <div className="col gap12">
        {queue.map((k) => (
          <div key={k.id} className="card row gap14 wrap" style={{ padding: 16 }}>
            <Avatar name={k.n} size={44} />
            <div className="col gap2" style={{ flex: 1.4, minWidth: 160 }}>
              <span className="b7 t15">{k.n}</span>
              <span className="muted t13">@{k.h} · applied {k.t}</span>
            </div>
            <div className="col gap2" style={{ flex: 1, minWidth: 130 }}>
              <span className="up muted2">Document</span>
              <span className="b6 t14">{k.doc}</span>
            </div>
            <div className="col gap2" style={{ flex: 1, minWidth: 130 }}>
              <span className="up muted2">Risk signal</span>
              <span className={"b6 t14 " + (k.risk === "Low" ? "mint" : "amber")}>
                {k.risk !== "Low" && <Icon n="flag" s={12} />} {k.risk}
              </span>
            </div>
            <div style={{ minWidth: 110 }}>
              <span className="tag" style={stChipStyle(k.st)}>{k.st}</span>
            </div>
            <div className="row gap8">
              <button className="btn btn-ghost btn-sm" onClick={() => requestInfo(k)}>Request info…</button>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral-ink)" }} onClick={() => reject(k)}>Reject…</button>
              <button className="btn btn-blue btn-sm" onClick={() => approve(k)}><Icon n="check" s={14} />Approve</button>
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <>
          <div className="b7" style={{ margin: "24px 0 12px" }}>Processed this session · {done.length}</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {done.map((k, i) => (
              <div key={k.id} className="row gap12" style={{ padding: "12px 18px", borderBottom: i < done.length - 1 ? "1px solid var(--line)" : "none" }}>
                <Avatar name={k.n} size={34} />
                <div className="col grow"><span className="b6 t14">{k.n}</span><span className="muted t12">@{k.h} · {k.doc}</span></div>
                <span className="tag" style={stChipStyle(k.st)}>{k.st}</span>
                <Menu items={[
                  { ic: "repost", t: "Reopen application", fn: () => { A.kycSet(k.id, "Pending"); A.log(`Reopened KYC @${k.h}`, "KYC"); A.toast(`KYC for @${k.h} reopened`, "ok"); } },
                ]} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
