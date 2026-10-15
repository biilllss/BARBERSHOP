/* ================================================================== */
/*  All site copy lives in this ONE object.                           */
/*  en = source of truth · ar = natural, Lebanese-friendly MSA        */
/*  (copy written for people, not word-for-word translation)          */
/* ================================================================== */

const en = {
  header: {
    nav: {
      about: "About",
      services: "Services",
      gallery: "Gallery",
      barbers: "Barbers",
      reviews: "Reviews",
      faq: "FAQ",
      visit: "Visit",
      gift: "Gift cards",
    },
    book: "Book now",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },

  announcement: {
    message: "Gift cards now available at the counter — the sharpest gift in town.",
    dismiss: "Dismiss announcement",
  },

  hero: {
    kicker: "Hamra · Beirut — Est. 2016",
    titleA: "A proper cut,",
    titleB: "the Beirut way.",
    sub: "Precision barbering, hot towel rituals and honest conversation — in the heart of the city.",
    ctaPrimary: "Book on WhatsApp",
    ctaSecondary: "View services",
    scroll: "Scroll",
    vertical: "Est. 2016 · Hamra — Beirut",
  },

  ribbon: {
    items: [
      "Walk-ins welcome",
      "Hot towel rituals",
      "Est. 2016 — Hamra, Beirut",
      "Cash or card",
      "Open 6 days a week",
    ],
  },

  about: {
    kicker: "Our story",
    title: "Old-school craft, modern edge",
    p1: "Blade & Cedar opened its doors in 2016 with one idea: bring back the ritual of barbering. Not a rushed haircut — an appointment worth slowing down for.",
    p2: "Two cousins, one vintage chair, and a love for the old Beirut salons. Today our barbers blend sharp modern technique with the unhurried warmth of the neighborhood.",
    p3: "Cedar on the shelf, steel on the stone. Every guest leaves sharper than they arrived.",
    imageAlt: "Barber trimming a client's hair inside Blade & Cedar",
    statYears: "Years of craft",
    statCuts: "Cuts every month",
    statRating: "Average review score",
  },

  services: {
    kicker: "Services & prices",
    title: "The menu",
    subtitle: "Straightforward pricing. Walk-ins welcome, appointments preferred.",
    note: "All prices in USD — pay cash or card.",
    noteLbp: "Converted from USD at {rate} L.L. to the dollar — pay cash or card.",
    currency: { label: "Currency", usd: "USD $", lbp: "L.L. ل.ل" },
    bookCta: "Book this service",
    directWa: "or message us directly on WhatsApp",
    signature: "House signature",
    popular: "Most booked",
    print: "Print the price list",
    printNote:
      "All prices in USD · LBP reference: 1$ ≈ {rate} L.L. (rounded to the nearest 5,000).",
    detailsAria: "View {name} details",
    duration: "≈ {n} min in the chair",
    includesLabel: "What's included",
    closeDetails: "Close details",
  },

  gallery: {
    kicker: "Gallery",
    title: "The work speaks",
    subtitle: "Fresh from the chair.",
    filters: {
      all: "All work",
      cuts: "Cuts",
      fades: "Fades",
      shaves: "Shaves",
      shop: "The shop",
    },
    loadMore: "Load more",
    showLess: "Show less",
    by: "by {name}",
    compare: {
      before: "Before",
      after: "After",
      hint: "Drag the handle or use arrow keys to compare",
      beforeAlt: "Overgrown curly hair, before the cut",
      afterAlt: "Sharp skin fade, after the cut",
    },
    alts: [
      "Barber finishing a straight-razor shave on a reclined client",
      "Clippers, scissors and grooming tools laid out on the counter",
      "Barber cutting a client's hair with scissors",
      "Barber detailing a fresh fade with comb and trimmer",
      "Barber blow-drying and styling a client's hair",
      "Fresh cut and style — ready for the weekend",
      "Tattooed forearms sculpting a clipper fade at the nape",
      "Scissor trim shaping a full beard — moody black & white",
      "Textured crop styled by hand at the chair",
      "The tufted leather chair, waiting for the next client",
      "Fresh cut and clean stubble — weekend ready",
      "Mirror line and chairs — the shop at opening hour",
    ],
  },

  barbers: {
    kicker: "Meet the barbers",
    title: "Steady hands, sharp eyes",
    subtitle: "The people behind the chair.",
    roles: ["Master Barber · Founder", "Fade Specialist", "Beard & Shave Artist"],
    bios: [
      "Trained in Tripoli's old salons, Karim cut for 15 years before opening Blade & Cedar.",
      "Jad chases the perfect blend — no guard, no rush, no compromise.",
      "Elie treats every beard like architecture: measured, balanced, built to last.",
    ],
    specialties: [
      ["Classic scissor cuts", "Hot towel shaves", "Head shaves"],
      ["Skin fades", "Taper cuts", "Textured crops"],
      ["Beard sculpting", "Straight razor work", "Line-ups"],
    ],
    alts: ["Portrait of Karim Haddad", "Portrait of Jad Nassar", "Portrait of Elie Chami"],
    names: ["Karim Haddad", "Jad Nassar", "Elie Chami"],
    profileCta: "View profile",
    specialtiesLabel: "In the chair",
    bookWith: "Book with {name}",
    seeWork: "See {name}'s work",
    closeProfile: "Close profile",
  },

  faq: {
    kicker: "Good to know",
    title: "Questions, answered",
    items: [
      {
        q: "Do I need an appointment?",
        a: "Walk-ins are welcome, but evenings and Saturdays get busy — a quick WhatsApp booking guarantees your chair at the time you want.",
      },
      {
        q: "Where exactly are you?",
        a: "Bechara El Khoury Street, Hamra — two minutes from the sea, next to the old cinema. Look for the gold cedar on the door.",
      },
      {
        q: "How do I pay?",
        a: "Cash or card. All prices on the menu are in USD.",
      },
      {
        q: "How long does a visit take?",
        a: "A haircut runs 30–45 minutes. Add the hot towel shave and set aside about 20 more — it's worth it.",
      },
      {
        q: "Do you cut kids' hair?",
        a: "Yes — kids cuts are $8, and our barbers are famously patient with first-timers.",
      },
      {
        q: "Can I bring a reference photo?",
        a: "Please do. A photo is the fastest way to land on exactly the cut you want.",
      },
    ],
  },

  reviews: {
    kicker: "Reviews",
    title: "Word around town",
    summary: "Based on {n} Google reviews",
    readAll: "Read all reviews on Google",
    verified: "Verified visit",
    items: [
      {
        quote: "Best skin fade in Beirut, and I've tried them all. Karim takes his time and it shows.",
        name: "Rami K.",
        service: "Skin Fade",
      },
      {
        quote: "The hot towel shave is an experience. Walked out feeling like a new man.",
        name: "Tarek A.",
        service: "Hot Towel Shave",
      },
      {
        quote: "Took my son for his first proper haircut. Patient, kind, and a great result.",
        name: "Georges M.",
        service: "Kids Cut",
      },
      {
        quote: "Walked in without an appointment on a busy Friday — still got a proper cut and a good chat.",
        name: "Marwan S.",
        service: "Classic Haircut",
      },
      {
        quote: "Jad is a perfectionist with the fade. Four weeks later, it still holds its shape.",
        name: "Nadim H.",
        service: "Skin Fade",
      },
      {
        quote: "The full works — haircut, beard, hot towel. Worth every minute and every dollar.",
        name: "Walid Z.",
        service: "Haircut + Beard",
      },
    ],
  },

  location: {
    kicker: "Find us",
    title: "Location & hours",
    addressLabel: "Address",
    phoneLabel: "Phone",
    hoursLabel: "Opening hours",
    today: "Today",
    hours: [
      { days: "Monday — Friday", time: "10:00 — 20:00" },
      { days: "Saturday", time: "10:00 — 18:00" },
      { days: "Sunday", time: "Closed" },
    ],
    mapLabel: "Map — Bechara El Khoury Street, Hamra",
    mapPin: "Blade & Cedar · Hamra, Beirut",
    directions: "Open in Google Maps",
    mapToggleAria: "Map style",
    mapToggleStylised: "Illustrated",
    mapToggleLive: "Live map",
  },

  gift: {
    kicker: "Gift cards",
    title: "Give someone the sharp side of life.",
    sub: "A Blade & Cedar gift card covers any chair time — cuts, shaves or the full works. Order on WhatsApp and we'll have it ready at the counter.",
    amountLabel: "Pick an amount",
    value: "Gift card",
    for: "For the person who has everything",
    forLabel: "For whom? (optional)",
    forPlaceholder: "e.g. Dad, Karim, my brother…",
    ticketTo: "To",
    clearRecipient: "Clear name",
    serialLabel: "No.",
    custom: "Want a different amount? Say so on WhatsApp — any value works.",
    cta: "Order on WhatsApp",
    note: "Valid 12 months · any service · transferable",
  },

  cta: {
    kicker: "Ready when you are",
    title: "Sit down. Walk out sharp.",
    sub: "Message us on WhatsApp — we'll confirm your slot within the hour.",
    button: "Book on WhatsApp",
    share: "Share the shop",
    shareCopied: "Link copied",
    watermark: "Stay sharp",
  },

  footer: {
    tagline: "Premium barbering in the heart of Beirut.",
    navAria: "Footer navigation",
    instaCaption: "Fresh from the chair — follow along",
    socialAria: {
      instagram: "Blade & Cedar on Instagram",
      facebook: "Blade & Cedar on Facebook",
      whatsapp: "Blade & Cedar on WhatsApp",
    },
    rights: "All rights reserved.",
    credit: "Concept design by Mawqe3 Studio",
  },

  a11y: {
    whatsappFloat: "Book an appointment on WhatsApp",
    toTop: "Back to top",
  },

  booking: {
    title: "Book your chair",
    description: "Two quick steps — then we confirm on WhatsApp.",
    step: "Step {n} of 2",
    chooseBarber: "Choose your barber",
    chooseTime: "Choose a day & time",
    anyBarber: "First available",
    firstAvailableNote:
      "Pick “first available” and the next free chair is yours — the wait is usually under 10 minutes.",
    today: "Today",
    tomorrow: "Tomorrow",
    back: "Back",
    confirm: "Confirm on WhatsApp",
    closedNote: "We're closed right now — pick a slot for later.",
    tzHint: "Beirut time · 30-min slots",
    phoneFallback: "Prefer to call?",
    waWith: "Hi Blade & Cedar, I'd like to book an appointment with {barber} on {day} at {time}.",
    waAny: "Hi Blade & Cedar, I'd like to book an appointment with the first available barber on {day} at {time}.",
    waServiceWith: "Hi Blade & Cedar, I'd like to book {service} with {barber} on {day} at {time}.",
    waServiceAny: "Hi Blade & Cedar, I'd like to book {service} with the first available barber on {day} at {time}.",
    serviceLabel: "Service",
    clearService: "Remove selected service",
    pastNote: "Earlier slots today are gone — pick from what's left.",
    lastBarberHint: "We pre-picked your barber from last time — tap Back to change.",
    lastServiceHint: "We kept {service} from last time too — tap ✕ on the chip to change it.",
    lastBothHint: "We pre-picked your barber and {service} from last time — tap Back or ✕ to change.",
    copyDetails: "Copy booking details",
    copied: "Copied",
    a11yOpen: "Open booking dialog",
  },

  openBadge: {
    openNow: "Open now",
    closesAt: "Closes {time}",
    closedNow: "Closed now",
    opensAt: "Opens {day} · {time}",
  },

  lightbox: {
    close: "Close image",
    prev: "Previous image",
    next: "Next image",
  },
};

