"use client";

import { services } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function Services() {
  const { t, lang } = useApp();

  return (
    <section
      id="services"
      className="section-pad border-t border-line bg-paper-elevated"
      aria-labelledby="services-heading"
    >
      <div className="container-site">
        <p className="label-kicker">{t(services.label)}</p>
        <h2
          id="services-heading"
          className="font-display mt-4 max-w-xl text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-tight text-ink"
        >
          {t(services.heading)}
        </h2>

        <ol className="mt-14 divide-y divide-line border-y border-line">
          {services.items.map((item) => (
            <li
              key={item.id}
              className="group grid gap-6 py-10 transition-colors md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div className="md:col-span-2">
                <span className="font-display text-3xl font-semibold tabular-nums text-teal md:text-4xl">
                  {item.id}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {t(item.title)}
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-base leading-relaxed text-ink-soft">
                  {t(item.body)}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {item.points[lang].map((point) => (
                    <li
                      key={point}
                      className="text-sm font-medium text-ink before:mr-2 before:text-teal before:content-['·']"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
