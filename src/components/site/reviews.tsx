"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type Review = { quote: string; name: string; service: string };

/**
 * One review card. `fixed` gives it the marquee width; the grid
 * fallback uses h-full instead so rows align.
 */
function ReviewCard({
  review,
  dir,
  fixed = false,
  ariaHidden = false,
}: {
  review: Review;
  dir: "ltr" | "rtl";
  fixed?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <figure
      dir={dir}
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "group relative flex flex-col overflow-hidden border border-cream/10 bg-charcoal-soft p-7 transition-[border-color] duration-500 hover:border-gold/40",
        fixed ? "w-[320px] shrink-0 select-none sm:w-[360px]" : "h-full"
      )}
    >
      {/* Gold accent — sweeps in along the top edge on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-start scale-x-0 bg-gold transition-transform duration-700 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
      {/* Oversized ghost quote mark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-4 top-2 select-none font-display text-7xl italic leading-none text-gold/10"
      >
        &rdquo;
      </span>
      {/* Rating */}
      <div className="flex gap-1 text-gold" role="img" aria-label="5 / 5">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="size-4 fill-gold" aria-hidden="true" />
        ))}
      </div>
      <blockquote
        className={cn(
          "mt-5 flex-1 font-display text-lg italic leading-relaxed text-cream",
          fixed && "line-clamp-5"
        )}
      >
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-cream/10 pt-5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center border border-gold/50 font-display text-sm font-bold text-gold"
        >
          {review.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-cream">
            {review.name}
          </span>
          <span className="block truncate text-xs uppercase tracking-[0.16em] text-cream-muted">
            {review.service}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Reviews — a neutral "What clients say" wall: an auto-scrolling marquee
 * of six cards (pause on hover / focus-within), with a static grid
 * fallback for reduced-motion users. No platform attribution, no counts —
 * just the quotes. Like the ribbon, the track is forced LTR so the -50%
 * loop math is identical in both languages; each card carries its own
 * dir so Arabic quotes stay right-aligned.
 */
export function Reviews() {
  const { t, isAr } = useLanguage();

  /** Reduced-motion users get the static grid instead of the marquee. */
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Apply post-hydration (timeout keeps setState out of the effect body)
    const apply = () => setReduceMotion(mq.matches);
    const timer = window.setTimeout(apply, 0);
    mq.addEventListener("change", apply);
    return () => {
      window.clearTimeout(timer);
      mq.removeEventListener("change", apply);
    };
  }, []);

  const items = t.reviews.items;
  const dir: "ltr" | "rtl" = isAr ? "rtl" : "ltr";

  /* ------------------------------------------------ static grid (RM) */
  if (reduceMotion) {
    return (
      <section id="reviews" aria-labelledby="reviews-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <FadeIn>
            <SectionHeading
              id="reviews-title"
              index="05"
              kicker={t.reviews.kicker}
              title={t.reviews.title}
              align="center"
            />
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {items.map((review) => (
              <ReviewCard key={review.name} review={review} dir={dir} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------- marquee (default) */
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="reviews-title"
            index="05"
            kicker={t.reviews.kicker}
            title={t.reviews.title}
            align="center"
          />
        </FadeIn>
      </div>

      {/* Full-bleed marquee — edge fades melt cards into the charcoal */}
      <div className="relative mt-12" dir="ltr">
        <div
          className="ribbon overflow-hidden py-2"
          role="region"
          aria-label={t.reviews.title}
        >
          <div
            className="animate-marquee flex w-max gap-6 px-3 motion-reduce:animate-none lg:gap-8"
            style={{ animationDuration: "64s" }}
          >
            {items.map((review) => (
              <ReviewCard key={review.name} review={review} dir={dir} fixed />
            ))}
            {items.map((review) => (
              <ReviewCard
                key={`dup-${review.name}`}
                review={review}
                dir={dir}
                fixed
                ariaHidden
              />
            ))}
          </div>
        </div>

        {/* Charcoal edge fades — editorial vignette over the moving cards */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-r from-charcoal to-transparent sm:w-24"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-10 bg-gradient-to-l from-charcoal to-transparent sm:w-24"
        />
      </div>
    </section>
  );
}
