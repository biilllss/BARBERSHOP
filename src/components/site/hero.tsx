"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { IMAGES } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { WhatsAppButton } from "./whatsapp-button";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="top"
      aria-label="Blade & Cedar — introduction"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="ken-burns object-cover object-center opacity-45"
        />
        {/* Layered charcoal washes keep text contrast high everywhere */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/85 via-charcoal/60 to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/30 to-charcoal/70" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-32 sm:px-8">
        <div className="max-w-3xl">
          <p className="kicker hero-rise" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
            <span aria-hidden="true" className="h-px w-10 bg-gold/70" />
            {t.hero.kicker}
          </p>

          <h1
            className="headline hero-rise mt-6 text-[clamp(2.75rem,9vw,6rem)] font-bold leading-[1.05]"
            style={{ "--rise-delay": "260ms" } as React.CSSProperties}
          >
            {t.hero.titleA}
            <br />
            <em className="font-medium italic text-gold">{t.hero.titleB}</em>
          </h1>

          <p
            className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg"
            style={{ "--rise-delay": "430ms" } as React.CSSProperties}
          >
            {t.hero.sub}
          </p>

          <div
            className="hero-rise mt-10 flex flex-wrap items-center gap-4"
            style={{ "--rise-delay": "580ms" } as React.CSSProperties}
          >
            <WhatsAppButton size="lg" label={t.hero.ctaPrimary} />
            <a
              href="#services"
              className="inline-flex h-12 items-center justify-center border border-cream/25 px-8 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-all duration-300 hover:border-gold hover:text-gold"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Vertical side label — desktop only, mirrored by logical `end` */}
      <p
        aria-hidden="true"
        className="hero-rise absolute end-7 top-1/2 hidden -translate-y-1/2 select-none text-[10px] font-medium uppercase tracking-[0.4em] text-cream/30 [writing-mode:vertical-rl] lg:block"
        style={{ "--rise-delay": "1100ms" } as React.CSSProperties}
      >
        {t.hero.vertical}
      </p>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label={t.hero.scroll}
        className="hero-rise group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/50 transition-colors hover:text-gold sm:flex"
        style={{ "--rise-delay": "950ms" } as React.CSSProperties}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          {t.hero.scroll}
        </span>
        <ArrowDown className="size-4 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
