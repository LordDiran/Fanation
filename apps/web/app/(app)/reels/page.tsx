"use client";
import { useEffect, useState } from "react";
import { CREATORS, useAppStore } from "@fanation/core";
import { Avatar, Icon, Verified, bg } from "@fanation/ui";
import { FollowBtn } from "../../../components/post-card";

export default function ReelsPage() {
  const S = useAppStore();
  const [i, setI] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const ix = ((i % CREATORS.length) + CREATORS.length) % CREATORS.length;
  const c = CREATORS[ix];
  const isLiked = !!liked[ix];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setI((v) => v + 1);
      if (e.key === "ArrowUp") setI((v) => v - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="content row center" style={{ minHeight: "calc(100vh - 61px)" }}>
      <div className="row gap16" style={{ alignItems: "center" }}>
        <div className="card" style={{ width: 340, height: 600, padding: 0, overflow: "hidden", position: "relative", background: bg(`reel${c.id}${ix}`) }}>
          <div className="pill t12" style={{ position: "absolute", top: 14, left: 14 }}>Reel {ix + 1}/{CREATORS.length}</div>
          <div style={{ position: "absolute", left: 14, right: 70, bottom: 16 }}>
            <div className="row gap8" style={{ marginBottom: 8 }}>
              <Avatar name={c.name} size={38} ring="#fff" />
              <div className="row gap6 b7 t14" style={{ color: "#fff" }}>{c.name.split(" ")[0]} {c.v && <Verified s={13} />}</div>
              <FollowBtn handle={c.handle} />
            </div>
            <div className="t14" style={{ color: "#fff" }}>Behind the scenes 🎬 exclusive drop for subscribers only</div>
          </div>
          <div className="col gap18" style={{ position: "absolute", right: 14, bottom: 20, alignItems: "center" }}>
            <div className="col center gap4" style={{ cursor: "pointer" }} onClick={() => setLiked((m) => ({ ...m, [ix]: !m[ix] }))}>
              <div className="feature-ic" style={{ width: 44, height: 44, background: "rgba(0,0,0,.4)" }}>
                <Icon n="heart" s={20} c={isLiked ? "var(--coral)" : "#fff"} fill={isLiked ? "var(--coral)" : undefined} />
              </div>
              <span className="t12" style={{ color: "#fff" }}>{isLiked ? "24.2K" : "24.1K"}</span>
            </div>
            <div className="col center gap4" style={{ cursor: "pointer" }} onClick={() => S.toast("Comments open on the post view")}>
              <div className="feature-ic" style={{ width: 44, height: 44, background: "rgba(0,0,0,.4)" }}><Icon n="comment" s={20} c="#fff" /></div>
              <span className="t12" style={{ color: "#fff" }}>842</span>
            </div>
            <div className="col center gap4" style={{ cursor: "pointer" }} onClick={() => S.openModal("gift", c)}>
              <div className="feature-ic" style={{ width: 44, height: 44, background: "rgba(0,0,0,.4)" }}><Icon n="gift" s={20} c="#fff" /></div>
              <span className="t12" style={{ color: "#fff" }}>Gift</span>
            </div>
            <div className="col center gap4" style={{ cursor: "pointer" }} onClick={() => S.toast(`Link copied — fanation.app/r/${c.handle}`)}>
              <div className="feature-ic" style={{ width: 44, height: 44, background: "rgba(0,0,0,.4)" }}><Icon n="repost" s={20} c="#fff" /></div>
              <span className="t12" style={{ color: "#fff" }}>Share</span>
            </div>
          </div>
        </div>
        <div className="col gap10">
          <button className="feature-ic" style={{ width: 44, height: 44, background: "var(--fill)", border: "1px solid var(--line)" }} onClick={() => setI(i - 1)}>
            <span style={{ transform: "rotate(-90deg)", display: "flex" }}><Icon n="arrow" s={18} c="var(--muted)" /></span>
          </button>
          <button className="feature-ic" style={{ width: 44, height: 44, background: "var(--fill)", border: "1px solid var(--line)" }} onClick={() => setI(i + 1)}>
            <span style={{ transform: "rotate(90deg)", display: "flex" }}><Icon n="arrow" s={18} c="var(--muted)" /></span>
          </button>
        </div>
      </div>
    </div>
  );
}
