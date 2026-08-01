import { useEffect } from "react";
import { applyTheme, subscribeToStoredTheme, useAppStore } from "@/lib/core";
import { Icon, ToastStack } from "@/lib/ui";

/**
 * Theme + toast host. `<body>` is owned by `index.html`, not by React, so the
 * theme is written onto it as an attribute rather than rendered as a prop —
 * `tokens.css` keys its light palette off `[data-theme="light"]`, which matches
 * on `<body>` exactly as it did before.
 *
 * React is not first to write that attribute any more. The pre-paint script in
 * `index.html` sets it from storage before this component exists, and the store
 * initialises from the same key, so the effect below is a no-op on load and
 * only does real work once someone touches the toggle. That ordering is the
 * whole point: a light user must never watch the page arrive dark.
 *
 * Mounted once at the top of the route tree so a toast raised on any page
 * survives the navigation that follows it.
 */
export function ThemeChrome() {
  const theme = useAppStore((s) => s.theme);
  const toasts = useAppStore((s) => s.toasts);
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  /* Sets state only — writing back would be re-storing a value the tab that
     raised the event has already stored. */
  useEffect(() => subscribeToStoredTheme((t) => useAppStore.setState({ theme: t })), []);
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
