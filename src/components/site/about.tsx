"use client";

import Image from "next/image";
import { CountUp } from "./count-up";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { IMAGES } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";

export function About() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Portrait with offset gold frame */}
        <FadeIn className="relative order-2 lg:order-1">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -end-4 h-full w-full border border-gold/40"
            />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={IMAGES.about}
                alt={t.about.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"
              />
            </div>
          </div>
        </FadeIn>

        {/* Story */}
        <div className="order-1 lg:order-2">
          <FadeIn>
            <SectionHeading
              id="about-title"
              index="01"
              kicker={t.about.kicker}
              title={t.about.title}
            />
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-8 space-y-5 leading-relaxed text-cream-muted">
              <p className="drop-cap">{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p className="font-display text-lg italic text-cream">{t.about.p3}</p>
            </div>
          </FadeIn>

          {/* Stats — count up on first view */}
          <FadeIn delay={220}>
            <dl className="mt-10 grid grid-cols-3 divide-x divide-cream/10 border-y border-cream/10 py-6 rtl:divide-x-reverse">
              <div className="px-4 text-center sm:px-6 sm:text-start">
                <dt className="order-2 mt-1 block text-[11px] uppercase tracking-[0.18em] text-cream-muted">
                  {t.about.statYears}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold text-gold sm:text-4xl">
                  <CountUp value={8} suffix="+" />
                </dd>
              </div>
              <div className="px-4 text-center sm:px-6 sm:text-start">
                <dt className="order-2 mt-1 block text-[11px] uppercase tracking-[0.18em] text-cream-muted">
                  {t.about.statCuts}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold text-gold sm:text-4xl">
                  <CountUp value={600} suffix="+" />
                </dd>
              </div>
              <div className="px-4 text-center sm:px-6 sm:text-start">
                <dt className="order-2 mt-1 block text-[11px] uppercase tracking-[0.18em] text-cream-muted">
                  {t.about.statRating}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold text-gold sm:text-4xl">
                  <CountUp value={4.9} decimals={1} />
                </dd>
              </div>
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
