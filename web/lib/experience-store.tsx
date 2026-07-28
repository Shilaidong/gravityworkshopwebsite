"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./content";
import { DEFAULT_TIMELINE, type Keyframe } from "./scroll-story";

/** Matches footer.intents keys in content.ts */
export type IntentKey = "ug" | "grad" | "demo" | "other";

type ExperienceContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  progress: number;
  setProgress: (p: number) => void;
  ready: boolean;
  setReady: (v: boolean) => void;
  reducedMotion: boolean;
  isMobile: boolean;
  t: <T extends Record<Lang, string>>(dict: T) => string;
  /** Halo keyframes, re-derived from real act positions once measured */
  frames: Keyframe[];
  setFrames: (f: Keyframe[]) => void;
  /** Service tier chosen in the 选配 act — prefills the contact form */
  intent: IntentKey;
  setIntent: (i: IntentKey) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({
  children,
  reducedMotion,
  isMobile,
}: {
  children: ReactNode;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const [lang, setLang] = useState<Lang>("zh");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [frames, setFrames] = useState<Keyframe[]>(DEFAULT_TIMELINE);
  const [intent, setIntent] = useState<IntentKey>("ug");

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "zh" ? "en" : "zh"));
  }, []);

  const t = useCallback(
    <T extends Record<Lang, string>>(dict: T) => dict[lang],
    [lang],
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      progress,
      setProgress,
      ready,
      setReady,
      reducedMotion,
      isMobile,
      t,
      frames,
      setFrames,
      intent,
      setIntent,
    }),
    [
      lang,
      toggleLang,
      progress,
      ready,
      reducedMotion,
      isMobile,
      t,
      frames,
      intent,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience requires ExperienceProvider");
  return ctx;
}
