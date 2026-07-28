"use client";
import { NOTIF_SEED, useAppStore } from "@fanation/core";
import { Icon, Menu } from "@fanation/ui";

export default function NotificationsPage() {
  const S = useAppStore();
  return (
    <div className="content" style={{ maxWidth: 680 }}>
      <div className="row between" style={{ marginBottom: 18 }}>
        <h2 className="display t32">Notifications</h2>
        <button className="btn btn-ghost btn-sm" disabled={S.notifsRead} onClick={S.markNotifsRead}>
          {S.notifsRead ? "All read ✓" : "Mark all as read"}
        </button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {NOTIF_SEED.map((n, i) => {
          const unread = !S.notifsRead && i < 4;
          return (
            <div key={i}>
              <div className="row gap14" style={{ padding: "15px 18px", background: unread ? "rgba(46,155,255,.05)" : "" }}>
                <div className="feature-ic" style={{ width: 40, height: 40, background: "var(--fill)" }}>
                  <span style={{ color: n.color }}><Icon n={n.icon} s={18} /></span>
                </div>
                <div className="grow">
                  <div className="t14 b6">{n.text}</div>
                  <div className="muted t12">{n.time}</div>
                </div>
                {unread && <span className="dot" style={{ background: "var(--blue)" }} />}
                <Menu items={[
                  { ic: "check", t: "Mark as read", fn: () => S.toast("Marked as read") },
                  { ic: "bell", t: "Turn off this type", fn: () => S.toast("You'll get fewer notifications like this") },
                ]} />
              </div>
              {i < NOTIF_SEED.length - 1 && <hr className="divider" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
