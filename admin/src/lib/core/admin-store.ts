import type { CSSProperties } from "react";
import { create } from "zustand";
import { ADM_KYC, ADM_PAY, ADM_REPORTS, ADM_USERS } from "./data";
import { readStoredTheme, writeStoredTheme } from "./theme-storage";
import type { AdminPayout, AdminUser, AuditEntry, ConfirmCfg, KycApp, ModReport, ToastMsg } from "./types";

/**
 * Admin console store. Every action is reason-gated where destructive and
 * appended to the audit log. BACKEND SEAM: one action = one endpoint;
 * the audit write happens server-side in production.
 */

let _seq = 100;
const uid = () => ++_seq;

export interface AdminState {
  authed: boolean;
  theme: "dark" | "light";
  users: AdminUser[];
  kyc: KycApp[];
  pay: AdminPayout[];
  reps: ModReport[];
  flags: Record<number, string | undefined>;
  featured: Record<string, boolean>;
  frozen: Record<string, boolean>;
  audit: AuditEntry[];
  toasts: ToastMsg[];
  confirm: ConfirmCfg | null;

  setAuthed(v: boolean): void;
  setTheme(t: "dark" | "light"): void;
  toast(msg: string, tone?: "ok" | "err" | ""): void;
  ask(cfg: ConfirmCfg): void;
  closeConfirm(): void;
  log(act: string, cat: string, why?: string): void;
  setUserSt(id: number, st: string): void;
  setUserStByHandle(h: string, st: string): void;
  warn(id: number): void;
  kycSet(id: number, st: string): void;
  paySet(id: number, st: string): void;
  repSet(id: number, st: string, outcome?: string): void;
  flagTx(i: number): void;
  refundTx(i: number): void;
  toggleFeature(h: string): void;
  toggleFreeze(h: string): void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  authed: false,
  /* Read at module evaluation, which happens after the pre-paint script in
     `index.html` has already put the same value on `<body>`. Both read the same
     key, so React mounts agreeing with what is on screen instead of correcting
     it. Everything else in this store is session state and stays in memory. */
  theme: readStoredTheme(),
  users: ADM_USERS,
  kyc: ADM_KYC,
  pay: ADM_PAY,
  reps: ADM_REPORTS,
  flags: {},
  featured: { sofiaa: true },
  frozen: {},
  audit: [
    { time: "10m ago", who: "admin@fanation.app", act: "Suspended @baduser · 7 days", cat: "Users", why: "Harassment — 12 reports" },
    { time: "25m ago", who: "finance@fanation.app", act: "Approved payout $15,240", cat: "Finance", why: "Co-signed · threshold cleared" },
    { time: "1h ago", who: "admin@fanation.app", act: "Removed violating content", cat: "Moderation", why: "Nudity policy" },
    { time: "2h ago", who: "tns@fanation.app", act: "Closed report #2847", cat: "Moderation", why: "Duplicate of #2846" },
    { time: "5h ago", who: "admin@fanation.app", act: "Approved KYC @lenaart", cat: "KYC", why: "Docs verified via Didit" },
  ],
  toasts: [],
  confirm: null,

  setAuthed: (v) => set({ authed: v }),
  /* Write first, then set. Only an explicit choice is ever stored — an operator
     who never touches the toggle leaves no key behind, so the default stays
     changeable without stranding anyone on a value they never picked. */
  setTheme: (t) => {
    writeStoredTheme(t);
    set({ theme: t });
  },

  toast: (msg, tone = "") => {
    const id = uid();
    set((s) => ({ toasts: [...s.toasts, { id, msg, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 3400);
  },

  ask: (cfg) => set({ confirm: cfg }),
  closeConfirm: () => set({ confirm: null }),

  log: (act, cat, why = "—") =>
    set((s) => ({ audit: [{ time: "Just now", who: "admin@fanation.app", act, cat, why }, ...s.audit] })),

  setUserSt: (id, st) => set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, st } : u)) })),
  setUserStByHandle: (h, st) => set((s) => ({ users: s.users.map((u) => (u.h === h ? { ...u, st } : u)) })),

  // 3 strikes auto-flags the account for review
  warn: (id) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id ? { ...u, strikes: u.strikes + 1, st: u.strikes + 1 >= 3 ? "Under review" : u.st } : u,
      ),
    })),

  kycSet: (id, st) => set((s) => ({ kyc: s.kyc.map((x) => (x.id === id ? { ...x, st } : x)) })),
  paySet: (id, st) => set((s) => ({ pay: s.pay.map((x) => (x.id === id ? { ...x, st } : x)) })),
  repSet: (id, st, outcome) => set((s) => ({ reps: s.reps.map((x) => (x.id === id ? { ...x, st, outcome } : x)) })),

  flagTx: (i) => set((s) => ({ flags: { ...s.flags, [i]: s.flags[i] === "Flagged" ? undefined : "Flagged" } })),
  refundTx: (i) => set((s) => ({ flags: { ...s.flags, [i]: "Refunded" } })),

  toggleFeature: (h) => set((s) => ({ featured: { ...s.featured, [h]: !s.featured[h] } })),
  toggleFreeze: (h) => set((s) => ({ frozen: { ...s.frozen, [h]: !s.frozen[h] } })),
}));

export const stChipStyle = (st: string): CSSProperties =>
  st === "Active" || st === "Paid" || st === "Approved"
    ? { color: "var(--mint-ink)", borderColor: "rgba(93,221,144,.3)" }
    : st === "Suspended" || st === "Banned" || st === "Rejected" || st === "Removed"
      ? { color: "var(--coral-ink)", borderColor: "rgba(243,106,70,.3)" }
      : st === "Awaiting co-sign"
        ? { color: "var(--blueL-ink)", borderColor: "rgba(37,153,246,.35)" }
        : { color: "var(--amber-ink)", borderColor: "rgba(252,164,75,.3)" };
