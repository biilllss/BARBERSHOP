"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { SITE_CONFIG, ANNOUNCEMENTS, getActiveAnnouncement } from "@/lib/config";
import { cn } from "@/lib/utils";
import { BookingDialog } from "./booking-dialog";
import { WhatsAppIcon } from "./icons";

const SECTION_IDS = ["about", "services", "gallery", "barbers", "reviews", "faq", "visit"] as const;

/* ------------------------------------------------------------------ */
/*  Language toggle — EN | AR                                          */
/* ------------------------------------------------------------------ */

function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      role="group"
      aria-label="Language / اللغة"
      className={cn("flex items-stretch border border-cream/20", className)}
    >
      {(["en", "ar"] as const).map((code, i) => (
        <span key={code} className="flex items-stretch">
          {i > 0 && <span aria-hidden="true" className="w-px bg-cream/20" />}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold tracking-[0.18em] transition-colors duration-300",
              lang === code
                ? "bg-gold text-charcoal"
                : "text-cream/70 hover:text-cream"
            )}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Announcement bar — seasonal scheduler + dismiss, persisted         */
/*  Config-driven: ANNOUNCEMENTS ranges (Beirut time) win over the     */
/*  evergreen i18n message. Dismissal is remembered per announcement.  */
/* ------------------------------------------------------------------ */

const ANNOUNCE_KEY = "bc-announce-dismissed-id";

function AnnouncementBar({ previewId }: { previewId: string | null }) {
  const { t, isAr } = useLanguage();
  const [dismissedStored, setDismissedStored] = useState(false);

  /*
   * Owner preview override — /?announce=beard-season forces a specific
   * campaign (or "default" for the evergreen message) regardless of the
   * calendar; a valid preview also ignores stored dismissals so the bar
   * always shows. Unknown ids fall back to the normal scheduler.
   */
  const overrideActive =
    previewId !== null &&
    (previewId === "default" || ANNOUNCEMENTS.some((a) => a.id === previewId));

  const seasonal = overrideActive
    ? previewId === "default"
      ? null
      : ANNOUNCEMENTS.find((a) => a.id === previewId) ?? null
    : getActiveAnnouncement();

  const currentId = seasonal?.id ?? "default";
  const message = seasonal
    ? isAr
      ? seasonal.messageAr
      : seasonal.messageEn
    : t.announcement.message;

  // Hydration-safe restore: the bar renders for everyone on first paint,
  // then collapses after mount if THIS announcement was dismissed before.
  // Preview mode skips the restore so the campaign is always visible.
  useEffect(() => {
    if (overrideActive) return;
    try {
      const gone = window.localStorage.getItem(ANNOUNCE_KEY) === currentId;
      // Post-hydration restore keeps setState out of the effect body
      const timer = window.setTimeout(() => setDismissedStored(gone), 0);
      return () => window.clearTimeout(timer);
    } catch {
      /* storage unavailable — keep the bar visible */
    }
  }, [currentId, overrideActive]);

  /** Preview overrides never collapse. */
  const barHidden = overrideActive ? false : dismissedStored;

  const dismiss = () => {
    setDismissedStored(true);
    try {
      window.localStorage.setItem(ANNOUNCE_KEY, currentId);
    } catch {
      /* private mode — session-only dismissal */
    }
  };

  return (
    <div
      aria-hidden={barHidden}
      className={cn(
        "relative overflow-hidden bg-gold text-charcoal transition-all duration-500",
        barHidden ? "max-h-0" : "max-h-12"
      )}
    >
      <p className="mx-auto max-w-7xl px-12 py-2 text-center text-[11px] font-semibold leading-snug sm:px-14 sm:text-xs">
        {message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.announcement.dismiss}
        className="absolute end-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export function Header() {
  const { t, isAr } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  /** Owner tool: /?announce=<id> previews a campaign (read once on mount). */
  const [announcePreview, setAnnouncePreview] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const p = new URLSearchParams(window.location.search).get("announce");
        if (p) setAnnouncePreview(p);
      } catch {
        /* no URL access — skip preview */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Solid background + reading progress once the hero starts scrolling away.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "about", label: t.header.nav.about },
    { id: "services", label: t.header.nav.services },
    { id: "gallery", label: t.header.nav.gallery },
    { id: "barbers", label: t.header.nav.barbers },
    { id: "reviews", label: t.header.nav.reviews },
    { id: "faq", label: t.header.nav.faq },
    { id: "visit", label: t.header.nav.visit },
  ];

  return (
    <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen}>
      {(openBooking) => (
        <header
          data-print="hide"
          className={cn(
            "fixed inset-x-0 top-0 z-50 transition-all duration-500",
            scrolled
              ? "border-b border-cream/10 bg-charcoal/90 backdrop-blur-md"
              : "bg-gradient-to-b from-charcoal/80 to-transparent"
          )}
        >
          <AnnouncementBar previewId={announcePreview} />

          <div
            className={cn(
              "transition-[padding] duration-500",
              scrolled ? "py-3" : "py-5"
            )}
          >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-wide text-cream transition-colors hover:text-gold sm:text-xl"
        >
          {isAr ? SITE_CONFIG.nameAr : SITE_CONFIG.name.split(" & ")[0]}
          {!isAr && (
            <>
              <span className="text-gold"> &amp; </span>
              {SITE_CONFIG.name.split(" & ")[1]}
            </>
          )}
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "text-[13px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                active === item.id
                  ? "text-gold"
                  : "text-cream/70 hover:text-cream"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LangToggle className="hidden sm:flex" />
          {/* Desktop booking trigger — opens the 2-step dialog */}
          <button
            type="button"
            onClick={openBooking}
            className="sheen hidden h-9 items-center gap-2 bg-gold px-4 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep active:scale-[0.97] sm:inline-flex"
          >
            <WhatsAppIcon className="size-3.5" aria-hidden="true" />
            {t.header.book}
          </button>
          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 text-cream hover:bg-cream/10 hover:text-gold lg:hidden"
                aria-label={t.header.openMenu}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            {/* Sheet flips sides automatically via dir-aware side prop */}
            <SheetContent
              side={isAr ? "left" : "right"}
              aria-describedby={undefined}
              className="w-[84vw] max-w-sm border-cream/10 bg-charcoal p-0 sm:max-w-sm"
            >
              <SheetTitle className="sr-only">{t.header.openMenu}</SheetTitle>
              <div className="flex h-full flex-col gap-2 overflow-y-auto p-6 pt-8">
                <p className="font-display text-2xl font-bold text-cream">
                  {isAr ? SITE_CONFIG.nameAr : SITE_CONFIG.name}
                </p>
                <span aria-hidden="true" className="gold-rule mb-4" />
                <nav aria-label="Mobile" className="flex flex-col">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="border-b border-cream/10 py-4 font-display text-2xl text-cream transition-colors hover:text-gold"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4 pt-6">
                  <LangToggle className="w-fit" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openBooking();
                    }}
                    className="sheen inline-flex h-12 w-full items-center justify-center gap-2.5 bg-gold text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="size-4" aria-hidden="true" />
                    {t.header.book}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
          </div>

      {/* Reading progress — thin gold line along the header's bottom edge */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 start-0 h-[2px] bg-gold transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
        </header>
      )}
    </BookingDialog>
  );
}
// r11-preview-override
