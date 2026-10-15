"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { BeforeAfter } from "./before-after";
import {
  GALLERY_FILTERS,
  GALLERY_ITEM_BARBER,
  GALLERY_ITEM_TAGS,
  GALLERY_PAGE_SIZE,
  IMAGES,
  type GalleryFilter,
} from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

/** Event fired by the barber profiles to preselect a gallery filter. */
export const GALLERY_FILTER_EVENT = "bc:gallery-filter";

export function Gallery() {
  const { t, isAr } = useLanguage();
  const [filter, setFilter] = useState<GalleryFilter>("all");
  /** Open lightbox image — index into the FULL gallery array. */
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  /** "Load more" — false shows only the first GALLERY_PAGE_SIZE items. */
  const [expanded, setExpanded] = useState(false);

  const fill = (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  /*
   * Barber profiles dispatch GALLERY_FILTER_EVENT to preselect a
   * specialty filter (their work in front of the lens) and scroll here.
   * setState inside the event callback is lint-safe.
   */
  useEffect(() => {
    const onPreset = (e: Event) => {
      const tag = (e as CustomEvent<string>).detail;
      if (GALLERY_FILTERS.includes(tag as GalleryFilter)) {
        setFilter(tag as GalleryFilter);
      }
    };
    window.addEventListener(GALLERY_FILTER_EVENT, onPreset);
    return () => window.removeEventListener(GALLERY_FILTER_EVENT, onPreset);
  }, []);

  /** Items under the current filter, with their original indexes. */
  const filtered = IMAGES.gallery
    .map((src, idx) => ({ src, idx, tag: GALLERY_ITEM_TAGS[idx] }))
    .filter((item) => filter === "all" || item.tag === filter);

  /** What's actually on the wall right now (capped until expanded). */
  const shown = expanded ? filtered : filtered.slice(0, GALLERY_PAGE_SIZE);
  const hiddenCount = filtered.length - shown.length;

  const openPos = openIdx === null ? -1 : shown.findIndex((v) => v.idx === openIdx);

  const go = (dir: 1 | -1) => {
    if (openPos < 0 || shown.length === 0) return;
    const next = shown[(openPos + dir + shown.length) % shown.length];
    setOpenIdx(next.idx);
  };

  /**
   * Adjacent-image preloading — once the lightbox is open (or moves),
   * fetch the neighbours at full resolution so prev/next feels instant.
   */
  useEffect(() => {
    if (openIdx === null || openPos < 0 || shown.length < 2) return;
    const preload = (dir: 1 | -1) => {
      const next = shown[(openPos + dir + shown.length) % shown.length];
      // NB: `Image` here is the next/image component — create the DOM
      // element explicitly to avoid shadowing the constructor.
      const im = document.createElement("img");
      im.src = IMAGES.galleryFull[next.idx];
    };
    preload(1);
    preload(-1);
  }, [openIdx, filter, expanded]);

  /*
   * Touch swipe — horizontal drags ≥ 48px flip to prev/next.
   * Swipe left = next (carousel convention), mirrored in RTL to match
   * the direction-aware arrow-key behaviour.
   */
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onSwipeStart = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onSwipeEnd = (e: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? (isAr ? -1 : 1) : isAr ? 1 : -1);
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="gallery-title"
            index="03"
            kicker={t.gallery.kicker}
            title={t.gallery.title}
            subtitle={t.gallery.subtitle}
          />
        </FadeIn>

        {/* Before / After reveal slider */}
        <BeforeAfter />

        {/* Category filters */}
        <FadeIn delay={160}>
          <div
            role="group"
            aria-label={t.gallery.kicker}
            className="mt-14 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible"
          >
            {GALLERY_FILTERS.map((f) => {
              const count =
                f === "all"
                  ? IMAGES.gallery.length
                  : GALLERY_ITEM_TAGS.filter((tag) => tag === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
                    filter === f
                      ? "border-gold bg-gold text-charcoal"
                      : "border-cream/15 text-cream-muted hover:border-cream/40 hover:text-cream"
                  )}
                >
                  {t.gallery.filters[f]}
                  <span
                    className={cn(
                      "font-display text-[10px] tabular-nums",
                      filter === f ? "text-charcoal/70" : "text-gold"
                    )}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        <div
          key={filter}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {shown.map(({ src, idx }, i) => {
            const barberNum = GALLERY_ITEM_BARBER[idx] ?? null;
            const barberName =
              barberNum === null ? null : t.barbers.names[barberNum];
            return (
            <FadeIn key={src} delay={i * 90} as="figure">
              <button
                type="button"
                onClick={() => setOpenIdx(idx)}
                aria-label={t.gallery.alts[idx]}
                className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-charcoal-soft"
              >
                <Image
                  src={src}
                  alt={t.gallery.alts[idx]}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                />
                {/* Corner brackets — editorial gold frame on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <span className="absolute bottom-0 start-0 size-4 border-b border-s border-gold" />
                  <span className="absolute bottom-0 end-0 size-4 border-b border-e border-gold" />
                  <span className="absolute start-0 top-0 size-4 border-s border-t border-gold" />
                  <span className="absolute end-0 top-0 size-4 border-e border-t border-gold" />
                </span>
                {/* Corner index detail */}
                <span
                  aria-hidden="true"
                  className="absolute top-3 start-3 font-display text-sm italic text-cream/0 transition-colors duration-500 group-hover:text-gold"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {/* Expand hint on hover */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 end-3 border border-cream/0 bg-charcoal/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100"
                >
                  +
                </span>
                {/* Barber attribution chip — who did this work */}
                {barberName && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 start-3 border border-gold/0 bg-charcoal/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100"
                  >
                    {fill(t.gallery.by, { name: barberName })}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-start scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
                />
              </button>
            </FadeIn>
            );
          })}
        </div>

        {/* Load more / show less — only when a filter actually hides items
            ("All work" hides 6 until expanded; every tag fits on one page) */}
        {(expanded || hiddenCount > 0) && filtered.length > GALLERY_PAGE_SIZE && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="group inline-flex items-center gap-3 border border-gold/40 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
            >
              {expanded ? t.gallery.showLess : t.gallery.loadMore}
              {!expanded && (
                <span
                  className={cn(
                    "font-display text-xs tabular-nums",
                    "text-gold/70 group-hover:text-charcoal/70"
                  )}
                >
                  +{String(hiddenCount).padStart(2, "0")}
                </span>
              )}
              {expanded ? (
                <ChevronUp className="size-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox — navigates within the filtered set */}
      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        {openIdx !== null && (
          <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            className="max-w-4xl gap-0 overflow-hidden border-cream/10 bg-charcoal p-0"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") go(isAr ? 1 : -1);
              if (e.key === "ArrowRight") go(isAr ? -1 : 1);
            }}
          >
            <DialogTitle className="sr-only">{t.gallery.alts[openIdx]}</DialogTitle>

            <div
              className="relative h-[68vh] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[72vh]"
              onPointerDown={onSwipeStart}
              onPointerUp={onSwipeEnd}
              onPointerCancel={() => (swipe.current = null)}
            >
              <Image
                src={IMAGES.galleryFull[openIdx]}
                alt={t.gallery.alts[openIdx]}
                fill
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-contain"
                priority
                draggable={false}
              />
            </div>

            {/* Prev / Next — logical sides so they mirror in RTL */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.lightbox.prev}
              className="absolute start-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-cream/15 bg-charcoal/80 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              {isAr ? (
                <ChevronRight className="size-5" aria-hidden="true" />
              ) : (
                <ChevronLeft className="size-5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.lightbox.next}
              className="absolute end-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-cream/15 bg-charcoal/80 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              {isAr ? (
                <ChevronLeft className="size-5" aria-hidden="true" />
              ) : (
                <ChevronRight className="size-5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpenIdx(null)}
              aria-label={t.lightbox.close}
              className="absolute end-3 top-3 flex size-10 items-center justify-center border border-cream/15 bg-charcoal/80 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            {/* Caption strip — alt text + barber credit + position */}
            <div className="flex items-center justify-between gap-4 border-t border-cream/10 px-4 py-3">
              <p className="truncate text-sm text-cream-muted">
                {t.gallery.alts[openIdx]}
                {GALLERY_ITEM_BARBER[openIdx] !== null &&
                  GALLERY_ITEM_BARBER[openIdx] !== undefined && (
                    <span className="text-gold">
                      {" \u2014 "}
                      {fill(t.gallery.by, {
                        name: t.barbers.names[GALLERY_ITEM_BARBER[openIdx] as number],
                      })}
                    </span>
                  )}
              </p>
              {/* dir=ltr keeps "1 / 6" from bidi-flipping to "6 / 1" in AR */}
              <p
                dir="ltr"
                className="shrink-0 font-display text-sm tabular-nums text-gold"
              >
                {openPos + 1} / {shown.length}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
