"use client";

import { useEffect, useState } from "react";
import { ExperienceProvider } from "@/lib/experience-store";
import { RingCanvas } from "./RingCanvas";
import { ScrollDriver } from "./ScrollDriver";
import { Preloader } from "./Preloader";
import {
  SiteHeader,
  ScrollHint,
  ChapterRail,
  PageFrame,
} from "@/components/ui/SiteChrome";
import {
  ChapterIntro,
  ChapterManifesto,
  ChapterMethod,
  ChapterSystems,
  ChapterCases,
  ChapterTeam,
  ChapterVoices,
  ChapterServices,
  ChapterContact,
} from "@/components/chapters/Chapters";

function useMediaFlags() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      setReducedMotion(mqMotion.matches);
      setIsMobile(mqMobile.matches);
    };
    apply();
    mqMotion.addEventListener("change", apply);
    mqMobile.addEventListener("change", apply);
    return () => {
      mqMotion.removeEventListener("change", apply);
      mqMobile.removeEventListener("change", apply);
    };
  }, []);

  return { reducedMotion, isMobile };
}

export function Experience() {
  const flags = useMediaFlags();

  return (
    <ExperienceProvider
      reducedMotion={flags.reducedMotion}
      isMobile={flags.isMobile}
    >
      <div className="relative min-h-screen bg-stage text-cream">
        {/* WebGL halo sits above photo stages, below UI chrome */}
        <RingCanvas />
        <Preloader />
        <SiteHeader />
        <ScrollHint />
        <ChapterRail />
        <PageFrame />
        <ScrollDriver />
        <main className="relative z-[1]">
          <ChapterIntro />
          <ChapterManifesto />
          <ChapterMethod />
          <ChapterSystems />
          <ChapterCases />
          <ChapterTeam />
          <ChapterVoices />
          <ChapterServices />
          <ChapterContact />
        </main>
      </div>
    </ExperienceProvider>
  );
}
