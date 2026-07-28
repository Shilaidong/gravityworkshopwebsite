"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  cases,
  contact,
  footer,
  hero,
  manifesto,
  method,
  precision,
  services,
  systems,
  team,
  voices,
} from "@/lib/content";
import { SCENE_PHOTOS } from "@/lib/scroll-story";
import { useExperience, type IntentKey } from "@/lib/experience-store";
import { SceneStage } from "@/components/ui/SceneStage";

const FALLBACKS = {
  intro:
    "radial-gradient(ellipse at 68% 38%, oklch(0.42 0.055 62) 0%, oklch(0.2 0.028 55) 48%, oklch(0.12 0.015 58) 100%)",
  dark: "radial-gradient(ellipse at 50% 42%, oklch(0.24 0.028 58) 0%, oklch(0.115 0.014 58) 72%)",
  warm: "radial-gradient(ellipse at 28% 30%, oklch(0.36 0.05 55) 0%, oklch(0.135 0.016 58) 68%)",
  cool: "radial-gradient(ellipse at 62% 48%, oklch(0.3 0.05 195) 0%, oklch(0.115 0.014 58) 72%)",
};

/** dotted ring bullet — the feature-list mark used in the reference frames */
function DotMark() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      className="mt-[0.45em] shrink-0 text-cream/45"
      aria-hidden
    >
      <circle
        cx="5.5"
        cy="5.5"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeDasharray="1.6 1.8"
      />
    </svg>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="t-kicker on-photo">{children}</p>;
}

/* ------------------------------- Act 1 · Intro ------------------------------ */

