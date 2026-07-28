# Fanation brand assets

Everything here is generated or hand-composed from one geometry source and one palette
source. Nothing is a binary you cannot reproduce. If an asset needs to change, change
the source and re-run the script — do not edit an output by hand, because the next run
will overwrite it.

---

## 1. Where the mark came from

The supplied master is `StitchFanation_Logo_v2` — a 1024 × 1024 PNG, blue glyph on a
dark tile. It ships alongside a vector export, and that export is a **polygon trace**:
every curve in the mark is approximated by short straight segments. At 34 px in a nav
bar you cannot see it. At 512 px in an app icon you can, and 512 px is exactly where a
favicon, an Apple touch icon and an Open Graph card live.

So the mark in `mark.svg` is a **re-trace** of the 1024 px master using cubic Béziers,
fitted against a sub-pixel alpha map rather than a hard bitmask.

| | Polygon export (supplied) | Bézier re-trace (shipped) |
|---|---|---|
| Intersection-over-union vs master | 94.91 % | **99.12 %** |
| Segments | ~1,100 straight | **98 curves** |
| Path bytes | ~13 KB | **4.3 KB** |
| Mean edge error at 1024 px | visible stair-step | well under 0.5 px |

Two things about `StitchFanation_Logo` (version 1, no `_v2`): it draws the mark in
**#5D2BDA on #23262B** — a purple that predates the current palette. It is superseded.
**If you find a purple Fanation mark anywhere in this repo or in a deck, it is v1 and it
is wrong.** Use `mark.svg`.

The wordmark in the 1024 px master is a rounded geometric sans with a single-storey
'a'. That is **not** what ships. Fanation's wordmark is **Inter Black (900) at
−0.01em tracking**, matching the live landing header. See §5.

---

## 2. Coordinate space

Paths are in the master's own **400 × 400 artboard space**, so they drop straight into
the inline copies already living in `apps/landing`. Do not renumber them.

Glyph bounding box: `x 113.73 → 287.06`, `y 57.44 → 259.89`. Centre **(200.40, 158.67)**.

The mark is a **monoline** — a constant 15.625-unit stroke, round caps, round joins.
Confirmed by distance transform on the master: the half-width clamps to exactly 20 px
at 1024, i.e. 7.8125 units here. Anything drawn beside the mark — an outline icon, a
rule, a divider — should respect that weight rather than pick its own.

### The two crops, and why there are exactly two

For a fill fraction *f*, the square viewBox side is `202.45 / f`, centred on the glyph.

| Export | viewBox | Height fill | Use it when |
|---|---|---|---|
| `MARK_VIEWBOX` | `68 27 264 264` | 76.7 % | **The corner is ours to draw.** Nav lockups, `icon.svg`, `favicon.ico`, the OG tile. |
| `MARK_VIEWBOX_SAFE` | `48 7 304 304` | 66.6 % | **The platform masks the corner itself.** Apple touch icon, and anything else delivered full-bleed and rounded downstream. |

iOS is the case that forces the second one. An Apple touch icon is handed over as an
opaque square and rounded by the OS at a radius Apple has changed three times, so the
glyph has to survive the worst of them. There is no third crop and there should not be:
a tighter small-size variant buys at most 1.23 px of favicon stroke instead of 0.95 px,
which is not worth a coordinate set to keep in sync.

Corner radius everywhere is **9/34 of the tile edge**, taken from the landing header
(9 px on a 34 px tile). It is exported as `MARK_RADIUS_RATIO`.

---

## 3. The files

| File | Size | What it is |
|---|---|---|
| `mark.svg` | 4.6 KB | **Canonical geometry.** Glyph only, no tile, `#2599F6`. Every generated icon is derived from this file at run time. |
| `mark-tile.svg` | 4.7 KB | Same paths, plus the `#0C1121` tile and its 9/34 radius. For decks, README badges, anywhere that wants one self-contained square. |
| `lockup.svg` | 9.5 KB | Horizontal lockup — tile, gap, wordmark — `441.43 × 120`. Wordmark is **outlined**, not `<text>`. |
| `og-brand.svg` | 55 KB | The 1200 × 630 Open Graph card, source form. All text outlined. |

Generated from those and committed into the apps (11 files, 179 KB):

```
apps/landing/app/   icon.svg  favicon.ico  apple-icon.png  opengraph-image.png
apps/web/app/       icon.svg  favicon.ico  apple-icon.png  opengraph-image.png
apps/admin/app/     icon.svg  favicon.ico  apple-icon.png
```

`apps/admin` gets no OG card on purpose — its layout sets `robots: { index: false,
follow: false }`, so nothing will ever unfurl a link to it.

Next 15 picks all four names up from an `app/` directory **by file convention** and
emits the `<link>` and `<meta>` tags itself. **Do not also add an `icons:` key to a
`metadata` export** — that overrides the convention and leaves you maintaining both.

`favicon.ico` carries 16 / 32 / 48 px as PNG-in-ICO (valid since Vista, read by every
browser in use). Each size is rendered at 4× and Lanczos-downsampled, because a 7.7 %
monoline stroke lands at **0.95 px** at 16 px and needs the resampling to stay legible.
32 and 48 read cleanly; 16 is tight but holds.

