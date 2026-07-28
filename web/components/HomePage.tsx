"use client";

import { AppProvider } from "@/lib/i18n";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { Cases } from "./Cases";
import { Team } from "./Team";
import { Voices } from "./Voices";
import { ContactFooter } from "./ContactFooter";
import { Modals } from "./Modals";

export function HomePage() {
  return (
    <AppProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Cases />
        <Team />
        <Voices />
      </main>
      <ContactFooter />
      <Modals />
    </AppProvider>
  );
}
