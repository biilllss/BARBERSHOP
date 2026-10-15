"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { BookingDialog } from "./booking-dialog";
import { GALLERY_FILTER_EVENT } from "./gallery";
import { WhatsAppIcon } from "./icons";
import { BARBER_WORK_TAG, IMAGES } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";

export function Barbers() {
  const { t, lang } = useLanguage();
  const [profileIdx, setProfileIdx] = useState<number | null>(null);
  const [booking, setBooking] = useState<{ open: boolean; barber: number | null }>({
    open: false,
    barber: null,
  });

  const openBookingWith = (barber: number | null) =>
    setBooking({ open: true, barber });

  /** Jump to the gallery with this barber's specialty filter preselected. */
  const seeBarberWork = (barber: number) => {
    setProfileIdx(null);
    window.dispatchEvent(
      new CustomEvent(GALLERY_FILTER_EVENT, {
        detail: BARBER_WORK_TAG[barber] ?? "all",
      })
    );
    document
      .getElementById("gallery")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fill = (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  return (
    <section
      id="barbers"
      aria-labelledby="barbers-title"
      className="border-y border-cream/10 bg-charcoal-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="barbers-title"
            index="04"
            kicker={t.barbers.kicker}
            title={t.barbers.title}
            subtitle={t.barbers.subtitle}
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {t.barbers.names.map((name, i) => (
            <FadeIn key={name} delay={i * 120} as="article">
              <div className="group h-full border border-cream/10 bg-charcoal transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40">
                {/* Portrait opens the profile dialog */}
                <button
                  type="button"
                  onClick={() => setProfileIdx(i)}
                  aria-label={`${t.barbers.profileCta} — ${name}`}
                  className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden"
                >
                  <Image
                    src={IMAGES.barbers[i]}
                    alt={t.barbers.alts[i]}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 end-3 font-display text-5xl italic text-cream/15"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-3 start-3 border border-cream/0 bg-charcoal/70 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                    {t.barbers.profileCta}
                  </span>
                </button>

                <div className="p-6">
                  <h3 className="font-display text-2xl text-cream transition-colors duration-300 group-hover:text-gold">
                    {name}
                  </h3>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                    {t.barbers.roles[i]}
                  </p>
                  <span aria-hidden="true" className="gold-rule my-4 block" />
                  <p className="line-clamp-2 text-sm leading-relaxed text-cream-muted">
                    {t.barbers.bios[i]}
                  </p>

                  {/* Book with this barber — preselects him in the dialog */}
                  <button
                    type="button"
                    onClick={() => openBookingWith(i)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-gold/50 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:bg-gold hover:text-charcoal"
                  >
                    <WhatsAppIcon className="size-3.5" aria-hidden="true" />
                    {fill(t.barbers.bookWith, { name })}
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Profile dialog */}
      <Dialog open={profileIdx !== null} onOpenChange={(o) => !o && setProfileIdx(null)}>
        {profileIdx !== null && (
          <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            className="max-w-2xl gap-0 overflow-hidden border-cream/10 bg-charcoal p-0"
          >
            <DialogTitle className="sr-only">
              {t.barbers.names[profileIdx]}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setProfileIdx(null)}
              aria-label={t.barbers.closeProfile}
              className="absolute end-4 top-4 z-10 flex size-9 items-center justify-center border border-cream/15 bg-charcoal/80 text-cream-muted transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="grid sm:grid-cols-[2fr_3fr]">
              {/* Photo side */}
              <div className="relative min-h-64 sm:min-h-full">
                <Image
                  src={IMAGES.barbers[profileIdx]}
                  alt={t.barbers.alts[profileIdx]}
                  fill
                  sizes="(min-width: 640px) 270px, 100vw"
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent"
                />
              </div>

              {/* Info side */}
              <div className="flex flex-col p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  {t.barbers.roles[profileIdx]}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold text-cream">
                  {t.barbers.names[profileIdx]}
                </h3>
                <span aria-hidden="true" className="gold-rule my-5 block" />
                <p className="leading-relaxed text-cream-muted">
                  {t.barbers.bios[profileIdx]}
                </p>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-cream">
                  {t.barbers.specialtiesLabel}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {t.barbers.specialties[profileIdx].map((s) => (
                    <li
                      key={s}
                      className="border border-cream/15 px-3 py-1.5 text-xs text-cream-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                {/* See their work — gallery filter preset, smooth-scrolled */}
                <button
                  type="button"
                  onClick={() => seeBarberWork(profileIdx)}
                  className="group mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold transition-colors duration-300 hover:text-cream"
                >
                  <Images
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  {fill(t.barbers.seeWork, { name: t.barbers.names[profileIdx] })}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileIdx(null);
                    openBookingWith(profileIdx);
                  }}
                  className="mt-8 inline-flex items-center justify-center gap-2.5 bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep"
                >
                  <WhatsAppIcon className="size-4" aria-hidden="true" />
                  {fill(t.barbers.bookWith, { name: t.barbers.names[profileIdx] })}
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Shared booking dialog, pre-selecting a barber when asked */}
      <BookingDialog
        open={booking.open}
        onOpenChange={(o) => setBooking((s) => ({ ...s, open: o }))}
        initialBarber={booking.barber}
      >
        {() => null}
      </BookingDialog>
    </section>
  );
}
