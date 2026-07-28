"use client";

import Image from "next/image";
import { about, contact } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function About() {
  const { t, lang } = useApp();

  return (
    <section
      id="about"
      className="section-pad border-t border-line"
      aria-labelledby="about-heading"
    >
      <div className="container-site">
        <p className="label-kicker">{t(about.label)}</p>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2
              id="about-heading"
              className="font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold tracking-tight text-ink"
            >
              {about.name}
            </h2>
            <p className="mt-3 text-sm font-semibold text-teal">{t(about.role)}</p>
            <p className="prose-measure mt-8 text-lg leading-relaxed text-ink-soft">
              {t(about.body)}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {about.tags[lang].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-teal-soft px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-teal-soft lg:col-span-5 lg:col-start-8">
            <Image
              src={contact.founderImage}
              alt={
                lang === "zh"
                  ? "引力坊创始人 Mira Shi"
                  : "Mira Shi, founder of GRAVITY FANG"
              }
              width={900}
              height={1100}
              className="h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
