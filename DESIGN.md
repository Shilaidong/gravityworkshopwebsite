# Design System — GRAVITY FANG v2.5

## Visual Theme

Cinematic scroll film: **cream type on warm dark stages**, optional **photography backdrops** (`public/scenes/*.jpg`), continuous real-time WebGL **Halo** (dual thin rings, physical metal + teal rim). Consulting-first; Terra as showcase. Photo files are optional slots — gradients until replaced.

## Color (OKLCH)

| Token | Role |
|-------|------|
| `stage` `oklch(0.14 0.02 250)` | Page / canvas ground |
| `stage-elevated` `oklch(0.18 0.022 250)` | Panels, dialogs |
| `on-stage` `oklch(0.94 0.01 85)` | Primary text on dark |
| `teal` `oklch(0.62 0.11 185)` | Accent ≤10% (CTA, nodes, progress) |
| `teal-deep` | Hover / emphasis |

Strategy: **Restrained accent on drenched dark stage**. No pure black/white; no Swiss red/blue.

## Typography

- Display (Latin): **Sora**
- Body / Chinese: **Noto Sans SC**
- Fluid display type on hero; chapter titles via `clamp()`

## Motion

- Preloader: ring draw + % counter, curtain lift
- Lenis smooth scroll (disabled when `prefers-reduced-motion`)
- Scroll progress 0–1 → ring keyframes (`lib/scroll-story.ts`)
- Ring morphs: solid → path nodes → Terra satellites → lock → seal
- Header progress bar scrubbed to scroll
- Mobile: CSS ring substitute, no WebGL

## Layout chapters

Intro → Manifesto → Method → Systems (Terra + 3 satellites) → Cases → Team → Voices → Contact (phone / WeChat / light form)

## Components

- `btn-teal` / `btn-ghost-dark`
- `panel-glass` showcase cards
- Fixed header + lang toggle
- Contact form: client success placeholder only

## Stack

Next.js App Router · R3F / Three · GSAP available · Lenis · Tailwind v4
