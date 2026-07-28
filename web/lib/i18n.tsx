"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./content";

type ModalKind = "contact" | "cases" | null;

type AppContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  modal: ModalKind;
  openModal: (kind: Exclude<ModalKind, null>) => void;
  closeModal: () => void;
  t: <T extends Record<Lang, string>>(dict: T) => string;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");
  const [modal, setModal] = useState<ModalKind>(null);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "zh" ? "en" : "zh"));
  }, []);

  const openModal = useCallback((kind: Exclude<ModalKind, null>) => {
    setModal(kind);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const t = useCallback(
    <T extends Record<Lang, string>>(dict: T) => dict[lang],
    [lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modal, closeModal]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      modal,
      openModal,
      closeModal,
      t,
    }),
    [lang, toggleLang, modal, openModal, closeModal, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
