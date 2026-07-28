"use client";
import { useAppStore } from "@fanation/core";
import { Icon, ToastStack } from "@fanation/ui";

/** Applies data-theme from the store and hosts the global toast stack. */
export function ThemeBody({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const toasts = useAppStore((s) => s.toasts);
  return (
    <body data-theme={theme}>
      {children}
      <ToastStack list={toasts} />
    </body>
  );
}

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  return (
    <button className="btn btn-ghost btn-sm" title="Toggle light / dark"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Icon n={theme === "dark" ? "sun" : "moon"} s={16} />
    </button>
  );
}
