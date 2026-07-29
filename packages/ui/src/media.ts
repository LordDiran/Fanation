/**
 * Picture resolvers.
 *
 * `@fanation/brand` owns *which* photographs exist and who they belong to.
 * This file owns the question the apps actually ask: given a post, a handle or
 * a bare name, which file do I paint? It lives in `@fanation/ui` because that
 * is the package both apps depend on — neither `apps/web` nor `apps/admin`
 * lists `@fanation/brand` as a dependency, and adding it in two more places to
 * reach a lookup table would be the wrong trade.
 *
 * Everything here is deterministic. The same post resolves to the same
 * photograph on the server, on the client, and on a reload — otherwise the
 * markup React streams and the markup React hydrates would disagree.
 */

import { fhash, SEED_FEED } from "@fanation/core";
import type { Post } from "@fanation/core";
import {
  AVATARS,
  FALLBACK_FACES,
  CATEGORY_MEDIA,
  CREATOR_POOLS,
  CREATOR_NAMES,
  REEL_STILLS,
  REEL_LOOPS,
  REEL_IN_POOL,
  COVERS,
  MEDIA_VIDEOS,
  EVIDENCE,
} from "@fanation/brand";

export {
  AVATARS,
  FALLBACK_FACES,
  CATEGORY_MEDIA,
  CREATOR_POOLS,
  CREATOR_NAMES,
  REEL_STILLS,
  REEL_LOOPS,
  COVERS,
  MEDIA_VIDEOS,
  EVIDENCE,
};

/** The category a creator we have never heard of gets dealt from. */
const DEFAULT_CAT = "life";

/**
 * A face for a name.
 *
 * Named people — the sixteen creators, the four commenters the seed data
 * models, and the signed-in user — have a portrait chosen for them. Everyone
 * else gets one of twenty-one stock faces, picked by hash, so the same fan in
 * the CRM keeps the same face on every render and across a reload. An empty
 * name resolves to nothing and the caller paints its initials disc instead.
 */
export function avatarFor(name?: string): string {
  if (!name) return "";
  const exact = AVATARS[name];
  if (exact) return exact;
  return FALLBACK_FACES[fhash(name) % FALLBACK_FACES.length];
}

/** A face for a handle, for the surfaces that only carry `@handle`. */
export function avatarForHandle(handle?: string): string {
  if (!handle) return "";
  const h = handle.replace(/^@/, "");
  const name = CREATOR_NAMES[h];
  return name ? avatarFor(name) : FALLBACK_FACES[fhash(h) % FALLBACK_FACES.length];
}

/** The pool a handle's work is drawn from. */
export function poolFor(handle?: string): string {
  const h = (handle || "").replace(/^@/, "");
  return CREATOR_POOLS[h] || DEFAULT_CAT;
}

/**
 * One photograph out of a category, by index. Wraps, so a caller may count
 * past the end of the pool without checking.
 */
export function mediaFor(cat: string, i = 0): string {
  const pool = CATEGORY_MEDIA[cat] || CATEGORY_MEDIA[DEFAULT_CAT];
  return pool[((i % pool.length) + pool.length) % pool.length];
}

/** A creator's 3:1 profile cover. */
export function coverFor(handle?: string): string {
  const h = (handle || "").replace(/^@/, "");
  return COVERS[h] || COVERS[Object.keys(COVERS)[fhash(h) % Object.keys(COVERS).length]];
}

/** A creator's 9:16 reel still and the loop that plays over it. */
export function reelFor(handle?: string): { still: string; loop: string } {
  const h = (handle || "").replace(/^@/, "");
  return { still: REEL_STILLS[h] || "", loop: REEL_LOOPS[h] || "" };
}

/** The motion loop behind a photograph, or "" if that frame is a still. */
export function loopFor(src: string): string {
  return MEDIA_VIDEOS[src] || "";
}

