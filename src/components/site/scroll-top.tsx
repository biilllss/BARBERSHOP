"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const RING_RADIUS = 21;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Back-to-top button with a circular gold reading-progress ring.
 * Appears after ~1.5 viewports of scrolling; sits above the floating
 * WhatsApp button on mobile, in the same logical `end` column so both
 * mirror together in RTL.
 */
export function ScrollTop() {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(p);
      setVisible(window.scrollY > window.innerHeight * 1.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.a11y.toTop}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-print="hide"
      className={cn(
        "group fixed end-5 z-40 flex size-13 items-center justify-center rounded-full bg-charcoal/90 text-cream shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-500",
        "bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:bottom-8",
        "hover:text-gold active:scale-95",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      {/* Progress ring */}
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2"
          className="stroke-cream/15"
        />
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-gold transition-[stroke-dashoffset] duration-150 ease-out"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <ArrowUp
        className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}
