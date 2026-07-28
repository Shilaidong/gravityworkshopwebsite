"use client";

import Image from "next/image";
import { team } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function Team() {
  const { t, lang } = useApp();

  return (
    <section
      id="team"
      className="section-pad border-t border-line"
      aria-labelledby="team-heading"
    >
      <div className="container-site">
        <p className="label-kicker">{t(team.label)}</p>
        <h2
          id="team-heading"
          className="font-display mt-4 max-w-lg text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-tight text-ink"
        >
          {t(team.heading)}
        </h2>

        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {team.members.map((member) => (
            <li key={member.name} className="flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-line">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-display mt-6 text-xl font-semibold tracking-tight text-ink">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-teal">
                {t(member.title)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {t(member.body)}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {member.tags[lang].map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
