"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useExperience } from "@/lib/experience-store";
import { buildTimeline, measureAnchors } from "@/lib/scroll-story";

export function ScrollDriver() {
  const { setProgress, setFrames, reducedMotion, ready } = useExperience();

  /**
   * Derive the Halo timeline from where the acts actually are.
   * Re-runs on resize and after fonts/images settle, so chapters of
   * different heights land on their own keyframe.
   */
  useEffect(() => {
    if (!ready) return;

    const remeasure = () => {
      const anchors = measureAnchors();
      if (anchors) setFrames(buildTimeline(anchors));
    };

    remeasure();
    const settle = window.setTimeout(remeasure, 400);
    window.addEventListener("resize", remeasure);

    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, [ready, setFrames]);

  useEffect(() => {
    if (!ready) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    if (reducedMotion) {
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", update);
    update();

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.removeEventListener("resize", update);
    };
  }, [ready, reducedMotion, setProgress]);

  return null;
}
