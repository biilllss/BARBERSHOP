"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { WhatsAppIcon } from "./icons";
import { cn } from "@/lib/utils";

/**
 * Floating booking button — mobile only (the header CTA covers desktop).
 * `end-5` is a logical property, so it mirrors to the correct corner in RTL.
 */
export function FloatingWhatsApp() {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Slide in shortly after load instead of on first paint.
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <a
      href={waLink(lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.a11y.whatsappFloat}
      data-print="hide"
      className={cn(
        "fixed end-5 z-50 flex size-13 items-center justify-center rounded-full bg-gold text-charcoal shadow-lg shadow-black/40 transition-all duration-500 hover:scale-105 hover:bg-gold-deep md:hidden",
        "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <WhatsAppIcon className="size-6" />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/30 motion-reduce:animate-none"
      />
    </a>
  );
}