/** Every photograph that has footage behind it, in manifest order. */
export const MOTION_STILLS: string[] = Object.keys(MEDIA_VIDEOS);

/**
 * The signed-in creator's own library — the studio, the vault, the composer.
 *
 * "You" is not one of the sixteen, so there is no curated pool to draw from.
 * The studio surfaces deal from a rotation across categories instead, which is
 * both truer to a working creator's library and necessary for the geometry:
 * the vault renders five tiles to a row, and a single five-photograph pool
 * would put the same picture down every column. Six categories against five
 * photographs gives thirty distinct frames before anything repeats, and
 * consecutive tiles never share a category.
 */
const MY_CATS = ["life", "glow", "model", "trav", "art", "food"];

export function myMediaFor(i: number): string {
  const n = Math.abs(Math.floor(i));
  return mediaFor(MY_CATS[n % MY_CATS.length], Math.floor(n / MY_CATS.length));
}

/** Moderation exhibit by name. Admin only — the fan app never calls this. */
export function evidenceFor(key: string): string {
  return EVIDENCE[key] || "";
}

/**
 * The feed deal.
 *
 * Every post in `SEED_FEED` needs a photograph, and the same author owns
 * several posts. Hashing each post independently would repeat a picture inside
 * one author's run roughly as often as chance allows, which looks like a bug.
 * So the deal is done once, per author, round-robin over their category:
 * consecutive posts by the same creator always advance to the next photograph
 * in their pool and only wrap after all five are spent.
 *
 * Two constraints ride along:
 *
 *   1. A video post must land on a still that actually has a motion loop. The
 *      loops are declared in the manifest, so the video posts are dealt first,
 *      out of the author's motion-capable subset, before the image posts take
 *      what is left.
 *   2. A creator's own reel photograph is skipped, so one picture never appears
 *      twice under one name — once full-screen in reels, once again in the
 *      feed. `REEL_IN_POOL` is empty under the current manifest; the guard is
 *      here so it stays true if the curation changes.
 *
 * This runs once at module load and is pure, so the server and the client
 * arrive at the same answer.
 */
function deal(posts: Post[]): Record<string, string> {
  const out: Record<string, string> = {};
  const byAuthor: Record<string, Post[]> = {};
  for (const p of posts) (byAuthor[p.h] ||= []).push(p);

  for (const [handle, own] of Object.entries(byAuthor)) {
    const cat = poolFor(handle);
    const pool = (CATEGORY_MEDIA[cat] || CATEGORY_MEDIA[DEFAULT_CAT]).filter(
      (src) => src !== REEL_IN_POOL[handle],
    );
    const motion = pool.filter((src) => MEDIA_VIDEOS[src]);
    const stills = pool.filter((src) => !MEDIA_VIDEOS[src]);

    let mi = 0;
    let si = 0;
    for (const p of own) {
      if (p.type === "video" && motion.length) {
        out[p.id] = motion[mi++ % motion.length];
      } else if (stills.length) {
        out[p.id] = stills[si++ % stills.length];
      } else {
        out[p.id] = pool[si++ % pool.length];
      }
    }
  }
  return out;
}

/** Post id → photograph, dealt once at module load. */
export const FEED_MEDIA: Record<string, string> = deal(SEED_FEED);

/**
 * The photograph for a post.
 *
 * A post the deal knows about gets its dealt picture. A post the user just
 * created in the composer does not exist in `SEED_FEED`, so it falls back to a
 * hash of its own seed against its author's pool — which is stable for the life
 * of that post and still lands inside the right category.
 *
 * The locked and unlocked branches of a PPV post resolve here identically. That
 * is the point: unlocking must reveal the photograph the blur was hiding, not
 * swap in a different one.
 */
export function postMediaFor(p: Post): string {
  const dealt = FEED_MEDIA[p.id];
  if (dealt) return dealt;
  return mediaFor(poolFor(p.h), fhash(p.seed || p.id));
}

