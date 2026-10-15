/* ================================================================== */
/*  Blade & Cedar — site configuration                                */
/*  Everything a real shop owner would need to edit lives here.       */
/* ================================================================== */

/**
 * THE number — one constant drives every WhatsApp booking link AND the
 * displayed phone number (header, hero, booking popup, gift card, barber
 * cards, floating button, footer, "Prefer to call?"). International
 * format WITHOUT "+" or spaces.
 */
export const WHATSAPP_NUMBER = "96179143702";

/**
 * "+961 79 143 702" — derived from WHATSAPP_NUMBER so the displayed
 * phone can never drift out of sync with the wa.me links.
 * Grouping: country code · prefix · 3 · 3.
 */
export const WHATSAPP_DISPLAY = `+${WHATSAPP_NUMBER.slice(0, 3)} ${WHATSAPP_NUMBER.slice(3, 5)} ${WHATSAPP_NUMBER.slice(5, 8)} ${WHATSAPP_NUMBER.slice(8)}`;

export const SITE_CONFIG = {
  /** Brand */
  name: "Blade & Cedar",
  nameAr: "بليد آند سيدر",

  /**
   * Canonical site URL (SITE_URL) — used by Open Graph, Twitter cards,
   * JSON-LD, sitemap & robots. Update this one line when the
   * deployment domain changes.
   */
  siteUrl: "https://blade-and-cedar.vercel.app",

  /** WhatsApp booking number — see WHATSAPP_NUMBER above. */
  whatsappNumber: WHATSAPP_NUMBER,

  /** Phone shown to humans — derived, always matches the WhatsApp line. */
  phoneDisplay: WHATSAPP_DISPLAY,

  /** Pre-filled booking messages (URL-encoded automatically in waLink()). */
  whatsappMessageEn: "Hi Blade & Cedar, I'd like to book an appointment",
  whatsappMessageAr: "مرحبًا بليد آند سيدر، أودّ حجز موعد",

  /** Fictional location */
  addressEn: "Bechara El Khoury Street, Hamra — Beirut, Lebanon",
  addressAr: "شارع بشارة الخوري، الحمرا — بيروت، لبنان",
  mapUrl: "https://maps.google.com/?q=Hamra+Beirut", // placeholder map link
} as const;

/**
 * Builds the wa.me booking link for a given language.
 * Pass a service name to pre-fill a service-specific booking message.
 */
