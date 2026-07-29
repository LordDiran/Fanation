import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/core";
import { Icon, Logo } from "@/lib/ui";

export default function Signup() {
  const navigate = useNavigate();
  const setAuthed = useAppStore((s) => s.setAuthed);
  const [pw, setPw] = useState("");
  const rules: Array<[string, boolean]> = [
    ["8+ characters", pw.length >= 8],
    ["Uppercase", /[A-Z]/.test(pw)],
    ["Lowercase", /[a-z]/.test(pw)],
    ["Number", /[0-9]/.test(pw)],
    ["Special char", /[^A-Za-z0-9]/.test(pw)],
  ];
  const score = rules.filter((r) => r[1]).length;
  return (
    <div className="glowbg row center" style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div className="row center" style={{ marginBottom: 22 }}><Logo /></div>
        <div className="card" style={{ padding: 28 }}>
          <div className="display t24" style={{ marginBottom: 4 }}>Create your account</div>
          <div className="muted t13" style={{ marginBottom: 18 }}>Start earning from day one — no approval, no guesswork.</div>
          <div className="grid g2 gap12" style={{ marginBottom: 12 }}>
            <input className="input" placeholder="First name" />
            <input className="input" placeholder="Last name" />
          </div>
          <div className="grid g2 gap12" style={{ marginBottom: 12 }}>
            <input className="input" type="email" placeholder="Email" />
            <input className="input" placeholder="Username" />
          </div>
          <input className="input" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} style={{ marginBottom: 12 }} />
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <div className="row between" style={{ marginBottom: 10 }}>
              <span className="up muted">Password strength</span>
              <span className="t12 b7" style={{ color: score >= 4 ? "var(--mint)" : score >= 2 ? "var(--amber)" : "var(--muted)" }}>
                {["None", "Weak", "Fair", "Good", "Strong", "Strong"][score]}
              </span>
            </div>
            <div className="progress" style={{ marginBottom: 12 }}><i style={{ width: `${score * 20}%` }} /></div>
            <div className="grid g2 gap8">
              {rules.map((r) => (
                <div key={r[0]} className="row gap8 t13" style={{ color: r[1] ? "var(--mint)" : "var(--muted2)" }}>
                  <Icon n="check" s={14} />{r[0]}
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-blue btn-block" onClick={() => { setAuthed(true); navigate("/feed"); }}>Create Account</button>
          <div className="row center muted t14" style={{ marginTop: 14, gap: 5 }}>
            Already have an account?
            <span className="blue b6" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Log in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
