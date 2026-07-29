/**
 * `@fanation/brand` — the one place colour and the logo are defined.
 *
 * Import tokens from here in TS/TSX. For CSS, import `@fanation/brand/src/tokens.css`
 * (`@fanation/ui/src/styles.css` already does, so both apps get it for free).
 *
 * Deliberately NOT depended on by `apps/landing`: see the note in `tokens.ts`.
 */

export { BRAND, GRADIENT, LIGHT, RADIUS, MARK_RADIUS_RATIO } from "./tokens";
export type { BrandColor } from "./tokens";

export { MARK_PATHS, MARK_VIEWBOX, MARK_VIEWBOX_SAFE, MARK_BBOX, MARK_STROKE } from "./mark";

export {
  WORDMARK_PATH,
  WORDMARK_EM,
  WORDMARK_ADVANCE,
  WORDMARK_CAP_HEIGHT,
  WORDMARK_INK,
} from "./wordmark";

export { FanationMark, FanationLogo } from "./logo";
export type { FanationMarkProps, FanationLogoProps } from "./logo";

/**
 * The photography tables. Generated — see `assets/build.mjs`.
 *
 * They live in brand because the curation is a brand decision: which face is
 * attached to which name, which photographs a creator's work is allowed to be.
 * The *resolvers* that turn a post into a picture live in `@fanation/ui`,
 * because that is what both apps actually depend on.
 */
export * from "./media";
