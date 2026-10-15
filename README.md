# Blade & Cedar — بليد آند سيدر

A premium one-page concept website for a fictional barbershop in Beirut, Lebanon.
Built as a portfolio concept by **Mawqe3 Studio**.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** with a custom charcoal / cream / gold token set
- **shadcn/ui** primitives (Sheet, Button) + Lucide icons
- Fonts via `next/font`: Playfair Display (headings), Inter (body), Cairo (Arabic)
- No backend required — deploy-ready for Vercel

## Features

- Full **English / Arabic** versions with an `EN | AR` toggle in the header.
  Arabic flips the whole document to `dir="rtl"` and swaps to the Cairo font.
- All layout uses **logical CSS properties** (`ms/me/ps/pe/start/end`) so the
  RTL layout mirrors automatically.
- **2-step booking dialog** (header + final CTA): pick a barber → pick a day
  and 30-min slot → hands off to WhatsApp with the full choice pre-filled in
  the message. Days/slots are generated from the `HOURS` config in Beirut time.
  "Book with {name}" buttons on barber cards open it pre-selected.
- **It remembers your barber & service** — the last confirmed choices are
  stored locally; the next time the dialog opens on its own it jumps straight
  to the time step with a gold "we kept your barber and Haircut + Beard" note
  and both baked into the message. Stale/absent values (unknown service id,
  out-of-range barber) degrade gracefully to the normal two-step flow; manual
  re-picks clear their part of the note.
- **Service-aware booking funnel** — the "Book this service" CTA inside a
  service detail dialog opens the booking flow with that service attached
  (gold chip in the dialog header, clearable), and the WhatsApp message reads
  "I'd like to book Skin Fade with Karim Haddad on Saturday Oct 17 at 11:00".
- **Smart time slots** — once today is in the day picker, slots inside a
  30-minute lead window (`BOOKING_LEAD_MIN`) are greyed out with a strike-
  through and can't be picked; a small note explains it. Relative day labels
  (Today / Tomorrow) are keyed on the actual Beirut date, so after closing
  time the picker correctly starts at "Tomorrow".
- **USD ⇄ L.L. currency toggle** in Services — converts every price at the
  config rate (`CURRENCY.usdToLbp`, rounded to `roundTo` notes) with a
  localized conversion note; the detail-dialog price flag follows; the toggle
  is hidden in print (menu prints in the active currency).
- **Barber profile dialogs** — tap a barber's portrait for photo, bio and
  signature specialties, then book with them directly.
- **FAQ accordion** with `FAQPage` JSON-LD for rich results.
- **Live "Open now / Closed" badge** in the Location section — computed from
  real Beirut time against `HOURS`, refreshed every minute; when closed it
  points to the next opening as "Opens Today/Tomorrow/Weekday · 10:00".
- **Gallery lightbox** with prev/next buttons, arrow-key navigation (RTL aware),
  **touch swipe gestures** (swipe left = next, mirrored in RTL) and a caption
  counter. Lightbox navigation follows the active filter.
- **Gallery category filters** — All / Cuts / Fades / Shaves / Shop chips with
  gold counts (`GALLERY_ITEM_TAGS` in config); tags + alt texts verified
  against the actual photos.
- **Gallery "Load more"** — the wall shows the first 6 shots
  (`GALLERY_PAGE_SIZE`), a gold button reveals the other 6 (12 total) and
  toggles to "Show less"; filters with fewer items than a page never show
  the button, and the lightbox only navigates what is on the wall.
- **Barber → gallery presets** — every barber profile dialog has a
  "See {name}'s work" link that closes the dialog, smooth-scrolls to the
  gallery and preselects the barber's specialty filter (cuts / fades /
  shaves via `BARBER_WORK_TAG` in config, dispatched as a `CustomEvent`).
- **Before / After comparison slider** (`before-after.tsx`): drag the gold
  handle (pointer + touch), arrow keys, Home/End; ARIA slider semantics;
  photo geometry stays LTR while the labels localize (قبل / بعد).
- **Service detail dialogs** — every menu row opens a rich dialog: photo strip
  with a gold price flag, chair-time chip ("≈ 40 min in the chair"), a
  "What's included" list, and a service-specific WhatsApp booking CTA
  (`durationMin`/`includesEn`/`includesAr` + `SERVICE_IMAGE_INDEX` in config).
- **Seasonal announcement scheduler** — `ANNOUNCEMENTS` in config with
  recurring `MM-DD` date ranges (computed in Beirut time, new-year wrap
  supported). Active seasonal messages override the evergreen notice;
  dismissal is remembered per announcement (`bc-announce-dismissed-id`).
  **Owner preview:** open `/?announce=<id>` to force any campaign (or
  `/?announce=default` for the evergreen message) regardless of the
  calendar — previews ignore stored dismissals and can't be collapsed;
  unknown ids fall back to the normal scheduler.
