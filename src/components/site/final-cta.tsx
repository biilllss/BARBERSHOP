"use client";

import { useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { FadeIn } from "./fade-in";
import { BookingDialog } from "./booking-dialog";
import { WhatsAppIcon } from "./icons";
import { CedarLeaf } from "./cedar-leaf";
import { useLanguage } from "@/lib/language-context";
import { SITE_CONFIG } from "@/lib/config";

export function FinalCta() {
  const { t, isAr } = useLanguage();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  /** Web Share with clipboard fallback (visual "link copied" feedback). */
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: isAr ? SITE_CONFIG.nameAr : SITE_CONFIG.name,
          text: t.cta.sub,
          url,
        });
        return;
      }
      throw new Error("share-unsupported");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        if (copyTimer.current) window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => setCopied(false), 2400);
      } catch {
        /* clipboard unavailable — silently ignore */
      }
    }
  };

  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      {/* Soft gold glow framing the close */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-3xl"
      />
      {/* Cedar signature — barely-there watermark */}
      <CedarLeaf
        className="pointer-events-none absolute start-1/2 top-1/2 -z-10 w-72 -translate-x-1/2 -translate-y-1/2 text-cream/[0.035] rtl:translate-x-1/2 sm:w-96"
      />
      {/* Giant hollow watermark word along the bottom edge */}
      <span
        aria-hidden="true"
        className="text-stroke pointer-events-none absolute inset-x-0 bottom-2 -z-10 select-none whitespace-nowrap text-center font-display text-[16vw] font-bold italic leading-none sm:bottom-0"
      >
        {t.cta.watermark}
      </span>

      <FadeIn className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="kicker justify-center">
          <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
          {t.cta.kicker}
          <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
        </p>
        <h2
          id="cta-title"
          className="headline mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
        >
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-cream-muted">{t.cta.sub}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen}>
            {(openBooking) => (
              <button
                type="button"
                onClick={openBooking}
                className="sheen inline-flex h-14 items-center justify-center gap-3 bg-gold px-10 text-base font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep hover:shadow-[0_8px_30px_rgba(201,162,75,0.25)] active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5" aria-hidden="true" />
                {t.cta.button}
              </button>
            )}
          </BookingDialog>

          {/* Share — native sheet where available, clipboard elsewhere */}
          <button
            type="button"
            onClick={share}
            className="inline-flex h-14 items-center justify-center gap-2.5 border border-cream/25 px-8 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-all duration-300 hover:border-gold hover:text-gold"
          >
            {copied ? (
              <Check className="size-4 text-gold" aria-hidden="true" />
            ) : (
              <Share2 className="size-4" aria-hidden="true" />
            )}
            {copied ? t.cta.shareCopied : t.cta.share}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? t.cta.shareCopied : ""}
          </span>
        </div>
      </FadeIn>
    </section>
  );
}
