# Worklog — Blade & Cedar (بليد آند سيدر)

Fictional premium barbershop one-pager for Beirut. Next.js 16 App Router + Tailwind 4 + shadcn/ui. Full EN/AR with RTL, WhatsApp booking CTAs.

---
Task ID: 1
Agent: Z.ai Code (main)
Task: Build the complete Blade & Cedar one-page website (design system, i18n/RTL, 10 sections, WhatsApp integration, README), verify end-to-end in a real browser.

Work Log:
- Verified 12 Unsplash image URLs reachable (all 200) before wiring them in.
- `next.config.ts`: whitelisted `images.unsplash.com` remote patterns (kept standalone output).
- `src/app/globals.css`: Tailwind 4 CSS-first theme — charcoal `#121212`, cream `#F2EDE4`, gold `#C9A24B` tokens; shadcn token bridge (primary = gold); `--radius: 0.25rem` (sharp edges); Cairo font swap for `[dir="rtl"]`; `.kicker`, `.gold-rule` (with RTL gradient flip), `.leader-dots`; `.reveal` scroll-reveal with `prefers-reduced-motion` kill-switch; gold scrollbar; film-grain utility.
- `src/app/layout.tsx`: Playfair Display + Inter + Cairo via `next/font`; full SEO metadata + Open Graph/Twitter cards (OG image = Unsplash 1200x630).
- `src/lib/config.ts`: single source of truth — `SITE_CONFIG.whatsappNumber` ("961XXXXXXXX" placeholder per spec), EN/AR pre-filled messages, fictional address/phone/socials, `waLink(lang, service?)` builder (per-service booking messages), `IMAGES` map, `SERVICES` menu (6 items, USD).
- `src/lib/i18n.ts`: one typed `TRANSLATIONS` object (en = truth, ar = natural Lebanese-friendly MSA, not literal translation).
- `src/lib/language-context.tsx`: client provider; flips `<html lang/dir>`, persists to localStorage (`bc-lang`), hydration-safe restore.
- Components in `src/components/site/`: `header` (fixed, scroll-aware bg, scroll-spy nav, EN|AR toggle, mobile Sheet that flips side per RTL), `hero` (min-h-svh, layered charcoal overlays, clamp() headline, scroll cue), `about` (offset gold frame, stats strip), `services` (barber-menu dotted leaders, per-item WhatsApp links), `gallery` (2/3-col grid, hover zoom + gold underline sweep), `barbers` (3 cards, grayscale→color hover), `reviews` (5 gold stars), `location` (hours table + stylised faux-map placeholder with pinging pin), `final-cta` (glow + big gold button), `footer` (mt-auto sticky-bottom, socials, Mawqe3 Studio credit), `floating-whatsapp` (mobile-only, logical `end-5` inset mirrors in RTL, safe-area padding), `fade-in` (IntersectionObserver reveal), `section-heading`, `whatsapp-button` (shared gold CTA), `icons` (WhatsApp brand SVG).
- `src/app/page.tsx`: LanguageProvider → skip link → Header/Hero/About/Services/Gallery/Barbers/Reviews/Location/FinalCta/Footer; `min-h-svh flex flex-col` + `mt-auto` footer.
- `README.md`: stack, feature list, customization table (WhatsApp number, copy, images, palette), deploy notes.
- Fixed 2 `react-hooks/set-state-in-effect` lint errors (fade-in → setState in IO callback + DOM fallback; language-context → documented eslint-disable for the hydration-safe localStorage restore).
- Fixed Radix warning: `aria-describedby={undefined}` on SheetContent.
- Browser verification (agent-browser): EN desktop hero/about/services/barbers/location/footer screenshots OK; scroll-spy highlights correct; WhatsApp href + decoded message match spec exactly (EN + AR); AR mode → dir=rtl/lang=ar/localStorage saved, full mirror confirmed (wordmark right, menu prices left, sheet opens from left); mobile 375px (hero, sheet open→nav→close+scroll, floating WhatsApp bottom-corner both directions); tablet 768px; zero console errors; `bun run lint` clean; dev.log 200s, no runtime errors.

Stage Summary:
- Site complete and browser-verified end-to-end (EN/AR/RTL/mobile/tablet).
- All booking CTAs driven by ONE constant: `SITE_CONFIG.whatsappNumber` in `src/lib/config.ts`.
- All copy in one object: `src/lib/i18n.ts`. All images in one map: `IMAGES` in config.
- Unresolved/next ideas: per-service booking links already done; possible next steps — FAQ accordion, booking form fallback, JSON-LD LocalBusiness schema, real map embed, barber profile modals, lightbox for gallery, page transitions.

---
Task ID: 2
Agent: Z.ai Code (cron webDevReview)
Task: QA re-assessment + next-round feature development (booking dialog, open/closed badge, lightbox, JSON-LD, style detail pass).

Work Log:
- QA baseline: server 200, zero console/page errors, lint clean → phase stable, proceeded to features.
- NEW `src/lib/hours.ts`: machine-readable `HOURS` config (Mon–Fri 10:00–20:00, Sat 10:00–18:00, Sun closed), `beirutNow()` via Intl timezone, `isOpenNow()`, `upcomingOpenDays(n)` (skips today when last slot passed, skips Sundays), `slotsForDate()` (30-min grid), `weekdayOf()`. Display strings stay in i18n; logic is config-driven.
- NEW booking dialog `src/components/site/booking-dialog.tsx`: 2-step flow — (1) barber or "first available" (auto-advances), (2) day chips (Today/Tomorrow/weekday via ar-LB/en-US Intl) + 30-min slot grid → WhatsApp handoff with full choice pre-filled. Progress dots, Back, disabled confirm until slot chosen, RTL-mirrored (side, icons, chevrons), remounts fresh per open via key. Wired into Header (desktop + mobile sheet) and FinalCta via render-prop trigger; hero/floating/services stay direct wa.me links.
- NEW live badge in Location: `OpenBadge` computes Beirut time post-hydration (setTimeout 0 + 60s interval), gold pinging dot when open ("Open now · Closes 20:00"), muted dot + next opening when closed; `self-start` so it hugs content.
- NEW gallery lightbox: grid items are now buttons; Dialog shows `IMAGES.galleryFull` (1400px variants added to config), prev/next at logical sides (mirror in RTL), arrow-key nav (direction-aware), Escape, close button, caption + "1 / 6" gold counter.
- SEO: JSON-LD `BarberShop` (alternateName AR, address, openingHoursSpecification from HOURS, priceRange, currencies) injected in layout.tsx.
- Style details: cedar-of-Lebanon SVG signature (`cedar-leaf.tsx`) as CTA watermark + footer wordmark ornament; staggered hero entrance (`.hero-rise` keyframes + --rise-delay 120→950ms); ghost quote mark on review cards; "+" expand hint on gallery hover.
- Copy additions in i18n (en+ar): booking/openBadge/lightbox strings; Arabic WhatsApp template refined to avoid "يوم اليوم" (weekday prefix only added for real weekday labels) — verified message: "مرحبًا بليد آند سيدر، أودّ حجز موعد مع كريم حداد اليوم ١٥ تشرين الأول الساعة 14:00."
- Lint fixes: removed manual useMemo on waHref (React Compiler preserve-manual-memoization), removed unused eslint-disable.
- README updated (features + customization table incl. HOURS).

Verification (agent-browser):
- EN dialog flow: header → step 1 cards → Karim → step 2 days (Today Oct 15 / Tomorrow / Saturday Oct 17 / Monday Oct 19 — Sunday correctly skipped) → 14:00 slot → href = "Hi Blade & Cedar, I'd like to book an appointment with Karim Haddad on Today Oct 15 at 14:00." ✓
- AR dialog: fully mirrored (title/legend/cards right-aligned, close top-left, progress RTL); Arabic message verified ✓
- Badge: "Open now · Closes 20:00" (matches Beirut 14:xx Thu) ✓; role=status.
- Lightbox: open → 1/6, ArrowRight → 2/6, ArrowLeft → 1/6, Escape closes ✓; caption strip + counter ✓.
- Mobile 375px: sheet → book button → dialog opens correctly (single column, RTL) ✓.
- JSON-LD present (@type=BarberShop) ✓. Hero entrance stagger renders ✓ (screenshot mid-animation confirmed motion).
- Final: lint 0 problems, zero console errors, dev.log clean 200s.

