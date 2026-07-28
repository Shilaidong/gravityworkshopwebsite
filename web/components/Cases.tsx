"use client";

import { cases } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function Cases() {
  const { t, openModal } = useApp();

  return (
    <section
      id="cases"
      className="border-t border-line bg-ink-band text-on-ink"
      aria-labelledby="cases-heading"
    >
      <div className="section-pad container-wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-teal">
              {t(cases.label)}
            </p>
            <h2
              id="cases-heading"
              className="font-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-tight"
            >
              {t(cases.heading)}
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-on-ink-mute">
              {t(cases.body)}
            </p>
            <button
              type="button"
              className="btn-ghost-on-dark mt-8"
              onClick={() => openModal("cases")}
            >
              {t(cases.browse)}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <ul className="lg:col-span-8">
            {cases.featured.map((item, index) => (
              <li
                key={item.school}
                className="border-t border-white/10 py-8 first:border-t-0 first:pt-0 md:py-10"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-ink-mute">
                    {String(index + 1).padStart(2, "0")} · {t(item.level)}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-tight">
                  {item.school}
                </h3>
                <p className="mt-2 text-base font-medium text-teal">
                  {item.major}
                </p>
                <p className="mt-3 text-sm text-on-ink-mute">{t(item.note)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
