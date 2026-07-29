import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/core";
import { Logo } from "@/lib/ui";

/** Mock auth — swap for the real auth provider at integration (see README). */
export default function Login() {
  const navigate = useNavigate();
  const setAuthed = useAppStore((s) => s.setAuthed);
  const go = () => { setAuthed(true); navigate("/feed"); };
  return (
    <div className="glowbg row center" style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="row center" style={{ marginBottom: 22 }}><Logo /></div>
        <div className="card" style={{ padding: 28 }}>
          <div className="display t24" style={{ marginBottom: 4 }}>Welcome back</div>
          <div className="muted t13" style={{ marginBottom: 18 }}>Log in to your Fanation account.</div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@example.com" style={{ marginBottom: 14 }} />
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" style={{ marginBottom: 16 }} />
          <button className="btn btn-blue btn-block" onClick={go}>Sign in</button>
          <div className="row center muted t14" style={{ marginTop: 14, gap: 5 }}>
            Don&apos;t have an account?
            <span className="blue b6" style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>Create one</span>
          </div>
        </div>
      </div>
    </div>
  );
}
