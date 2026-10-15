"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check, Copy, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { SITE_CONFIG, SERVICES, waLink } from "@/lib/config";
import {
  upcomingOpenDays,
  slotsForDate,
  isOpenNow,
  isSlotGone,
  beirutDayKey,
  nextDayKey,
} from "@/lib/hours";
import { WhatsAppIcon } from "./icons";
import { cn } from "@/lib/utils";

/** Barber avatar thumbs (same IDs as IMAGES.barbers, small square crop). */
const BARBER_THUMBS = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=70&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=70&auto=format",
];

/** localStorage keys for the choices the visitor confirmed last time. */
const LAST_BARBER_KEY = "bc-last-barber";
const LAST_SERVICE_KEY = "bc-last-service";
type RememberedBarber = number | "any" | null;

/**
 * Read the remembered barber choice ("any" | barber index). Returns null
 * when nothing was stored or the value is stale (out-of-range index).
 * Safe to call on mount: the dialog content only mounts once opened,
 * i.e. always client-side after hydration.
 */
function readLastBarber(): RememberedBarber {
  try {
    const raw = window.localStorage.getItem(LAST_BARBER_KEY);
    if (raw === null || raw === "") return null;
    if (raw === "any") return "any";
    const idx = Number(raw);
    if (Number.isInteger(idx) && idx >= 0 && idx < 3) return idx;
  } catch {
    /* private mode / blocked storage — just skip the personalization */
  }
  return null;
}

function rememberBarber(choice: RememberedBarber) {
  try {
    if (choice === null) window.localStorage.removeItem(LAST_BARBER_KEY);
    else window.localStorage.setItem(LAST_BARBER_KEY, String(choice));
  } catch {
    /* storage unavailable — non-critical */
  }
}

/**
 * Read the remembered service (SERVICES id). Returns null when nothing
 * valid was stored — stale ids (removed from the menu) degrade to null.
 */
function readLastService(): string | null {
  try {
    const raw = window.localStorage.getItem(LAST_SERVICE_KEY);
    if (raw && SERVICES.some((s) => s.id === raw)) return raw;
  } catch {
    /* storage unavailable — non-critical */
  }
  return null;
}

function rememberService(id: string | null) {
  try {
    if (id === null) window.localStorage.removeItem(LAST_SERVICE_KEY);
    else window.localStorage.setItem(LAST_SERVICE_KEY, id);
  } catch {
    /* storage unavailable — non-critical */
  }
}

/**
 * Two-step booking micro-flow:
 *   1. pick a barber (or "first available")
 *   2. pick a day + 30-min slot (Beirut time, driven by HOURS config)
 * → hands off to WhatsApp with the full choice pre-filled in the message.
 * Trigger rendering is delegated to the parent via a render prop.
 */
export function BookingDialog({
  open,
  onOpenChange,
  children,
  initialBarber = null,
  initialService = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: (open: () => void) => React.ReactNode;
  /** Pre-select a barber (index into t.barbers.names); null = first available. */
  initialBarber?: number | null;
  /** Pre-select a service (SERVICES[].id); null = no service attached. */
  initialService?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children(() => onOpenChange(true))}
      {/* key remounts the flow fresh every time the dialog opens */}
      <BookingDialogContent
        key={String(open)}
        initialBarber={initialBarber}
        initialService={initialService}
        onClose={() => onOpenChange(false)}
      />
    </Dialog>
  );
}