Stage Summary:
- Site now has an interactive booking micro-flow, live availability status, lightbox, and local-business structured data — still zero-dependency additions (uses existing Radix Dialog + Intl APIs only).
- Single config points: WhatsApp number (config.ts), opening hours (hours.ts HOURS — drives badge + slots + JSON-LD), copy (i18n.ts).
- Risks/notes: `waLink()` in config unchanged for direct CTAs; booking dialog only reachable via header/final-CTA (by design). DST handled via Intl timezone names. Next ideas: FAQ accordion, real map embed (iframe), barber profile modals from booking cards, form fallback if WhatsApp unavailable, unit tests for hours.ts edge cases.

---
Task ID: 3
Agent: Z.ai Code (cron webDevReview)
Task: QA sweep + round-3 features (FAQ accordion + FAQPage schema, barber profile dialogs with booking preselect, styling detail pass).

Work Log:
- QA baseline: server 200, zero page errors, zero console errors, lint clean → stable, proceeded to features from the handover list.
- NEW FAQ section (`faq.tsx`): shadcn Accordion, 6 Q&As (EN + natural Lebanese-friendly AR), serif questions, gold chevrons, centered heading; wired into header nav (scroll-spy SECTION_IDS now includes `faq`), footer nav, and page order (Reviews → FAQ → Location).
- NEW FAQPage JSON-LD in layout.tsx (built from TRANSLATIONS.en.faq.items) alongside the existing BarberShop schema.
- BookingDialog: added `initialBarber` prop — opens pre-selected at step 2 when a specific barber is chosen; state init honors it.
- NEW barber profile dialogs (`barbers.tsx` rewritten): portrait is now a button opening a split photo/info dialog (role, bio, "In the chair" specialty chips, gold book CTA); "Book with {name}" buttons on every card + inside profile hand off to the booking dialog with that barber preselected (profile closes, booking opens at step 2).
- i18n additions (en+ar): faq section, barbers.specialties (3×3), profileCta/specialtiesLabel/bookWith/closeProfile, reviews.summary, header.nav.faq.
- Styling details: gold reading-progress line under the sticky header (scroll+resize listeners, `start-0` so it mirrors in RTL); reviews rating summary strip (big gold 4.9 + 4.5-star row + "Based on 127 Google reviews" AR/EN); faux-map street label ("BECHARA EL KHOURY ST." / "شارع بشارة الخوري") along the road; cedar SVG favicon (public/cedar.svg + metadata.icons).
- README updated (features + customization table rows for FAQ/barbers).

