import { useEffect, useState } from "react";
import { applyTheme, subscribeToStoredTheme, useAdminStore } from "@/lib/core";
import type { ConfirmCfg } from "@/lib/core";
import { Icon, ToastStack } from "@/lib/ui";

/**
 * Theme, toasts and the governance confirm dialog. `<body>` is owned by
 * `index.html`, not by React, so the theme is written onto it as an attribute —
 * `tokens.css` keys its light palette off `[data-theme="light"]`, which matches
 * on `<body>` exactly as it did before.
 *
 * React is not first to write that attribute any more. The pre-paint script in
 * `index.html` sets it from storage before this component exists, and the store
 * initialises from the same key, so the effect below is a no-op on load and
 * only does real work once someone touches the toggle. That ordering is the
 * whole point: an operator on light must never watch the console arrive dark.
 *
 * Mounted once at the top of the route tree: a confirm opened on /payouts must
 * not be unmounted by the navigation it triggers.
 */
export function AdminChrome() {
  const theme = useAdminStore((s) => s.theme);
  const toasts = useAdminStore((s) => s.toasts);
  const confirm = useAdminStore((s) => s.confirm);
  const close = useAdminStore((s) => s.closeConfirm);
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  /* Sets state only — writing back would be re-storing a value the tab that
     raised the event has already stored. */
  useEffect(() => subscribeToStoredTheme((t) => useAdminStore.setState({ theme: t })), []);
  return (
    <>
      <ToastStack list={toasts} />
      {confirm && <ConfirmModal cfg={confirm} close={close} />}
    </>
  );
}

export function AdminThemeToggle() {
  const theme = useAdminStore((s) => s.theme);
  const setTheme = useAdminStore((s) => s.setTheme);
  return (
    <button className="btn btn-ghost btn-sm" title="Toggle light / dark"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Icon n={theme === "dark" ? "sun" : "moon"} s={16} />
    </button>
  );
}

/**
 * The same control, placed for the one screen that renders outside the shell.
 *
 * `/login` sits outside `AdminLayout` — nesting it would loop, because the
 * shell redirects anyone unauthenticated back to `/login` — so the topbar and
 * its toggle do not exist there. An operator who prefers light had no way to
 * reach it until after they had signed in.
 *
 * A wrapper rather than a variant of `AdminThemeToggle`, so the button stays
 * one component: same icon, same title, same store call. `verify-theme.mjs`
 * matches signed-in and signed-out on the same `button[title]`, and the two can
 * never disagree about what the control does. The positioning lives entirely in
 * `.authtoggle`.
 */
export function AdminAuthThemeToggle() {
  return <div className="authtoggle"><AdminThemeToggle /></div>;
}

/** Governance confirm — reason-gated, duration picker, type-to-confirm for irreversible actions. */
function ConfirmModal({ cfg, close }: { cfg: ConfirmCfg; close: () => void }) {
  const [ri, setRi] = useState<number | null>(null);
  const [di, setDi] = useState(0);
  const [note, setNote] = useState("");
  const [typed, setTyped] = useState("");
  const okReason = !cfg.requireReason || ri != null;
  const okType = !cfg.confirmText || typed.trim() === cfg.confirmText;
  const ok = okReason && okType;
  const go = () => {
    if (!ok) return;
    const why = (cfg.reasons && ri != null ? cfg.reasons[ri] : "") + (note ? (ri != null ? " — " : "") + note : "");
    cfg.onGo(why || "—", cfg.durations ? cfg.durations[di] : undefined);
    close();
  };
  return (
    <div className="overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="b7 t20" style={{ marginBottom: 6 }}>{cfg.title}</div>
        <div className="muted t13" style={{ marginBottom: 14 }}>{cfg.desc}</div>
        {cfg.reasons && (
          <>
            <label className="label">Reason {cfg.requireReason && <span className="coral">* required</span>}</label>
            <div className="col gap6" style={{ marginBottom: 12, maxHeight: 220, overflowY: "auto" }}>
              {cfg.reasons.map((r, i) => (
                <label key={i} className="row gap10 hair t13 b6" onClick={() => setRi(i)}
                  style={{ padding: "9px 12px", borderRadius: 10, cursor: "pointer", borderColor: ri === i ? (cfg.tone === "danger" ? "var(--coral)" : "var(--blue)") : "var(--line)" }}>
                  <input type="radio" checked={ri === i} onChange={() => setRi(i)} />{r}
                </label>
              ))}
            </div>
          </>
        )}
        {cfg.durations && (
          <>
            <label className="label">Duration</label>
            <div className="row gap8 wrap" style={{ marginBottom: 12 }}>
              {cfg.durations.map((d, i) => (
                <span key={i} className={"tag" + (di === i ? " on" : "")} style={{ cursor: "pointer" }} onClick={() => setDi(i)}>{d}</span>
              ))}
            </div>
          </>
        )}
        <textarea className="input" rows={2} placeholder="Internal note (optional — recorded in the audit log)" value={note}
          onChange={(e) => setNote(e.target.value)} style={{ resize: "none", marginBottom: 12 }} />
        {cfg.confirmText && (
          <>
            <label className="label">Type <b style={{ color: "var(--coral-ink)" }}>{cfg.confirmText}</b> to confirm — this is irreversible</label>
            <input className="input" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={cfg.confirmText} style={{ marginBottom: 12 }} />
          </>
        )}
        <div className="row gap10">
          <button className="btn btn-ghost grow" onClick={close}>Cancel</button>
          <button className="btn grow" disabled={!ok} onClick={go}
            style={{ background: cfg.tone === "danger" ? "var(--red)" : "var(--blue)", color: cfg.tone === "danger" ? "#fff" : "#04122a" }}>
            {cfg.verb}
          </button>
        </div>
        <div className="row center muted2 t12 gap6" style={{ marginTop: 10 }}>
          <Icon n="shield" s={12} /> Every action is written to the audit log
        </div>
      </div>
    </div>
  );
}
