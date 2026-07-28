"use client";
import { useState } from "react";
import { useAppStore } from "@fanation/core";
import { Icon, bg } from "@fanation/ui";

interface VaultItem { id: string; kind: string; used: boolean }

export default function VaultPage() {
  const S = useAppStore();
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState<VaultItem[]>(
    Array.from({ length: 25 }).map((_, i) => ({ id: String(i), kind: i % 4 === 1 ? "Videos" : i % 4 === 3 ? "Audio" : "Photos", used: i % 3 !== 0 })),
  );
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const list = items.filter((x) => tab === "All" || x.kind === tab || (tab === "Used" && x.used) || (tab === "Unused" && !x.used));
  const nSel = Object.keys(sel).filter((k) => sel[k]).length;
  return (
    <div className="content">
      <div className="row between" style={{ marginBottom: 18 }}>
        <div className="col gap4">
          <h2 className="display t32">Vault</h2>
          <span className="muted">All your media in one place · {items.length} items.</span>
        </div>
        <button className="btn btn-grad" onClick={() => { setItems((x) => [{ id: `n${x.length}`, kind: "Photos", used: false }, ...x]); S.toast("Upload complete — added to your vault", "ok"); }}>
          <Icon n="upload" s={16} />Upload
        </button>
      </div>
      <div className="row gap8 wrap" style={{ marginBottom: 18 }}>
        {["All", "Photos", "Videos", "Audio", "Used", "Unused"].map((t) => (
          <span key={t} className={"tag" + (tab === t ? " on" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(t)}>{t}</span>
        ))}
      </div>
      {nSel > 0 && (
        <div className="card row gap12" style={{ padding: "10px 16px", marginBottom: 14, borderColor: "var(--blue)" }}>
          <span className="b7 t14">{nSel} selected</span>
          <div className="grow" />
          <button className="btn btn-ghost btn-sm" onClick={() => { S.toast("Sent as PPV message to VIP fans · 150 coins to unlock", "ok"); setSel({}); }}>
            <Icon n="lock" s={14} />Send as PPV
          </button>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral)" }}
            onClick={() => { setItems((x) => x.filter((it) => !sel[it.id])); S.toast(`${nSel} item${nSel > 1 ? "s" : ""} deleted`); setSel({}); }}>
            <Icon n="x" s={14} />Delete
          </button>
          <button className="muted t13" onClick={() => setSel({})}>Clear</button>
        </div>
      )}
      {list.length === 0 && (
        <div className="card col center gap8" style={{ padding: 44 }}>
          <div className="b7">Nothing in "{tab}"</div>
          <div className="muted t13">Upload media or switch filters.</div>
        </div>
      )}
      <div className="grid gap12" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {list.map((x) => (
          <div key={x.id} onClick={() => setSel((m) => ({ ...m, [x.id]: !m[x.id] }))}
            style={{ aspectRatio: "1", borderRadius: 12, background: bg(`v${x.id}`), position: "relative", cursor: "pointer", outline: sel[x.id] ? "2px solid var(--blue)" : "none", outlineOffset: -2 }}>
            {!x.used && !sel[x.id] && <span className="chip-coin" style={{ position: "absolute", top: 8, left: 8, padding: "2px 7px" }}>Unused</span>}
            {x.kind === "Videos" && <span className="pill t12" style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.5)", border: "none", color: "#fff" }}><Icon n="play" s={11} /></span>}
            {sel[x.id] && (
              <span className="feature-ic" style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, background: "var(--blue)" }}>
                <Icon n="check" s={13} c="#04122a" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
