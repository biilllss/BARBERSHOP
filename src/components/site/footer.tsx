"use client";

import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";
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

  const socials = [
    {
      href: SITE_CONFIG.instagram,
      label: t.footer.socialAria.instagram,
      icon: <Instagram className="size-4.5" aria-hidden="true" />,
    },
    {
      href: SITE_CONFIG.facebook,
      label: t.footer.socialAria.facebook,
      icon: <Facebook className="size-4.5" aria-hidden="true" />,
    },
    {
      href: waLink(lang),
      label: t.footer.socialAria.whatsapp,
      icon: <WhatsAppIcon className="size-4.5" aria-hidden="true" />,
    },
  ];

  return (
    <footer data-print="hide" className="mt-auto border-t border-cream/10 bg-charcoal-soft">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
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

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-10 items-center justify-center border border-cream/15 text-cream-muted transition-all duration-300 hover:border-gold hover:text-gold"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Instagram strip — latest from the chair */}
        <div className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cream-muted">
            <a
              href={SITE_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold transition-colors hover:text-cream"
            >
              @bladeandcedar
            </a>
            <span className="mx-2 text-cream/25" aria-hidden="true">
              ·
            </span>
            {t.footer.instaCaption}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {IMAGES.galleryThumbs.map((src, i) => (
              <a
                key={src}
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.footer.socialAria.instagram} — ${t.gallery.alts[i]}`}
                className="group relative aspect-square overflow-hidden border border-transparent transition-colors hover:border-gold/60"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-charcoal/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <Instagram className="size-4 text-gold" />
                </span>
              </a>
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
              href="https://mawqe3.studio"
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
