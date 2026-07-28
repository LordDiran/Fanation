"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@fanation/core";
import { Avatar, CoinBadge, Icon, Logo } from "@fanation/ui";
import { FAN_NAV, STUDIO_NAV } from "../../components/nav";
import { ThemeToggle } from "../../components/theme";
import { ModalHost } from "../../components/modals";

/** One account, two modes: Browse (fan) ⇄ Studio (creator). Route prefix decides the surface. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authed = useAppStore((s) => s.authed);
  const coins = useAppStore((s) => s.coins);
  const openModal = useAppStore((s) => s.openModal);
  const setAuthed = useAppStore((s) => s.setAuthed);

  const studio = pathname.startsWith("/studio");
  const nav = studio ? STUDIO_NAV : FAN_NAV;

  // Mock auth guard — replace with middleware + session at integration.
  useEffect(() => {
    if (!authed) router.replace("/login");
  }, [authed, router]);
  if (!authed) return null;

  return (
    <div className="app">
      <div className="side">
        <div style={{ padding: "4px 8px 20px" }}><Logo /></div>
        <div className="col gap4 grow" style={{ overflowY: "auto" }}>
          <div className="up muted2" style={{ padding: "6px 13px 8px" }}>{studio ? "Creator surface" : "Fan surface"}</div>
          {nav.map(([href, label, icon]) => (
            <Link key={href} href={href} className={"navi" + (pathname === href ? " on" : "")}>
              <Icon n={icon} s={19} />{label}
            </Link>
          ))}
        </div>
        <div className="col gap8" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost btn-sm btn-block" onClick={() => router.push(studio ? "/feed" : "/studio")}>
            <Icon n={studio ? "home" : "star"} s={15} />
            {studio ? "Switch to Browsing" : "Switch to Creator Studio"}
          </button>
          <div className="card row gap10" style={{ padding: 12 }}>
            <Avatar name="You" size={38} />
            <div className="col grow"><span className="b6 t14">You</span><span className="muted t12">@yourhandle</span></div>
            <button onClick={() => { setAuthed(false); router.push("/login"); }} title="Sign out">
              <Icon n="logout" s={17} c="var(--muted)" />
            </button>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div className="search"><Icon n="search" s={17} /><input placeholder="Search creators, posts, transactions…" /></div>
          <div className="grow" />
          <div className="row" style={{ background: "var(--fill)", border: "1px solid var(--line)", borderRadius: 999, padding: 3 }}>
            {([["fan", "Browse", "/feed"], ["creator", "Studio", "/studio"]] as const).map(([k, label, href]) => (
              <button key={k} onClick={() => router.push(href)}
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
            <Icon n="plus" s={15} />Create
          </button>
        </div>
        {children}
      </div>
      <ModalHost />
    </div>
  );
}
