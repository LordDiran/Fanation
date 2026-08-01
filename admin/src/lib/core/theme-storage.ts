/**
 * Theme persistence — the one piece of console state that outlives the tab.
 *
 * Stored as a bare string rather than through zustand's `persist` middleware,
 * and the reason is `index.html`. The pre-paint script there has to read the
 * same value before any bundle has loaded, and a bare string is something four
 * lines of inline script can read correctly and go on reading correctly. A JSON
 * envelope owned by a library is not: it couples the HTML to zustand's
 * serialisation format, and the failure mode when that format moves is silent.
 * The script reads undefined, falls through to dark, and light users get a
 * flash on every load with nothing in the console to explain it.
 *
 * The key is namespaced away from the client app's. Both are separate origins
 * in production so their storage never meets, but the console is a different
 * product with a different session, and an operator choosing light here should
 * not be choosing it for their own fan account.
 *
 * KEEP IN SYNC: `THEME_KEY` and the key in `index.html` are the same string in
 * two places, as are the two `THEME_COLOR` hexes. Nothing can share them — the
 * script has to run before any module does.
 */

export type Theme = "dark" | "light";

export const THEME_KEY = "fanation.admin.theme";

/**
 * What an operator who has never touched the toggle gets.
 *
 * Deliberately a constant rather than the OS preference. Dark is the palette
 * this console shipped with and the one every existing operator is already
 * looking at; having light appear on its own would be a visible change to
 * people who never asked for one. To follow the OS instead, this becomes
 *
 *     matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
 *
 * and the same expression goes into the pre-paint script in `index.html`.
 * Nothing else moves.
 */
export const DEFAULT_THEME: Theme = "dark";

/**
 * `theme-color` drives the browser chrome on mobile. Leaving it at the dark
 * navy while the page renders light makes the status bar look like a rendering
 * fault on iOS, which is the sort of thing that gets reported as "light mode is
 * broken". These two must equal `--bg` for each palette in `tokens.css`.
 */
export const THEME_COLOR = { dark: "#07091A", light: "#F3F5FA" } as const;

const isTheme = (v: unknown): v is Theme => v === "dark" || v === "light";

/**
 * Storage access throws rather than returning null in a few real situations —
 * Safari private browsing historically, and any browser where the person has
 * blocked site data. Both are reasons to fall back to the default; neither is a
 * reason to take the console down. A hand-edited or half-written value falls
 * back the same way, which is why this validates rather than casting.
 */
export function readStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return isTheme(raw) ? raw : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function writeStoredTheme(t: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* Quota, or storage blocked. The choice still applies for this session, it
       just will not survive the reload. Staying silent is correct: there is
       nothing the operator could do about it, and nothing they asked for has
       visibly failed. */
  }
}

/**
 * `tokens.css` keys its light palette off `[data-theme="light"]` on `<body>`,
 * so that attribute is the switch. The meta tag rides along with it.
 */
export function applyTheme(t: Theme): void {
  document.body.setAttribute("data-theme", t);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[t]);
}

/**
 * Another tab changed the theme. Operators routinely keep the console open in
 * several tabs at once, and having them disagree about their palette after a
 * toggle is a small thing that reads as a bug. The fix is a listener rather
 * than a reload.
 *
 * `key` arrives as null when the whole store is cleared — that is a reset to
 * the default, not an event to ignore.
 */
export function subscribeToStoredTheme(onChange: (t: Theme) => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key !== null && e.key !== THEME_KEY) return;
    onChange(isTheme(e.newValue) ? e.newValue : DEFAULT_THEME);
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
