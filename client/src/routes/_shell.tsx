import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/core";
import { Avatar, Icon, Logo } from "@/lib/ui";
import { FAN_NAV, FAN_TABS, STUDIO_NAV, STUDIO_TABS } from "@/components/nav";
import { ThemeToggle } from "@/components/theme";
import { ModalHost } from "@/components/modals";

/**
 * One account, two modes: Browse (fan) ⇄ Studio (creator). Route prefix decides
 * the surface. This is the router's layout route — every authenticated page
 * renders through the `<Outlet />` below.
 *
 * Navigation exists twice on purpose. Above 900px it is the sidebar. Below it the
 * sidebar is display:none and the bottom tab bar plus the More drawer take over —
 * the same four-plus-More shape every social app uses on a phone, because the top
 * of a tall screen is not where a thumb lives.
 */
export default function AppLayout() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const authed = useAppStore((s) => s.authed);
  const coins = useAppStore((s) => s.coins);
  const openModal = useAppStore((s) => s.openModal);
  const setAuthed = useAppStore((s) => s.setAuthed);
  const [menu, setMenu] = useState(false);

  const studio = pathname.startsWith("/studio");
  const nav = studio ? STUDIO_NAV : FAN_NAV;
  const tabs = studio ? STUDIO_TABS : FAN_TABS;

  // Mock auth guard — replace with middleware + session at integration.
  useEffect(() => {
    if (!authed) navigate("/login", { replace: true });
  }, [authed, navigate]);

  // Any navigation closes the drawer, including a tap on a link inside it.
  useEffect(() => setMenu(false), [pathname]);

  // The drawer is fixed and scrolls its own content; the page behind it must not.
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  if (!authed) return null;

  const navLinks = nav.map(([href, label, icon]) => (
    <Link key={href} to={href} className={"navi" + (pathname === href ? " on" : "")}>
      <Icon n={icon} s={19} />{label}
    </Link>
  ));

  const account = (
    <div className="col gap8" style={{ marginTop: 12 }}>
      <button className="btn btn-ghost btn-sm btn-block" onClick={() => navigate(studio ? "/feed" : "/studio")}>
        <Icon n={studio ? "home" : "star"} s={15} />
        {studio ? "Switch to Browsing" : "Switch to Creator Studio"}
      </button>
      <div className="card row gap10" style={{ padding: 12 }}>
        <Avatar name="You" size={38} />
        <div className="col grow"><span className="b6 t14">You</span><span className="muted t12">@yourhandle</span></div>
        <button onClick={() => { setAuthed(false); navigate("/login"); }} title="Sign out">
          <Icon n="logout" s={17} c="var(--muted)" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="side">
        <div style={{ padding: "4px 8px 20px" }}><Logo /></div>
        <div className="col gap4 grow" style={{ overflowY: "auto" }}>
          <div className="up muted2" style={{ padding: "6px 13px 8px" }}>{studio ? "Creator surface" : "Fan surface"}</div>
          {navLinks}
        </div>
        {account}
      </div>

      <div className="main">
        <div className="topbar">
          <div className="search"><Icon n="search" s={17} /><input placeholder="Search creators, posts, transactions…" /></div>
          <div className="grow" />
          {/* Browse ⇄ Studio. Hidden on a phone — the drawer carries the same switch,
              and five controls do not fit across 390px without shrinking the search
              field to nothing. */}
          <div className="row hide-sm" style={{ background: "var(--fill)", border: "1px solid var(--line)", borderRadius: 999, padding: 3 }}>
            {([["fan", "Browse", "/feed"], ["creator", "Studio", "/studio"]] as const).map(([k, label, href]) => (
              <button key={k} onClick={() => navigate(href)}
                style={{ padding: "6px 13px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: (k === "creator") === studio ? "var(--blue)" : "transparent", color: (k === "creator") === studio ? "#04122a" : "var(--muted)" }}>
                {label}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <button className="btn btn-ghost btn-sm" onClick={() => openModal("coins")}>
            <Icon n="coin" s={15} c="var(--amber)" />{coins.toLocaleString()}
          </button>
          <button className="btn btn-blue btn-sm" onClick={() => openModal("compose")}>
            <Icon n="plus" s={15} /><span className="hide-sm">Create</span>
          </button>
        </div>
        <Outlet />
      </div>

      {/* Phone navigation. `.tabbar` is display:none above 900px, so nothing here
          renders on a desktop and the drawer below can never be opened there. */}
      <nav className="tabbar">
        {tabs.map(([href, label, icon]) => (
          <Link key={href} to={href} className={"tabi" + (pathname === href ? " on" : "")}>
            <Icon n={icon} s={20} />{label}
          </Link>
        ))}
        <button className={"tabi" + (menu ? " on" : "")} onClick={() => setMenu(true)} aria-label="More">
          <Icon n="menu" s={20} />More
        </button>
      </nav>

      {menu && (
        <>
          <div className="scrim" onClick={() => setMenu(false)} />
          <div className="navdrawer">
            <div className="row between" style={{ padding: "0 4px 18px" }}>
              <Logo />
              <button onClick={() => setMenu(false)} aria-label="Close menu"><Icon n="x" s={20} c="var(--muted)" /></button>
            </div>
            <div className="col gap4 grow">
              <div className="up muted2" style={{ padding: "0 13px 8px" }}>{studio ? "Creator surface" : "Fan surface"}</div>
              {navLinks}
            </div>
            {account}
          </div>
        </>
      )}

      <ModalHost />
    </div>
  );
}
