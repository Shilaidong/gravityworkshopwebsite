"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { useApp } from "@/lib/i18n";

const links = [
  { href: "#about", key: "about" as const },
  { href: "#services", key: "services" as const },
  { href: "#cases", key: "cases" as const },
  { href: "#team", key: "team" as const },
];

export function Header() {
  const { t, lang, toggleLang, openModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
      style={{ height: "var(--nav-h)" }}
    >
      <div className="container-wide flex h-full items-center justify-between px-[var(--space-gutter)]">
        <a
          href="#top"
          className="font-display text-[0.95rem] font-semibold tracking-tight text-ink"
        >
          <span className="hidden sm:inline">引力坊 </span>
          <span className="text-ink">GRAVITY FANG</span>
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {t(nav[link.key])}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft transition-colors hover:bg-teal-soft hover:text-ink"
            aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
          >
            {lang === "zh" ? "EN" : "中文"}
          </button>

          <button
            type="button"
            onClick={() => openModal("contact")}
            className="btn-primary hidden !px-4 !py-2 text-sm sm:inline-flex"
          >
            {t(nav.contact)}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t(nav.close) : t(nav.menu)}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-line bg-paper md:hidden"
        >
          <nav
            className="flex flex-col gap-1 px-[var(--space-gutter)] py-4"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-teal-soft"
                onClick={() => setOpen(false)}
              >
                {t(nav[link.key])}
              </a>
            ))}
            <button
              type="button"
              className="btn-primary mt-2 w-full"
              onClick={() => {
                setOpen(false);
                openModal("contact");
              }}
            >
              {t(nav.contact)}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
