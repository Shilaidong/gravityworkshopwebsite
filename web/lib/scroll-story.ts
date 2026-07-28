/**
 * Storyboard: acts → Halo/camera poses.
 *
 * Poses are bound to an act **id**, never to a hardcoded scroll fraction.
 * The `p` timeline is derived at runtime from where each act's DOM node
 * actually sits (see `measureAnchors`), so cutting or restoring an act —
 * or changing a chapter's height — never requires re-tuning the curve.
 */

export type ActId =
  | "intro"
  | "manifesto"
  | "precision"
  | "method"
  | "systems"
  | "cases"
  | "team"
  | "voices"
  | "services"
  | "contact";

/** Halo + camera state for one act */
export type HaloPose = {
  /** world position */
  x: number;
  y: number;
  z: number;
  scale: number;
  rotX: number;
  rotY: number;
  /** thickness feel 0 thin 1 slightly fuller */
  weight: number;
  /** rim light / teal edge */
  rim: number;
  /** openness / spread of dual ring offset */
  spread: number;
  /** camera */
  camX: number;
  camY: number;
  camZ: number;
  camFov: number;
  /** 0–1 scene dim for photo chapters */
  sceneDim: number;
};

export type Keyframe = HaloPose & { p: number };

export type Act = {
  id: ActId;
  /**
   * DOM id to measure, when the act's beat is not the whole section.
   * Defaults to `id`.
   */
  anchorId?: string;
  /** V3-A ships "A"; "B" acts stay authored but out of the running order */
  phase: "A" | "B";
  /** public path under /scenes — optional until real photography lands */
  photo?: string;
  pose: HaloPose;
};

/**
 * Running order. Add/remove entries freely — the timeline re-derives.
 * `id` must match the DOM id of the corresponding stage (or sub-node).
 */
export const ACTS: Act[] = [
  {
    id: "intro",
    phase: "A",
    photo: "/scenes/intro.jpg",
    pose: {
      // verified against the frame: object centred, wordmark bleeding over it
      x: 0.1,
      y: -0.05,
      z: 0,
      scale: 0.58,
      rotX: 0.55,
      rotY: 0.15,
      weight: 0.35,
      rim: 0.45,
      spread: 0.02,
      camX: 0,
      camY: 0.1,
      camZ: 5.6,
      camFov: 34,
      sceneDim: 0.35,
    },
  },
  {
    id: "manifesto",
    // the stage is 200svh (claim + precision); anchor on the claim beat only
    anchorId: "manifesto-claim",
    phase: "A",
    pose: {
      // sits in the gutter between the statement (left) and the reading (right)
      x: 0.05,
      y: -0.02,
      z: 0,
      scale: 0.62,
      rotX: 0.42,
      rotY: 0.55,
      weight: 0.42,
      rim: 0.6,
      spread: 0.04,
      camX: 0,
      camY: 0.05,
      camZ: 5.4,
      camFov: 34,
      sceneDim: 0.55,
    },
  },
  {
    // Act 6 (精密/材质) — a close-up beat, not its own chapter.
    // Near-flat and cropped along the bottom so centred type stays clean.
    id: "precision",
    phase: "A",
    pose: {
      x: 0,
      y: 0,
      z: 0,
      scale: 1.44,
      rotX: 1.5,
      rotY: 0.9,
      weight: 0.62,
      rim: 0.95,
      spread: 0.01,
      camX: 0,
      camY: 0.25,
      camZ: 4.8,
      camFov: 32,
      sceneDim: 0.72,
    },
  },
  {
    id: "method",
    phase: "A",
    photo: "/scenes/method.jpg",
    pose: {
      // low and wide, reading as a path under the five steps
      x: 0,
      y: -2.25,
      z: 0,
      scale: 0.8,
      rotX: 1.16,
      rotY: 0.25,
      weight: 0.3,
      rim: 0.7,
      spread: 0.16,
      camX: 0,
      camY: 0.2,
      camZ: 5.8,
      camFov: 38,
      sceneDim: 0.4,
    },
  },
  {
    id: "systems",
    phase: "A",
    photo: "/scenes/systems.jpg",
    pose: {
      // tucked low-left, clear of the copy column and the terminal panel
      x: -1.05,
      y: -0.68,
      z: 0.1,
      scale: 0.54,
      rotX: 0.35,
      rotY: 1.1,
      weight: 0.45,
      rim: 0.9,
      spread: 0.08,
      camX: 0,
      camY: 0.12,
      camZ: 5.6,
      camFov: 36,
      sceneDim: 0.5,
    },
  },
  {
    id: "cases",
    phase: "A",
    photo: "/scenes/cases.jpg",
    pose: {
      x: 0,
      y: -2.05,
      z: 0,
      scale: 0.78,
      rotX: 1.2,
      rotY: -0.4,
      weight: 0.35,
      rim: 0.5,
      spread: 0.03,
      camX: 0,
      camY: 0.22,
      camZ: 5.7,
      camFov: 37,
      sceneDim: 0.45,
    },
  },
  {
    id: "team",
    phase: "A",
    pose: {
      // quiet, high right — the portraits carry this act
      x: -0.85,
      y: -3.45,
      z: -0.2,
      scale: 0.36,
      rotX: 0.25,
      rotY: 0.35,
      weight: 0.3,
      rim: 0.35,
      spread: 0.02,
      camX: 0,
      camY: 0,
      camZ: 5.9,
      camFov: 39,
      sceneDim: 0.55,
    },
  },
  {
    id: "voices",
    phase: "A",
    pose: {
      x: 0.9,
      y: -2.3,
      z: -0.2,
      scale: 0.46,
      rotX: 0.3,
      rotY: -0.25,
      weight: 0.28,
      rim: 0.32,
      spread: 0.02,
      camX: 0,
      camY: 0,
      camZ: 5.9,
      camFov: 39,
      sceneDim: 0.55,
    },
  },
  {
    // Act 10 — 选配. Centred low, filling the empty middle column
    // the way the product sits between description and feature list.
    id: "services",
    phase: "A",
    pose: {
      x: 0,
      y: -0.5,
      z: 0,
      scale: 0.6,
      rotX: 0.5,
      rotY: 0.95,
      weight: 0.45,
      rim: 0.66,
      spread: 0.03,
      camX: 0,
      camY: 0.1,
      camZ: 5.3,
      camFov: 35,
      sceneDim: 0.6,
    },
  },
  {
    id: "contact",
    phase: "A",
    photo: "/scenes/contact.jpg",
    pose: {
      // frontal seal, left of the closing statement
      x: -1.0,
      y: 0.12,
      z: 0,
      scale: 0.56,
      rotX: 0.08,
      rotY: 0,
      weight: 0.5,
      rim: 0.42,
      spread: 0.01,
      camX: 0,
      camY: 0.05,
      camZ: 5.4,
      camFov: 34,
      sceneDim: 0.65,
    },
  },
  // ---- V3-B, authored but not in the running order ----
  {
    id: "gallery" as ActId,
    phase: "B",
    pose: {
      x: 0,
      y: 0,
      z: -1.2,
      scale: 0.42,
      rotX: 0.2,
      rotY: 0.4,
      weight: 0.25,
      rim: 0.25,
      spread: 0.02,
      camX: 0,
      camY: 0,
      camZ: 6.2,
      camFov: 42,
      sceneDim: 0.7,
    },
  },
];

