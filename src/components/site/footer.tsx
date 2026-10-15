"use client";

import Image from "next/image";
import { SITE_CONFIG, waLink, IMAGES } from "@/lib/config";
import { useLanguage } from "@/lib/language-context";
import { WhatsAppIcon } from "./icons";
import { CedarLeaf } from "./cedar-leaf";

export function Footer() {
  const { t, lang, isAr } = useLanguage();
  const year = new Date().getFullYear();

  const nav = [
    { id: "about", label: t.header.nav.about },
    { id: "services", label: t.header.nav.services },
    { id: "gallery", label: t.header.nav.gallery },
    { id: "faq", label: t.header.nav.faq },
    { id: "visit", label: t.header.nav.visit },
    { id: "gift", label: t.header.nav.gift },
  ];

  /* WhatsApp is the only outbound social — it's the real booking line.
     Instagram/Facebook are concept-only, so no icons are shown. */
  const whatsapp = {
    href: waLink(lang),
    label: t.footer.socialAria.whatsapp,
  };

  return (
    <footer
      data-print="hide"
      /* pb-28 keeps the mobile floating WhatsApp button clear of the
         legal strip; desktop has no floating button so the padding
         returns to the compact rhythm. */
      className="mt-auto border-t border-cream/10 bg-charcoal-soft pb-28 pt-14 md:pb-14"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="flex items-center gap-2.5 font-display text-xl font-bold text-cream">
              <CedarLeaf className="size-5 shrink-0 text-gold" />
              {isAr ? SITE_CONFIG.nameAr : SITE_CONFIG.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream-muted">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick nav */}
          <nav aria-label={t.footer.navAria} className="flex flex-col gap-3">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="link-sweep w-fit text-sm text-cream-muted transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* WhatsApp only */}
          <div className="flex items-center gap-3">
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsapp.label}
              className="flex size-10 items-center justify-center border border-cream/15 text-cream-muted transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <WhatsAppIcon className="size-4.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Latest from the chair — decorative strip, no outbound links */}
        <div className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cream-muted">
            {t.footer.stripCaption}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {IMAGES.galleryThumbs.map((src, i) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden border border-transparent transition-colors hover:border-gold/60"
              >
                <Image
                  src={src}
                  alt={t.gallery.alts[i]}
                  fill
                  sizes="(min-width: 640px) 140px, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-12 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {isAr ? SITE_CONFIG.nameAr : SITE_CONFIG.name}. {t.footer.rights}
          </p>
          <p>
            {t.footer.credit.split("Mawqe3 Studio")[0]}
            <a
              href="https://instagram.com/mawqe3_studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold transition-colors hover:text-cream"
            >
              Mawqe3 Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
