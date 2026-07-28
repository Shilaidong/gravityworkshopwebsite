"use client";

import { voices } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function Voices() {
  const { t } = useApp();

  return (
    <section
      className="section-pad border-t border-line bg-teal-soft/40"
      aria-labelledby="voices-heading"
    >
      <div className="container-site">
        <p className="label-kicker">{t(voices.label)}</p>
        <h2
          id="voices-heading"
          className="font-display mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-ink"
        >
          {t(voices.heading)}
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {voices.items.map((item) => (
            <li
              key={item.school}
              className="flex flex-col rounded-2xl border border-line/80 bg-paper-elevated p-7"
            >
              <p className="flex-1 text-base leading-relaxed text-ink-soft">
                “{t(item.quote)}”
              </p>
              <div className="mt-8 border-t border-line pt-5">
                <p className="text-sm font-semibold text-ink">{t(item.name)}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-teal">
                  {item.school}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
