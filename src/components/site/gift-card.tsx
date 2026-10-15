"use client";

import { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { CedarLeaf } from "./cedar-leaf";
import { WhatsAppIcon } from "./icons";
import { GIFT_CARD, lbpFromUsd, waGiftLink } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

/**
 * Gift-card section — pick an amount, order over WhatsApp.
 * The left-hand gold ticket is a purely decorative foil visual (aria-hidden):
 * everything it "says" is available to assistive tech via the copy side.
 */
const GIFT_RECIPIENT_KEY = "bc-gift-recipient";

export function GiftCard() {
  const { t, lang } = useLanguage();
  const [amount, setAmount] = useState<number>(GIFT_CARD.amounts[1]);
  /** Optional recipient — personalises the ticket and the WhatsApp order. */
  const [forName, setForName] = useState("");
  const recipient = forName.trim();

  /*
   * Remember the last recipient — pre-fill after mount (hydration-safe)
   * so a returning buyer starts one tap ahead. Saved/cleared on the
   * order CTA click; blocked storage degrades silently.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(GIFT_RECIPIENT_KEY);
        if (saved) setForName(saved);
      } catch {
        /* storage unavailable — start empty */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const rememberRecipient = () => {
    try {
      if (recipient) {
        window.localStorage.setItem(GIFT_RECIPIENT_KEY, recipient);
      } else {
        window.localStorage.removeItem(GIFT_RECIPIENT_KEY);
      }
    } catch {
      /* private mode — session-only */
    }
  };

  return (
    <section
      id="gift"
      aria-labelledby="gift-title"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Soft gold glow behind the ticket */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-0 top-1/3 -z-10 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-3xl rtl:translate-x-1/2"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="gift-title"
            index="08"
            kicker={t.gift.kicker}
            title={t.gift.title}
            subtitle={t.gift.sub}
          />
        </FadeIn>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* ------------------------------------------------ foil ticket */}
          <FadeIn delay={120} className="lg:col-span-2">
            <div
              aria-hidden="true"
              className="group relative mx-auto w-full max-w-md -rotate-[1.5deg] transition-transform duration-700 ease-out hover:rotate-0 lg:max-w-none"
            >
              {/* Stacked card edges behind the ticket */}
              <span className="absolute inset-x-4 -bottom-3 h-full border border-gold/25 bg-charcoal-soft" />
              <span className="absolute inset-x-2 -bottom-1.5 h-full border border-gold/40 bg-charcoal-soft" />

              {/* The ticket itself */}
              <div className="sheen relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#e0c078] via-gold to-gold-deep text-charcoal shadow-[0_24px_60px_-24px_rgba(201,162,75,0.45)]">
                {/* Film grain keeps the foil from reading flat */}
                <span className="grain absolute inset-0" />

                {/* Main body — left of the perforation */}
                <div className="absolute inset-y-0 start-0 flex w-[68%] flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex items-center gap-2">
                      <CedarLeaf className="size-5 text-charcoal/80" />
                      <span className="font-display text-sm font-bold tracking-wide sm:text-base">
                        Blade &amp; Cedar
                      </span>
                    </span>
                    <span className="border border-charcoal/40 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-charcoal/80">
                      {t.gift.value}
                    </span>
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-charcoal/60">
                      {t.gift.for}
                    </p>
                    {/* Recipient name replaces the tagline once typed */}
                    {recipient ? (
                      <p className="mt-1 font-display text-lg italic leading-tight text-charcoal/90">
                        {t.gift.ticketTo} {recipient}
                      </p>
                    ) : null}
                    <p className="mt-1 font-display text-6xl font-bold leading-none tabular-nums sm:text-7xl">
                      <span className="align-top text-2xl sm:text-3xl">$</span>
                      {amount}
                    </p>
                  </div>

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/60">
                    {t.gift.kicker}
                  </p>
                </div>

                {/* Perforation — dashed rule + punched notches */}
                <span className="absolute inset-y-0 start-[68%] border-s-2 border-dashed border-charcoal/35" />
                <span className="absolute start-[68%] top-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-charcoal" />
                <span className="absolute start-[68%] top-full size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-charcoal" />

                {/* Stub — right of the perforation */}
                <div className="absolute inset-y-0 end-0 flex w-[32%] flex-col items-center justify-between py-5 sm:py-6">
                  {/* Fake barcode — pure decoration */}
                  <span
                    className="h-8 w-3/4"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, rgba(18,18,18,0.85) 0 2px, transparent 2px 5px)",
                    }}
                  />
                  <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-charcoal/80">
                    {t.gift.serialLabel} {GIFT_CARD.serial}
                  </span>
                  <Gift className="size-4 text-charcoal/60" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* -------------------------------------------------- copy + buy */}
          <FadeIn delay={240} className="lg:col-span-3">
            <div className="flex flex-col items-start gap-7">
              {/* Amount chips */}
              <div
                role="group"
                aria-label={t.gift.amountLabel}
                className="flex flex-wrap items-center gap-3"
              >
                {GIFT_CARD.amounts.map((usd) => (
                  <button
                    key={usd}
                    type="button"
                    aria-pressed={amount === usd}
                    onClick={() => setAmount(usd)}
                    className={cn(
                      "border px-6 py-3 font-display text-2xl font-bold tabular-nums transition-all duration-300 hover:-translate-y-0.5",
                      amount === usd
                        ? "border-gold bg-gold text-charcoal shadow-[0_10px_30px_-12px_rgba(201,162,75,0.6)]"
                        : "border-cream/15 text-cream hover:border-gold/50 hover:text-gold"
                    )}
                  >
                    <span className="align-top text-sm font-medium">$</span>
                    {usd}
                  </button>
                ))}
              </div>

              {/* Live LBP conversion — mirrors the Services currency logic */}
              <p
                className="text-sm tabular-nums text-cream-muted"
                aria-live="polite"
              >
                <span dir="ltr" className="inline-block">
                  ≈ {lbpFromUsd(amount)} L.L.
                </span>
              </p>

              {/* Optional recipient — rides along in the WhatsApp order,
                  and is remembered for next time */}
              <div className="w-full max-w-xs">
                <label
                  htmlFor="gift-recipient"
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-muted/80"
                >
                  {t.gift.forLabel}
                </label>
                <div className="relative mt-2">
                  <input
                    id="gift-recipient"
                    type="text"
                    value={forName}
                    maxLength={40}
                    onChange={(e) => setForName(e.target.value)}
                    placeholder={t.gift.forPlaceholder}
                    className="w-full border border-cream/15 bg-charcoal-soft px-4 py-3 pe-10 text-sm text-cream transition-colors duration-300 placeholder:text-cream-muted/50 focus:border-gold focus:outline-none"
                  />
                  {forName && (
                    <button
                      type="button"
                      onClick={() => setForName("")}
                      aria-label={t.gift.clearRecipient}
                      className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-cream-muted transition-colors hover:text-gold"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-cream-muted">
                {t.gift.custom}
              </p>

              {/* Order CTA — pre-filled WhatsApp message with amount + recipient;
                  the click also (un)remembers the name for next time */}
              <a
                href={waGiftLink(lang, amount, recipient || undefined)}
                onClick={rememberRecipient}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen glow-gold inline-flex h-14 items-center justify-center gap-3 bg-gold px-9 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-deep active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5" aria-hidden="true" />
                {t.gift.cta}
                <span className="tabular-nums tracking-normal">· ${amount}</span>
              </a>

              <p className="text-xs uppercase tracking-[0.16em] text-cream-muted/80">
                {t.gift.note}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