- **Back-to-top button** with a circular gold reading-progress ring — appears
  after ~1.5 viewports, sits above the floating WhatsApp button on mobile,
  mirrors to the correct corner in RTL.
- **Dismissible announcement bar** pinned above the header — gift-card notice,
  dismissal persisted in `localStorage`,
  hydration-safe, collapses smoothly.
- **Printable price list** — the "Print the price list" button in Services
  triggers a dedicated `@media print` stylesheet: clean white sheet, serif
  letterhead with address + phone, two-column menu, everything else hidden.
- **"Today" highlight** in the Location hours table — the current Beirut
  weekday's row gets a gold tint + "Today / اليوم" chip (config-driven from
  `HOURS`).
- **Gift-card section** (`#gift`, new "08") — a gold **foil ticket visual**
  (tilted, sheen sweep, perforation with punched notches, fake barcode,
  serial number `BC·0117`, stacked card edges, film grain) next to amount
  chips ($25/$50/$75) with a **live L.L. conversion** line (`aria-live`), an
  **optional recipient name** field (once typed, the ticket reads
  "To {name}" and the WhatsApp order becomes "…gift card for {name}…"),
  **remembered between visits** (`bc-gift-recipient`, pre-filled on return,
  clearable with an in-field ✕), a
  custom-amount note and a **pre-filled WhatsApp order CTA**
  (`GIFT_CARD` + `waGiftLink(lang, usd, forName?)` in config). Fully
  mirrored in RTL; the ticket is decorative (`aria-hidden`) while all info
  stays accessible via the copy side; linked from the footer quick-nav.
- **Gallery barber attribution** — attributed shots carry a gold "by {name}"
  hover chip in the grid and a "— by {name}" credit in the lightbox caption
  (`GALLERY_ITEM_BARBER` in config; shop interiors stay neutral); the
  lightbox **preloads the neighbouring shots** at full resolution so
  prev/next feels instant.
- **FAQ editorial numbering** — quiet gold serif 01–06 indices before each
  question.
- **Booking reassurance** — step 1 closes with the "first available" promise
  ("the wait is usually under 10 minutes"), EN + AR.
- **Reviews marquee** — six reviews (EN/AR) drift in a full-bleed
  auto-scrolling track (64s loop, reuses the ribbon's pause-on-hover /
  focus-within rule), duplicated copy is `aria-hidden`, charcoal edge fades
  melt the cards into the page; each card carries its own `dir` so Arabic
  quotes stay right-aligned inside the LTR track. Reduced-motion users get
  a static 3-column grid instead (`matchMedia` swap, post-hydration).
- **Reviews upgrades** — "Read all reviews on Google ↗" link (arrow mirrors in
  RTL), a "Verified visit" gold badge chip on every review card and a gold
  **top-edge accent sweep** on hover (reduced-motion safe).
- Style details: gold **reading-progress line** under the sticky header,
  4.9-star review summary strip, street label on the stylised map, cedar
  favicon (`public/cedar.svg`), cedar-of-Lebanon watermark on the final CTA,
  **giant hollow watermark word** ("Stay sharp" / "خليك مشطّف") behind the
  final CTA, **gold editorial drop cap** on the story's first paragraph,
  **gold underline sweep** on footer nav links, press-scale on gold CTAs,
  **gold sheen sweep** + **gold hover halo** (`glow-gold`) on booking CTAs
  (reduced-motion safe), **slow ken-burns drift** on the hero backdrop,
  gold corner brackets on gallery hover, hover-lift on cards, hover wash +
  price lift on menu rows, `tabular-nums` prices/slots, gold `::selection`,
  gold `:focus-visible` rings site-wide, a **giant ghost cedar watermark**
  behind the services menu, hover-lift on booking day chips,
  **cedar hairline section dividers** between reviews → FAQ and location →
  gift sections, a **"Most booked" flame pill** on the Skin Fade row
  (menu + detail dialog) and a **print-only LBP reference line** under the
  letterhead note ("1$ ≈ 89,500 L.L. …", rate sourced from `CURRENCY`).
- **Gold marquee ribbon** between hero and story (Walk-ins welcome · Hot
  towel rituals · Est. 2016 …) — infinite CSS loop, pauses on hover/focus,
  static under reduced motion, cedar-leaf separators.
- **Live map toggle** in Location: the illustrated charcoal map is default,
  switch to a real OpenStreetMap embed recolored to the dark palette
  (`filter: grayscale + invert + sepia`) — no API key needed.
- **Animated stat counters** in About (8+ years · 600+ cuts · 4.9 rating)
  count up on first scroll into view (hydration-safe, reduced-motion safe).
- **Instagram strip** in the footer: six square shots linking to the profile
  with a gold hover overlay.
- **Web Share button** on the final CTA — native share sheet where supported,
  clipboard copy fallback with a "Link copied" confirmation (aria-live).
- **Phone fallback** inside the booking dialog's time step for anyone
  without WhatsApp, plus a **"Copy booking details"** button (clipboard API
  with a legacy `execCommand` fallback, gold "Copied" confirmation) so the
  appointment text can be pasted anywhere.
