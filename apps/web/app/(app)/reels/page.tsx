"use client";
import { useEffect, useRef, useState } from "react";
import { CREATORS, SEED_FEED, fhash, useAppStore } from "@fanation/core";
import { Avatar, Icon, Loop, Photo, Scrim, Verified, reelFor } from "@fanation/ui";
import { FollowBtn } from "../../../components/post-card";

/**
 * Copy for a reel.
 *
 * A creator who has posted in the feed speaks in their own words here — the
 * caption is their first post, which keeps one voice per creator across the
 * app. The rest draw from a small deck by hash. Sixteen reels carrying one
 * identical line is the single loudest tell that a demo is a mock.
 */
const FALLBACK_CAPS = [
  "Behind the scenes from Friday's shoot 🎬",
  "Raw take, no edits. Subscribers get the full cut.",
  "This one took four hours and I'd do it again ✨",
  "Testing something new — tell me if it lands.",
  "Two minutes of what the last two weeks looked like.",
];

function captionFor(handle: string): string {
  const own = SEED_FEED.find((p) => p.h === handle && p.text);
  return own?.text || FALLBACK_CAPS[fhash(handle) % FALLBACK_CAPS.length];
}

/** Counts that differ per creator. Deterministic, so they survive a reload. */
const kfmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));
const likesFor = (h: string) => 6200 + (fhash(`l${h}`) % 46000);
const cmtsFor = (h: string) => 140 + (fhash(`c${h}`) % 1900);

export default function ReelsPage() {
  const S = useAppStore();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const ix = ((i % CREATORS.length) + CREATORS.length) % CREATORS.length;
  const c = CREATORS[ix];
  const isLiked = !!liked[ix];
  const { still, loop } = reelFor(c.handle);
  const nextStill = reelFor(CREATORS[(ix + 1) % CREATORS.length].handle).still;
  const likes = likesFor(c.handle);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setI((v) => v + 1);
      if (e.key === "ArrowUp") setI((v) => v - 1);
      if (e.key === " ") { e.preventDefault(); setPaused((v) => !v); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* A snap feed answers the wheel — that is the whole interaction on a phone,
     and a trackpad is the desktop equivalent. The cooldown is what stops one
     flick of an inertial scroll from firing through six reels. */
  const cool = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 12) return;
    const now = Date.now();
    if (now - cool.current < 420) return;
    cool.current = now;
    setI((v) => v + (e.deltaY > 0 ? 1 : -1));
  };

  return (
    <div className="content row center" style={{ minHeight: "calc(100vh - 61px)" }} onWheel={onWheel}>
      <div className="row gap16" style={{ alignItems: "center" }}>
        <div className="card" onClick={() => setPaused((v) => !v)}
          style={{ width: 340, height: 600, padding: 0, overflow: "hidden", position: "relative", cursor: "pointer" }}>
          {/* `key` forces a fresh <video> per reel: without it React reuses the
              element and the old frame hangs for a beat over the new source. */}
          {loop
            ? <Loop key={c.id} src={loop} poster={still} active={!paused} />
            : <Photo src={still} seed={c.id} />}

          {/* The frames are real photographs now — a third of them are bright.
              White chrome needs the wash or it disappears on the light ones. */}
          <Scrim from={0.5} height="24%" top />
          <Scrim from={0.85} height="48%" />

          <div className="pill t12" style={{ position: "absolute", top: 14, left: 14 }}>Reel {ix + 1}/{CREATORS.length}</div>
          {c.live && (
            <div className="badge-live" style={{ position: "absolute", top: 14, right: 14 }}><span className="dot" />LIVE</div>
          )}

          {paused && (
            <div className="row center" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <div className="feature-ic" style={{ width: 62, height: 62, background: "rgba(0,0,0,.42)" }}>
                <Icon n="play" s={26} c="#fff" fill="#fff" />
              </div>
            </div>
          )}

          <div style={{ position: "absolute", left: 14, right: 70, bottom: 16 }} onClick={(e) => e.stopPropagation()}>
            <div className="row gap8" style={{ marginBottom: 8 }}>
              <Avatar name={c.name} size={38} ring="#fff" />
              <div className="row gap6 b7 t14" style={{ color: "#fff" }}>{c.name.split(" ")[0]} {c.v && <Verified s={13} />}</div>
              <FollowBtn handle={c.handle} />
            </div>
            <div className="t14" style={{ color: "#fff", lineHeight: 1.45, textShadow: "0 1px 12px rgba(0,0,0,.45)" }}>{captionFor(c.handle)}</div>
          </div>

          <div className="col gap18" style={{ position: "absolute", right: 14, bottom: 20, alignItems: "center" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="col center gap4" style={{ cursor: "pointer" }} onClick={() => setLiked((m) => ({ ...m, [ix]: !m[ix] }))}>
              <div className="feature-ic" style={{ width: 44, height: 44, background: "rgba(0,0,0,.4)" }}>
                <Icon n="heart" s={20} c={isLiked ? "var(--coral)" : "#fff"} fill={isLiked ? "var(--coral)" : undefined} />
              </div>
              <span className="t12" style={{ color: "#fff" }}>{kfmt(likes + (isLiked ? 1 : 0))}</span>
            </div>
            <div className="col center gap4" style={{ cursor: "pointer" }} onClick={() => S.toast("Comments open on the post view")}>
              <div className="feature-ic" style={{ width: 44, height: 44, background: "rgba(0,0,0,.4)" }}><Icon n="comment" s={20} c="#fff" /></div>
              <span className="t12" style={{ color: "#fff" }}>{kfmt(cmtsFor(c.handle))}</span>
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

        <div className="col gap10" style={{ alignItems: "center" }}>
          <button className="feature-ic" style={{ width: 44, height: 44, background: "var(--fill)", border: "1px solid var(--line)" }} onClick={() => setI(i - 1)}>
            <span style={{ transform: "rotate(-90deg)", display: "flex" }}><Icon n="arrow" s={18} c="var(--muted)" /></span>
          </button>
          <button className="feature-ic" style={{ width: 44, height: 44, background: "var(--fill)", border: "1px solid var(--line)" }} onClick={() => setI(i + 1)}>
            <span style={{ transform: "rotate(90deg)", display: "flex" }}><Icon n="arrow" s={18} c="var(--muted)" /></span>
          </button>
          {/* Up next, at thumbnail size. It also warms the browser cache for the
              frame the next flick of the wheel is about to need. */}
          <div style={{ width: 44, height: 66, borderRadius: 9, position: "relative", overflow: "hidden", cursor: "pointer", marginTop: 4 }}
            onClick={() => setI(i + 1)}>
            <Photo src={nextStill} seed={`nx${ix}`} />
          </div>
          <span className="muted2 t12" style={{ textAlign: "center", lineHeight: 1.3 }}>Scroll<br />or ↑ ↓</span>
        </div>
      </div>
    </div>
  );
}