const ar = {
  header: {
    nav: {
      about: "من نحن",
      services: "الخدمات",
      gallery: "الصور",
      barbers: "الحلاقين",
      reviews: "آراء الزبائن",
      faq: "أسئلة شائعة",
      visit: "زيارتنا",
      gift: "بطاقات هدايا",
    },
    book: "احجز الآن",
    openMenu: "افتح القائمة",
    closeMenu: "أغلق القائمة",
    skipToContent: "تجاوز إلى المحتوى",
  },

  announcement: {
    message: "بطاقات الهدايا صارت متوفرة عند الكونتوار — أرقى هدية بالمدينة.",
    dismiss: "إخفاء الإعلان",
  },

  hero: {
    kicker: "الحمرا · بيروت — منذ ٢٠١٦",
    titleA: "قصّة على طريقة بيروت،",
    titleB: "بدقة وفخامة.",
    sub: "حلاقة راقية، طقوس منشفة ساخنة، وحديث على قهوة — في قلب المدينة.",
    ctaPrimary: "احجز عبر واتساب",
    ctaSecondary: "شوف الخدمات",
    scroll: "انزل",
    vertical: "منذ ٢٠١٦ · الحمرا — بيروت",
  },

  ribbon: {
    items: [
      "بدون موعد منقبلنا",
      "طقوس منشفة ساخنة",
      "منذ ٢٠١٦ — الحمرا، بيروت",
      "كاش أو بطاقة",
      "مفتوحين ٦ أيام بالأسبوع",
    ],
  },

  about: {
    kicker: "قصتنا",
    title: "حِرفة قديمة بروح جديدة",
    p1: "فتح بليد آند سيدر أبوابه سنة ٢٠١٦ بفكرة وحدة: نرجّع طقوس الحلاقة الحقيقية. مش قصّة على عجل — موعد تستاهل تاخد وقتك فيه.",
    p2: "ولدين عمّين، كرسي قديم، وحب كبير لصالونات بيروت الأقدمية. اليوم حلاقينا بينسقوا بين التقنيات الحديثة ودفء الحارة القديم.",
    p3: "أرز على الرفوف وفولاذ على الحجر. كل زائر بيخرج من عندنا مشطّف أكتر ما جا.",
    imageAlt: "حلاق يقصّ شعر زبون داخل صالون بليد آند سيدر",
    statYears: "سنين خبرة",
    statCuts: "قصّة كل شهر",
    statRating: "متوسط التقييم",
  },

  services: {
    kicker: "الخدمات والأسعار",
    title: "القائمة",
    subtitle: "أسعار واضحة ومن غير مفاجآت. بلا موعد كمان منقبلنا، بس الأفضل تحجز.",
    note: "كل الأسعار بالدولار الأمريكي — دفع نقدي أو بالبطاقة.",
    noteLbp: "الأسعار محوّلة من الدولار على أساس {rate} ل.ل للدولار — دفع نقدي أو بالبطاقة.",
    currency: { label: "العملة", usd: "دولار $", lbp: "ل.ل" },
    bookCta: "احجز هالخدمة",
    directWa: "أو راسلنا مباشرة عواتساب",
    signature: "توقيع المحل",
    popular: "الأكثر طلبًا",
    print: "اطبع قائمة الأسعار",
    printNote:
      "كل الأسعار بالدولار · المرجع بالليرة: 1$ ≈ {rate} ل.ل (مقرّبة لأقرب ٥٬٠٠٠).",
    detailsAria: "شوف تفاصيل {name}",
    duration: "≈ {n} دقيقة عالكرسي",
    includesLabel: "شو بتشمل",
    closeDetails: "أغلق التفاصيل",
  },

  gallery: {
    kicker: "الصور",
    title: "الشغل بينحكي حالو",
    subtitle: "طازة من على الكرسي.",
    filters: {
      all: "الكل",
      cuts: "قصّات",
      fades: "فايد",
      shaves: "حلاقة",
      shop: "المحل",
    },
    loadMore: "شوف أكتر",
    showLess: "قلّل",
    by: "شغل {name}",
    compare: {
      before: "قبل",
      after: "بعد",
      hint: "اسحب المقبض أو استعمل الأسهم للمقارنة",
      beforeAlt: "شعر كيرلي طويل قبل القصّة",
      afterAlt: "فايد ناعم بعد القصّة",
    },
    alts: [
      "حلاق بيكمل حلاقة بالموس لزبون مستلقي على الكرسي",
      "ماكينات ومقص وعدد الحلاقة مرصوصة على الطاولة",
      "حلاق يقصّ شعر زبون بالمقص",
      "حلاق بيتأكد من الفايد الجديد بالمشط والماكينة",
      "حلاق بينشّف ويصبّ شعر زبون بعد القصّة",
      "قصّة وتسريحة جديدة — جاهز لعطلة الأسبوع",
      "واعدين مشطّبين بيشقّوا فايد بالماكينة على القفا",
      "تشذيب وتشكيل لحية بالمقص — أبيض وأسود بلمسة سينمائية",
      "قصّة كروب تكسترد منضّطة بإيدين الحلاق",
      "الكرسي الجلد المبطّن، مستنّي الزبون الجاي",
      "قصّة نضيفة ولحية خفيفة — جاهز لعطلة الأسبوع",
      "صف المرايات والكراسي — المحل أول الدوام",
    ],
  },

  barbers: {
    kicker: "تعرّف على الحلاقين",
    title: "أيادي ثابتة وعيون حاذقة",
    subtitle: "الناس اللي ورا الكرسي.",
    roles: ["معلّم حلاقة · المؤسس", "أستاذ الفايد", "أستاذ اللحية والحلاقة"],
    bios: [
      "اتعلم كريم بصالونات طرابلس القديمة، وقصّ أكتر من ١٥ سنة قبل ما يفتح بليد آند سيدر.",
      "جاد بيدور على التدريج المثالي — بلا عجلة وبلا تنازلات.",
      "إيلي بشوف كل لحية كبناء: مقاس، متوازنة، وبتضل واقفة.",
    ],
    specialties: [
      ["قص كلاسيك بالمقص", "حلاقة بالمنشفة الساخنة", "حلاقة الراس"],
      ["فايد ناعم", "قصّات تيبر", "قصّات كروب"],
      ["تشكيل اللحية", "شغل موس تقليدي", "تحديد الخطوط"],
    ],
    alts: ["صورة كريم حداد", "صورة جاد نصار", "صورة إيلي شامي"],
    names: ["كريم حداد", "جاد نصار", "إيلي شامي"],
    profileCta: "شوف الملف",
    specialtiesLabel: "على الكرسي عنده",
    bookWith: "احجز مع {name}",
    seeWork: "شوف شغل {name}",
    closeProfile: "أغلق الملف",
  },

  faq: {
    kicker: "حلو تعرف",
    title: "أسئلة وجوابها",
    items: [
      {
        q: "هل لازم موعد؟",
        a: "منقبلنا زيارة بدون موعد، بس بالتيل والسبت بقى زحمة — حجز سريع على واتساب بيضمنلك كرسيك بالوقت اللي بدك ياها.",
      },
      {
        q: "وين موقعكن بالضبط؟",
        a: "شارع بشارة الخوري، الحمرا — دقيقتين من البحر، جنب السينما القديمة. دوّر على أرز دهبي على الباب.",
      },
      {
        q: "كيف بدفع؟",
        a: "كاش أو بطاقة. كل الأسعار عالقائمة بالدولار.",
      },
      {
        q: "قدّيش بتاخد الزيارة؟",
        a: "القصّة حوالي ٣٠–٤٥ دقيقة. ضيف المنشفة الساخنة واحسب حوالي ٢٠ دقيقة زيادة — بتستاهل.",
      },
      {
        q: "بتقصّوا شعر أطفال؟",
        a: "أكيد — قصّة أطفال بـ 8$، وحلاقينا مشهورين بصبرهم مع الأولاد لأول مرة.",
      },
      {
        q: "في جيب صورة قصّة بدّي ياها؟",
        a: "أكيد جيبها — الصورة أسرع طريقة توصل للقصّة اللي بالضبط بدك ياها.",
      },
    ],
  },

  reviews: {
    kicker: "آراء الزبائن",
    title: "كلام الحارة",
    summary: "حسب {n} تقييم على جوجل",
    readAll: "اقرا كل التقييمات على جوجل",
    verified: "زيارة موثّقة",
    items: [
      {
        quote: "أحسن فايد ببيروت، وجرّبت كل الصالونات. كريم بيخد وقتو والنتيجة بتبين.",
        name: "رامي ك.",
        service: "فايد ناعم",
      },
      {
        quote: "الحلاقة بالمنشفة الساخنة تجربة بحالها. طلقت بحالي ولّيت إنسان جديد.",
        name: "طارق ع.",
        service: "منشفة ساخنة",
      },
      {
        quote: "خدّيت ولدي لأول قصّة حقيقية إلو. صبر، لطف، ونتيجة حلوة كتير.",
        name: "جورج م.",
        service: "قصّة أطفال",
      },
      {
        quote: "دخلت بدون موعد يوم جمعة مزدحمة — أخذت قصّة واضحة ودردشة حلوة كتير.",
        name: "مروان س.",
        service: "قصّة كلاسيك",
      },
      {
        quote: "جاد بيتقن الفايد. بعد أربع أسابيع، لسا شايل شكلو.",
        name: "نديم ح.",
        service: "فايد ناعم",
      },
      {
        quote: "الطقس الكامل — قصّة، لحية، منشفة سخنة. بتستاهل كل دقيقة وكل دولار.",
        name: "وليد ز.",
        service: "قصّة + لحية",
      },
    ],
  },

  location: {
    kicker: "فيننا",
    title: "الموقع والأوقات",
    addressLabel: "العنوان",
    phoneLabel: "الهاتف",
    hoursLabel: "أوقات الدوام",
    today: "اليوم",
    hours: [
      { days: "الاثنين — الجمعة", time: "10:00 — 20:00" },
      { days: "السبت", time: "10:00 — 18:00" },
      { days: "الأحد", time: "مغلق" },
    ],
    mapLabel: "الخريطة — شارع بشارة الخوري، الحمرا",
    mapPin: "بليد آند سيدر · الحمرا، بيروت",
    directions: "افتح على خرائط جوجل",
    mapToggleAria: "نمط الخريطة",
    mapToggleStylised: "مرسومة",
    mapToggleLive: "خريطة حيّة",
  },

  gift: {
    kicker: "بطاقات هدايا",
    title: "أهدى حدّ يلي بحبو يخرج مشطّف.",
    sub: "بطاقة هدية من بليد آند سيدر بتغطي أي وقت عالكرسي — قصّة، حلاقة، أو الطقس الكامل. اطلبها عالواتساب وبتكون جاهزة عند الكونتوار.",
    amountLabel: "اختار القيمة",
    value: "بطاقة هدية",
    for: "للشخص يلي عندو كل شي",
    forLabel: "باسم مين؟ (اختياري)",
    forPlaceholder: "مثلاً: بابا، كريم، أخوي…",
    ticketTo: "لـ",
    clearRecipient: "امسح الاسم",
    serialLabel: "رقم.",
    custom: "بدك قيمة تانية؟ احكينا عالواتساب — أي قيمة بتنضاف.",
    cta: "اطلبها عالواتساب",
    note: "صالحة لـ ١٢ شهر · لأي خدمة · قابلة للإهداء",
  },

  cta: {
    kicker: "جاهزين وقت ما تكون",
    title: "اقعد على الكرسي، وطلع مشطّف.",
    sub: "ابعتلنا على واتساب ومنأكدّلك موعدك خلال الساعة.",
    button: "احجز عبر واتساب",
    share: "شارك الصالون",
    shareCopied: "تم نسخ الرابط",
    watermark: "خليك مشطّف",
  },

  footer: {
    tagline: "حلاقة راقية في قلب بيروت.",
    navAria: "روابط أسفل الصفحة",
    instaCaption: "طازة من على الكرسي — تابعنا",
    socialAria: {
      instagram: "بليد آند سيدر على إنستغرام",
      facebook: "بليد آند سيدر على فيسبوك",
      whatsapp: "بليد آند سيدر على واتساب",
    },
    rights: "جميع الحقوق محفوظة.",
    credit: "تصميم مفاهيمي من Mawqe3 Studio",
  },

  a11y: {
    whatsappFloat: "احجز موعد عبر واتساب",
    toTop: "رجوع لأعلى",
  },

  booking: {
    title: "احجز كرسيك",
    description: "خطوتين سريعتين — ومنأكّدلك على واتساب.",
    step: "خطوة {n} من ٢",
    chooseBarber: "اختار حلاقك",
    chooseTime: "اختار اليوم والوقت",
    anyBarber: "أول حلاق متفرغ",
    firstAvailableNote:
      "اختار «أول حلاق متفرغ» والكرسي الفاضي الجاي إلك — الانتظار عادةً أقل من ١٠ دقايق.",
    today: "اليوم",
    tomorrow: "بكرة",
    back: "رجوع",
    confirm: "أكّد على واتساب",
    closedNote: "الصالون مغلق هلّق — اختار وقت لاحق.",
    tzHint: "بتوقيت بيروت · مواعيد كل ٣٠ دقيقة",
    phoneFallback: "أو اتصل بينا:",
    waWith: "مرحبًا بليد آند سيدر، أودّ حجز موعد مع {barber} {day} الساعة {time}.",
    waAny: "مرحبًا بليد آند سيدر، أودّ حجز موعد مع أول حلاق متفرغ {day} الساعة {time}.",
    waServiceWith: "مرحبًا بليد آند سيدر، أودّ حجز {service} مع {barber} {day} الساعة {time}.",
    waServiceAny: "مرحبًا بليد آند سيدر، أودّ حجز {service} مع أول حلاق متفرغ {day} الساعة {time}.",
    serviceLabel: "الخدمة",
    clearService: "شيل الخدمة المختارة",
    pastNote: "مواعيد اليوم اللي مضت صارت مش متوفرة — اختار من الباقي.",
    lastBarberHint: "اخترنا حلاقك من آخر زيارة — اضغط رجوع لتغييره.",
    lastServiceHint: "كمان خليّنا {service} يلي اختارتو آخر مرة — اضغط ✕ على الشريحة لتغييرها.",
    lastBothHint: "اخترنا حلاقك و {service} من آخر زيارة — اضغط رجوع أو ✕ لتغييرها.",
    copyDetails: "انسخ تفاصيل الحجز",
    copied: "اتنسخ",
    a11yOpen: "افتح نافذة الحجز",
  },

  openBadge: {
    openNow: "مفتوح هلّق",
    closesAt: "بيقفل {time}",
    closedNow: "مغلق هلّق",
    opensAt: "بيفتح {day} · {time}",
  },

  lightbox: {
    close: "أغلق الصورة",
    prev: "الصورة السابقة",
    next: "الصورة التالية",
  },
};

export type Translations = typeof en;

export const TRANSLATIONS: Record<"en" | "ar", Translations> = { en, ar };
