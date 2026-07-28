"use client";

import Image from "next/image";
import { contact, footer } from "@/lib/content";
import { useApp } from "@/lib/i18n";

export function ContactFooter() {
  const { t, openModal } = useApp();

  return (
    <footer
      id="contact"
      className="border-t border-line bg-paper"
      aria-labelledby="contact-heading"
    >
      <div className="section-pad container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <h2
              id="contact-heading"
              className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-ink"
            >
              {t(footer.heading)}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              {t(footer.sub)}
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-mute">
                  {t(footer.phoneLabel)}
                </p>
                <a
                  href={contact.phoneHref}
                  className="font-display mt-2 inline-block text-3xl font-semibold tracking-tight text-ink transition-colors hover:text-teal sm:text-4xl"
                >
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-mute">
                  {t(footer.hoursLabel)}
                </p>
                <p className="mt-2 text-base text-ink-soft">{t(contact.hours)}</p>
                <p className="mt-1 text-base text-ink-soft">{t(contact.cities)}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary mt-10"
              onClick={() => openModal("contact")}
            >
              {t(footer.wechatLabel)}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:col-start-8 lg:items-end">
            <div className="rounded-2xl border border-line bg-paper-elevated p-4">
              <Image
                src={contact.qr}
                alt={t(footer.scan)}
                width={180}
                height={180}
                className="h-40 w-40 object-cover"
              />
            </div>
            <p className="text-sm text-mute">{t(footer.scan)}</p>
            <p className="max-w-xs text-right text-sm leading-relaxed text-ink-soft lg:text-right">
              {t(footer.note)}
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-sm font-semibold tracking-tight text-ink">
            {footer.copyright}
          </p>
          <p className="text-xs text-mute">Precision over spectacle.</p>
        </div>
      </div>
    </footer>
  );
}
