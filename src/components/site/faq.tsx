"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";
import { useLanguage } from "@/lib/language-context";

export function Faq() {
  const { t } = useLanguage();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            id="faq-title"
            index="06"
            kicker={t.faq.kicker}
            title={t.faq.title}
            align="center"
          />
        </FadeIn>

        <FadeIn delay={140}>
          <Accordion type="single" collapsible className="mt-12">
            {t.faq.items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="border-cream/10"
              >
                <AccordionTrigger className="py-5 text-start font-display text-lg text-cream hover:text-gold hover:no-underline [&>svg]:text-gold">
                  {/* Gold serif index — quiet editorial numbering */}
                  <span className="flex min-w-0 items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-display text-sm italic tabular-nums text-gold/60"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 leading-relaxed text-cream-muted">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