Verification (agent-browser):
- FAQPage JSON-LD present (@type=FAQPage, script #2) ✓
- FAQ accordion: expands/collapses, serif+gold chevrons; AR version fully mirrored ✓ (note: `find text` matches JSON-LD script text too — use snapshot refs for in-page clicks during QA)
- Profile dialog: photo/role/bio/specialties/chips/book CTA; EN desktop + AR mobile 375px ✓
- Preselect: "Book with Karim" → booking dialog opens at STEP 2 OF 2, message = "...appointment with Karim Haddad on Today Oct 15 at 14:00." ✓
- Rating summary strip renders (4.9 gold serif + star row + label) ✓
- Scroll-progress gold line live under header, RTL-aware (grows from right in AR) ✓
- Map street label visible in both languages ✓
- Lint 0 problems; console clean on final sweep.

Stage Summary:
- Site now covers: booking micro-flow (3 entry points + barber preselect), profiles, FAQ, live hours badge, lightbox, 2 JSON-LD schemas, reading progress — still zero new dependencies.
- All copy/config points: i18n.ts (incl. faq, specialties), config.ts (WhatsApp/images), hours.ts (schedule).
- Risks/notes: FAQPage schema uses EN strings (Google reads one locale; acceptable for concept). Accordion state persists across language toggle (value-based, harmless). Next ideas: real map iframe, WhatsApp desktop fallback banner, footer newsletter/Instagram strip, hours.ts unit tests, OG image regeneration with cedar branding.

---
Task ID: 4
Agent: Z.ai Code (cron webDevReview)
Task: QA re-assessment + round-4 features (marquee ribbon, live map toggle, animated counters, Instagram strip, share button, phone fallback, editorial styling details).

Work Log:
- QA baseline: server 200, zero console/page errors, lint clean → stable, proceeded to features from the handover list.
- NEW `ribbon.tsx`: gold marquee ticker between Hero and About (5 items EN/AR from i18n `ribbon.items`), cedar-leaf separators, duplicated track + -50% translateX loop, pauses on hover/focus, static under reduced motion; track forced LTR so loop math is identical in both languages.
- NEW live map toggle in Location: segmented control (Illustrated ⇄ Live map, aria-pressed) swaps the faux charcoal map for an OpenStreetMap iframe embed (no API key, Hamra bbox + marker) recolored via `.map-dark` filter (grayscale+invert+sepia) to stay on-palette; iframe lazy-loaded; faux map keeps role="img"/aria-label, iframe uses title.
- NEW `count-up.tsx`: About stats (8+ / 600+ / 4.9) count up on first intersection (ease-out cubic, rAF); SSR renders final value (hydration-safe), animation resets inside the wrapping FadeIn so the reset is invisible; reduced-motion/no-IO → static final value. setState only in IO/rAF callbacks (lint-safe, no eslint-disable).
- NEW footer Instagram strip: @bladeandcedar caption + 6 square thumbs (`IMAGES.galleryThumbs` added to config), gold hover overlay + ring, links to SITE_CONFIG.instagram.
- NEW share button on FinalCta: navigator.share → clipboard fallback with "Link copied" gold Check feedback (2.4s, timer ref-cleaned), sr-only aria-live confirmation; AbortError (user dismissed share sheet) silently ignored.
- NEW phone fallback in booking dialog step 2: "Prefer to call? +961 1 000 000" tel: link under the tz hint (WhatsApp-desktop-unavailable users).
- Styling details: SectionHeading `index` prop → gold serif section numbers (01 About … 07 Visit; CTA intentionally unnumbered); hero vertical side label "Est. 2016 · Hamra — Beirut" (writing-mode vertical, end-7 logical inset → RTL-mirrored, desktop only); "House signature / توقيع المحل" gold tag on the featured Haircut+Beard service (`featured: true` in SERVICES); `p { text-wrap: pretty }` base rule.
- i18n additions (en+ar): ribbon.items, hero.vertical, services.signature, location.mapToggle{Aria,Stylised,Live}, cta.share{,Copied}, footer.instaCaption, booking.phoneFallback.
- BUGFIX: new globals.css rules (marquee keyframes, .animate-marquee, .ribbon hover pause, .map-dark) were missing from compiled CSS after edits (turbopack CSS HMR lag — rules absent even though hero-rise from the same file was present); touch didn't help, appending a content change forced recompile → verified `.map-dark` + `@keyframes marquee` present in the served chunk and filter applied on the iframe.
- Lint/type hygiene: removed unused `lang` from FinalCta destructure; dropped a non-existent aria-hidden prop pass-through on CedarLeaf (it hardcodes aria-hidden internally).

Verification (agent-browser):
- EN desktop: ribbon renders with gold cedar separators; animation verified live (computed transform -286px → -315px, animationName=marquee, 38s); numbered kicker "01 — OUR STORY"; counters animate (mid-frame 4+/93+/0.8 → final 8+/600+/4.9); signature tag on combo row; map toggle LIVE MAP → dark-tinted OSM iframe loads (computed filter = grayscale(1) invert(0.92) sepia(0.14) contrast(0.92) brightness(0.96)); footer strip 6 thumbs + @bladeandcedar; share button renders + graceful silent catch when headless clipboard denied; booking dialog step 2 shows "Prefer to call? +961 1 000 000".
- AR mode: dir=rtl/lang=ar, Arabic ribbon items mirrored correctly, numbered kickers mirror (e.g. "02 — الخدمات والأسعار" on the right), signature tag "توقيع المحل", map toggle group mirrors to card top-right, badge/stats/footer all translated.
- Mobile 375px: EN hero + ribbon + floating WhatsApp bottom-right; AR floating button bottom-left (mirrored); counters mid-animation visible; sheet opens from the right (LTR) with EN|AR toggle + BOOK NOW.
- Final sweep: zero console errors, zero page errors, lint 0 problems, src/ tsc clean (only pre-existing examples/skills errors unrelated to this project), dev.log clean.
- README updated (features + customization rows).

Stage Summary:
- Round 4 shipped: ribbon marquee, live-map toggle, animated counters, Instagram strip, share button, booking phone fallback, numbered kickers, hero side label, signature tag — still zero new npm dependencies.
- Single config points unchanged: i18n.ts (all copy incl. ribbon), config.ts (IMAGES.galleryThumbs, SERVICES.featured), hours.ts (schedule).
- Risks/notes: OSM iframe depends on openstreetmap.org reachability (graceful: toggle back to illustrated); navigator.share/clipboard require https or localhost (silent fallback otherwise); turbopack CSS HMR can lag behind globals.css edits — if a new custom class seems inert, force a content change and re-verify compiled chunk before debugging further.
- Next ideas: barber-specific gallery filtering, price-list print/PDF stylesheet, testimonial Google-rating widget link, OG image with cedar branding, hours.ts unit tests, announcement bar for holiday hours.

---
Task ID: 5
Agent: Z.ai Code (cron webDevReview)
Task: QA sweep + round-5 features (before/after slider, gallery filters, announcement bar, printable menu, today-highlight, reviews upgrades, branded OG image, styling detail pass).

Work Log:
- QA baseline: server 200, zero console/page errors, lint clean → stable, proceeded to features from the handover list.
- NEW before/after comparison slider (`before-after.tsx`): found a matched pair via image-search skill (curly overgrown mullet vs sharp skin fade, both left-facing profiles, visually verified before embedding), self-hosted in `public/before-after/{before,after}.jpg`. Gold divider + glowing round handle, pointer-events drag (unified mouse/touch via Pointer Capture), ArrowLeft/Right/Home/End keys, ARIA `role=slider` with valuenow/valuetext, `touch-none select-none`, clip-path reveal (before clipped to the left of handle). Geometry forced `dir="ltr"` (photo convention) while labels localize (قبل/بعد) — mirrors nothing, stays correct in RTL.
- NEW gallery category filters: `GALLERY_FILTERS`/`GALLERY_ITEM_TAGS` in config, chips with gold tabular counts, `aria-pressed`, horizontally scrollable row on mobile; grid remounts per filter (key) so FadeIn replays; lightbox now navigates within the filtered set (openIdx = full-array index, counter = position within filter, "1 / 1" verified on Fades, 1→2 verified on Cuts).
- CONTENT FIX: catalogued all six Unsplash photos from a live grid screenshot — several alt texts (round-1) didn't match actual image content (e.g. "skin fade close-up" was actually a tools flat-lay). Rewrote all 6 alts EN+AR to describe the real photos, retagged items truthfully (shaves/shop/cuts/fades/cuts/shop) and dropped the empty "Beards" filter so no chip can yield an empty grid.
- NEW dismissible announcement bar inside the fixed header (gold band above nav): gift-card notice EN+AR, X dismiss → `localStorage["bc-announce-dismissed"]`, hydration-safe restore pattern (same documented eslint-disable as language-context), smooth max-h collapse; header padding moved to an inner div so collapse doesn't clash with scroll styles.
- NEW printable price list: dedicated `@media print` block in globals.css — white sheet, serif letterhead ("Blade & Cedar — Barbershop · address · phone") via `#services::before`, 2-col grid menu, dark leaders, forces `.reveal` visible, hides `[data-print="hide"]` (header/footer/floating marked on their own root elements) and `main > *:not(#services)`; gold "Print the price list" button (Printer icon) in Services, itself `print:hidden` (caught in PDF QA that the button initially printed itself).
- NEW today highlight in Location hours: `beirutNow().day` post-hydration (setTimeout 0), row-days derived from HOURS (`HOURS[i]?.days ?? [0]` for the Sunday row), gold text + "Today/اليوم" chip + gold tint; Thursday correctly highlighted the Mon–Fri row.
- NEW reviews upgrades: "Read all reviews on Google ↗" gold link under the 4.9 strip (SITE_CONFIG.reviewsUrl, arrow mirrors in RTL via rtl:-scale-x-100), "Verified visit" BadgeCheck chip on every card (icon-only on mobile, whitespace-nowrap fix after catching a 2-line wrap in QA).
- NEW branded OG image: generated via image-generation skill (1344×768, cinematic charcoal interior + gold cedar emblem plaque), ffmpeg center-cropped to exactly 1200×630 → `public/og.jpg` (123KB), wired into layout metadata (metadataBase resolves /og.jpg) — og:image meta verified in served HTML.
- Styling details: `.sheen` gold light-sweep on all gold CTAs (header desktop/mobile book, WhatsAppButton, final CTA; ::after gradient band, disabled under reduced-motion); gold corner brackets on gallery hover; hover-lift already on barber/review cards (kept).
- README updated (features + customization rows: gallery filters, OG image, announcement, today-highlight).

Verification (agent-browser):
- Announcement: renders gold over hero; dismiss → localStorage "1"; after reload maxHeight=0px (collapsed); key cleared afterwards; AR variant right-aligned text with X mirrored to top-left ✓
- Slider: pointerdown at 75% → ariaNow 75 → ArrowLeft → 71 (clip inset(0 29% 0 0)); screenshots at 50% and 71% confirm handle/labels/clip; mobile 375px renders with localized chips ✓
- Filters: chip list + counts correct ("All work 06 / Cuts 02 / Fades 01 / Shaves 01 / The shop 02"); Fades → 1 item with corrected alt; lightbox "1 / 1"; Cuts → open first → "1 / 2" → next → "2 / 2" ✓
- Print (via agent-browser pdf): clean white sheet with serif letterhead + rule, 2-col serif menu, dotted leaders, everything else hidden; v2 PDF confirmed the print button no longer appears (pdftotext) ✓
- Location EN: "Monday — Friday" gold + TODAY chip + tint, time gold, badge "Open now · Closes 20:00" ✓; AR: fully mirrored, "اليوم" chip on الاثنين — الجمعة ✓
- Reviews EN: Google link with ↗ under summary; verified-visit chips on all 3 cards (no wrap after fix) ✓
- AR full pass: announcement Arabic, gallery heading/labels/filters Arabic, slider labels قبل/بعد with LTR photo geometry, hours table mirrored ✓
- Mobile 375px: announcement wraps to 2 clean lines, hero, slider, scrollable chip row, floating WhatsApp ✓
- og:image meta = https://blade-and-cedar.example.com/og.jpg (1200×630); /og.jpg + /before-after/*.jpg all 200 ✓
- Final: lint 0 problems, zero console errors, dev.log clean.

Stage Summary:
- Round 5 shipped: interactive before/after reveal slider, gallery filters with corrected content metadata, dismissible announcement bar, print-ready price list, today-highlighted hours, Google-reviews link + verified-visit badges, branded self-hosted OG artwork, gold sheen micro-interaction — still zero new npm dependencies.
- Single config points unchanged & extended: i18n.ts (announcement, filters, compare, print, verified, today), config.ts (GALLERY_FILTERS/GALLERY_ITEM_TAGS, reviewsUrl, IMAGES.og + IMAGES.beforeAfter), hours.ts (drives today-highlight too).
- Assets now self-hosted: public/og.jpg (1200×630), public/before-after/{before,after}.jpg — swap these for real shop photos.
- Risks/notes: alt texts now match actual Unsplash content but the photos are still generic stock — for a real client, replace IMAGES + before-after pair with portfolio shots; announcement bar copy is a placeholder campaign (edit `announcement.message`); print stylesheet assumes EN letterhead (locale-neutral content, acceptable).
- Next ideas: barber-specific booking stats, seasonal announcement scheduler (date-range in config), gallery "load more" with more shots, real testimonials Google widget, hours.ts unit tests, lightbox swipe gestures on touch.

---
Task ID: 6
Agent: Z.ai Code (cron webDevReview)
Task: QA re-assessment + round-6 features (service detail dialogs, lightbox touch swipe, back-to-top progress ring, seasonal announcement scheduler, editorial styling detail pass).

Work Log:
- QA baseline: server 200, zero console/page errors, lint clean, all 8 sections present → stable, proceeded to features from the handover list.
- NEW service detail dialogs (services.tsx rewritten): each menu row is now a button (was direct wa.me link) opening a rich dialog — photo strip reusing gallery shots (SERVICE_IMAGE_INDEX map in config), gold $-price flag over the photo, chair-time chip with gold Clock icon ("≈ 40 min in the chair" / "≈ ٤٠ دقيقة عالكرسي"), "What's included" list with gold diamond bullets, full-width service-specific WhatsApp CTA (message pre-fills service name). Config: added `durationMin`, `includesEn[]`, `includesAr[]` per service + `SERVICE_IMAGE_INDEX` (service id → gallery index, zero new downloads). QA caught a double close button (default shadcn + custom) → `showCloseButton={false}`.
- NEW lightbox touch swipe: pointer-based horizontal drag ≥ 48px (|dx| > |dy| guard) on the image area, `touch-pan-y` + `draggable={false}` + cursor-grab. QA caught inverted direction (swipe-left went to PREVIOUS) → fixed to carousel convention: swipe left = next, mirrored in RTL; re-verified 1/6 → swipe-left → 2/6 → swipe-right → 1/6.
- NEW `scroll-top.tsx`: back-to-top button with circular SVG gold progress ring (r=21, strokeDashoffset live-updates with reading progress), appears after ~1.5 viewports (scroll/resize listeners), smooth scrollTo top, `aria-hidden` + `tabIndex=-1` when hidden, sits above the mobile floating WhatsApp in the same logical `end` column (bottom-[calc(6.5rem+safe-area)] on mobile, bottom-8 on md+), mirrors correctly in RTL (verified x=20 on 375px AR).
- NEW seasonal announcement scheduler: `ANNOUNCEMENTS` in config — recurring "MM-DD" ranges computed in Beirut time (`Intl en-CA` date, new-year wrap supported via from>to branch), `getActiveAnnouncement()` picks the first active; header falls back to the evergreen i18n message when none. Dismissal now stored per announcement id (`bc-announce-dismissed-id` = "default" | announcement.id) so a new seasonal message isn't swallowed by an old dismissal. Seeded two campaigns (Beard Season Nov, Holiday gift Dec 15–31) — both inactive today (Oct 16), fallback verified live. Logic unit-checked via bun -e across Oct/Nov/Dec/Jan dates.
- Styling detail pass: `.drop-cap::first-letter` — gold Playfair 3.1em float inline-start on the About story's first paragraph (verified computed gold); `.text-stroke` — giant hollow italic watermark word behind the final CTA ("Stay sharp" / "خليك مشطّف", 16vw, webkit-text-stroke with faint-fill @supports fallback for Firefox); `.link-sweep` — gold underline scaleX 0→1 from inline-start on footer nav links (RTL origin flip); `active:scale-[0.97/0.98]` press states on header desktop/mobile gold CTAs.
- i18n additions (en+ar): services.detailsAria/duration/includesLabel/closeDetails, cta.watermark, a11y.toTop.
- ENV NOTE (recurring): turbopack CSS HMR lag struck again — new globals.css classes (.drop-cap/.text-stroke/.link-sweep) absent from compiled chunk until a content change was appended → always force-recompile + verify compiled CSS before debugging "missing style" issues.
- Print regression checked via PDF: menu rows are now <button>s but the print stylesheet still produces the clean letterhead + 2-col menu (pdftotext verified).
- README updated (features + customization rows for service details, seasonal announcements).

Verification (agent-browser):
- Service dialog EN: heading/photo/price flag/duration chip/includes list/CTA href = "Hi Blade & Cedar, I'd like to book an appointment for Classic Haircut" ✓; screenshot confirms layout; AR dialog fully mirrored (title right, price flag left, close top-left, Arabic includes) with message "مرحبًا بليد آند سيدر، أودّ حجز موعد لخدمة قصّة كلاسيك" ✓
- Swipe: fixed direction verified 1/6→2/6→1/6 ✓ (pointer-event simulation)
- ScrollTop: hidden at top, visible past 1.5 viewports, ring dashoffset 44.67/131.94 at 60% scroll, click → scrollY 0 + hidden ✓; AR mobile mirrored to left ✓
- Watermark: giant hollow "Stay sharp" behind CTA visible in EN + Arabic "خليك مشطّف" in AR screenshots ✓
- Drop cap: gold "B" floats on About p1 (computed ::first-letter color rgb(201,162,75)) ✓
- Announcement fallback: gift-card message EN+AR (scheduler inactive today — correct) ✓
- Mobile 375px: scroll-top ring stacked above floating WhatsApp ✓; FAQ/services render clean ✓
- Final: lint 0 problems, zero console errors (only pre-existing before-after LCP advisory), dev.log clean 200s, footer sweep ::after gold confirmed at scaleX(0) idle ✓

Stage Summary:
- Round 6 shipped: service detail dialogs (menu → details → booking funnel), lightbox touch swipe (direction bug caught + fixed in QA), back-to-top progress ring, seasonal announcement scheduler with per-announcement dismissal, drop cap + CTA watermark + footer link sweep + press states — still zero new npm dependencies.
- Config surface extended: SERVICES entries now carry durationMin/includesEn/includesAr; SERVICE_IMAGE_INDEX maps service→gallery photo; ANNOUNCEMENTS drives the header bar (Beirut-time seasonal ranges, evergreen fallback in i18n).
- Single edit points unchanged: i18n.ts (all copy), config.ts (number/menu/images/announcements), hours.ts (schedule).
- Risks/notes: menu rows no longer link directly to WhatsApp (details dialog is one tap away with the service pre-filled — intentional funnel deepening); announcement dismissal key renamed (old "1" value ignored once); turbopack CSS HMR lag remains the recurring gotcha for globals.css additions.
- Next ideas: barber-specific gallery filtering, hours.ts unit tests, gallery "load more" with more shots, real map embed default, booking dialog service preselect (combine dialog service CTA with the 2-step flow), PWA manifest.

---
Task ID: 7
Agent: Z.ai Code (cron webDevReview)
Task: QA re-assessment + round-7 features (service-aware booking funnel, smart time slots, USD⇄L.L. currency toggle, PWA manifest + icons, styling detail pass) + one pre-existing bug fix.

Work Log:
- QA baseline: server 200, zero page errors, zero console errors, lint clean → stable, proceeded to features from the handover list.
- NEW service-aware booking funnel: `BookingDialog` gained `initialService` (SERVICES[].id); the service detail dialog's CTA now opens the 2-step flow with the service attached instead of a raw wa.me jump (Services section owns its own BookingDialog instance; detail dialog closes first — no nesting). The dialog header shows a clearable gold "SERVICE — {name}" chip on both steps; the WhatsApp message becomes "…I'd like to book {service} with {barber} on {day} at {time}." (waServiceWith/waServiceAny templates, EN+AR). A small "or message us directly on WhatsApp ↗" link keeps the old direct path as fallback.
- BUGFIX (pre-existing, caught during QA): booking day chips were labeled by INDEX (`index===0 → "Today"`) but `upcomingOpenDays` skips today after the last bookable slot — so after closing time, tomorrow's chip read "Today" (verified live: "TodayOct 16" shown when today was Thu Oct 15 20:0x). Fixed with date-key-based labels: exported `beirutDayKey()` + `nextDayKey()` (DST-safe pure calendar math) from hours.ts; `dayLabel()` now compares the chip's Beirut date key against today/tomorrow keys. Same fix applied to the AR يوم-prefix logic in the WhatsApp message (prefix only for real weekday labels, not index ≥ 2).
- NEW smart time slots: `isSlotGone(date, slot)` + `BOOKING_LEAD_MIN = 30` in hours.ts — today's slots within the 30-min lead window (Beirut time) render greyed with line-through, `aria-disabled` + `tabIndex=-1` + click-guarded; an italic "earlier slots today are gone" note appears when any are dead. Logic unit-verified via bun (today evening → all gone; tomorrow → none gone). NOTE: could not be visually verified live tonight because after 19:30 Beirut today is skipped entirely from the picker (by design) — the composition (isToday + isSlotGone + render branch) is thin and unit-checked; revisit next daytime run.
- NEW USD ⇄ L.L. currency toggle in Services: `CURRENCY {usdToLbp: 89500, roundTo: 5000}` + `lbpFromUsd()` in config; segmented control (aria-pressed, `print:hidden`) top-end of the menu; prices render grouped Latin digits + "L.L./ل.ل" unit with tabular-nums (smaller size in LBP), detail-dialog price flag follows, bottom note swaps to "Converted from USD at 89,500 L.L. to the dollar…" (aria-live polite). Subtitle made currency-neutral. Print WYSIWYG: menu prints in the active currency, toggle itself hidden (pdftotext-verified).
- NEW PWA layer: generated `public/icon-{192,512}.png` + `icon-maskable-512.png` (cedar scaled to 72% inside the 80% safe zone) + `apple-touch-icon.png` (180, full-bleed) from the cedar SVG via sharp (visually verified both variants); `public/manifest.webmanifest` (standalone, charcoal theme/background, app shortcuts → /#services and /#visit); layout.tsx now exports `viewport` (themeColor #121212, colorScheme dark) + manifest/icons/appleWebApp metadata. Verified: /manifest.webmanifest + all PNGs 200; manifest link, theme-color and apple-touch meta present in served HTML.
- Styling detail pass: `.glow-gold` hover/focus halo (dual-layer gold shadow) on the booking confirm CTA + service dialog CTA (computed shadow verified on focus); `.ken-burns` 34s ease-in-out alternate drift on the hero backdrop, wrapped in `@media (prefers-reduced-motion: no-preference)` so reduced-motion users get a still (animationName/duration verified); menu rows got a hover wash (`hover:bg-cream/[0.035]` with px-3/-mx-3 bleed) + price lift (`group-hover:-translate-y-0.5`); tabular-nums on all prices/slots.
- i18n additions (en+ar): services.subtitle rewrite (currency-neutral), services.noteLbp/currency{label,usd,lbp}/directWa, booking.waServiceWith/waServiceAny/serviceLabel/clearService/pastNote.
- README updated (funnel, smart slots, currency toggle, PWA, new style details + 2 customization rows: CURRENCY, BOOKING_LEAD_MIN).

Verification (agent-browser):
- Currency toggle EN: L.L. → "1,075,000 | 1,345,000 | 715,000 | 1,610,000 | 1,075,000 | 715,000" ($12/$15/$8/$18/$12/$8 — all rounded to the 5,000 note correctly); note swaps; USD toggles back clean.
- Funnel EN: "View Haircut + Beard details" → BOOK THIS SERVICE → booking STEP 1 with gold "SERVICE Haircut + Beard" chip → Karim → STEP 2 → slot 10:00 → message "…book an appointment with the first available barber on Tomorrow Oct 16 at 10:00."; service flow: Skin Fade + Karim + Saturday 11:00 → "Hi Blade & Cedar, I'd like to book Skin Fade with Karim Haddad on Saturday Oct 17 at 11:00." ✓
- Chip removal: X → message falls back to the generic template ✓
- Day labels fixed: chips now "Tomorrow Oct 16 / Saturday Oct 17 / Monday Oct 19 / Tuesday Oct 20" (today correctly skipped after closing; Sat Oct 18 excluded = Sunday-closed in 2026 sanity-checked) ✓
- AR full pass: dialog RTL-mirrored with Arabic chips (بكرة ١٦ تشرين الأول / السبت…), currency toggle mirrored with ل.ل active + Arabic prices, service chip "الخدمة — قصّة كلاسيك", message "مرحبًا بليد آند سيدر، أودّ حجز قصّة كلاسيك مع أول حلاق متفرغ بكرة ١٦ تشرين الأول الساعة 11:30." (natural بكرة, no يوم prefix on relative day) ✓
- Mobile 375px AR: hero + announcement wrap clean; services toggle + LBP prices render; back-to-top ring + floating WhatsApp mirrored bottom-left ✓
- PWA: manifest + icons 200, meta tags in HTML ✓
- Print: letterhead + menu + USD prices present, currency toggle absent from PDF ✓
- glow-gold computed shadow rgba(201,162,75,.55) 0 10px 38px -10px on focus ✓; ken-burns animationName/duration verified ✓
- Final: lint 0 problems, tsc clean in src/, zero page errors, console clean (only the known before-after LCP advisory), dev.log 200s.

Stage Summary:
- Round 7 shipped: service-aware booking funnel (service chip → WhatsApp), smart same-day slot disabling + date-key day labels (incl. a real pre-existing mislabel bug fix), USD⇄L.L. toggle, PWA manifest/icon set, glow halo + ken-burns + menu-row hover details — still zero new npm dependencies (sharp used only as a build-time icon generator, already present).
- Single edit points extended: config.ts (CURRENCY + lbpFromUsd), hours.ts (BOOKING_LEAD_MIN, isSlotGone, beirutDayKey, nextDayKey), i18n.ts (booking.waService*/serviceLabel/clearService/pastNote, services.currency/noteLbp/directWa).
- Risks/notes: currency rate is a config constant — update `CURRENCY.usdToLbp` when it moves; slot-greying only observable during shop hours (today is skipped after last slot by design); manifest has no service worker (installable prompt still fine on Chromium; offline not a goal for a one-pager); recurring reminder — turbopack CSS HMR can lag globals.css edits, cache-bust comment appended again.
- Next ideas: barber-specific gallery filtering, gallery "load more" with more shots, seasonal announcement preview tool, booking dialog: remember last barber via localStorage, LBP prices in print letterhead note, hours.ts "opens next at" edge-case polish, real testimonials widget.

---
Task ID: 8
Agent: Z.ai Code (cron webDevReview)
Task: QA re-assessment + round-8 features (remember-last-barber personalization, copy-details fallback, "Opens next" badge polish, sitemap.xml, ghost cedar watermark + micro-details).

Work Log:
- QA baseline: server 200, zero page/console errors, lint clean → stable, proceeded to features from the handover list.
- NEW remember-last-barber: localStorage "bc-last-barber" stores the confirmed choice ("any" or barber index) on the Confirm click; on the next dialog open WITHOUT an explicit preselect (initialBarber === null), the flow jumps straight to STEP 2 with the choice preselected, a gold i18n hint ("We pre-picked your barber from last time — tap Back to change." / AR "اخترنا حلاقك من آخر زيارة…"), and the choice baked into the WhatsApp message. Manual re-pick clears the hint (usedMemory state); invalid/stale values (empty, "99") and blocked storage degrade safely to the normal two-step flow (try/catch everywhere).
  - BUG caught in QA before it shipped: readLastBarber() treated a MISSING key as barber index 0 because Number(null)===0 — verified live (dialog opened at step 2 with nothing stored), fixed with an explicit null/"" guard, re-verified.
- NEW copy-details fallback in booking step 2: "Copy booking details" text-button (Copy→Check icon, aria-live "Copied", 2.4s timer) appears once a slot is picked; waHref block refactored to build the waMessage string first (shared by the href and the clipboard). navigator.clipboard with a textarea+execCommand legacy fallback; false "Copied" impossible (both failures return early). Verified live: click → "Copied".
- OpenBadge polish (Location): the closed state's next-opening label now says "Opens Today/Tomorrow · 10:00" via beirutDayKey/nextDayKey comparison instead of always the bare weekday — verified live: "Closed now · Opens Tomorrow · 10:00" (Thursday 20:1x) and AR "مغلق هلّق · بيفتح بكرة · 10:00".
- NEW sitemap.xml via src/app/sitemap.ts: canonical URL from SITE_CONFIG.siteUrl (new config field; layout.tsx now sources its SITE_URL from config — single edit point restored) + en/ar hreflang alternates; "Sitemap:" line appended to public/robots.txt. Verified /sitemap.xml 200 with both alternates.
- Styling details: giant ghost cedar watermark (CedarLeaf, 34rem, rotate-12, gold @ 3.5% opacity, aria-hidden, pointer-events-none, print:hidden, sm+ only) behind the services menu — section got relative+overflow-hidden, content wrapper relative (screenshot verified, menu untouched); booking day chips got a hover lift (-translate-y-0.5).
- i18n additions (en+ar): booking.lastBarberHint/copyDetails/copied.
- README updated (memory, copy fallback, badge wording, sitemap, watermark + siteUrl row).

Verification (agent-browser):
- Memory flow EN desktop: fresh (key cleared) → STEP 1 ✓; Karim + slot 11:00 → Copy button appears → click → "Copied" ✓; Confirm → tab opened to wa.me with correct message, localStorage = "0" (Karim) ✓; reopen → STEP 2 directly + gold hint + message "…with Karim Haddad on Tomorrow Oct 16 at 10:30" ✓; Back → pick "First available" → hint disappears ✓.
- Robustness: stale "99" → STEP 1 fallback ✓; storage cleared → STEP 1 ✓ (regression after the Number(null) fix).
- OpenBadge: "Closed now · Opens Tomorrow · 10:00" EN; "مغلق هلّق · بيفتح بكرة · 10:00" AR ✓ (matches upcomingOpenDays skip logic — today Thursday skipped after closing).
- Watermark: absolute/645px/opacity 0.035/pointer-events none computed ✓; screenshot confirms subtle silhouette behind menu, layout intact.
- Mobile 375px AR: memory fast-path renders — "خطوة ٢ من ٢", Arabic gold hint, "بكرة ١٦ تشرين الأول" selected, RTL mirrored, copy button correctly gated until slot ✓ (screenshot).
- Sitemap: /sitemap.xml 200, loc + hreflang en/ar + lastmod present ✓; robots.txt has Sitemap line ✓.
- Final: lint 0 problems, tsc clean in src/, zero page errors, zero console errors, site 200.

Stage Summary:
- Round 8 shipped: booking personalization (remember-last-barber fast-path with graceful degradation), copy-details clipboard fallback, smarter closed-badge copy ("Opens Tomorrow · 10:00"), sitemap.xml + siteUrl consolidation into config, ghost cedar watermark behind the menu + day-chip hover micro-interaction — still zero new npm dependencies.
- Config surface: SITE_CONFIG.siteUrl added (metadata/sitemap/robots single source); localStorage key "bc-last-barber" joins bc-lang / bc-announce-dismissed-id as client prefs.
- Risks/notes: remembered-barber indices are positional (t.barbers.names order) — reordering the barbers array in i18n invalidates stored indices (readLastBarber range-checks, so worst case is a silent fallback, never a crash); execCommand fallback is deprecated but only a safety net; sitemap hreflang points both locales at the same URL (client-side language switch — acceptable for a one-pager).
- Next ideas: gallery "load more" with more verified shots, seasonal announcement preview tool, booking: also remember last service, hours.ts "opens next at" DST-change edge tests, LLM-generated testimonial variety, lightbox caption from gallery items.

---
Task ID: 9
Agent: Z.ai Code (cron webDevReview)
Task: QA re-assessment + round-9 features (gift-card section, remember-last-service booking memory, reviews hover accent, AR step-digit polish).

Work Log:
- QA baseline: worklog reread (round 8 stable), server 200, JSON-LD confirmed in served HTML, lint 0 problems, agent-browser fresh pass → zero console errors after full-page scroll. Confirmed several handover "next ideas" were already shipped (lightbox captions, reading progress) → picked the remaining ones + new work.
- NEW gift-card section (`src/components/site/gift-card.tsx`, `#gift`, numbered "08" — inserted between Location (07) and FinalCta, so no existing section renumbering): right column = amount chips ($25/$50/$75, `aria-pressed`, hover lift) with a live L.L. conversion line (reuses `lbpFromUsd`, `aria-live="polite"`, LTR-wrapped), custom-amount note, and a pre-filled WhatsApp order CTA (`waGiftLink(lang, usd)` → "Hi Blade & Cedar, I'd like to buy a $50 gift card — can you share the details?" / natural AR equivalent, amount interpolated). Left column = gold foil ticket visual (aria-hidden decorative): gradient foil + film grain, tilted -1.5° straightening on hover, `.sheen` light sweep, dashed perforation with punched charcoal notches, stub with fake barcode (repeating-linear-gradient), serial "No. BC·0117", stacked card edges behind, big serif $ amount.
- Config: `GIFT_CARD {amounts: [25,50,75], serial}` + `waGiftLink()` added to config.ts (single edit point preserved).
- i18n (en+ar): new `gift` namespace (kicker/title/sub/amountLabel/value/for/serialLabel/custom/cta/note), `header.nav.gift` (footer quick-nav link added; header nav intentionally unchanged to avoid lg crowding), `booking.lastServiceHint` + `booking.lastBothHint`.
- NEW remember-last-service in booking-dialog: `bc-last-service` stores the confirmed SERVICES id on Confirm (removed when none); `readLastService()` validates against SERVICES ids (stale id → null). Memory hints are now per-part state (`usedBarberMemory`/`usedServiceMemory`): both → lastBothHint ("barber and {service}"), service-only → lastServiceHint (fills {service}), barber-only → existing lastBarberHint; manual barber pick / chip ✕ clear their own part. Barber memory still solely controls the step-2 fast path.
- Styling detail: reviews cards get a gold top-edge accent sweeping in on hover (origin-start scale-x, motion-reduce safe) — matches the gallery/footer sweep language.
- i18n polish (bug-ish detail): booking step counter now formats {n} via Intl ("خطوة ١ من ٢" — was a Latin "2" inside the Arabic-Indic template).
- README updated (memory bullet rewritten, gift-card bullet, reviews accent, 08 kicker, GIFT_CARD customization row).

Verification (agent-browser):
- Gift EN desktop: title/chips/LBP line render; $50 → "≈ 4,475,000 L.L."; click $75 → LBP "≈ 6,715,000" (89,500 rate, .5 note rounds up — matches CURRENCY contract), aria-pressed [false,false,true], CTA href message updated to $75 ✓; screenshot: tilted gold ticket w/ perforation, notches, barcode, serial, stacked edges ✓.
- Gift AR desktop (RTL): ticket fully mirrored (stub left / body right), Arabic title/kicker/custom/note, chips latin amounts, CTA href = Arabic prefill with "بقيمة 50$" ✓; mobile 375px AR: ticket full-width, chips mirrored, LBP + CTA visible ✓ (screenshot).
- Booking memory full loop (EN): cleared storage → header booking = Step 1 no chip; Karim + 10:00 + Confirm → bc-last-barber="0", bc-last-service absent (removed, correct with no service) ✓; combo card → BOOK THIS SERVICE → Step 2 (barber memory) + combo chip + barber-only hint ✓; Confirm → bc-last-service="combo" ✓; reopen via header → Step 2 + chip "Haircut + Beard" + hint "We pre-picked your barber and Haircut + Beard from last time — tap Back or ✕ to change." ✓; chip ✕ → hint falls back to barber-only ✓.
- AR memory: reopen → Step 2 + chip "الخدمة — قصّة + لحية" + hint "اخترنا حلاقك و قصّة + لحية من آخر زيارة — اضغط رجوع أو ✕ لتغييرها." (RTL dialog) ✓; step counter now "خطوة ١ من ٢" with Arabic-Indic digit ✓.
- Footer: "بطاقات هدايا"/"Gift cards" quick-nav link → #gift ✓.
- NOTE (environment, not a bug): agent-browser's headless Chromium reports `(hover: hover)` = false, so Tailwind v4 gates ALL `hover:` variants off in the harness — reviews sweep + every pre-existing hover effect are untestable visually there. Verified instead by CSS-rule presence (`.group-hover\:scale-x-100:is(:where(.group):hover *)` inside the hover media) + class wiring; works in real desktop browsers.
- Gotcha logged: `agent-browser close --all` starts a fresh ephemeral profile → localStorage (language/memory keys) wipes between sessions; not a code issue.
- Final: lint 0 problems, src/ tsc clean (only pre-existing examples/+skills/ errors), zero page errors, zero console errors, dev.log 200s.

Stage Summary:
- Round 9 shipped: gift-card section (foil ticket + amount chips + live L.L. + WhatsApp order CTA), booking remembers last service alongside last barber (per-part hints, graceful degradation), reviews hover accent sweep, AR digit polish — still zero new npm dependencies.
- Single edit points extended: config.ts (GIFT_CARD + waGiftLink), i18n.ts (gift.* , nav.gift, booking.lastServiceHint/lastBothHint). localStorage keys now: bc-lang, bc-announce-dismissed-id, bc-last-barber, bc-last-service.
- Risks/notes: gift CTA message interpolates the raw number (no LBP in the message — WhatsApp conversation handles details, per the custom-amount note); ticket is aria-hidden so its texts aren't announced (duplicated by design); header nav deliberately not extended (footer + scroll discovery cover #gift); hover-gated effects unverifiable in this harness (see NOTE).
- Next ideas: gallery "load more" with more verified shots (needs new Unsplash URL verification), barber-specific gallery filter preset from barber dialogs, seasonal announcement preview tool, "opens next at" DST-change unit pass, testimonial variety refresh, gift section: optional recipient-name field appended to the WhatsApp message.

---
Task ID: 10
Agent: Z.ai Code (main)
Task: QA re-assessment + round-10 features (gallery "Load more" + 6 verified shots, barber→gallery filter presets, reviews marquee with 6 testimonials, gift-card recipient field, "Most booked" pill, cedar section dividers, print LBP note).

Work Log:
- QA baseline: worklog reread (round 9 stable with a clear backlog), server 200, agent-browser fresh pass → zero page/console errors, lint clean → proceeded to features from the handover list.
- NEW gallery "Load more": 6 new Unsplash shots appended (12 total). Every candidate URL curl-verified AND visually read before embedding — 8 of 20 candidates rejected (a globe, LEGO Batman, vaccine vials, an office high-five, a women's salon wash — the round-5 lesson paid off). Keepers: tattooed-forearm clipper fade (fades), B&W beard scissor trim (shaves), textured crop styling (cuts), tufted leather chair (shop), finished-cut portrait (cuts), mirror-line interior (shop). `GALLERY_PAGE_SIZE = 6` in config; grid shows 6, gold button reveals the rest and toggles to "Show less" (aria-expanded); button hidden when a filter fits on one page (Cuts 4 / Fades 2 / Shaves 2 / Shop 4 / All 12); lightbox now navigates `shown` only (counter "10 / 12" verified on the chair shot). galleryFull extended to 12; galleryThumbs intentionally left at the best 6 for the footer strip.
- NEW barber→gallery presets: `BARBER_WORK_TAG` (Karim→cuts, Jad→fades, Elie→shaves) + `GALLERY_FILTER_EVENT` ("bc:gallery-filter") CustomEvent; profile dialog gained a "See {name}'s work" gold text-button (Images icon) that closes the dialog, dispatches the preset and smooth-scrolls to #gallery; gallery validates the detail against GALLERY_FILTERS. Verified EN (Karim→Cuts 04) and AR (جاد→فايد 02).
- NEW reviews marquee: 3 new natural testimonials (Marwan S. Classic Haircut / Nadim H. Skin Fade / Walid Z. Haircut + Beard, EN+AR) → 6 total. `reviews.tsx` rewritten around a shared ReviewCard: default render is a full-bleed auto-scrolling track (12 cards = 6 + aria-hidden duplicate, 64s `animate-marquee` inline duration, reused `.ribbon` pause-on-hover/focus-within rule), charcoal edge-fade vignettes melt cards into the page; track forced LTR like the ribbon while each card carries dir={rtl?} so Arabic quotes stay right-aligned; `matchMedia('(prefers-reduced-motion: reduce)')` swaps to the static 3-col grid post-hydration (setTimeout 0 keeps setState lint-safe). Fixed-width cards (320/360px) with line-clamped quotes in marquee mode.
- NEW gift recipient: optional "For whom?" input (maxLength 40, gold focus border) in the gift section — once typed, the foil ticket reads "To {name}" (italic display font, replacing nothing — the tagline stays) and the WhatsApp order becomes "…gift card for {name}…"; clearing the field reverts both. `waGiftLink(lang, usd, forName?)` with trim + Arabic "باسم {name}". Verified EN ("for Dad" → cleared → fallback) and AR ("باسم كريم" + ticket "لـ كريم").
- NEW "Most booked" pill: `popular: true` on the Skin Fade service → flame-icon gold pill in the menu row AND the detail dialog, next to (distinct from) the outlined "House signature" tag. Verified EN/AR.
- NEW print LBP note: hidden-on-screen paragraph under the services note row (`hidden print:block`) rendering `services.printNote` with the CURRENCY rate interpolated — the PDF letterhead now closes with "All prices in USD · LBP reference: 1$ ≈ 89,500 L.L. (rounded to the nearest 5,000)." (pdftotext-verified; "MOST BOOKED" prints as part of the menu, WYSIWYG).
- NEW cedar section dividers (`divider.tsx`): hairline gradient rules meeting a small gold CedarLeaf, aria-hidden + print:hidden, placed between Reviews→FAQ and Location→GiftCard.
- i18n additions (en+ar): gallery.loadMore/showLess + 6 alts, barbers.seeWork, gift.forLabel/forPlaceholder/ticketTo, services.popular/printNote, reviews.items 3→6.
- README updated (features rewritten for load-more/presets/marquee/recipient/dividers/pill/print-note + 3 new customization-table rows).
- Fixed in passing: a malformed JSX comment broke gallery.tsx parsing (caught by lint immediately).

Verification (agent-browser):
- Gallery EN: 6 → LOAD MORE +06 → 12 (all new images naturalWidth>0) → lightbox "10 / 12" on the chair shot → Escape → SHOW LESS → 6, aria-expanded=false ✓; AR: "شوف أكتر +06" ✓.
- Presets: Karim profile → "SEE KARIM HADDAD'S WORK" → dialog closes, scrollY>1000, Cuts aria-pressed=true, 4 items ✓; AR Jad → "فايد" 2 items ✓; filter counts All 12 / Cuts 04 / Fades 02 / Shaves 02 / Shop 04 ✓.
- Gift EN: type "Dad" → href message "…$50 gift card for Dad — can you share the details?", ticket "To Dad" ✓; clear → fallback message, no To-line ✓; AR inserttext "كريم" → "…بقيمة 50$ باسم كريم — ممكن التفاصيل؟" + "لـ كريم" ✓.
- Reviews: 12 cards, animationName=marquee dur=64s running, transform changes over time (moving=true); pause-on-hover verified — `.ribbon:hover` rule present in compiled CSS, ribbonHover=true → animationPlayState=paused (first hover attempt failed only because the section was off-viewport — matches(':hover') false; after scrollIntoView-center it works); AR: card dir=rtl, marquee moving ✓; mobile 375px EN+AR screenshots (edge fades, RTL right-aligned quotes, scroll-top + floating WhatsApp stacking intact) ✓.
- Pill: "MOST BOOKED" on Skin Fade row + detail dialog; AR "الأكثر طلبًا" ✓.
- Print PDF: letterhead + "All prices in USD · LBP reference: 1$ ≈ 89,500 L.L. …" + MOST BOOKED present ✓.
- Regression: booking dialog still opens at step 1 via header BOOK NOW ✓; announcement bar, scroll-top, floating WhatsApp untouched ✓.
- Harness notes: synthetic value-clearing (native setter + input event) does NOT reach React 19 state in this harness while real keystrokes/inserttext do — a testing quirk, not an app bug; agent-browser viewport via `set viewport 375 812` (the --viewport open-flag is a no-op in this version).
- Final: lint 0 problems, tsc clean in src/, zero page errors, zero console errors, dev.log 200s.

Stage Summary:
- Round 10 shipped: gallery "Load more" (+6 visually verified shots), barber→gallery filter presets, reviews marquee (6 bilingual testimonials with reduced-motion grid fallback), gift-card recipient personalization, "Most booked" pill, cedar section dividers, print LBP reference — still zero new npm dependencies.
- Config surface extended: GALLERY_PAGE_SIZE, BARBER_WORK_TAG, waGiftLink(lang, usd, forName?), SERVICES[].popular. i18n namespaces grown (gallery alts ×12, reviews ×6).
- Risks/notes: gallery items 7–12 load lazily only after "Load more" (below fold by design — next/image still preloads the grid's first rows); the marquee duplicate track doubles the review DOM (12 cards, aria-hidden half — acceptable); reviews grid fallback for reduced-motion verified only by code-path (reduce emulation not exercised in this harness); the two new gallery "shop" shots (portrait/interior) skew modern-minimal vs the original moody charcoal set — flag for a real-client photo swap.
- Next ideas: barber-specific gallery attribution (tag items with the barber who did the work, preset scrolls to their items), seasonal announcement preview tool, hours.ts DST-change unit pass, gift section: remember last recipient name, "load more" → pagination with per-tag pages, real testimonials widget, lightbox: preload adjacent images on open.

---
Task ID: 11
Agent: Z.ai Code (main)
Task: QA re-assessment + round-11 features (gallery barber attribution + lightbox preloading, gift recipient memory, announcement preview tool, FAQ numbering, booking wait note, bidi counter fix) + one real crash bug found & fixed in QA.

Work Log:
- QA baseline: worklog reread (round 10 handover), lint clean, site 200. Agent-browser pass surfaced NO pre-existing bugs; a suspected anchor-scroll-offset bug was investigated and CLEARED (html `scroll-padding-top: 5.5rem` already offsets header nav jumps — verified #services lands visibly at titleTop=257px; the #gift "no scroll" reading was my selector matching nothing since #gift is footer-only nav). DST sanity pass on hours.ts via bun -e: day keys continuous across the 2026-10-25 fall-back (24→25→26), slot grid intact (20 slots 10:00–19:30); isSlotGone only applies to real-today by design (synthetic future dates correctly false).
- BUG (introduced this round, caught in QA before handover): my new lightbox preload effect used `new Image()` — but the module imports `Image` from next/image, so the constructor call threw "Image.default is not a constructor" the moment the lightbox opened, unmounting the whole React root ("Application error" overlay, all interactivity dead). The error was nasty to isolate: SSR HTML stayed valid, console appeared clean across stale HMR replay cycles, and agent-browser session artifacts (stale tabs, per-origin storage, mid-refactor 500s) muddied every signal. Fixed with `document.createElement("img")` + a shadowing warning comment. Lesson recorded: in files importing next/image, NEVER use the global `Image` constructor.
- HMR gotcha upgraded: turbopack replayed the stale duplicate-declaration compile error for header.tsx across reloads even after the file was fixed (error preview showed pre-fix line numbers), surviving a globals.css cache-bust and a full browser restart; renaming header.tsx → site-header.tsx (+ page.tsx import) finally issued a fresh module. The dev overlay "Application error" also survived in one tab after the code was already clean — always re-verify in a brand-new browser session before trusting "still broken".
- NEW gallery barber attribution: `GALLERY_ITEM_BARBER: (number|null)[]` (12 entries; Karim ×3, Jad ×3, Elie ×1, null ×5 for tools/chair/interiors/client portraits). Grid gets a gold "by {name}" hover chip (bottom-start, mirrors the "+" hint); lightbox caption gains "— by {name}" in gold. Verified EN + AR ("شغل كريم حداد" chip + caption).
- NEW lightbox adjacent preload: on open/navigate, neighbours at w=1400 are fetched via createElement('img') — performance entries showed 2 preloads after opening item 0. Combined with attribution this makes prev/next feel instant.
- NEW gift recipient memory: localStorage `bc-gift-recipient` saved on order-CTA click (removed when the field is empty), pre-filled post-hydration on return visits (setTimeout-0 pattern), in-field ✕ clear button (aria-label gift.clearRecipient). Verified: type "Dad" → CTA → stored; fresh load → input pre-filled "Dad"; ✕ → empty; clear-then-CTA → key removed.
- NEW announcement preview tool: `/?announce=<id>` forces any campaign (or "default" = evergreen) regardless of calendar; valid previews ignore stored dismissals and cannot be collapsed (dismiss click is a visual no-op while previewing); bogus ids fall back to the scheduler. Implemented as a one-shot query read in Header → `previewId` prop → AnnouncementBar derives `overrideActive`; dismissal state renamed to dismissedStored with derived `barHidden`. Verified: beard-season forced on Oct 16 (AR "موسم اللحية وصل…"), default → evergreen, bogus → evergreen, forced preview stays 48px despite a stored dismissal, normal dismissal still persists (0px after reload).
- Style details: FAQ questions numbered 01–06 (gold italic serif, RTL-checked), booking step 1 closes with the "first available" wait promise (EN + AR), gallery attribution chips (above), lightbox credits (above).
- BIDI FIX (cosmetic, pre-existing since round 2): the AR lightbox counter "1 / 6" rendered "6 / 1" — spaces around "/" break the number run under RTL bidi. Counter <p> now dir="ltr"; screenshot-verified "1 / 6".
- i18n additions (en+ar): gallery.by, gift.clearRecipient, booking.firstAvailableNote.
- README updated (preview tool, recipient memory, attribution, preloading, FAQ numbering, booking note + announcement table row).

Verification (agent-browser):
- Attribution: item 0 → "…reclined client — by Karim Haddad"; item 1 (tools) → caption without credit ✓; AR equivalents ✓.
- Preload: 2 × w=1400 resources after opening ✓.
- Gift memory: full save/prefill/clear/remove loop ✓ (learned: wa.me CTA navigates the SAME tab in this harness → post-click checks must re-open localhost since storage is per-origin).
- Announce preview: 4 cases verified above ✓; dismissal persistence regression in normal mode ✓.
- FAQ "01" + Arabic question, booking note text ✓; AR toggle round-trip (hydration canary) ✓.
- Mobile 375px AR gift section screenshot (input + RTL ticket) ✓; desktop AR lightbox screenshot (credit + fixed counter) ✓.
- Final: lint 0 problems, tsc clean in src/, zero console errors on a fresh session, site 200.

Stage Summary:
- Round 11 shipped: barber-attributed gallery (hover chips + lightbox credits + neighbour preloading), remembered gift recipient, owner-facing announcement preview (`/?announce=`), FAQ editorial numbering, booking wait reassurance, one bidi counter fix — still zero new npm dependencies. header.tsx renamed to site-header.tsx (turbopack cache-bust; import updated in page.tsx only).
- Config surface extended: GALLERY_ITEM_BARBER. New localStorage key: bc-gift-recipient (joins bc-lang, bc-announce-dismissed-id, bc-last-barber, bc-last-service).
- Risks/notes: the `new Image()` shadowing class of bug can recur anywhere next/image is imported — grep before using DOM constructors; the announcement preview is public (anyone with the URL can force a campaign) — acceptable for a one-pager, note for real deployments; attribution indices are positional like the booking memory (reordering t.barbers.names silently shifts credits); turbopack stale-chunk replay can burn QA time — rename the module if a fixed file keeps erroring.
- Next ideas: hover-state visual test on a real (non-headless) browser for the attribution chips, barber filter chips could become a URL param (?work=fades) for shareable links, announcement preview could also accept a date (?announce-date=11-15) to demo the scheduler itself, gift recipient could also remember the last amount, real testimonials widget, per-barber page anchor links (#barber-karim) for social bios.
