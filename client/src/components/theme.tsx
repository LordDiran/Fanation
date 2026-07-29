import { useEffect } from "react";
import { useAppStore } from "@/lib/core";
import { Icon, ToastStack } from "@/lib/ui";

/**
 * Theme + toast host. `<body>` is owned by `index.html`, not by React, so the
 * theme is written onto it as an attribute rather than rendered as a prop —
 * `tokens.css` keys its light palette off `[data-theme="light"]`, which matches
 * on `<body>` exactly as it did before.
 *
 * Mounted once at the top of the route tree so a toast raised on any page
 * survives the navigation that follows it.
 */
export function ThemeChrome() {
  const theme = useAppStore((s) => s.theme);
  const toasts = useAppStore((s) => s.toasts);
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);
  return <ToastStack list={toasts} />;
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
