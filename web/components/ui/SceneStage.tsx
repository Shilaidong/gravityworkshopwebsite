"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  /** public path e.g. /scenes/intro.jpg — optional until real photos land */
  photo?: string;
  /** CSS gradient fallback when photo missing */
  fallback: string;
  /** dark overlay strength 0–1 for type readability */
  dim?: number;
  children: ReactNode;
  id: string;
  className?: string;
  /** min height in vh */
  tall?: boolean;
  /**
   * Above-the-fold stage: render through next/image with `priority` so the
   * LCP image is preloaded instead of waiting on a JS probe.
   */
  priority?: boolean;
  /** override min-height, e.g. "min-h-[180svh]" for stages with two beats */
  minH?: string;
  /** where the scrim falls, so type stays legible without dimming the frame */
  veil?: "left" | "bottom" | "vignette";
};

/** keep photography bright — the reference frames are not murky */
const PHOTO_FILTER = "saturate(1.05) contrast(1.06) brightness(1.06)";

/**
 * Full-bleed chapter stage. Drop final photography into public/scenes/.
 */
export function SceneStage({
  photo,
  fallback,
  dim = 0.2,
  children,
  id,
  className = "",
  tall = true,
  priority = false,
  minH,
  veil = "vignette",
}: Props) {
  /** path of the photo confirmed to exist; null until it loads */
  const [probed, setProbed] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Priority stages go through next/image; no probe, no double fetch.
    if (!photo || priority) return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setProbed(photo);
    };
    img.src = photo;
    return () => {
      cancelled = true;
    };
  }, [photo, priority]);

  const hasPhoto = probed !== null && probed === photo;

  const height = minH ?? (tall ? "min-h-[100svh]" : "min-h-[70svh]");

  return (
    <section id={id} className={`relative flex ${height} flex-col ${className}`}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* gradient always sits underneath, so a missing file degrades cleanly */}
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center transition-[background-image] duration-700"
          style={{
            backgroundImage: hasPhoto && photo ? `url(${photo})` : fallback,
            filter: hasPhoto ? PHOTO_FILTER : undefined,
          }}
        />
        {priority && photo && !failed && (
          <Image
            src={photo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
            style={{ filter: PHOTO_FILTER }}
            onError={() => setFailed(true)}
          />
        )}
        {/*
          Directional scrim only. A full-frame veil is what made the earlier
          build read as a dark template — the reference keeps photography
          bright and lets type carry its own shadow (.on-photo).
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              veil === "left"
                ? `linear-gradient(100deg, oklch(0.08 0.012 58 / ${0.62 + dim * 0.3}) 0%, oklch(0.08 0.012 58 / ${0.3 + dim * 0.25}) 42%, transparent 78%)`
                : veil === "bottom"
                  ? `linear-gradient(to bottom, transparent 8%, oklch(0.08 0.012 58 / ${0.25 + dim * 0.3}) 62%, oklch(0.07 0.01 58 / ${0.55 + dim * 0.3}) 100%)`
                  : `radial-gradient(120% 90% at 50% 45%, transparent 25%, oklch(0.07 0.01 58 / ${0.35 + dim * 0.35}) 100%)`,
          }}
        />
        {/* film grain-ish */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </section>
  );
}