/** The loop for a video post, or "" if its photograph does not have one. */
export function postVideoFor(p: Post): string {
  return MEDIA_VIDEOS[postMediaFor(p)] || "";
}

/**
 * Categories that can lend a photograph to their neighbour without the grid
 * changing subject. A lifestyle creator's wall can carry a beauty frame, a
 * travel frame and a food frame and still read as one person's work; it cannot
 * carry a server rack. The relation is deliberately not symmetric-by-accident —
 * each row was chosen for what the borrowing category can absorb, not for what
 * the lender wants to give away.
 */
const NEIGHBOURS: Record<string, [string, string, string]> = {
  life: ["glow", "trav", "food"],
  stream: ["game", "tech", "music"],
  pod: ["music", "edu", "tech"],
  fit: ["life", "food", "dance"],
  edu: ["tech", "art", "pod"],
  vlog: ["trav", "life", "tech"],
  trav: ["vlog", "life", "food"],
  model: ["glow", "art", "life"],
  music: ["pod", "dance", "com"],
  com: ["music", "vlog", "dance"],
  art: ["model", "glow", "edu"],
  game: ["stream", "tech", "com"],
  glow: ["model", "life", "art"],
  tech: ["game", "edu", "stream"],
  dance: ["music", "fit", "com"],
  food: ["life", "trav", "fit"],
};

/**
 * The 21 photographs a creator's profile grid draws from, in order.
 *
 * The grid renders 18 tiles and a category holds 5, so the naive deal repeats
 * every sixth tile — three visible duplicates per wall, which is the kind of
 * thing nobody consciously notices and everybody registers as cheap. Their own
 * five lead, then their reel frame, and the remaining twelve come from three
 * neighbouring categories.
 *
 * The neighbour frames are dealt a row at a time — three columns, three
 * different categories per row — and the column each category lands in rotates
 * every row, so the wall does not stripe vertically into three themed columns.
 * 21 frames against 18 tiles means nothing repeats at all.
 *
 * Built once per handle and cached: the profile calls this eighteen times in a
 * single render and the answer cannot change between those calls.
 */
const GRID_CACHE: Record<string, string[]> = {};

function gridDeck(h: string): string[] {
  const cached = GRID_CACHE[h];
  if (cached) return cached;

  const cat = poolFor(h);
  const own = CATEGORY_MEDIA[cat] || CATEGORY_MEDIA[DEFAULT_CAT];
  /* The reel frame joins the wall, but only when it is not already on it.
     `REEL_IN_POOL` names the creators whose reel photograph is also one of
     their five category frames; for those, appending the reel would paint the
     same photograph twice at two different crops, which `deck.includes` cannot
     catch because the two crops are two different files. */
  const reel = REEL_IN_POOL[h] ? "" : REEL_STILLS[h];
  const deck: string[] = reel ? [...own, reel] : [...own];

  const nb = (NEIGHBOURS[cat] || NEIGHBOURS[DEFAULT_CAT]).map(
    (n) => CATEGORY_MEDIA[n] || CATEGORY_MEDIA[DEFAULT_CAT],
  );
  const depth = Math.max(...nb.map((p) => p.length));
  for (let d = 0; d < depth; d++) {
    for (let col = 0; col < nb.length; col++) {
      const pool = nb[(col + d) % nb.length];
      const src = pool[d % pool.length];
      if (!deck.includes(src)) deck.push(src);
    }
  }

  GRID_CACHE[h] = deck;
  return deck;
}

/**
 * A photograph for a creator's profile grid.
 *
 * The grid is a wall of their own work, so it leads with their whole pool
 * including the reel frame — a creator's reel appearing among their posts on
 * their own profile is what the real products do.
 */
export function gridFor(handle: string, i: number): string {
  const deck = gridDeck(handle.replace(/^@/, ""));
  return deck[((i % deck.length) + deck.length) % deck.length];
}
