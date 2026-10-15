"use client";

import { LanguageProvider, useLanguage } from "@/lib/language-context";
import { Header } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { Ribbon } from "@/components/site/ribbon";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Gallery } from "@/components/site/gallery";
import { Barbers } from "@/components/site/barbers";
import { Reviews } from "@/components/site/reviews";
import { SectionDivider } from "@/components/site/divider";
import { Faq } from "@/components/site/faq";
import { Location } from "@/components/site/location";
import { GiftCard } from "@/components/site/gift-card";
import { FinalCta } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { ScrollTop } from "@/components/site/scroll-top";

function PageBody() {
  const { t } = useLanguage();

  return (
    /* min-h-screen + flex + mt-auto footer = footer always reaches
       the bottom, and is pushed naturally on tall pages. */
    <div className="flex min-h-svh flex-col">
      {/* Keyboard skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-charcoal"
      >
        {t.header.skipToContent}
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Hero />
        <Ribbon />
        <About />
        <Services />
        <Gallery />
        <Barbers />
        <Reviews />
        <SectionDivider />
        <Faq />
        <Location />
        <SectionDivider />
        <GiftCard />
        <FinalCta />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <ScrollTop />
    </div>
  );
}

export default function Page() {
  return (
    <LanguageProvider>
      <PageBody />
    </LanguageProvider>
  );
}
