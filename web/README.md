# 引力坊 GRAVITY FANG — Site v2 (Phase A)

Cinematic brand experience: **Gravity Ring** (R3F) threads scroll chapters. Consulting-first; Terra ecosystem as showcase capability proof.

## Stack

- Next.js App Router + React 19
- Tailwind CSS v4
- `@react-three/fiber` + `three` (desktop ring)
- Lenis smooth scroll
- TypeScript

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port Next prints).

## Build

```bash
npm run build
npm start
```

## Structure

```
app/                 # layout, page, tokens
components/
  experience/        # Canvas, preloader, scroll driver, shell
  ring/              # Gravity Ring scene
  chapters/          # Intro → Contact
  ui/                # Header, scroll hint
lib/
  content.ts         # zh/en copy + data
  scroll-story.ts    # ring keyframes vs scroll progress
  experience-store.tsx
```

## Notes

- Form submit is frontend success only (`// TODO` wire API).
- Mobile: no WebGL; CSS orbit substitute.
- v1.0 remains in git history (`cf6f01d`).