export function waLink(lang: "en" | "ar", service?: string): string {
  const message = service
    ? lang === "ar"
      ? `مرحبًا بليد آند سيدر، أودّ حجز موعد لخدمة ${service}`
      : `Hi Blade & Cedar, I'd like to book an appointment for ${service}`
    : lang === "ar"
      ? SITE_CONFIG.whatsappMessageAr
      : SITE_CONFIG.whatsappMessageEn;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* ================================================================== */
/*  Imagery — every path in one place so photos are easy to swap      */
/* ================================================================== */

const img = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ""}&fit=crop&q=80&auto=format`;

export const IMAGES = {
  /** Hero backdrop — moody barbershop interior */
  hero: img("photo-1521590832167-7bcbfaa6381f", 1920, 1280),
  /** About — barber at work */
  about: img("photo-1585747860715-2ba37e788b70", 1000, 1250),
  /** Open Graph share image — hero photo + wordmark, self-hosted (public/og.jpg, 1200×630) */
  og: "/og.jpg",
  /** Before/after pair for the comparison slider (public/before-after/) */
  beforeAfter: {
    before: "/before-after/before.jpg",
    after: "/before-after/after.jpg",
  },
  /** Meet the barbers — portraits */
  barbers: [
    img("photo-1506794778202-cad84cf45f1d", 700, 850),
    img("photo-1472099645785-5658abf4ff4e", 700, 850),
    img("photo-1500648767791-00dcc994a43e", 700, 850),
  ],
  /**
   * Gallery grid — first 6 are shown initially, the rest reveal via
   * "Load more". Every URL visually verified before embedding.
   */
  gallery: [
    img("photo-1503951914875-452162b0f3f1", 800, 1000),
    img("photo-1621605815971-fbc98d665033", 800, 1000),
    img("photo-1622286342621-4bd786c2447c", 800, 1000),
    img("photo-1599351431202-1e0f0137899a", 800, 1000),
    img("photo-1605497788044-5a32c7078486", 800, 1000),
    img("photo-1614252369475-531eba835eb1", 800, 1000),
    // — revealed by "Load more" —
    img("photo-1493256338651-d82f7acb2b38", 800, 1000), // clipper fade work
    img("photo-1517832606299-7ae9b720a186", 800, 1000), // beard scissor trim B&W
    img("photo-1567894340315-735d7c361db0", 800, 1000), // textured crop styling
    img("photo-1512690459411-b9245aed614b", 800, 1000), // leather barber chair
    img("photo-1583864697784-a0efc8379f70", 800, 1000), // finished-cut portrait
    img("photo-1600948836101-f9ffda59d250", 800, 1000), // mirror line interior
  ],
  /** Tiny square crops for the footer Instagram strip (same order). */
  galleryThumbs: [
    img("photo-1503951914875-452162b0f3f1", 240, 240),
    img("photo-1621605815971-fbc98d665033", 240, 240),
    img("photo-1622286342621-4bd786c2447c", 240, 240),
    img("photo-1599351431202-1e0f0137899a", 240, 240),
    img("photo-1605497788044-5a32c7078486", 240, 240),
    img("photo-1614252369475-531eba835eb1", 240, 240),
  ],
  /** Same shots at lightbox resolution (same order as gallery). */
  galleryFull: [
    img("photo-1503951914875-452162b0f3f1", 1400, 1750),
    img("photo-1621605815971-fbc98d665033", 1400, 1750),
    img("photo-1622286342621-4bd786c2447c", 1400, 1750),
    img("photo-1599351431202-1e0f0137899a", 1400, 1750),
    img("photo-1605497788044-5a32c7078486", 1400, 1750),
    img("photo-1614252369475-531eba835eb1", 1400, 1750),
    img("photo-1493256338651-d82f7acb2b38", 1400, 1750),
    img("photo-1517832606299-7ae9b720a186", 1400, 1750),
    img("photo-1567894340315-735d7c361db0", 1400, 1750),
    img("photo-1512690459411-b9245aed614b", 1400, 1750),
    img("photo-1583864697784-a0efc8379f70", 1400, 1750),
    img("photo-1600948836101-f9ffda59d250", 1400, 1750),
  ],
} as const;

/* ================================================================== */
/*  Gift cards — buy for someone else, ordered over WhatsApp.         */
/*  Amounts are USD presets; waGiftLink() pre-fills the message.      */
/* ================================================================== */

export const GIFT_CARD = {
  /** Preset amounts shown as selectable chips (USD). */
  amounts: [25, 50, 75] as const,
  /** Fictional starting serial printed on the ticket visual. */
  serial: "BC·0117",
} as const;

/**
 * wa.me link with a gift-card purchase message pre-filled.
 * Pass `forName` (optional recipient) to append it to the message.
 */
export function waGiftLink(
  lang: "en" | "ar",
  usd: number,
  forName?: string
): string {
  const name = forName?.trim();
  const message =
    lang === "ar"
      ? `مرحبًا بليد آند سيدر، حابب أشتري بطاقة هدية بقيمة ${usd}$${name ? ` باسم ${name}` : ""} — ممكن التفاصيل؟`
      : `Hi Blade & Cedar, I'd like to buy a $${usd} gift card${name ? ` for ${name}` : ""} — can you share the details?`;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* ================================================================== */
/*  Currency — the menu quotes USD but locals think in L.L.            */
/*  The Services section toggles between the two with this rate.       */
/* ================================================================== */

export const CURRENCY = {
  /** L.L. per $1 — update when the rate moves. */
  usdToLbp: 89500,
  /** Round LBP conversions to a sane note (5,000 L.L.). */
  roundTo: 5000,
} as const;

/** $12 → "1,075,000" (rounded to the nearest roundTo note, grouped digits). */
export function lbpFromUsd(usd: number): string {
  const raw = usd * CURRENCY.usdToLbp;
  const rounded = Math.round(raw / CURRENCY.roundTo) * CURRENCY.roundTo;
  return new Intl.NumberFormat("en-US").format(rounded);
}