---

## 4. Colour

Never type a hex into an asset. The three that appear here are:

| Role | Hex | Token |
|---|---|---|
| Glyph | `#2599F6` | `BRAND.blue` |
| Tile | `#0C1121` | `BRAND.surface` |
| Wordmark on dark | `#F6F8FC` | `BRAND.text` |

On a light background the wordmark wants `#0C1220` (`LIGHT.text`). The glyph and tile
do not change — the tile is what gives the mark its contrast, and dropping it puts a
mid-blue monoline on white, which fails at small sizes.

Full palette and its rationale: `../src/tokens.ts`. CSS mirror: `../src/tokens.css`.
Those two are one list rendered twice — change both together.

---

## 5. Why the text in these files is outlined

`lockup.svg` and `og-brand.svg` carry their text as `<path>` outlines, never `<text>`.

They have to render in places that have **no fonts at all**: sharp/librsvg during icon
generation, mail-client link previews, OS thumbnailers, Slack and iMessage unfurlers.
A `<text>` element there falls back to whatever the renderer has, or to nothing.

The alternative — routing the OG card through headless Chromium — would make Playwright
a repo-level build requirement and the output non-deterministic. Outlining gives one
toolchain (`sharp`), byte-reproducible output, and source you can diff in git.

**In the product, the wordmark stays live text.** `FanationLogo` renders a `<span>` at
`fontWeight: 900, letterSpacing: -0.01em, fontFamily: inherit`, and both apps load Inter
through `next/font`. Live text and outlines draw the same thing: **Inter Black 900,
−0.01em**. Shaped with HarfBuzz — the same shaper a browser uses — from Inter v4's Black
latin subset, `unitsPerEm` 2048, `kern` and `liga` on.

The OG card deliberately carries **no domain line**. No custom domain is configured
anywhere in this repo — only `.vercel.app` hosts. Printing a domain we may not own would
be a factual error on a public asset; printing a `.vercel.app` URL would look unfinished.
When a real domain exists it is a one-line addition at `y ≈ 570`.

---

## 6. Regenerating

### Icons and the OG card

Requires `sharp`, already a devDependency of this package.

```bash
pnpm --filter @fanation/brand icons          # all three apps
node packages/brand/scripts/generate-icons.mjs web admin   # or just these
```

The script reads the two `<path d="…">` out of `mark.svg` and **throws if it does not
find exactly two**. That is the mechanism that stops the icons drifting away from the
mark — no coordinate is retyped in the script.

Nothing in the build calls it. Run it only when the mark, the tile colour, or the OG
card changes, then commit the outputs.

### Re-outlining text (new copy on the OG card, or a new lockup)

One-time setup — none of this is a repo dependency, it is a local toolchain:

```bash
pip install fonttools uharfbuzz --break-system-packages
curl -sL https://registry.npmjs.org/@fontsource/inter/-/inter-5.3.0.tgz | tar xz -C /tmp
# → /tmp/package/files/inter-latin-{400,500,700,800,900}-normal.woff
```

Use the **`.woff`** files, not `.woff2`: woff2 is Brotli-compressed and fontTools cannot
open it without the `brotli` package. woff is zlib and opens natively.

```bash
python3 packages/brand/scripts/outline-text.py "Turn Followers Into Fans." \
  --weight 800 --size 76
```

It prints the path `d`, the advance width, the ink bounds and the cap height. Drop the
path into the SVG at the baseline you want and check the advance still clears the
1200 − 160 margins.

Weights and sizes currently in use:

| Where | String | Weight | Size | Tracking |
|---|---|---|---|---|
| Wordmark (`src/wordmark.ts`, `lockup.svg`) | `Fanation` | 900 | 100 (scale to taste) | −0.01em |
| OG headline, both lines | `Turn Followers Into Fans.` / `Turn Fans Into Income.` | 800 | 76 | −0.01em |
| OG subline | `Subscriptions · Pay-per-view · Live gifting · Direct messaging` | 500 | 26 | 0 |

Running `outline-text.py "Fanation" --weight 900 --size 100` reproduces the path
committed in `src/wordmark.ts` **byte for byte**. That is the regression test — if it
ever stops matching, the font version moved.

---

## 7. Rules

1. **`mark.svg` is the only place mark geometry lives.** Code imports `MARK_PATHS`;
   scripts read the file. Nobody retypes coordinates.
2. **Two crops, no more.** `MARK_VIEWBOX` when we draw the corner, `MARK_VIEWBOX_SAFE`
   when the platform draws it.
3. **No hex literals in assets.** Everything traces back to `src/tokens.ts`.
4. **Don't hand-edit generated files.** `apps/*/app/icon.svg`, `favicon.ico`,
   `apple-icon.png` and `opengraph-image.png` are outputs. Change the source, re-run.
5. **Static assets outline their text. The product does not.** §5.
6. **`apps/landing` takes no code dependency on this package.** It receives icon and OG
   files — pure additions — and keeps its own inline hex, which already matches. A code
   dependency would make every brand tweak redeploy the live marketing site.
