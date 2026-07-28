"use client";

import { useEffect, useState } from "react";
import { preloader } from "@/lib/content";
import { useExperience } from "@/lib/experience-store";

export function Preloader() {
  const { t, setReady, ready, reducedMotion } = useExperience();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (ready) return;
    if (reducedMotion) {
      // one-shot handoff: no intro animation to play, so hand straight over
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPct(100);
      setReady(true);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = 1800;

    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        window.setTimeout(() => setReady(true), 700);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready, reducedMotion, setReady]);

  if (ready) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-stage transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        leaving ? "-translate-y-full" : "translate-y-0"
      }`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative mb-12 h-24 w-24">
        <div
          className="absolute inset-0 rounded-full border border-cream/15"
          style={{
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
          }}
        />
        <div className="absolute inset-[18%] rounded-full border border-teal/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-cream/80" />
        </div>
      </div>
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-cream/45">
        {t(preloader.loading)}
      </p>
      <p className="font-display mt-3 text-xl tabular-nums tracking-tight text-cream/80">
        {String(pct).padStart(2, "0")}
      </p>
    </div>
  );
}
