"use client";

import { CedarLeaf } from "./cedar-leaf";
import { useLanguage } from "@/lib/language-context";

/**
 * Gold ticker between the hero and the story — the classic barbershop
 * marquee. Two identical copies sit on one track; a -50% translate loops
 * it seamlessly. Pauses on hover/focus; reduced-motion users get a
 * static strip (animation disabled globally).
 * The track is forced LTR so the loop math is identical in both
 * languages; the Arabic items still render correctly via bidi.
 */
export function Ribbon() {
  const { t } = useLanguage();

  const copy = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {t.ribbon.items.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/70 sm:px-8 sm:text-xs">
            {item}
          </span>
          <CedarLeaf className="size-3.5 shrink-0 text-gold/80" />
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      aria-label={t.ribbon.items[0]}
      className="ribbon relative overflow-hidden border-y border-gold/20 bg-charcoal-soft py-3.5"
      dir="ltr"
    >
      <div className="animate-marquee flex w-max">
        {copy(false)}
        {copy(true)}
      </div>
    </aside>
  );
}
