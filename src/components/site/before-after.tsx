"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { IMAGES } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { FadeIn } from "./fade-in";

const MIN = 4;
const MAX = 96;

/**
 * Before / After comparison slider.
 * Geometry is deliberately forced LTR (photos read before-left → after-right
 * in every locale — it's a photographic convention, not text direction);
 * only the labels localize. Pointer events unify mouse + touch; the handle
 * is a keyboard-reachable ARIA slider.
 */
export function BeforeAfter() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(MAX, Math.max(MIN, pct)));
  };

  return (
    <FadeIn delay={120}>
      <figure className="mt-14">
        <div
          ref={trackRef}
          dir="ltr"
          role="slider"
          tabIndex={0}
          aria-label={t.gallery.compare.hint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% ${t.gallery.compare.after}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setPos((p) => Math.max(MIN, p - 4));
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setPos((p) => Math.min(MAX, p + 4));
            }
            if (e.key === "Home") {
              e.preventDefault();
              setPos(MIN);
            }
            if (e.key === "End") {
              e.preventDefault();
              setPos(MAX);
            }
          }}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture?.(e.pointerId);
            setFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFromClientX(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          className="relative aspect-[16/10] w-full cursor-ew-resize touch-none select-none overflow-hidden border border-cream/10 bg-charcoal-soft focus-visible:outline-2 focus-visible:outline-gold"
        >
          {/* After — full bleed bottom layer */}
          <Image
            src={IMAGES.beforeAfter.after}
            alt={t.gallery.compare.afterAlt}
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
            draggable={false}
          />

          {/* Before — clipped to the left of the handle */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <Image
              src={IMAGES.beforeAfter.before}
              alt=""
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Labels */}
          <span
            aria-hidden="true"
            className="absolute left-4 top-4 bg-charcoal/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-sm"
          >
            {t.gallery.compare.before}
          </span>
          <span
            aria-hidden="true"
            className="absolute right-4 top-4 border border-gold/60 bg-charcoal/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-sm"
          >
            {t.gallery.compare.after}
          </span>

          {/* Divider + handle */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 w-px bg-gold"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute inset-y-0 -start-px w-0.5 bg-gold shadow-[0_0_18px_rgba(201,162,75,0.65)]" />
            <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-charcoal/90 text-gold shadow-[0_0_24px_rgba(201,162,75,0.4)] backdrop-blur-sm">
              <MoveHorizontal className="size-5" />
            </span>
          </div>

          {/* Gold baseline */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1 bg-gold/80"
          />
        </div>

        <figcaption className="mt-3 text-xs tracking-wide text-cream-muted">
          {t.gallery.compare.hint}
        </figcaption>
      </figure>
    </FadeIn>
  );
}
