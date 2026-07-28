# 引力坊 GRAVITY FANG — Official Site

Next.js brand site for Gravity Fang Education (elite admissions consulting).

## Stack

- Next.js (App Router) + React
- Tailwind CSS v4
- TypeScript
- `next/font`: Sora + Noto Sans SC

## Develop

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Structure

```
app/           # layout, page, global styles
components/    # Header, Hero, sections, modals
lib/           # content (zh/en) + app context
```

Copy and media URLs live in `lib/content.ts`. Design tokens are in `app/globals.css` and project-root `DESIGN.md` / `PRODUCT.md`.

## Deploy

Any Node host (e.g. Vercel). Root directory: `web`.
