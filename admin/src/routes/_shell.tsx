import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminStore } from "@/lib/core";
import { Avatar, Icon, Logo, Menu } from "@/lib/ui";
import { AdminThemeToggle } from "@/components/admin-chrome";

const NAV: Array<[string, string, string]> = [
  ["/overview", "Overview", "grid"],
  ["/users", "Users", "users"],
  ["/creators", "Creators", "star"],
  ["/kyc", "KYC review", "shield"],
  ["/moderation", "Moderation", "flag"],
  ["/finance", "Finance", "dollar"],
  ["/payouts", "Payouts", "wallet"],
  ["/reports", "Reports", "chart"],
  ["/audit", "Audit log", "doc"],
];

/** Router layout route for the console — every admin page renders through `<Outlet />`. */
export default function AdminLayout() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const A = useAdminStore();
  const openReps = A.reps.filter((r) => r.st === "Open").length;
  const pendPay = A.pay.filter((p) => p.st === "Pending" || p.st === "Awaiting co-sign").length;
  const pendKyc = A.kyc.filter((k) => k.st === "Pending" || k.st === "Info requested").length;

  useEffect(() => {
    if (!A.authed) navigate("/login", { replace: true });
  }, [A.authed, navigate]);
  if (!A.authed) return null;

  const badge = (n: number) =>
    n > 0 ? (
      <span className="tag" style={{ marginLeft: "auto", padding: "1px 8px", fontSize: 11, color: "var(--amber)", borderColor: "rgba(252,164,75,.3)" }}>{n}</span>
    ) : null;

  return (
    <div className="app">
      <div className="side">
        {/* Mark carries the brand, word carries the product. The full "Fanation Admin"
            lockup measures 192px against 200px of usable sidebar — too tight to survive
            a fallback-font flash — so it lives on the login screen instead. */}
        <div style={{ padding: "4px 8px 20px" }}>
          <Logo label="Admin" />
        </div>
        <div className="col gap4 grow">
          <div className="up muted2" style={{ padding: "6px 13px 8px" }}>Admin console</div>
          {NAV.map(([href, label, icon]) => (
            <Link key={href} to={href} className={"navi" + (pathname === href ? " on" : "")}>
              <Icon n={icon} s={19} />{label}
              {href === "/moderation" && badge(openReps)}
              {href === "/payouts" && badge(pendPay)}
              {href === "/kyc" && badge(pendKyc)}
            </Link>
          ))}
        </div>
        <div className="card row gap10" style={{ padding: 12, marginTop: 12 }}>
          <Avatar name="Admin Staff" size={38} />
          <div className="col grow"><span className="b6 t14">Admin Staff</span><span className="muted t12">Super admin</span></div>
          <button onClick={() => { A.setAuthed(false); navigate("/login"); }} title="Sign out">
            <Icon n="logout" s={17} c="var(--muted)" />
          </button>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div className="search"><Icon n="search" s={17} /><input placeholder="Search users, creators, transactions…" /></div>
          <div className="grow" />
          <span className="chip-mint"><span className="dot" style={{ background: "var(--mint)" }} />Systems normal</span>
          <AdminThemeToggle />
          <Menu
            trigger={
              <button className="btn btn-ghost btn-sm">
                <Icon n="bell" s={15} />Alerts
                {openReps + pendPay + pendKyc > 0 && <span className="dot" style={{ background: "var(--coral)" }} />}
              </button>
            }
            items={[
              { ic: "flag", t: `${openReps} open moderation reports`, fn: () => navigate("/moderation") },
              { ic: "wallet", t: `${pendPay} payouts awaiting action`, fn: () => navigate("/payouts") },
              { ic: "shield", t: `${pendKyc} KYC applications pending`, fn: () => navigate("/kyc") },
              "-",
              { ic: "chart", t: "Payment spike — 3× volume", fn: () => navigate("/finance") },
            ]}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
