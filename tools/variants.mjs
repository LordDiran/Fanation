/**
 * Cut every photograph down to the sizes it is actually painted at.
 *
 *   node tools/variants.mjs          # write anything missing
 *   node tools/variants.mjs --check  # verify the ladder is complete, write nothing
 *   node tools/variants.mjs --force  # re-encode even where the file exists
 *
 * The app ships one file per photograph and paints it into boxes between 30 and
 * 602 CSS pixels. `tools/boxes.mjs` measured that; `tools/perfaudit.mjs` priced
 * it — 17.9x the pixels on the client's sign-in screen, 90.8x on the landing
 * page. A `srcset` is the fix, and a `srcset` needs files to point at.
 *
 * Generated ahead of the build rather than during it. There is no root
 * package.json here — client, admin and landing are three siblings — so a build
 * step means adding sharp and a Vite plugin to each of them and making all three
 * install and run it on Vercel. The repo already carries eight megabytes of
 * demo imagery; carrying the rungs beside the originals is the smaller change,
 * and it keeps the deploy exactly as fast and exactly as boring as it is today.
 *
 * The rungs come from the measured boxes, doubled for retina, and stop at the
 * intrinsic width — nothing is ever upscaled:
 *
 *   m/  1100x734   320 560 800    boxes 177-602; 800 covers 364 and 602 at 2x
 *   a/   320x320   112 208        boxes 30-104;  112 covers 52 at 2x, 208 covers 104
 *   c/  1500x500   480 960        boxes 390 and 1192; 960 covers 390 at 2x
 *   r/   720x1280  400            boxes ~390 mobile; the desktop stage upscales already
 *
 * `r/` interleaves sixteen mp4 clips with its sixteen stills, so the walk filters
 * on extension. Reading the first entry of that directory and handing it to sharp
 * is how this was first written, and `aisha.mp4` is not an image.
 *
 * A rung is `music-1.320.webp`, not `music-1-320.webp`. The obvious hyphen form
 * is unusable here: every photograph in `m/` is already `<category>-<n>.webp`, so
 * a rung marker of `-<digits>.webp` matches all eighty originals and the walk
 * skips the entire directory as though it had generated it. It did exactly that
 * on the first run. A dot cannot collide — no source file has one before its
 * extension — and it reads as what it is, a width sitting between the name and
 * the format.
 *
 * --check exists because a `srcset` fails hard. A `w`-descriptor candidate that
 * 404s does not fall back to another rung — the <img> fires onerror and paints
 * nothing at all. So the ladder has to be provably complete before it ships,
 * and "provably" means every source file crossed with every rung, not a spot
 * check of the directory listing.
 */

import { createRequire } from "node:module";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)(
  "/home/claude/.npm-global/lib/node_modules/sharp",
);

/* Quality 78 is where the m/ originals already sit, and effort 5 is the point
   past which another second per file buys under a percent. Matching the source
   encoder matters more than either: a rung encoded harder than its original
   would be visibly different at the moment a resize crosses a breakpoint. */
const ENC = { quality: 78, effort: 5 };

const LADDERS = [
  { root: "client/public/img", dir: "a", widths: [112, 208] },
  { root: "client/public/img", dir: "c", widths: [480, 960] },
  { root: "client/public/img", dir: "m", widths: [320, 560, 800] },
  { root: "client/public/img", dir: "r", widths: [400] },
  { root: "admin/public/img", dir: "a", widths: [112, 208] },
];

const CHECK = process.argv.includes("--check");
const FORCE = process.argv.includes("--force");

/** A rung is `<base>.<width>.webp`. See the note above on why not a hyphen. */
const isRung = (f) => /\.\d+\.webp$/.test(f);
const rungPath = (dir, file, w) => join(dir, file.replace(/\.webp$/, `.${w}.webp`));

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

let made = 0;
let skipped = 0;
let missing = 0;
let bytesAdded = 0;
let bytesOriginal = 0;

for (const { root, dir, widths } of LADDERS) {
  const abs = join(root, dir);
  const sources = readdirSync(abs)
    .filter((f) => f.endsWith(".webp") && !isRung(f))
    .sort();

  let dirAdded = 0;
  let dirOriginal = 0;
  let dirMade = 0;

  for (const file of sources) {
    const src = join(abs, file);
    dirOriginal += statSync(src).size;

    const meta = await sharp(src).metadata();
    for (const w of widths) {
      /* Never upscale. A rung wider than the source would be a bigger file
         carrying no more detail, and the browser would pick it on a retina
         screen and pay for the privilege. */
      if (w >= meta.width) continue;

      const out = rungPath(abs, file, w);
      if (existsSync(out) && !FORCE) {
        skipped++;
        dirAdded += statSync(out).size;
        continue;
      }
      if (CHECK) {
        console.log(`  ✗ missing  ${out}`);
        missing++;
        continue;
      }
      await sharp(src).resize({ width: w }).webp(ENC).toFile(out);
      made++;
      dirMade++;
      dirAdded += statSync(out).size;
    }
  }

  bytesAdded += dirAdded;
  bytesOriginal += dirOriginal;
  console.log(
    `  ${root}/${dir}  ${String(sources.length).padStart(3)} source(s)` +
      `  ${kb(dirOriginal).padStart(10)} original` +
      `  → ${kb(dirAdded).padStart(10)} in rungs` +
      (dirMade ? `  (${dirMade} written)` : ""),
  );
}

console.log(
  `\n  ${made} written · ${skipped} already present · ${missing} missing\n` +
    `  originals ${kb(bytesOriginal)} · rungs ${kb(bytesAdded)}\n`,
);

if (CHECK && missing) process.exit(1);