export function ChapterIntro() {
  const { t } = useExperience();
  return (
    <SceneStage
      id="intro"
      photo={SCENE_PHOTOS.intro}
      fallback={FALLBACKS.intro}
      veil="left"
      dim={0.3}
      priority
    >
      <div className="bleed relative flex flex-1 flex-col justify-between pb-14 pt-[calc(var(--nav-h)+3vh)]">
        {/* wordmark bleeds off the top-left, as in f00 */}
        <div>
          <Kicker>{t(hero.kicker)}</Kicker>
          <h1 className="t-wordmark on-photo mt-4 text-cream">
            <span className="block">{hero.titleA}</span>
            <span className="block">{hero.titleB}</span>
          </h1>
        </div>

        {/* claim + body ride the right edge at optical centre */}
        <div className="pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden w-[19rem] -translate-y-1/4 lg:block">
          <p className="t-title on-photo text-cream">{t(hero.claim)}</p>
          <p className="t-lead on-photo mt-5">{t(hero.body)}</p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="card-film max-w-[20rem]">
            <p className="font-display text-[0.95rem] font-extrabold uppercase leading-[1.25] tracking-[0.01em] text-cream">
              {t(hero.cardTitle)}
            </p>
            <div className="rule-dotted my-4" />
            <p className="t-body text-right !text-[0.8rem] !text-cream/65">
              {t(hero.cardNote)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#contact" className="btn-cream">
              {t(hero.cta)}
            </a>
            <a href="#systems" className="btn-outline-cream">
              {t(hero.secondary)}
            </a>
          </div>
        </div>

        {/* small-screen fallback for the right-edge block */}
        <div className="mt-10 lg:hidden">
          <p className="t-title on-photo text-cream">{t(hero.claim)}</p>
          <p className="t-lead on-photo mt-4">{t(hero.body)}</p>
        </div>
      </div>
    </SceneStage>
  );
}

/* --------------------- Act 2 · Manifesto (+ precision beat) ------------------ */

export function ChapterManifesto() {
  const { t } = useExperience();
  return (
    <SceneStage
      id="manifesto"
      fallback={FALLBACKS.dark}
      veil="vignette"
      dim={0.15}
      minH="min-h-[200svh]"
    >
      {/* beat 1 — statement left, reading right, object between them (f01) */}
      <div
        id="manifesto-claim"
        className="bleed flex min-h-[100svh] items-center"
      >
        <div className="grid w-full grid-cols-12 items-center gap-y-10">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <Kicker>{t(manifesto.label)}</Kicker>
            <h2 className="t-display on-photo mt-5 text-cream">
              {t(manifesto.heading)}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p className="t-lead on-photo">{t(manifesto.body)}</p>
          </div>
        </div>
      </div>

      {/* beat 2 — Act 6 precision close-up, centred (no separate chapter) */}
      <div
        id="precision"
        className="bleed flex min-h-[100svh] flex-col items-center justify-center text-center"
      >
        <Kicker>{t(precision.kicker)}</Kicker>
        <h2 className="t-display on-photo mx-auto mt-5 max-w-[16ch] text-cream">
          {t(precision.heading)}
        </h2>
        <p className="t-lead on-photo mx-auto mt-6 !max-w-[42ch]">
          {t(precision.body)}
        </p>
        <ul className="mt-14 flex flex-wrap justify-center gap-x-14 gap-y-5">
          {precision.facts.map((f) => (
            <li key={f.k.en} className="flex items-start gap-2.5 text-left">
              <DotMark />
              <span>
                <span className="t-micro block">{t(f.k)}</span>
                <span className="font-display mt-1 block text-base font-extrabold text-cream">
                  {t(f.v)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SceneStage>
  );
}

/* ------------------------------ Act 3 · Method ------------------------------ */

export function ChapterMethod() {
  const { t } = useExperience();
  return (
    <SceneStage
      id="method"
      photo={SCENE_PHOTOS.method}
      fallback={FALLBACKS.warm}
      veil="bottom"
      dim={0.25}
    >
      <div className="bleed flex flex-1 flex-col justify-center py-[16vh]">
        {/* centred title block, as in the feature frames */}
        <div className="text-center">
          <Kicker>{t(method.label)}</Kicker>
          <h2 className="t-display t-display-caps on-photo mx-auto mt-4 max-w-[18ch] text-cream">
            {t(method.heading)}
          </h2>
        </div>

        <ol className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5">
          {method.stages.map((s) => (
            <li key={s.id}>
              <div className="rule-dotted pt-4">
                <span className="font-display text-[0.7rem] font-extrabold tracking-[0.18em] text-teal">
                  {s.id}
                </span>
                <h3 className="font-display mt-2 text-lg font-extrabold text-cream">
                  {t(s.title)}
                </h3>
                <p className="t-body mt-2">{t(s.body)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SceneStage>
  );
}

/* ----------------------------- Act 4 · Systems ------------------------------ */

export function ChapterSystems() {
  const { t } = useExperience();
  return (
    <SceneStage
      id="systems"
      photo={SCENE_PHOTOS.systems}
      fallback={FALLBACKS.cool}
      veil="left"
      dim={0.3}
    >
      <div className="bleed flex flex-1 flex-col justify-center py-[14vh]">
        <div className="grid grid-cols-12 items-start gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <Kicker>{t(systems.label)}</Kicker>
              <span className="rounded-full border border-teal/50 px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-teal">
                {t(systems.badge)}
              </span>
            </div>
            <h2 className="t-display on-photo mt-5 text-cream">
              {t(systems.heading)}
            </h2>
            <p className="t-lead on-photo mt-6">{t(systems.body)}</p>
            <a href="#contact" className="btn-cream mt-9 inline-flex w-fit">
              {t(systems.cta)}
            </a>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="panel-film">
              <div className="flex items-center justify-between border-b border-cream/12 px-5 py-4">
                <div>
                  <p className="font-display text-xl font-extrabold text-cream">
                    {systems.hub.name}
                  </p>
                  <p className="t-micro mt-1 !text-teal">{t(systems.hub.title)}</p>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_12px_var(--teal)]" />
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-3">
                {["Track", "Tasks", "Nodes"].map((label, i) => (
                  <div
                    key={label}
                    className="rounded-lg border border-cream/10 bg-black/30 p-4"
                  >
                    <p className="t-micro !text-[0.55rem]">{label}</p>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-cream/12">
                      <div
                        className="h-full rounded-full bg-teal/85"
                        style={{ width: `${50 + i * 18}%` }}
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-1.5 w-full rounded bg-cream/12" />
                      <div className="h-1.5 w-4/5 rounded bg-cream/8" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="t-body border-t border-cream/12 px-5 py-4">
                {t(systems.hub.body)}
              </p>
            </div>

            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              {systems.satellites.map((sat) => (
                <li key={sat.id} className="flex items-start gap-2.5">
                  <DotMark />
                  <span>
                    <span className="font-display block text-sm font-extrabold text-cream">
                      {t(sat.name)}
                    </span>
                    <span className="t-body mt-1 block !text-[0.82rem]">
                      {t(sat.body)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="t-micro mt-6 !text-cream/35">{t(systems.infra)}</p>
          </div>
        </div>
      </div>
    </SceneStage>
  );
}

/* ------------------------------ Act 5 · Cases ------------------------------- */

export function ChapterCases() {
  const { t, lang } = useExperience();
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const total = Math.ceil(cases.all.length / pageSize);
  const slice = cases.all.slice((page - 1) * pageSize, page * pageSize);
  const active = cases.featured[focus];

  return (
    <SceneStage
      id="cases"
      photo={SCENE_PHOTOS.cases}
      fallback={FALLBACKS.dark}
      veil="vignette"
      dim={0.3}
    >
      <div className="bleed flex flex-1 flex-col justify-center py-[14vh]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>{t(cases.label)}</Kicker>
            <h2 className="t-display t-display-caps on-photo mt-4 text-cream">
              {t(cases.heading)}
            </h2>
          </div>
          <p className="t-lead on-photo !max-w-[28ch]">{t(cases.body)}</p>
        </div>

        {/* dashed viewfinder on the focused case, dimmed neighbours (f05) */}
        <div className="mt-14 flex items-stretch justify-center gap-4">
          {cases.featured.map((item, i) => {
            const on = i === focus;
            return (
              <button
                key={item.school}
                type="button"
                onClick={() => setFocus(i)}
                aria-pressed={on}
                className={`group relative flex-1 overflow-hidden p-5 text-left transition-all duration-500 ${
                  on
                    ? "frame-dashed min-h-[15rem] flex-[2.4] bg-stage-deep/45"
                    : "min-h-[15rem] opacity-45 hover:opacity-75"
                }`}
              >
                <span className="t-micro">
                  {String(i + 1).padStart(2, "0")} · {t(item.level)}
                </span>
                <span
                  className={`font-display mt-3 block font-extrabold leading-[1.05] tracking-[-0.02em] text-cream ${
                    on ? "text-3xl md:text-4xl" : "text-lg"
                  }`}
                >
                  {item.school}
                </span>
                <span className="mt-2 block text-sm font-bold text-teal">
                  {item.major}
                </span>
                {on && (
                  <span className="t-body mt-4 block max-w-[26ch]">
                    {t(item.note)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-6">
          <p className="t-micro">
            {active.school} — {active.major}
          </p>
          <button
            type="button"
            className="btn-outline-cream"
            onClick={() => {
              setOpen(true);
              setPage(1);
            }}
          >
            {t(cases.browse)}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/75"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 max-h-[85svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-cream/12 bg-stage-deep p-6 sm:rounded-2xl">
            <div className="mb-5 flex justify-between">
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-cream">
                {t(cases.browse)}
              </h3>
              <button
                type="button"
                className="text-cream/60"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {slice.map((c) => (
                <li
                  key={`${c.school}-${c.major}`}
                  className="rounded-xl border border-cream/12 p-4"
                >
                  <p className="font-display font-extrabold text-cream">
                    {c.school}
                  </p>
                  <p className="mt-1 text-sm font-bold text-teal">{c.major}</p>
                  <p className="t-body mt-2 !text-xs">{c.background}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page === 1}
                className="nav-link nav-link-active disabled:opacity-30"
                onClick={() => setPage((p) => p - 1)}
              >
                {lang === "zh" ? "上一页" : "Prev"}
              </button>
              <span className="t-micro">
                {page} / {total}
              </span>
              <button
                type="button"
                disabled={page === total}
                className="nav-link nav-link-active disabled:opacity-30"
                onClick={() => setPage((p) => p + 1)}
              >
                {lang === "zh" ? "下一页" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SceneStage>
  );
}

/* ------------------------------- Act 7 · Team ------------------------------- */

export function ChapterTeam() {
  const { t, lang } = useExperience();
  return (
    <SceneStage
      id="team"
      fallback={FALLBACKS.dark}
      veil="vignette"
      dim={0.15}
      tall={false}
    >
      <div className="bleed py-[14vh]">
        <Kicker>{t(team.label)}</Kicker>
        <h2 className="t-display t-display-caps on-photo mt-4 max-w-[14ch] text-cream">
          {t(team.heading)}
        </h2>
        <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {team.members.map((m) => (
            <li key={m.name}>
              <div className="relative aspect-[4/5] overflow-hidden bg-cream/5">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-display mt-6 text-2xl font-extrabold tracking-[-0.02em] text-cream">
                {m.name}
              </h3>
              <p className="t-micro mt-2 !text-teal">{t(m.title)}</p>
              <p className="t-body mt-3">{t(m.body)}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {m.tags[lang].map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-cream/20 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-cream/55"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </SceneStage>
  );
}

/* ------------------------------ Act 8 · Voices ------------------------------ */

export function ChapterVoices() {
  const { t } = useExperience();
  return (
    <SceneStage
      id="voices"
      fallback={FALLBACKS.warm}
      veil="vignette"
      dim={0.15}
      tall={false}
    >
      <div className="bleed py-[14vh]">
        <Kicker>{t(voices.label)}</Kicker>
        <h2 className="t-display t-display-caps on-photo mt-4 text-cream">
          {t(voices.heading)}
        </h2>
        <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {voices.items.map((v) => (
            <li key={v.school} className="rule-dotted flex flex-col pt-6">
              <p className="font-display flex-1 text-lg font-bold leading-[1.35] tracking-[-0.01em] text-cream/90">
                “{t(v.quote)}”
              </p>
              <div className="mt-8">
                <p className="font-display text-sm font-extrabold text-cream">
                  {t(v.name)}
                </p>
                <p className="t-micro mt-1 !text-teal">{v.school}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SceneStage>
  );
}

/* ----------------------------- Act 10 · Services ---------------------------- */

export function ChapterServices() {
  const { t, lang, intent, setIntent } = useExperience();
  const active =
    services.tiers.find((tier) => tier.id === intent) ?? services.tiers[0];

  return (
    <SceneStage id="services" fallback={FALLBACKS.dark} veil="vignette" dim={0.2}>
      <div className="bleed flex flex-1 flex-col justify-center py-[12vh]">
        {/* kicker + giant wordmark + pill row, stacked dead centre (f19) */}
        <div className="text-center">
          <Kicker>{t(services.heading)}</Kicker>
          <p className="t-wordmark on-photo mt-3 text-cream">
            {hero.titleA} {hero.titleB}
          </p>
          <div
            className="mt-8 flex flex-wrap justify-center gap-3"
            role="tablist"
            aria-label={t(services.heading)}
          >
            {services.tiers.map((tier) => {
              const on = tier.id === active.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setIntent(tier.id as IntentKey)}
                  className={`pill ${on ? "pill-active" : ""}`}
                >
                  {t(tier.name)}
                </button>
              );
            })}
          </div>
        </div>

        {/* three columns: description · (Halo shows through) · feature list */}
        <div className="mt-[10vh] grid grid-cols-12 items-start gap-y-12">
          <div className="col-span-12 md:col-span-3">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-[0.01em] text-cream">
              {t(active.name)}
            </h3>
            <p className="t-body mt-3">{t(active.tagline)}</p>
          </div>
          <ul className="col-span-12 space-y-4 md:col-span-4 md:col-start-9">
            {active.points[lang].map((p) => (
              <li key={p} className="flex items-start gap-3">
                <DotMark />
                <span className="font-display text-sm font-extrabold text-cream">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <a href="#contact" className="btn-cream mx-auto mt-[8vh] w-fit">
          {t(services.cta)}
        </a>
      </div>
    </SceneStage>
  );
}

/* ------------------------------ Act 11 · Contact ---------------------------- */

export function ChapterContact() {
  const { t, intent, setIntent } = useExperience();
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <SceneStage
      id="contact"
      photo={SCENE_PHOTOS.contact}
      fallback={FALLBACKS.dark}
      veil="left"
      dim={0.35}
    >
      <div className="bleed flex flex-1 flex-col justify-center py-[14vh]">
        {/* oversized closing statement, right-weighted like f21 */}
        {/* px width, not ch — `ch` here resolves against the div's 16px font
            and would wrap the display headline mid-phrase */}
        <div className="ml-auto max-w-[34rem] text-right">
          <h2 className="t-display t-display-caps on-photo text-cream">
            {t(footer.heading)}
          </h2>
          <p className="t-lead on-photo ml-auto mt-6 text-right">
            {t(footer.sub)}
          </p>
          <a href={contact.phoneHref} className="btn-lozenge mt-9">
            {contact.phone}
          </a>
        </div>

        <div className="mt-[12vh] grid grid-cols-12 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <div className="frame-dashed p-5">
              <p className="t-micro !text-teal">{t(footer.wechatLabel)}</p>
              <div className="mt-4 inline-block bg-white p-2">
                <Image
                  src={contact.qr}
                  alt={t(footer.scan)}
                  width={124}
                  height={124}
                  className="h-28 w-28 object-cover"
                />
              </div>
              <p className="t-micro mt-4">{t(footer.scan)}</p>
            </div>
            <div className="mt-6">
              <p className="t-micro">{t(footer.hoursLabel)}</p>
              <p className="font-display mt-2 text-sm font-extrabold text-cream">
                {t(contact.hours)}
              </p>
              <p className="font-display text-sm font-extrabold text-cream">
                {t(contact.cities)}
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="t-micro">{t(footer.formTitle)}</p>
            {done ? (
              <p className="t-lead mt-8 !text-teal">{t(footer.success)}</p>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                <input
                  required
                  name="name"
                  className="input-film"
                  placeholder={t(footer.name)}
                />
                <input
                  required
                  name="reach"
                  className="input-film"
                  placeholder={t(footer.reach)}
                />
                <select
                  name="intent"
                  className="input-film"
                  required
                  value={intent}
                  onChange={(e) => setIntent(e.target.value as IntentKey)}
                >
                  <option value="ug">{t(footer.intents.ug)}</option>
                  <option value="grad">{t(footer.intents.grad)}</option>
                  <option value="demo">{t(footer.intents.demo)}</option>
                  <option value="other">{t(footer.intents.other)}</option>
                </select>
                <textarea
                  name="message"
                  rows={2}
                  className="input-film resize-y"
                  placeholder={t(footer.message)}
                />
                <button type="submit" className="btn-cream">
                  {t(footer.submit)}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="t-micro mt-[10vh] !text-cream/30">{footer.copyright}</p>
      </div>
    </SceneStage>
  );
}