function BookingDialogContent({
  onClose,
  initialBarber = null,
  initialService = null,
}: {
  onClose: () => void;
  initialBarber?: number | null;
  initialService?: string | null;
}) {
  const { t, lang, isAr } = useLanguage();
  /**
   * Repeat visitors: without an explicit preselect, the last confirmed
   * barber AND service are remembered (localStorage). A remembered barber
   * jumps straight to the time step — one tap less for the common case;
   * a remembered service just pre-fills the chip.
   */
  const rememberedBarber: RememberedBarber =
    initialBarber === null ? readLastBarber() : null;
  const rememberedService = initialService === null ? readLastService() : null;
  const [step, setStep] = useState<1 | 2>(
    initialBarber !== null || rememberedBarber !== null ? 2 : 1
  );
  const [barberIdx, setBarberIdx] = useState<number | null>(
    initialBarber ??
      (rememberedBarber === "any" ? null : (rememberedBarber as number | null))
  );
  const [serviceId, setServiceId] = useState<string | null>(
    initialService ?? rememberedService
  );
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  /** True while the prefill still reflects a remembered choice (per part). */
  const [usedBarberMemory, setUsedBarberMemory] = useState(
    rememberedBarber !== null
  );
  const [usedServiceMemory, setUsedServiceMemory] = useState(
    rememberedService !== null
  );

  const days = useMemo(() => upcomingOpenDays(4), []);
  const slots = useMemo(() => (days.length ? slotsForDate(days[dayIdx]) : []), [days, dayIdx]);
  const closedNow = !isOpenNow().open;
  /**
   * Relative labels are keyed on the actual DATE, not the index —
   * after the last bookable slot, `upcomingOpenDays` skips today and
   * days[0] becomes tomorrow (this used to mislabel it "Today").
   */
  const todayKey = useMemo(() => beirutDayKey(new Date()), []);
  const tomorrowKey = useMemo(() => nextDayKey(todayKey), [todayKey]);
  /** Today's stale slots are greyed out (30-min lead time, Beirut time). */
  const slotGone = (s: string) => days.length > 0 && isSlotGone(days[dayIdx], s);
  const hasPastSlots = slots.some(slotGone);

  /**
   * Date-driven relative label: Today/Tomorrow only when the date really
   * is today/tomorrow in Beirut; otherwise the full weekday name.
   */
  const dayLabel = (date: Date): string => {
    const key = beirutDayKey(date);
    if (key === todayKey) return t.booking.today;
    if (key === tomorrowKey) return t.booking.tomorrow;
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
      weekday: "long",
      timeZone: "Asia/Beirut",
    }).format(date);
  };

  const dayDateLabel = (date: Date) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
      day: "numeric",
      month: "short",
      timeZone: "Asia/Beirut",
    }).format(date);

  const fill = (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  const barberName = barberIdx === null ? t.booking.anyBarber : t.barbers.names[barberIdx];
  const serviceName = serviceId
    ? (() => {
        const s = SERVICES.find((sv) => sv.id === serviceId);
        if (!s) return null;
        return isAr ? s.nameAr : s.nameEn;
      })()
    : null;

  // Plain per-render computation (cheap string work) — keeps the React
  // Compiler happy, no manual memoization needed.
  const waMessage = (() => {
    if (!slot || !days[dayIdx]) return null;
    // Arabic: "يوم السبت" reads natural, but "يوم اليوم" doesn't —
    // so the weekday prefix is only added for real weekday labels.
    // EN: real weekdays get a comma — "Saturday, Oct 17".
    const base = dayLabel(days[dayIdx]);
    const date = dayDateLabel(days[dayIdx]);
    const isRealWeekday =
      base !== t.booking.today && base !== t.booking.tomorrow;
    const dayStr = isAr
      ? isRealWeekday
        ? `يوم ${base} ${date}`
        : `${base} ${date}`
      : isRealWeekday
        ? `${base}, ${date}`
        : `${base} ${date}`;
    const vars = { barber: barberName, day: dayStr, time: slot };
    return serviceName
      ? fill(
          barberIdx === null ? t.booking.waServiceAny : t.booking.waServiceWith,
          { ...vars, service: serviceName }
        )
      : fill(
          barberIdx === null ? t.booking.waAny : t.booking.waWith,
          vars
        );
  })();

  const waHref = waMessage
    ? `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : waLink(lang);

  /** Clipboard fallback for desktop users without WhatsApp installed. */
  const copyDetails = async () => {
    if (!waMessage) return;
    try {
      await navigator.clipboard.writeText(waMessage);
    } catch {
      // Clipboard API blocked (older browser / permissions) — legacy path.
      try {
        const ta = document.createElement("textarea");
        ta.value = waMessage;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        return; // both paths failed — no false "Copied" feedback
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const options: Array<{ idx: number | null; name: string; role: string; photo?: string }> = [
    { idx: null, name: t.booking.anyBarber, role: t.booking.anyBarberRole },
    ...t.barbers.names.map((name, i) => ({
      idx: i as number,
      name,
      role: t.barbers.roles[i],
      photo: BARBER_THUMBS[i],
    })),
  ];

  return (
    <DialogContent
      showCloseButton={false}
      aria-describedby={undefined}
      className="max-w-lg gap-0 overflow-hidden border-cream/10 bg-charcoal p-0"
    >
      {/* Header */}
      <div className="border-b border-cream/10 p-6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle className="font-display text-2xl font-bold text-cream">
              {t.booking.title}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-cream-muted">
              {t.booking.description}
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.lightbox.close}
            className="flex size-9 shrink-0 items-center justify-center border border-cream/15 text-cream-muted transition-colors hover:border-gold hover:text-gold"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-cream-muted">
            {
              fill(t.booking.step, {
                // Match the template's Arabic-Indic digits in AR ("خطوة ٢ من ٢")
                n: new Intl.NumberFormat(lang === "ar" ? "ar-LB" : "en-US").format(step),
              })
            }
          </span>
          <span className="flex gap-1.5" aria-hidden="true">
            {[1, 2].map((s) => (
              <span
                key={s}
                className={cn("h-1 w-6 transition-colors duration-300", s <= step ? "bg-gold" : "bg-cream/15")}
              />
            ))}
          </span>
        </div>

        {/* Selected service chip — clearable, survives both steps */}
        {serviceName && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs text-gold">
              <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/70">
                {t.booking.serviceLabel}
              </span>
              <span className="font-medium">{serviceName}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setServiceId(null);
                setUsedServiceMemory(false); // manual clear — service part of the hint goes
              }}
              aria-label={t.booking.clearService}
              className="text-cream-muted transition-colors hover:text-gold"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[60vh] overflow-y-auto p-6">
        {step === 1 ? (
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {t.booking.chooseBarber}
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {options.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  aria-pressed={barberIdx === opt.idx}
                  onClick={() => {
                    setBarberIdx(opt.idx);
                    setUsedBarberMemory(false); // manual pick — barber part of the hint goes
                    setStep(2); // snappy: choosing a barber advances the flow
                  }}
                  className={cn(
                    "flex items-center gap-3 border p-3 text-start transition-all duration-300",
                    barberIdx === opt.idx
                      ? "border-gold bg-gold/10"
                      : "border-cream/15 hover:border-gold/50"
                  )}
                >
                  {opt.photo ? (
                    <Image
                      src={opt.photo}
                      alt=""
                      width={48}
                      height={48}
                      sizes="48px"
                      className="size-12 shrink-0 rounded-full object-cover grayscale-[30%]"
                    />
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <WhatsAppIcon className="size-5" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg text-cream">{opt.name}</span>
                    <span className="block truncate text-xs text-cream-muted">{opt.role}</span>
                  </span>
                </button>
              ))}
            </div>
            {/* Reassurance under the picker — the "first available" promise */}
            <p className="mt-3.5 text-xs italic leading-relaxed text-cream-muted/80">
              {t.booking.firstAvailableNote}
            </p>
          </fieldset>
        ) : (
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {t.booking.chooseTime}
            </legend>

            {closedNow && (
              <p className="mt-3 border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-cream-muted">
                {t.booking.closedNote}
              </p>
            )}

            {hasPastSlots && (
              <p className="mt-3 text-xs text-cream-muted/80 italic">
                {t.booking.pastNote}
              </p>
            )}

            {(usedBarberMemory || usedServiceMemory) && (
              <p className="mt-3 text-xs text-gold/70">
                {fill(
                  usedBarberMemory && usedServiceMemory
                    ? t.booking.lastBothHint
                    : usedServiceMemory
                      ? t.booking.lastServiceHint
                      : t.booking.lastBarberHint,
                  { service: serviceName ?? "" }
                )}
              </p>
            )}

            {/* Day chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {days.map((d, i) => (
                <button
                  key={d.toISOString()}
                  type="button"
                  aria-pressed={dayIdx === i}
                  onClick={() => {
                    setDayIdx(i);
                    setSlot(null);
                  }}
                  className={cn(
                    "border px-3.5 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5",
                    dayIdx === i
                      ? "border-gold bg-gold font-semibold text-charcoal"
                      : "border-cream/15 text-cream-muted hover:border-gold/50 hover:text-cream"
                  )}
                >
                  {dayLabel(d)}
                  <span className={cn("ms-1.5 text-xs", dayIdx === i ? "text-charcoal/70" : "opacity-70")}>
                    {dayDateLabel(d)}
                  </span>
                </button>
              ))}
            </div>

            {/* Slots — today's stale ones (past + 30-min lead) are dead */}
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {slots.map((s) => {
                const gone = slotGone(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={slot === s}
                    aria-disabled={gone || undefined}
                    tabIndex={gone ? -1 : undefined}
                    onClick={() => {
                      if (!gone) setSlot(s);
                    }}
                    className={cn(
                      "border py-2 text-sm tabular-nums transition-all duration-300",
                      gone
                        ? "cursor-not-allowed border-cream/5 text-cream-muted/35 line-through decoration-cream-muted/30"
                        : slot === s
                          ? "border-gold bg-gold text-charcoal"
                          : "border-cream/15 text-cream-muted hover:border-gold/50 hover:text-cream"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-cream-muted">{t.booking.tzHint}</p>

            {/* Copy fallback — for when WhatsApp isn't at hand */}
            {slot && (
              <button
                type="button"
                onClick={copyDetails}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-cream-muted transition-colors hover:text-gold"
              >
                {copied ? (
                  <Check className="size-3.5 text-gold" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
                <span aria-live="polite">{copied ? t.booking.copied : t.booking.copyDetails}</span>
              </button>
            )}

            {/* Desktop-WhatsApp fallback: plain old phone */}
            <p className="mt-2 text-xs text-cream-muted">
              {t.booking.phoneFallback}{" "}
              <a
                href={`tel:${SITE_CONFIG.phoneDisplay.replace(/\s/g, "")}`}
                dir="ltr"
                className="font-semibold tabular-nums text-gold transition-colors hover:text-cream"
              >
                {SITE_CONFIG.phoneDisplay}
              </a>
            </p>
          </fieldset>
        )}
      </div>

      {/* Footer */}
      <div className="flex min-h-[4.5rem] items-center justify-between gap-3 border-t border-cream/10 p-5">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setSlot(null);
            }}
            className="inline-flex items-center gap-1 text-sm text-cream-muted transition-colors hover:text-gold"
          >
            {isAr ? (
              <ChevronRight className="size-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-4" aria-hidden="true" />
            )}
            {t.booking.back}
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        {step === 2 &&
          /* The confirm CTA stays a dead button until a slot is picked —
             no href, not clickable, announced as disabled. */
          (slot ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                rememberBarber(barberIdx === null ? "any" : barberIdx);
                rememberService(serviceId);
                onClose();
              }}
              className="sheen glow-gold inline-flex items-center justify-center gap-2.5 bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep"
            >
              <WhatsAppIcon className="size-4" />
              {t.booking.confirm}
              <span className="tabular-nums">· {slot}</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center justify-center gap-2.5 bg-gold/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/60"
            >
              <WhatsAppIcon className="size-4" />
              {t.booking.confirm}
            </button>
          ))}
      </div>
    </DialogContent>
  );
}
