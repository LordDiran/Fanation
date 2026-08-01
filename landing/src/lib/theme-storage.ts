/**
 * Theme persistence for the marketing site.
 *
 * A near-copy of `client/src/lib/core/theme-storage.ts`, and deliberately not
 * an import of it: the landing site is its own package with its own deploy, and
 * a shared module would tie a marketing rebuild to a product release. The two
 * files are expected to stay similar; they are not required to.
 *
 * The storage key is NOT the product's. A visitor reading the marketing site is
 * not necessarily the same person as the signed-in user on the same machine,
 * the two properties sit on different subdomains in production anyway, and
 * sharing a key would mean a preference set on one silently rewrote the other.
 */
export type Theme = 'dark' | 'light'

export const THEME_KEY = 'fanation.landing.theme'
export const DEFAULT_THEME: Theme = 'dark'

/** Kept in step with the `<meta name="theme-color">` swap in `index.html`. */
export const THEME_COLOR = { dark: '#07091A', light: '#F3F5FA' } as const

const isTheme = (v: unknown): v is Theme => v === 'dark' || v === 'light'

export function readStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    return isTheme(raw) ? raw : DEFAULT_THEME
  } catch {
    // Storage blocked (private mode, third-party cookie policy). Default holds.
    return DEFAULT_THEME
  }
}

export function writeStoredTheme(t: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, t)
  } catch {
    // Quota or blocked. The choice still applies for this page view.
  }
}

export function applyTheme(t: Theme): void {
  document.body.setAttribute('data-theme', t)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLOR[t])
}

/**
 * Follow the choice across tabs. A `null` key means the whole store was
 * cleared, which counts as a reset to the default rather than something to
 * ignore.
 */
export function subscribeToStoredTheme(onChange: (t: Theme) => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key !== null && e.key !== THEME_KEY) return
    onChange(isTheme(e.newValue) ? e.newValue : DEFAULT_THEME)
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
