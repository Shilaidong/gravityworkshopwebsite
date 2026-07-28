"use client";

import { useEffect, useState } from "react";
import { nav, navLinks } from "@/lib/content";
import { useExperience } from "@/lib/experience-store";
import { RUNNING_ORDER } from "@/lib/scroll-story";

/** Rounded viewport frame — void shows through the four corners. */
export function PageFrame() {
  return <div className="page-frame" aria-hidden />;
}

/** Which act is currently on screen, for the boxed nav state. */
function useActiveAct() {
  const [active, setActive] = useState<string>("intro");

  useEffect(() => {
    const ids = RUNNING_ORDER.map((a) => a.anchorId ?? a.id);
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= mid) current = id;
      }
      setActive(current === "manifesto-claim" ? "manifesto" : current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

export function SiteHeader() {
  const { t, lang, toggleLang, ready } = useExperience();
  const [open, setOpen] = useState(false);
  const active = useActiveAct();

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-opacity duration-700 ${
        ready ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="bleed flex h-[var(--nav-h)] items-center justify-between">
        <a
          href="#intro"
          className="font-display on-photo text-[1.05rem] font-extrabold uppercase tracking-[0.02em] text-cream"
        >
          Gravity Fang
        </a>

        <nav
          className="hidden items-center gap-5 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((l) => {
            const on = active === l.id;
            return (
              <a
                key={l.id}
                href={l.href}
                aria-current={on ? "true" : undefined}
                className={`nav-link on-photo ${on ? "nav-link-active" : ""}`}
              >
                {t(nav[l.key])}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="nav-link on-photo"
          >
            {lang === "zh" ? "EN" : "中文"}
          </button>
          <a href="#contact" className="btn-cream hidden !py-2 sm:inline-flex">
            {t(nav.book)}
          </a>
          <button
            type="button"
            className="nav-link nav-link-active md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t(nav.close) : t(nav.menu)}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-y border-cream/12 bg-stage-deep/95 px-[var(--gutter)] py-3 backdrop-blur-md md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className="t-title block py-2.5 !text-xl text-cream"
              onClick={() => setOpen(false)}
            >
              {t(nav[l.key])}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/** Centred bottom cue — circle chevron + label, as in every reference frame. */
export function ScrollHint() {
  const { t, progress, ready } = useExperience();
  if (!ready || progress > 0.045) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[96] flex -translate-x-1/2 items-center gap-2.5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cream/50">
        <svg width="7" height="5" viewBox="0 0 7 5" aria-hidden>
          <path
            d="M1 1l2.5 2.5L6 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="text-cream/80"
          />
        </svg>
      </span>
      <p className="t-micro on-photo !text-cream/70">{t(nav.scroll)}</p>
    </div>
  );
}

/** Solid cream tab on the right edge + thin progress track. */
export function ChapterRail() {
  const { progress, ready } = useExperience();
  if (!ready) return null;
  return (
    <div
      className="pointer-events-none fixed right-0 top-1/2 z-[96] hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
      aria-hidden
    >
      <span className="edge-tab">Gravity Halo</span>
      <div className="relative mr-2 h-20 w-px bg-cream/20">
        <div
          className="absolute left-0 top-0 w-px bg-teal"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
