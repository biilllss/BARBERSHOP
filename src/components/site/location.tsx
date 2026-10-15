"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { SITE_CONFIG } from "@/lib/config";
import {
  HOURS,
  beirutDayKey,
  beirutNow,
  isOpenNow,
  nextDayKey,
  upcomingOpenDays,
  weekdayOf,
  type OpenState,
} from "@/lib/hours";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
/**
 * Live "Open now / Closed" chip, computed from real Beirut time
 * against the HOURS config. Mounted post-hydration (time-dependent),
 * refreshed every minute.
 */
function OpenBadge() {
  const { t, lang } = useLanguage();
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(isOpenNow());
    // Post-hydration tick: avoids an SSR/client time mismatch.
    const tick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(tick);
      window.clearInterval(interval);
    };
  }, []);

  const fill = (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  let label = "";
  if (state?.open) {
    label = `${t.openBadge.openNow} · ${fill(t.openBadge.closesAt, { time: state.closesAt })}`;
  } else if (state) {
    const next = upcomingOpenDays(1)[0];
    if (next) {
      // "Opens Today/Tomorrow" when the next open day is near; otherwise
      // the full weekday name ("Opens Saturday · 10:00").
      const todayKey = beirutDayKey(new Date());
      const nextKey = beirutDayKey(next);
      const dayName =
        nextKey === todayKey
          ? t.booking.today
          : nextKey === nextDayKey(todayKey)
            ? t.booking.tomorrow
            : new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
                  weekday: "long",
                  timeZone: "Asia/Beirut",
                }).format(next);
      const row = HOURS.find((r) => r.days.includes(weekdayOf(next)));
      label = `${t.openBadge.closedNow} · ${fill(t.openBadge.opensAt, {
        day: dayName,
        time: row?.open ?? "10:00",
      })}`;
    }
  }

  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 self-start border border-cream/12 px-3.5 py-2 text-sm",
        !label && "invisible"
      )}
      role="status"
    >
      <span className="relative flex size-2" aria-hidden="true">
        {state?.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 motion-reduce:animate-none" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            state?.open ? "bg-gold" : "bg-cream-muted/50"
          )}
        />
      </span>
      {label}
    </p>
  );
}

