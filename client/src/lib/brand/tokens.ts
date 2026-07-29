/**
 * Fanation brand tokens — the canonical source of truth for colour.
 *
 * Values are taken from the live landing page, which is the palette the public has
 * already seen. That decision was not arbitrary: 13 of the 16 rgba tints already
 * hand-written into `../ui/styles.css` were derived from
 * these exact values (blue 37,153,246 · coral 243,106,70 · amber 252,164,75 ·
 * mint 93,221,144). The `--blue` / `--coral` / `--mint` / `--amber` variables in
 * that file were the outliers, not the tints.
 *
 * The supplied brand assets agree. `StitchFanation_Logo_v2` draws the mark in
 * #2599F6 on #0C1121 — this blue, on this surface. (Version 1 of that export is
 * #5D2BDA on #23262B, a purple that predates the palette and is superseded. If you
 * find a purple Fanation mark anywhere, it is v1 and it is wrong.)
 *
 * This file and `tokens.css` are two renderings of one list. Change both together.
 *
 * The landing project deliberately does NOT read this file. It keeps its own inline
 * hex, which already matches these values. Wiring it up would make every brand tweak
 * force a rebuild and redeploy of the live marketing site, and that trade is not
 * worth it — the landing site is the one surface that ships on its own cadence.
 */

export const BRAND = {
  /** Primary. The logo mark is drawn in this. */
  blue: "#2599F6",
  blueD: "#1A80D8",
  blueL: "#60B8FA",

  /** Secondary. Pairs with blue in the brand gradient. */
  coral: "#F36A46",
  coralL: "#F79A7E",

  /** Positive — earnings, payouts cleared, upward movement. */
  mint: "#5DDD90",
  /** Coins, tips, anything with a value attached. */
  amber: "#FCA44B",
  /** Destructive and live-broadcast states only. */
  red: "#EF4444",

  /** Deepest surface. Page background in dark. */
  navy: "#07091A",
  /** Raised surface. The logo tile sits on this. */
  surface: "#0C1121",
  /** Card. */
  card: "#111830",
  /** Card raised — modals, drawers, menus. */
  card2: "#18223C",

  /** Body text on dark. */
  text: "#F6F8FC",
  /** Secondary text on dark. The most-used colour on the landing page (43 uses). */
  muted: "#7A8FB8",
} as const;

export type BrandColor = keyof typeof BRAND;

/** Coral → blue, left to right. Used for progress fills and emphasis surfaces. */
export const GRADIENT = `linear-gradient(90deg, ${BRAND.coral} 0%, ${BRAND.blue} 100%)`;

/** Light-theme surface and text values. Dark is the default; light is opt-in via `[data-theme=light]`. */
export const LIGHT = {
  bg: "#F3F5FA",
  bg2: "#E9EEF6",
  card: "#FFFFFF",
  text: "#0C1220",
  muted: "#5A6579",
} as const;

/** Corner radii, in px. */
export const RADIUS = { card: 16, modal: 22, pill: 999 } as const;

/**
 * Tile corner radius as a fraction of tile edge length.
 * Derived from the landing lockup: 9px radius on a 34px tile.
 */
export const MARK_RADIUS_RATIO = 9 / 34;
