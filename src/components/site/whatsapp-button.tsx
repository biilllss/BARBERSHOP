"use client";

import { cn } from "@/lib/utils";
import { waLink } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { WhatsAppIcon } from "./icons";

/**
 * Gold WhatsApp CTA used across the site so every booking link
 * stays consistent and driven by SITE_CONFIG.
 */
export function WhatsAppButton({
  service,
  className,
  label,
  size = "default",
}: {
  service?: string;
  className?: string;
  label?: string;
  size?: "default" | "lg";
}) {
  const { lang, t, isAr } = useLanguage();

  return (
    <a
      href={waLink(lang, service)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "group sheen inline-flex items-center justify-center gap-2.5 bg-gold font-semibold uppercase tracking-[0.14em] text-charcoal",
        "transition-all duration-300 hover:bg-gold-deep hover:shadow-[0_8px_30px_rgba(201,162,75,0.25)]",
        "active:scale-[0.98]",
        size === "lg" ? "h-12 px-8 text-sm" : "h-10 px-5 text-xs",
        isAr && "tracking-[0.06em] normal-case",
        className
      )}
    >
      <WhatsAppIcon className={cn("shrink-0", size === "lg" ? "size-5" : "size-4")} />
      {label ?? t.hero.ctaPrimary}
    </a>
  );
}
