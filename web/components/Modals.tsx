"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cases, contact, footer, nav } from "@/lib/content";
import { useApp } from "@/lib/i18n";

const PAGE_SIZE = 6;

export function Modals() {
  const { modal, closeModal, t, lang } = useApp();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (modal === "cases") setPage(1);
  }, [modal]);

  const totalPages = Math.ceil(cases.all.length / PAGE_SIZE);
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return cases.all.slice(start, start + PAGE_SIZE);
  }, [page]);

  if (!modal) return null;

  const title =
    modal === "contact"
      ? t(nav.contact)
      : t(cases.archive);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        aria-label={t(nav.close)}
        onClick={closeModal}
      />

      <div className="relative z-10 flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line bg-paper shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3
            id="modal-title"
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-teal-soft hover:text-ink"
          >
            {t(nav.close)}
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {modal === "contact" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-paper-elevated p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-mute">
                  {t(footer.phoneLabel)}
                </p>
                <a
                  href={contact.phoneHref}
                  className="font-display mt-3 block text-2xl font-semibold text-ink hover:text-teal"
                >
                  {contact.phone}
                </a>
                <p className="mt-4 text-sm text-ink-soft">
                  {t(footer.hoursLabel)}: {t(contact.hours)}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{t(contact.cities)}</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-line bg-paper-elevated p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-mute">
                  {t(footer.wechatLabel)}
                </p>
                <Image
                  src={contact.qr}
                  alt={t(footer.scan)}
                  width={160}
                  height={160}
                  className="mt-4 h-36 w-36 object-cover"
                />
                <p className="mt-4 text-sm text-ink-soft">{t(footer.scan)}</p>
              </div>
            </div>
          )}

          {modal === "cases" && (
            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {pageItems.map((item) => (
                  <li
                    key={`${item.school}-${item.major}`}
                    className="rounded-xl border border-line bg-paper-elevated p-4"
                  >
                    <p className="font-display text-base font-semibold tracking-tight text-ink">
                      {item.school}
                    </p>
                    <p className="mt-1 text-sm font-medium text-teal">
                      {item.major}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-mute">
                      {item.background}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {lang === "zh" ? "上一页" : "Prev"}
                </button>
                <span className="text-sm text-mute">
                  {lang === "zh"
                    ? `${page} / ${totalPages}`
                    : `${page} / ${totalPages}`}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  {lang === "zh" ? "下一页" : "Next"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
