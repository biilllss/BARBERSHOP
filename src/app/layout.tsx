import type { Metadata, Viewport } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { HOURS } from "@/lib/hours";
import { SITE_CONFIG } from "@/lib/config";
import { TRANSLATIONS } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Fonts — Playfair (headings) · Inter (body) · Cairo (Arabic)        */
/* ------------------------------------------------------------------ */

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

/* ------------------------------------------------------------------ */
/*  SEO metadata + Open Graph                                          */
/* ------------------------------------------------------------------ */

const SITE_URL = SITE_CONFIG.siteUrl; // single source of truth in config.ts
/** Branded share artwork — self-hosted (public/og.jpg, 1200×630). */
const OG_IMAGE = "/og.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Blade & Cedar — Premium Barbershop in Beirut | بليد آند سيدر",
  description:
    "Blade & Cedar is a premium barbershop in Hamra, Beirut. Precision haircuts, hot towel shaves and honest craft since 2016. Book on WhatsApp.",
  keywords: [
    "barbershop Beirut",
    "Blade and Cedar",
    "حلاقة بيروت",
    "barber Lebanon",
    "hot towel shave",
    "skin fade",
  ],
  openGraph: {
    title: "Blade & Cedar — Premium Barbershop in Beirut",
    description:
      "Precision cuts, hot towel shaves and honest craft in the heart of Hamra, Beirut.",
    url: SITE_URL,
    siteName: "Blade & Cedar",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Inside Blade & Cedar barbershop" }],
    locale: "en_US",
    alternateLocale: ["ar_LB"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blade & Cedar — Premium Barbershop in Beirut",
    description:
      "Precision cuts, hot towel shaves and honest craft in the heart of Hamra, Beirut.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/cedar.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Blade & Cedar",
    statusBarStyle: "black-translucent",
  },
};

/* Permanent dark theme — also what installed PWAs chrome with. */
export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* JSON-LD structured data — helps search engines surface the shop
     as a local business with real opening hours. */
  const DAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: "Blade & Cedar",
    alternateName: "بليد آند سيدر",
    description:
      "Premium barbershop in Hamra, Beirut. Precision haircuts, hot towel shaves and honest craft since 2016.",
    url: SITE_URL,
    image: [OG_IMAGE],
    telephone: "+9611000000",
    priceRange: "$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bechara El Khoury Street",
      addressLocality: "Beirut",
      addressCountry: "LB",
    },
    openingHoursSpecification: HOURS.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.days.map((d) => DAY_NAMES[d]),
      opens: row.open,
      closes: row.close,
    })),
  };

  /* FAQPage schema — mirrors the EN FAQ section for rich results. */
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TRANSLATIONS.en.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    /* lang/dir are flipped client-side by <LanguageProvider/> when the
       visitor switches to Arabic; defaults here are the English LTR base. */
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} ${cairo.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        {children}
      </body>
    </html>
  );
}
