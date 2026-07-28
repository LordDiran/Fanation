"use client";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@fanation/core";
import { Icon, Logo } from "@fanation/ui";

/** Staff-only mock auth — swap for SSO/JWT with role claims at integration. */
export default function AdminLogin() {
  const router = useRouter();
  const setAuthed = useAdminStore((s) => s.setAuthed);
  return (
    <div className="glowbg row center" style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="row center" style={{ marginBottom: 22 }}>
          <Logo label={<>Fanation <span className="muted">Admin</span></>} />
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div className="row gap10" style={{ marginBottom: 6 }}>
            <div className="feature-ic" style={{ width: 38, height: 38, background: "rgba(37,153,246,.14)" }}><Icon n="shield" s={18} c="var(--blueL)" /></div>
            <div className="col"><div className="b7 t18">Admin console</div><div className="muted t12">Staff access only</div></div>
          </div>
          <hr className="divider" style={{ margin: "16px 0" }} />
          <label className="label">Work email</label>
          <input className="input" defaultValue="admin@fanation.app" style={{ marginBottom: 14 }} />
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" style={{ marginBottom: 14 }} />
          <div className="row between hair" style={{ padding: "11px 14px", borderRadius: 12, marginBottom: 16 }}>
            <div className="row gap8"><Icon n="shield" s={15} c="var(--mint)" /><span className="t13 b6">Two-factor authentication</span></div>
            <span className="chip-mint">Required</span>
          </div>
          <button className="btn btn-blue btn-block" onClick={() => { setAuthed(true); router.push("/overview"); }}>Sign in to admin</button>
          <div className="row center muted2 t12" style={{ marginTop: 12 }}>Protected by SSO · every action is audit-logged</div>
        </div>
      </div>
    </div>
  );
}