export function Location() {
  const { t, isAr } = useLanguage();
  const [liveMap, setLiveMap] = useState(false);
  /** Beirut weekday (0=Sun…6=Sat) — resolved post-hydration for "Today" highlight. */
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    const tick = window.setTimeout(() => setToday(beirutNow().day), 0);
    return () => window.clearTimeout(tick);
  }, []);

  /** Weekdays covered by each display row (i18n rows follow HOURS order; the leftover row is Sunday). */
  const rowDays = (i: number): number[] => HOURS[i]?.days ?? [0];

  /** Hamra, Beirut — fictional pin around Bechara El Khoury St. */
  const osmEmbed =
    "https://www.openstreetmap.org/export/embed.html?bbox=35.4690%2C33.8900%2C35.4900%2C33.9030&layer=mapnik&marker=33.8971%2C35.4795";

  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="border-y border-cream/10 bg-charcoal-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="visit-title"
            index="07"
            kicker={t.location.kicker}
            title={t.location.title}
          />
        </FadeIn>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Info column */}
          <FadeIn delay={100}>
            <div className="flex h-full flex-col gap-8">
              {/* Live open/closed status */}
              <OpenBadge />

              {/* Address */}
              <div className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center border border-gold/40 text-gold"
                >
                  <MapPin className="size-5" />
                </span>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    {t.location.addressLabel}
                  </h3>
                  <p className="mt-2 leading-relaxed text-cream">
                    {isAr ? SITE_CONFIG.addressAr : SITE_CONFIG.addressEn}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center border border-gold/40 text-gold"
                >
                  <Phone className="size-5" />
                </span>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    {t.location.phoneLabel}
                  </h3>
                  <p className="mt-2 leading-relaxed text-cream" dir="ltr">
                    <a
                      href={`tel:${SITE_CONFIG.phoneDisplay.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-gold"
                    >
                      {SITE_CONFIG.phoneDisplay}
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center border border-gold/40 text-gold"
                >
                  <Clock className="size-5" />
                </span>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    {t.location.hoursLabel}
                  </h3>
                  <dl className="mt-3 divide-y divide-cream/10 border-y border-cream/10">
                    {t.location.hours.map((row, i) => {
                      const isToday = today !== null && rowDays(i).includes(today);
                      return (
                        <div
                          key={row.days}
                          className={cn(
                            "flex items-baseline justify-between gap-6 py-3 transition-colors",
                            isToday && "-mx-3 bg-gold/[0.06] px-3"
                          )}
                        >
                          <dt
                            className={cn(
                              "flex items-center gap-2 text-sm",
                              isToday ? "font-semibold text-gold" : "text-cream-muted"
                            )}
                          >
                            {row.days}
                            {isToday && (
                              <span className="border border-gold/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-gold">
                                {t.location.today}
                              </span>
                            )}
                          </dt>
                          <dd
                            className={cn(
                              "text-sm font-medium tabular-nums",
                              row.time === "Closed" || row.time === "مغلق"
                                ? "text-cream-muted"
                                : isToday
                                  ? "text-gold"
                                  : "text-cream"
                            )}
                          >
                            {row.time}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Map card — illustrated by default, live OSM on toggle */}
          <FadeIn delay={200}>
            <figure className="relative h-full min-h-80 overflow-hidden border border-cream/10">
              {liveMap ? (
                <iframe
                  title={t.location.mapLabel}
                  src={osmEmbed}
                  loading="lazy"
                  className="map-dark absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div
                  role="img"
                  aria-label={t.location.mapLabel}
                  className="absolute inset-0"
                >
                  {/* Faux-map grid */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-charcoal"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(242,237,228,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,228,0.05) 1px, transparent 1px), linear-gradient(rgba(242,237,228,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,228,0.03) 1px, transparent 1px)",
                      backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
                    }}
                  />
                  {/* Faux roads */}
                  <div aria-hidden="true" className="absolute inset-0">
                    <div className="absolute start-0 end-0 top-1/3 h-px bg-cream/15" />
                    <div className="absolute bottom-0 start-1/3 top-0 w-px bg-cream/15" />
                    <div className="absolute start-0 end-0 top-2/3 h-2 rotate-2 bg-cream/[0.06]" />
                    {/* Street name along the main road */}
                    <span className="absolute start-6 top-[calc(66%+8px)] rotate-2 text-[10px] font-medium uppercase tracking-[0.28em] text-cream/30">
                      {isAr ? "شارع بشارة الخوري" : "Bechara El Khoury St."}
                    </span>
                  </div>

                  {/* Pin */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-center gap-3">
                      <span className="relative flex size-14 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/25 motion-reduce:animate-none" />
                        <span className="relative flex size-11 items-center justify-center bg-gold text-charcoal">
                          <MapPin className="size-5" aria-hidden="true" />
                        </span>
                      </span>
                      <figcaption className="whitespace-nowrap bg-charcoal/90 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-cream">
                        {t.location.mapPin}
                      </figcaption>
                    </div>
                  </div>
                </div>
              )}

              {/* Map style toggle */}
              <div
                role="group"
                aria-label={t.location.mapToggleAria}
                className="absolute start-4 top-4 z-10 flex border border-cream/15 bg-charcoal/90 backdrop-blur-sm"
              >
                <button
                  type="button"
                  aria-pressed={!liveMap}
                  onClick={() => setLiveMap(false)}
                  className={cn(
                    "px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    !liveMap ? "bg-gold text-charcoal" : "text-cream-muted hover:text-cream"
                  )}
                >
                  {t.location.mapToggleStylised}
                </button>
                <button
                  type="button"
                  aria-pressed={liveMap}
                  onClick={() => setLiveMap(true)}
                  className={cn(
                    "px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    liveMap ? "bg-gold text-charcoal" : "text-cream-muted hover:text-cream"
                  )}
                >
                  {t.location.mapToggleLive}
                </button>
              </div>

              {/* Directions link */}
              <a
                href={SITE_CONFIG.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 end-4 z-10 inline-flex items-center gap-2 bg-charcoal/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-charcoal"
              >
                <Navigation className="size-3.5" aria-hidden="true" />
                {t.location.directions}
              </a>
            </figure>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
