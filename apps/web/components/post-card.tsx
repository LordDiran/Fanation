"use client";
import { useState } from "react";
import { byHandle, seedCommentsFor, useAppStore } from "@fanation/core";
import type { Post } from "@fanation/core";
import { Avatar, Icon, Menu, Verified, bg } from "@fanation/ui";

const EMOJIS = ["❤️", "🔥", "😂", "😍", "👏"];

export function FollowBtn({ handle }: { handle: string }) {
  const on = useAppStore((s) => !!s.follows[handle]);
  const toggleFollow = useAppStore((s) => s.toggleFollow);
  return (
    <button className={"btn btn-sm " + (on ? "btn-ghost" : "btn-blue")}
      onClick={(e) => { e.stopPropagation(); toggleFollow(handle); }}>
      {on ? "Following" : "Follow"}
    </button>
  );
}

/** Full-action post card — the atom of the fan experience. */
export function PostCard({ p }: { p: Post }) {
  const S = useAppStore();
  const [showC, setShowC] = useState(false);
  const [showR, setShowR] = useState(false);
  const [ctext, setCtext] = useState("");
  const liked = !!S.liked[p.id];
  const savedP = !!S.saved[p.id];
  const isSub = !!S.subs[p.h];
  const isUnlocked = !!S.unlocked[p.id];
  const voted = S.votes[p.id];
  const rx = S.reacts[p.id];
  const myC = S.comments[p.id] ?? [];
  const seeds = p.mine ? [] : seedCommentsFor(p.id);
  const sendC = () => {
    const v = ctext.trim();
    if (!v) return;
    S.addComment(p.id, v);
    setCtext("");
  };
  const menu = p.mine
    ? [
        { ic: "repost", t: "Copy link", fn: () => S.toast(`Link copied — fanation.app/p/${p.id}`) },
        "-" as const,
        { ic: "x", t: "Delete post", danger: true, fn: () => S.delPost(p.id) },
      ]
    : [
        { ic: "bookmark", t: savedP ? "Remove from collection" : "Save to collection", fn: () => S.toggleSave(p.id) },
        { ic: "repost", t: "Copy link", fn: () => S.toast(`Link copied — fanation.app/p/${p.id}`) },
        "-" as const,
        { ic: "eye", t: "Not interested", fn: () => S.hide(p.id) },
        { ic: "bell", t: `Mute @${p.h}`, fn: () => S.mute(p.h) },
        { ic: "shield", t: `Block @${p.h}`, danger: true, fn: () => S.block(p.h) },
        S.reported[p.id]
          ? { ic: "flag", t: "Reported ✓", off: true }
          : { ic: "flag", t: "Report post", danger: true, fn: () => S.openModal("report", p) },
      ];

  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="row between">
        <div className="row gap12">
          <Avatar name={p.who} size={44} />
          <div className="col">
            <div className="row gap6">
              <span className="b7 t14">{p.who}</span>
              {p.v && <Verified />}
              {isSub && !p.mine && <span className="tag" style={{ padding: "1px 8px", fontSize: 10.5, color: "var(--blueL)", borderColor: "rgba(46,155,255,.35)" }}>Subscribed</span>}
              {p.mine && p.vis && <span className="tag" style={{ padding: "1px 8px", fontSize: 10.5 }}>{p.vis}</span>}
            </div>
            <div className="muted t13">@{p.h} · {p.t}</div>
          </div>
        </div>
        <Menu items={menu} />
      </div>
      <div className="t14" style={{ margin: "13px 0", lineHeight: 1.55 }}>{p.text}</div>

      {(p.type === "image" || p.type === "video") && (
        <div style={{ height: 280, borderRadius: 14, background: bg(p.seed), position: "relative", overflow: "hidden" }}>
          {p.type === "video" && (
            <div className="row center" style={{ position: "absolute", inset: 0 }}>
              <div className="feature-ic" style={{ width: 56, height: 56, background: "rgba(0,0,0,.42)", cursor: "pointer" }}
                onClick={() => S.toast(`▶ Playing preview — full video is ${p.dur}`)}>
                <Icon n="play" s={24} c="#fff" fill="#fff" />
              </div>
            </div>
          )}
          {p.dur && <div className="pill t12" style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.55)", border: "none", color: "#fff" }}>{p.dur}</div>}
        </div>
      )}

      {p.poll && (
        <div className="col gap8" style={{ marginBottom: 4 }}>
          {p.poll.map((o, i) => {
            const pct = voted == null ? o.pct : voted === i ? Math.min(99, o.pct + 1) : Math.max(1, o.pct - 1);
            return (
              <div key={i} className="hair" onClick={() => { if (voted == null) S.vote(p.id, i); }}
                style={{ position: "relative", padding: "11px 14px", borderRadius: 12, overflow: "hidden", cursor: voted == null ? "pointer" : "default", borderColor: voted === i ? "var(--blue)" : "var(--line)" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: voted === i ? "rgba(46,155,255,.3)" : "rgba(46,155,255,.14)", transition: ".4s" }} />
                <div className="row between" style={{ position: "relative" }}>
                  <span className="row gap8 b6 t14">{voted === i && <Icon n="check" s={14} c="var(--blueL)" />}{o.label}</span>
                  <span className="muted t13">{pct}%</span>
                </div>
              </div>
            );
          })}
          <div className="muted t12">{voted == null ? "1,204 votes · 2 days left" : "1,205 votes · you voted · 2 days left"}</div>
        </div>
      )}

      {p.type === "locked" && !isUnlocked && (
        <div className="locked" style={{ height: 210 }}>
          <div style={{ height: "100%", background: bg(`lk${p.id}`), filter: "blur(2px)", transform: "scale(1.05)" }} />
          <div className="lockcover">
            <div className="feature-ic" style={{ background: "rgba(37,153,246,.16)" }}><Icon n="lock" c="var(--blueL)" /></div>
            <div className="b7" style={{ color: "#fff" }}>{isSub ? "Pay-per-view drop" : "Exclusive locked content"}</div>
            <div className="row gap8">
              {!isSub && <button className="btn btn-ghost btn-sm" onClick={() => S.openModal("subscribe", byHandle(p.h))}>Subscribe</button>}
              <button className="btn btn-blue btn-sm" onClick={() => S.openModal("ppv", p)}>Unlock · {p.price} coins</button>
            </div>
          </div>
        </div>
      )}
      {p.type === "locked" && isUnlocked && (
        <div style={{ height: 280, borderRadius: 14, background: bg(`lk${p.id}`), position: "relative", overflow: "hidden" }}>
          <span className="chip-mint" style={{ position: "absolute", top: 10, left: 10 }}><Icon n="check" s={12} />Unlocked</span>
        </div>
      )}

      <div className="row between" style={{ marginTop: 14 }}>
        <div className="row gap20" style={{ position: "relative" }}>
          <button className="row gap6 muted" onClick={() => S.toggleLike(p.id)} style={{ color: liked ? "var(--coral)" : "" }}>
            <Icon n="heart" s={19} fill={liked ? "var(--coral)" : undefined} />
            {(p.likes + (liked ? 1 : 0)).toLocaleString()}
          </button>
          <button className="row gap6 muted" onClick={() => setShowC((v) => !v)} style={{ color: showC ? "var(--blueL)" : "" }}>
            <Icon n="comment" s={19} />{p.comments + myC.length}
          </button>
          <button className="row gap6 muted" onClick={() => S.toast("Reposted to your profile", "ok")}>
            <Icon n="repost" s={19} />
          </button>
          <button className="row gap4 muted" onClick={() => setShowR((v) => !v)} style={{ fontSize: 15 }}>
            {rx || "🙂"}<Icon n="plus" s={12} />
          </button>
          {showR && (
            <div className="menu row gap4" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 120, minWidth: 0, padding: "7px 9px" }}>
              {EMOJIS.map((e) => (
                <span key={e} onClick={() => { S.setReact(p.id, e); setShowR(false); }}
                  style={{ fontSize: 20, cursor: "pointer", padding: "2px 4px", transform: rx === e ? "scale(1.25)" : "none" }}>
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="row gap12">
          <span className="chip-coin"><Icon n="coin" s={13} />{p.coins}</span>
          {!p.mine && (
            <button className="btn btn-ghost btn-sm" onClick={() => S.openModal("gift", byHandle(p.h))}>
              <Icon n="gift" s={15} />Gift
            </button>
          )}
        </div>
      </div>

      {showC && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          {seeds.map((c, i) => (
            <div key={i} className="row gap10" style={{ padding: "7px 0", alignItems: "flex-start" }}>
              <Avatar name={c[0]} size={30} />
              <div className="col">
                <span className="t13"><b>{c[0]}</b> <span className="muted2">@{c[1]}</span></span>
                <span className="t14">{c[2]}</span>
              </div>
            </div>
          ))}
          {myC.map((c, i) => (
            <div key={`m${i}`} className="row gap10" style={{ padding: "7px 0", alignItems: "flex-start" }}>
              <Avatar name="You" size={30} />
              <div className="col">
                <span className="t13"><b>You</b> <span className="muted2">@yourhandle · now</span></span>
                <span className="t14">{c}</span>
              </div>
            </div>
          ))}
          <div className="row gap10" style={{ marginTop: 8 }}>
            <Avatar name="You" size={32} />
            <input className="input" placeholder="Add a comment…" value={ctext} style={{ padding: "9px 13px" }}
              onChange={(e) => setCtext(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendC(); }} />
            <button className="btn btn-blue btn-sm" disabled={!ctext.trim()} onClick={sendC}><Icon n="send" s={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
