# Design System — GRAVITY FANG

## Visual Theme

Precision consulting system: warm paper ground, cool charcoal ink, a single restrained teal accent. Pure typography hero, numbered service rows, dark case evidence band. No brutalist borders, no metric walls, no 3D spectacle.

## Colors (OKLCH)

| Token | Value | Role |
|-------|--------|------|
| paper | `oklch(0.975 0.006 85)` | Page background |
| paper-elevated | `oklch(0.99 0.004 85)` | Raised surfaces |
| ink | `oklch(0.22 0.02 250)` | Primary text |
| ink-soft | `oklch(0.38 0.018 250)` | Body secondary |
| mute | `oklch(0.58 0.014 240)` | Meta labels |
| line | `oklch(0.88 0.01 240)` | Hairline dividers |
| teal | `oklch(0.48 0.09 195)` | Accent ≤10% (CTA, labels) |
| teal-deep | `oklch(0.4 0.08 195)` | CTA hover |
| teal-soft | `oklch(0.94 0.025 195)` | Soft fills / tags |
| ink-band | `oklch(0.2 0.025 250)` | Dark cases section |
| on-ink | `oklch(0.96 0.008 85)` | Text on dark band |

Strategy: **Restrained**. Never pure `#000` / `#fff`.

## Typography

- **Display (Latin):** Sora — heavy weight contrast, tight tracking on hero
- **UI / Chinese body:** Noto Sans SC
- Scale: fluid `clamp()` headings; body ~16–18px; measure ≤65ch
- Hierarchy via size + weight, not decoration

## Layout

- Max content ~1120px; wide ~1280px
- Section padding: `clamp(4.5rem, 10vw, 8rem)`
- Gutter: `clamp(1.25rem, 4vw, 2.5rem)`
- Services: horizontal numbered list rows (not equal cards)
- Cases: sticky intro + editorial list on dark band
- Rhythm: light → elevated → dark band → light

## Components

- **Primary button:** pill, solid teal
- **Ghost button:** hairline border, paper hover
- **Modal:** bottom sheet mobile, centered desktop; Escape + backdrop close
- **Tags:** soft teal fill or hairline chip
- **Nav:** fixed, blurs after scroll

## Motion

- Hero: short fade-up stagger (respects `prefers-reduced-motion`)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- No layout-property animation; no page curtain / marquee / 3D

## Accessibility

- Focus-visible rings on interactive elements
- Semantic landmarks and headings
- Keyboard modal dismiss
- WCAG AA-oriented contrast on paper and dark band