/* ================================================================== */
/*  Services & prices (USD) — edit the menu here, both languages      */
/* ================================================================== */

export type Service = {
  id: string;
  price: number;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  /** Chair time in minutes — shown in the service detail dialog. */
  durationMin: number;
  /** Line items for the "what's included" list in the detail dialog. */
  includesEn: string[];
  includesAr: string[];
  /** Marks the house signature — gets a gold tag in the menu. */
  featured?: boolean;
  /** Marks the most-booked service — gets a gold "popular" pill. */
  popular?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "classic",
    price: 12,
    nameEn: "Classic Haircut",
    nameAr: "قصّة كلاسيك",
    descEn: "Scissor cut, wash & finish",
    descAr: "قص بالمقص، غسيل وتمشيط",
    durationMin: 40,
    includesEn: ["Quick consultation", "Scissor cut", "Wash & style finish"],
    includesAr: ["استشارة سريعة", "قص بالمقص", "غسيل وتصفيف"],
  },
  {
    id: "fade",
    price: 15,
    nameEn: "Skin Fade",
    nameAr: "فايد ناعم",
    descEn: "Blended to the skin, razor-sharp edges",
    descAr: "تدريج حتى الجلد بحواف حادة",
    durationMin: 45,
    includesEn: ["Skin-fade blend, no guard", "Razor line-up & edges", "Wash & style"],
    includesAr: ["تدريج حتى الجلد", "تحديد الحواف بالموس", "غسيل وتصفيف"],
    popular: true,
  },
  {
    id: "beard",
    price: 8,
    nameEn: "Beard Trim & Shape",
    nameAr: "تهذيب وتشكيل اللحية",
    descEn: "Sculpted lines with hot towel finish",
    descAr: "تحديد بخطوط دقيقة ومنشفة ساخنة",
    durationMin: 25,
    includesEn: ["Shape consultation", "Trim & sculpted lines", "Hot towel & balm finish"],
    includesAr: ["استشارة الشكل", "تهذيب وتشكيل الخطوط", "منشفة ساخنة وبلسم"],
  },
  {
    id: "combo",
    price: 18,
    nameEn: "Haircut + Beard",
    nameAr: "قصّة + لحية",
    descEn: "The full works — leave sharp from every angle",
    descAr: "الطقس الكامل — تخرج مشطّف من كل زاوية",
    durationMin: 60,
    includesEn: ["Full haircut & wash", "Beard trim & sculpt", "Hot towel ritual to close"],
    includesAr: ["قصّة كاملة مع غسيل", "تهذيب وتشكيل اللحية", "طقوس منشفة ساخنة للختام"],
    featured: true,
  },
  {
    id: "shave",
    price: 12,
    nameEn: "Hot Towel Shave",
    nameAr: "حلاقة بالمنشفة الساخنة",
    descEn: "Straight razor ritual, oils & balm",
    descAr: "طقوس الموس التقليدي مع زيوت وبلسم",
    durationMin: 30,
    includesEn: ["Double hot-towel prep", "Straight razor shave", "Oils & balm finish"],
    includesAr: ["تحضير بمنشفتين ساخنتين", "حلاقة بالموس التقليدي", "زيوت وبلسم للختام"],
  },
  {
    id: "kids",
    price: 8,
    nameEn: "Kids Cut",
    nameAr: "قصّة أطفال",
    descEn: "Under 12 — patience included",
    descAr: "لأعمار ١٢ وما دون — بصبر شديد",
    durationMin: 30,
    includesEn: ["Patient, kid-friendly barber", "Any style they want", "Wash & style"],
    includesAr: ["حلاق صبور ومحبوب", "أي ستايل بدو ياها", "غسيل وتصفيف"],
  },
];

/**
 * Detail-dialog artwork per service — reuses gallery shots so there are
 * no extra downloads. Keys match SERVICES[].id, values are IMAGES.gallery indexes.
 */
export const SERVICE_IMAGE_INDEX: Record<string, number> = {
  classic: 2, // scissor cut in progress
  fade: 3, // fade detailing
  beard: 5, // finished look portrait
  combo: 4, // styling at the chair
  shave: 0, // straight-razor shave
  kids: 1, // tools flat-lay
};