/** Acts actually rendered this phase, in order. */
export const RUNNING_ORDER = ACTS.filter((a) => a.phase === "A");

/** Even spacing — used before the DOM has been measured. */
function evenAnchors(): number[] {
  const n = RUNNING_ORDER.length;
  return RUNNING_ORDER.map((_, i) => (n > 1 ? i / (n - 1) : 0));
}

/**
 * Turn per-act anchor positions (0–1, ascending) into a keyframe list.
 * Anchors are normalised so the first act sits at 0 and the last at 1.
 */
export function buildTimeline(anchors?: number[]): Keyframe[] {
  const raw =
    anchors && anchors.length === RUNNING_ORDER.length
      ? anchors
      : evenAnchors();

  const first = raw[0];
  const last = raw[raw.length - 1];
  const span = last - first || 1;

  let prev = -1;
  return RUNNING_ORDER.map((act, i) => {
    // clamp + force strictly ascending so sampling never divides by zero
    let p = (raw[i] - first) / span;
    if (!Number.isFinite(p)) p = i / Math.max(1, RUNNING_ORDER.length - 1);
    p = Math.min(1, Math.max(0, p));
    if (p <= prev) p = Math.min(1, prev + 0.001);
    prev = p;
    return { p, ...act.pose };
  });
}

/**
 * Measure where each act sits in the document, as a 0–1 scroll fraction.
 * Uses the element's centre against the same scroll range ScrollDriver uses,
 * so acts of different heights (70svh vs 100svh) land correctly.
 */
export function measureAnchors(): number[] | null {
  if (typeof document === "undefined") return null;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return null;

  const out: number[] = [];
  for (const act of RUNNING_ORDER) {
    const el = document.getElementById(act.anchorId ?? act.id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    // scroll position at which this act is centred in the viewport
    const centred = top + rect.height / 2 - window.innerHeight / 2;
    out.push(Math.min(1, Math.max(0, centred / max)));
  }
  return out;
}

export const DEFAULT_TIMELINE = buildTimeline();

export function sampleHaloPose(frames: Keyframe[], progress: number): HaloPose {
  const list = frames.length ? frames : DEFAULT_TIMELINE;
  const p = Math.min(1, Math.max(0, progress));
  if (p <= list[0].p) return { ...list[0] };
  if (p >= list[list.length - 1].p) return { ...list[list.length - 1] };

  let i = 0;
  while (i < list.length - 1 && list[i + 1].p < p) i++;
  const a = list[i];
  const b = list[i + 1];
  const t = (p - a.p) / (b.p - a.p || 1);
  const e = t * t * (3 - 2 * t);
  const L = (x: number, y: number) => x + (y - x) * e;

  return {
    x: L(a.x, b.x),
    y: L(a.y, b.y),
    z: L(a.z, b.z),
    scale: L(a.scale, b.scale),
    rotX: L(a.rotX, b.rotX),
    rotY: L(a.rotY, b.rotY),
    weight: L(a.weight, b.weight),
    rim: L(a.rim, b.rim),
    spread: L(a.spread, b.spread),
    camX: L(a.camX, b.camX),
    camY: L(a.camY, b.camY),
    camZ: L(a.camZ, b.camZ),
    camFov: L(a.camFov, b.camFov),
    sceneDim: L(a.sceneDim, b.sceneDim),
  };
}

/** Photo slots under public/scenes/ — swap files later */
export const SCENE_PHOTOS = Object.fromEntries(
  ACTS.filter((a) => a.photo).map((a) => [a.id, a.photo as string]),
) as Record<"intro" | "method" | "systems" | "cases" | "contact", string>;