- Editorial **numbered section kickers** (01 — Our story … 08 — Gift cards) in
  gold serif, and a vertical "Est. 2016 · Hamra — Beirut" side label on the
  hero (desktop, RTL-mirrored).
- **House signature tag** on the Haircut + Beard menu item.
- Every direct booking CTA still opens a pre-filled **WhatsApp** chat
  (Arabic message in AR mode); floating WhatsApp button on mobile.
- Scroll-reveal + staggered hero entrance driven by `IntersectionObserver`
  / CSS, fully disabled under `prefers-reduced-motion`.
- **Branded OG share image** — AI-generated cedar-emblem barbershop artwork,
  self-hosted at `public/og.jpg` (1200×630) and wired into metadata + JSON-LD.
- **PWA-ready** — `public/manifest.webmanifest` (standalone display, charcoal
  theme color, cedar icon set generated from the SVG: 192/512 + maskable +
  Apple touch icon), app shortcuts to booking and location; `theme-color`
  viewport meta for dark browser chrome.
- **JSON-LD `BarberShop` structured data** (name, address, opening hours,
  price range) for local SEO, plus `FAQPage` schema.
- SEO metadata + Open Graph tags in `src/app/layout.tsx`.
- **`sitemap.xml`** generated at `src/app/sitemap.ts` (canonical URL +
  en/ar hreflang alternates from `SITE_CONFIG.siteUrl`), referenced from
  `public/robots.txt`.

## Quick customization

| What | Where |
| --- | --- |
| **WhatsApp number** (single source of truth) | `whatsappNumber` in `src/lib/config.ts` |
| Canonical site URL (metadata, sitemap, JSON-LD) | `siteUrl` in `src/lib/config.ts` |
| Pre-filled booking messages | `whatsappMessageEn` / `whatsappMessageAr` + `waLink()` in `src/lib/config.ts` |
| **Opening hours** (drives badge + booking slots + today-highlight + JSON-LD) | `HOURS` in `src/lib/hours.ts` |
| Address, phone, socials, map link, Google reviews URL | `SITE_CONFIG` in `src/lib/config.ts` |
| Services & prices | `SERVICES` in `src/lib/config.ts` (`featured: true` = house signature tag, `popular: true` = most-booked pill) |
| **L.L. exchange rate** for the currency toggle | `CURRENCY.usdToLbp` / `CURRENCY.roundTo` in `src/lib/config.ts` |
| **Gift-card amounts & ticket serial** | `GIFT_CARD` in `src/lib/config.ts` (+ `waGiftLink()` message, optional recipient arg) |
| Booking lead time (greyed-out same-day slots) | `BOOKING_LEAD_MIN` in `src/lib/hours.ts` |
| Service detail dialogs (duration, included items, photo) | `durationMin` / `includesEn` / `includesAr` + `SERVICE_IMAGE_INDEX` in `src/lib/config.ts` |
| Gallery category filters | `GALLERY_FILTERS` + `GALLERY_ITEM_TAGS` in `src/lib/config.ts` |
| Gallery page size (items before "Load more") | `GALLERY_PAGE_SIZE` in `src/lib/config.ts` |
| Barber → gallery filter preset | `BARBER_WORK_TAG` in `src/lib/config.ts` |
| Marquee ribbon items | `ribbon.items` in `src/lib/i18n.ts` |
| FAQ questions & answers | `faq.items` in `src/lib/i18n.ts` (schema auto-generated) |
| Barber roles / bios / specialties | `barbers` in `src/lib/i18n.ts` |
| All English + Arabic copy | `src/lib/i18n.ts` (single `TRANSLATIONS` object) |
| All images | `IMAGES` map in `src/lib/config.ts` (Unsplash IDs — swap URLs freely) |
| OG share image | replace `public/og.jpg` (1200×630) |
| Announcement bar message | evergreen: `announcement.message` in `src/lib/i18n.ts` · seasonal: `ANNOUNCEMENTS` (recurring `MM-DD` ranges, Beirut time) in `src/lib/config.ts` · preview any campaign: `/?announce=<id>` |
| Brand palette | CSS variables in `src/app/globals.css` |

## Images

Photography is loaded from Unsplash via `next/image`
(`images.unsplash.com` is whitelisted in `next.config.ts`).
To use your own photos, drop them into `public/` and update the `IMAGES` map.
The before/after pair (`public/before-after/`) and the OG artwork
(`public/og.jpg`) are self-hosted — replace them with the shop's own photos.

## Getting started

```bash
bun install
bun run dev      # development
bun run lint     # ESLint
bun run build    # production build
```

## Deploying

Push to a Git repository and import into Vercel. Before sharing, update
`SITE_URL` and `OG_IMAGE` in `src/app/layout.tsx`.

---

© Blade & Cedar. Concept design by **Mawqe3 Studio** — fictional brand, for portfolio use.
