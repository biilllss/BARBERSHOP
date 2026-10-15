"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Flame, Printer, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { WhatsAppIcon } from "./icons";
import { CedarLeaf } from "./cedar-leaf";
import { BookingDialog } from "./booking-dialog";
import {
  SERVICES,
  SERVICE_IMAGE_INDEX,
  IMAGES,
  waLink,
  lbpFromUsd,
  CURRENCY,
} from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

type Currency = "USD" | "LBP";

/**
 * The barber menu. Rows open a detail dialog (photo, chair time, what's
 * included) whose booking CTA feeds the two-step booking flow with the
 * service pre-attached; a direct WhatsApp link stays as a fallback.
 * Prices toggle between USD and L.L. with a config-driven rate.
 */
export function Services() {
  const { t, lang, isAr } = useLanguage();
  /** id of the service whose detail dialog is open */
  const [openId, setOpenId] = useState<string | null>(null);
  const openService = SERVICES.find((s) => s.id === openId) ?? null;

  /** Currency the menu is quoted in (USD default; L.L. from config rate). */
  const [currency, setCurrency] = useState<Currency>("USD");
  const isLbp = currency === "LBP";

  /** Service handed to the booking flow (pre-selected chip in the dialog). */
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | null>(null);

  const openBookingWith = (serviceId: string) => {
    setBookingService(serviceId);
    setOpenId(null); // close the detail dialog first — no nesting
    setBookingOpen(true);
  };

  const priceFor = (usd: number) =>
    isLbp ? (
      <>
        {lbpFromUsd(usd)}
        <span className="ms-1 align-top text-xs font-semibold text-cream-muted/80">
          {isAr ? "ل.ل" : "L.L."}
        </span>
      </>
    ) : (
      <>
        <span className="align-top text-sm text-cream-muted">$</span>
        {usd}
      </>
    );

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative overflow-hidden border-y border-cream/10 bg-charcoal-soft py-24 sm:py-32"
    >
      {/* Giant ghost cedar behind the menu — pure editorial decoration */}
      <CedarLeaf className="pointer-events-none absolute -top-12 end-[-8rem] hidden h-[34rem] w-[34rem] rotate-12 select-none text-gold opacity-[0.035] print:hidden sm:block" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="services-title"
            index="02"
            kicker={t.services.kicker}
            title={t.services.title}
            subtitle={t.services.subtitle}
          />
        </FadeIn>

        {/* Currency toggle — USD ⇄ L.L. at the config rate */}
        <FadeIn delay={90}>
          <div className="mt-8 flex items-center justify-end gap-3 print:hidden">
            <span
              id="currency-label"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-muted/70"
            >
              {t.services.currency.label}
            </span>
            <div
              role="group"
              aria-labelledby="currency-label"
              className="flex border border-cream/15 p-0.5"
            >
              {(["USD", "LBP"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300",
                    currency === c
                      ? "bg-gold text-charcoal"
                      : "text-cream-muted hover:text-cream"
                  )}
                >
                  {c === "USD" ? t.services.currency.usd : t.services.currency.lbp}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Barber-menu grid: two columns on desktop */}
        <FadeIn delay={140}>
          <ul className="mt-10 grid gap-x-16 gap-y-2 lg:grid-cols-2">
            {SERVICES.map((service) => {
              const name = isAr ? service.nameAr : service.nameEn;
              const desc = isAr ? service.descAr : service.descEn;
              return (
                <li key={service.id} className="group border-b border-cream/10">
                  <button
                    type="button"
                    onClick={() => setOpenId(service.id)}
                    aria-haspopup="dialog"
                    aria-label={t.services.detailsAria.replace("{name}", name)}
                    className="flex w-full items-baseline rounded-sm px-3 py-5 text-start transition-all duration-300 -mx-3 hover:bg-cream/[0.035] focus-visible:bg-cream/[0.035] sm:-mx-3"
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="font-display text-xl text-cream transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                          {name}
                        </span>
                        {service.featured && (
                          <span className="border border-gold/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                            {t.services.signature}
                          </span>
                        )}
                        {service.popular && (
                          <span className="flex items-center gap-1.5 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                            <Flame className="size-3" aria-hidden="true" />
                            {t.services.popular}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-cream-muted">{desc}</span>
                    </span>
                    {/* Dotted price leader — the classic menu trick */}
                    <span aria-hidden="true" className="leader-dots" />
                    <span
                      className={cn(
                        "shrink-0 font-display font-semibold text-gold transition-transform duration-300 group-hover:-translate-y-0.5",
                        isLbp ? "text-lg tabular-nums sm:text-xl" : "text-2xl tabular-nums"
                      )}
                    >
                      {priceFor(service.price)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FadeIn>

        <FadeIn delay={220}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm tracking-wide text-cream-muted" aria-live="polite">
              {isLbp
                ? t.services.noteLbp.replace("{rate}", CURRENCY.usdToLbp.toLocaleString("en-US"))
                : t.services.note}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border border-cream/20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream-muted transition-colors duration-300 hover:border-gold hover:text-gold print:hidden"
            >
              <Printer className="size-4" aria-hidden="true" />
              {t.services.print}
            </button>
          </div>
          {/* Print-only LBP reference — the letterhead quotes both currencies */}
          <p className="mt-4 hidden text-xs italic print:block">
            {t.services.printNote.replace(
              "{rate}",
              CURRENCY.usdToLbp.toLocaleString("en-US")
            )}
          </p>
        </FadeIn>
      </div>

      {/* Service detail dialog — photo, chair time, what's included, book */}
      <Dialog
        open={openService !== null}
        onOpenChange={(o) => !o && setOpenId(null)}
      >
        {openService && (
          <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            className="max-w-lg gap-0 overflow-hidden border-cream/10 bg-charcoal-soft p-0"
          >
            <DialogTitle className="sr-only">
              {isAr ? openService.nameAr : openService.nameEn}
            </DialogTitle>

            {/* Photo strip with price flag */}
            <div className="relative h-44 w-full sm:h-52">
              <Image
                src={IMAGES.gallery[SERVICE_IMAGE_INDEX[openService.id] ?? 0]}
                alt={t.gallery.alts[SERVICE_IMAGE_INDEX[openService.id] ?? 0]}
                fill
                sizes="(min-width: 512px) 512px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-charcoal-soft via-charcoal-soft/20 to-transparent"
              />
              <span
                className={cn(
                  "absolute bottom-3 end-4 bg-gold px-3 py-1 font-display font-bold text-charcoal tabular-nums",
                  isLbp ? "text-sm" : "text-lg"
                )}
              >
                {priceFor(openService.price)}
              </span>
            </div>

            <div className="p-6 sm:p-7">
              {/* Name + signature tag + duration chip */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="font-display text-2xl text-cream sm:text-[1.7rem]">
                  {isAr ? openService.nameAr : openService.nameEn}
                </h3>
                {openService.featured && (
                  <span className="border border-gold/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {t.services.signature}
                  </span>
                )}
                {openService.popular && (
                  <span className="flex items-center gap-1.5 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                    <Flame className="size-3" aria-hidden="true" />
                    {t.services.popular}
                  </span>
                )}
              </div>
              <p className="mt-2.5 inline-flex items-center gap-2 border border-cream/15 px-2.5 py-1 text-xs font-medium tracking-wide text-cream-muted">
                <Clock className="size-3.5 text-gold" aria-hidden="true" />
                {t.services.duration.replace(
                  "{n}",
                  String(openService.durationMin)
                )}
              </p>

              {/* What's included */}
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                {t.services.includesLabel}
              </p>
              <ul className="mt-3 space-y-2.5">
                {(isAr ? openService.includesAr : openService.includesEn).map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-cream/90">
                      <span aria-hidden="true" className="mt-1.5 block size-1.5 shrink-0 rotate-45 bg-gold" />
                      {item}
                    </li>
                  )
                )}
              </ul>

              {/* Booking CTA — opens the 2-step flow with this service attached */}
              <button
                type="button"
                onClick={() => openBookingWith(openService.id)}
                className="sheen glow-gold mt-7 flex h-12 w-full items-center justify-center gap-2.5 bg-gold text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-4" aria-hidden="true" />
                {t.services.bookCta}
              </button>
              <p className="mt-3 text-center text-xs text-cream-muted">
                {t.services.directWa}{" "}
                <a
                  href={waLink(lang, isAr ? openService.nameAr : openService.nameEn)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold underline-offset-4 transition-colors hover:text-cream hover:underline"
                >
                  WhatsApp ↗
                </a>
              </p>
            </div>

            {/* Explicit close (dialog overlay click also works) */}
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label={t.services.closeDetails}
              className="absolute end-3 top-3 flex size-9 items-center justify-center border border-cream/15 bg-charcoal/80 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </DialogContent>
        )}
      </Dialog>

      {/* Two-step booking flow with the chosen service pre-attached */}
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialService={bookingService}
      >
        {() => null}
      </BookingDialog>
    </section>
  );
}
