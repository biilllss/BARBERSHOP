"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 * Renders the final value on the server (hydration-safe); the animation
 * then resets to 0 and runs while the element becomes visible — the
 * wrapping <FadeIn/> keeps that reset invisible. Reduced-motion users
 * and environments without IntersectionObserver simply see the final
 * value, immediately.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  duration = 1500,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(() =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return; // keep final value

    const format = (n: number) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          setDisplay(format(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {display}
      {suffix}
    </span>
  );
}
