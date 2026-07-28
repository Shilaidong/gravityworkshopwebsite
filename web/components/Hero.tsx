"use client";

import { hero } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function Hero() {
  const { t, openModal } = useApp();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end pb-[clamp(3rem,8vw,5.5rem)] pt-[calc(var(--nav-h)+2rem)]"
      aria-labelledby="hero-heading"
    >
      <div className="container-wide px-[var(--space-gutter)]">
        <p className="label-kicker animate-fade-up">{t(hero.kicker)}</p>

        <h1
          id="hero-heading"
          className="font-display mt-6 animate-fade-up animate-fade-up-delay-1 text-[clamp(3.5rem,14vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-ink"
        >
          <span className="block">{hero.titleLine1}</span>
          <span className="block text-ink-soft">{hero.titleLine2}</span>
        </h1>

        <div className="mt-10 grid max-w-5xl gap-8 md:mt-14 md:grid-cols-12 md:items-end md:gap-12">
          <div className="animate-fade-up animate-fade-up-delay-2 md:col-span-5">
            <p className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-snug tracking-tight text-ink">
              {t(hero.claim)}
            </p>
          </div>
          <div className="animate-fade-up animate-fade-up-delay-3 md:col-span-6 md:col-start-7">
            <p className="prose-measure text-base leading-relaxed text-ink-soft sm:text-lg">
              {t(hero.body)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => openModal("contact")}
              >
                {t(hero.cta)}
                <span aria-hidden="true">→</span>
              </button>
              <a href="#cases" className="btn-ghost">
                {t(hero.secondary)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