/* ================================================================== */
/*  Announcement bar scheduler — seasonal, recurring every year        */
/*  `from`/`to` are "MM-DD" (inclusive), compared in Beirut time.      */
/*  When nothing is active, the header falls back to the evergreen     */
/*  message in i18n (`announcement.message`).                          */
/* ================================================================== */

export type Announcement = {
  id: string;
  from: string; // "MM-DD"
  to: string; // "MM-DD"
  messageEn: string;
  messageAr: string;
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "beard-season",
    from: "11-01",
    to: "11-30",
    messageEn:
      "Beard season is on — free hot-towel upgrade with every shave through November.",
    messageAr:
      "موسم اللحية وصل — مع كل حلاقة، منشفة ساخنة مجانًا طوال شهر تشرين الثاني.",
  },
  {
    id: "holiday-gift",
    from: "12-15",
    to: "12-31",
    messageEn:
      "Gift cards for the holidays — give someone their sharpest season yet.",
    messageAr: "بطاقات هدايا للعطل — أهدى حدّ قصّة بتغير يومو.",
  },
];

/** Today's "MM-DD" in Beirut time (calendar-date safe across timezones). */
function beirutMonthDay(now: Date): string {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Beirut",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // "YYYY-MM-DD"
  return iso.slice(5);
}

/**
 * First announcement whose date range covers `now` (Beirut time).
 * Ranges may wrap the new year (from > to), e.g. 12-24 → 01-07.
 */
export function getActiveAnnouncement(now: Date = new Date()): Announcement | null {
  const md = beirutMonthDay(now);
  return (
    ANNOUNCEMENTS.find(({ from, to }) =>
      from <= to ? md >= from && md <= to : md >= from || md <= to
    ) ?? null
  );
}

/* ================================================================== */
/*  Gallery categories — tags drive the filter chips in the gallery   */
/* ================================================================== */

export type GalleryTag = "cuts" | "fades" | "shaves" | "shop";

export const GALLERY_FILTERS = [
  "all",
  "cuts",
  "fades",
  "shaves",
  "shop",
] as const;
export type GalleryFilter = (typeof GALLERY_FILTERS)[number];

/** One tag per gallery image, same order as IMAGES.gallery. */
export const GALLERY_ITEM_TAGS: GalleryTag[] = [
  "shaves", // straight-razor finish on a reclined client
  "shop", // clippers, scissors & tools on the counter
  "cuts", // scissor cut in progress
  "fades", // comb + trimmer detailing a fresh fade
  "cuts", // blow-dry styling at the chair
  "shop", // finished look — house style portrait
  // — revealed by "Load more" —
  "fades", // tattooed forearms sculpting a clipper fade
  "shaves", // moody B&W scissor trim shaping a full beard
  "cuts", // textured crop styled by hand at the chair
  "shop", // the tufted leather chair, waiting
  "cuts", // fresh cut + clean stubble portrait
  "shop", // mirror line & chairs at opening hour
];

/**
 * How many gallery items show before "Load more" reveals the rest.
 * Filters shorter than this never show the button.
 */
export const GALLERY_PAGE_SIZE = 6;

/**
 * The barber behind each gallery item (index into t.barbers.names),
 * same order as IMAGES.gallery — null for shop interiors / tools /
 * client portraits, where no single barber is "the author".
 * Shown as a hover chip in the grid and in the lightbox caption.
 */
export const GALLERY_ITEM_BARBER: (number | null)[] = [
  0, // straight-razor shave — Karim's chair ritual
  null, // tools flat-lay
  0, // scissor cut in progress — Karim
  1, // fade detailing — Jad
  1, // blow-dry styling — Jad
  null, // finished look, house portrait
  1, // tattooed-forearm clipper fade — Jad
  2, // B&W beard scissor trim — Elie
  0, // textured crop styled by hand — Karim
  null, // the leather chair
  null, // fresh-cut client portrait
  null, // mirror line interior
];

/**
 * Gallery filter preselected from each barber's profile — their
 * specialty in front of the lens (Karim → cuts, Jad → fades, Elie → shaves).
 */
export const BARBER_WORK_TAG: Record<number, GalleryTag> = {
  0: "cuts",
  1: "fades",
  2: "shaves",
} as const;
