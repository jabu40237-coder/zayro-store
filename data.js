/* ZAYRO STORE v5 — data layer (fully data-driven: every section of the
   storefront renders from this file; new products from the research pipeline
   are added HERE only — no code changes needed).
   SOURCE OF TRUTH: ~/workspace/zayro-store/products-registry.json (snapshot 2026-10-22).
   Prices (SAR/USD), supply statuses and payment links are copied EXACTLY.
   Status mapping (registry supply_status -> storefront status):
     "verified — own product"          -> "available"  (real NOWPayments buy link)
     "route-verified-account-pending"  -> "notify"     (NOT sold — notify only)
     "not-verified" (ZY-CALLIGRAPHY)   -> "unavailable" (do not sell)
   3D/AR: model_glb / model_usdz are null for EVERY product — no real model
   files exist yet, so no 3D/AR control is rendered anywhere. When a real
   model is supplied, set the fields and the viewer activates automatically
   (see NEEDS-3D.md). angles360 holds real generated multi-angle frames used
   by the drag-to-rotate viewer (a 2D fallback, never labelled "3D").
   No ratings, no reviews, no invented specs/stock counts/discounts.
   specs[] entries are registry facts only (type, delivery, billing, supply). */
var ZAYRO_CATEGORIES = [
  { key: "electronics",    icon: "💡", name_ar: "الإلكترونيات والأجهزة الذكية", name_en: "Electronics & Smart Devices" },
  { key: "phone-acc",      icon: "📱", name_ar: "إكسسوارات الهواتف",            name_en: "Phone Accessories" },
  { key: "watches",        icon: "⌚", name_ar: "الساعات",                      name_en: "Watches" },
  { key: "luxury-acc",     icon: "💎", name_ar: "الإكسسوارات الفاخرة",          name_en: "Luxury Accessories" },
  { key: "perfumes",       icon: "🪔", name_ar: "العطور والبخور",               name_en: "Perfumes & Bakhoor" },
  { key: "home-decor",     icon: "🏠", name_ar: "مستلزمات المنزل والديكور",     name_en: "Home & Decor" },
  { key: "gifts",          icon: "🎁", name_ar: "الهدايا",                      name_en: "Gifts" },
  { key: "prayer",         icon: "🕌", name_ar: "مستلزمات الصلاة",              name_en: "Prayer Essentials" },
  { key: "fashion",        icon: "👕", name_ar: "الأزياء والملابس",             name_en: "Fashion" },
  { key: "smart-tech",     icon: "🤖", name_ar: "التقنيات الذكية",              name_en: "Smart Tech" },
  { key: "trending",       icon: "🔥", name_ar: "المنتجات الرائجة والمبتكرة",    name_en: "Trending & Innovative" }
];

/* listed: catalog order used for the "newest first" default sort
   (higher = listed more recently). Display ordering only — not a claim. */
var ZAYRO_PRODUCTS = [
  {
    id: "ZY-BAKHOOR", listed: 3,
    cats: ["perfumes", "gifts"], icon: "🪔",
    name_ar: "مبخرة إلكترونية + بخور فاخر", name_en: "Electric Bakhoor Burner + Premium Bakhoor",
    desc_ar: "مبخرة إلكترونية مع بخور فاخر — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "An electric bakhoor burner with premium bakhoor — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 139, price_usd: 37, billing: "once", status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", stock_en: "Supply route verified — seller account not yet opened",
    image: "assets/bakhoor.webp", gallery: ["assets/bakhoor.webp"], video: "assets/bakhoor-promo.mp4",
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي", v_en: "Physical product" },
      { k: "delivery", v_ar: "يبدأ الشحن عند تفعيل حساب البائع لدى منصة التوريد", v_en: "Shipping starts once the seller account is activated with the fulfilment platform" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", v_en: "Supply route verified — seller account not yet opened" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-MAGSAFE", listed: 4,
    cats: ["phone-acc"], icon: "📱",
    name_ar: "غطاء جوال MagSafe الفاخر", name_en: "MagSafe Luxury Phone Case",
    desc_ar: "غطاء جوال مغناطيسي فاخر متوافق مع MagSafe — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "A luxury magnetic phone case with MagSafe compatibility — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 49, price_usd: 13, billing: "once", status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", stock_en: "Supply route verified — seller account not yet opened",
    image: "assets/magsafe.webp", gallery: ["assets/magsafe.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — إكسسوار هاتف", v_en: "Physical product — phone accessory" },
      { k: "delivery", v_ar: "يبدأ الشحن عند تفعيل حساب البائع لدى منصة التوريد", v_en: "Shipping starts once the seller account is activated with the fulfilment platform" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", v_en: "Supply route verified — seller account not yet opened" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-PRAYER", listed: 2,
    cats: ["prayer", "gifts"], icon: "🕌",
    name_ar: "سجادة صلاة + مسبحة إلكترونية", name_en: "Prayer Mat + Digital Tasbeeh Set",
    desc_ar: "طقم سجادة صلاة مع مسبحة إلكترونية — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "A prayer mat with a digital tasbeeh counter — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 79, price_usd: 21, billing: "once", status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", stock_en: "Supply route verified — seller account not yet opened",
    image: null, gallery: [], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي", v_en: "Physical product" },
      { k: "delivery", v_ar: "يبدأ الشحن عند تفعيل حساب البائع لدى منصة التوريد", v_en: "Shipping starts once the seller account is activated with the fulfilment platform" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", v_en: "Supply route verified — seller account not yet opened" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CALLIGRAPHY", listed: 1,
    cats: ["home-decor", "gifts"], icon: "🖼️",
    name_ar: "لوحة خط عربي — كانفس", name_en: "Arabic Calligraphy Canvas",
    desc_ar: "لوحة خط عربي على كانفس — منتج فيزيائي. لم يتم التحقق من مورّد لهذا المنتج بعد، لذلك هو غير متاح للبيع حالياً.",
    desc_en: "An Arabic calligraphy canvas print — a physical product. No supplier has been verified for this product yet, so it is not available for sale at this time.",
    price_sar: 139, price_usd: 37, billing: "once", status: "unavailable",
    stock_ar: "غير متاح — لا يوجد مورّد موثّق بعد", stock_en: "Unavailable — no verified supplier yet",
    image: null, gallery: [], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي", v_en: "Physical product" },
      { k: "delivery", v_ar: "غير متاح حالياً", v_en: "Not available at this time" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "لا يوجد مورّد موثّق بعد", v_en: "No verified supplier yet" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAR", listed: 5,
    cats: ["home-decor"], icon: "🚗",
    name_ar: "منظّم إكسسوارات السيارة الداخلي", name_en: "Car Interior Organizer Pro",
    desc_ar: "منظّم عملي لمقصورة السيارة — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "A practical car interior organizer — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 89, price_usd: 24, billing: "once", status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", stock_en: "Supply route verified — seller account not yet opened",
    image: null, gallery: [], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مستلزمات سيارة", v_en: "Physical product — car accessory" },
      { k: "delivery", v_ar: "يبدأ الشحن عند تفعيل حساب البائع لدى منصة التوريد", v_en: "Shipping starts once the seller account is activated with the fulfilment platform" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد", v_en: "Supply route verified — seller account not yet opened" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-AUDIO", listed: 7,
    cats: ["trending"], icon: "🎧",
    name_ar: "المكتبة الصوتية الحصرية", name_en: "Exclusive Audio Library (monthly)",
    desc_ar: "مكتبة صوتية حصرية من إنتاج المتجر — اشتراك شهري بتسليم رقمي فوري بعد إتمام الدفع عند بوابة الدفع.",
    desc_en: "An exclusive audio library produced by the store — a monthly subscription with instant digital delivery after payment completes at the payment gateway.",
    price_sar: 45, price_usd: 12, billing: "monthly", status: "available",
    stock_ar: "متاح — منتج رقمي من إنتاج المتجر", stock_en: "Available — the store's own digital product",
    image: "assets/audio.webp",
    gallery: ["assets/audio.webp", "assets/audio-a2.webp", "assets/audio-a3.webp", "assets/audio-a4.webp"],
    video: "assets/audio-promo.mp4",
    angles360: ["assets/audio.webp", "assets/audio-a2.webp", "assets/audio-a3.webp", "assets/audio-a4.webp"],
    model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج رقمي — اشتراك", v_en: "Digital product — subscription" },
      { k: "delivery", v_ar: "تسليم رقمي فوري بعد إتمام الدفع عند بوابة الدفع", v_en: "Instant digital delivery after payment completes at the gateway" },
      { k: "billing", v_ar: "اشتراك شهري", v_en: "Monthly subscription" },
      { k: "supply", v_ar: "منتج خاص بالمتجر — متاح الآن", v_en: "The store's own product — available now" }
    ],
    payment_link: "https://nowpayments.io/payment/?iid=4839326645",
    notify_link: null
  },
  {
    id: "ZY-MEMBER", listed: 6,
    cats: ["trending"], icon: "👑",
    name_ar: "العضوية الذهبية", name_en: "Golden Membership (monthly)",
    desc_ar: "عضوية ذهبية شهرية من إنتاج المتجر — اشتراك رقمي بتسليم فوري بعد إتمام الدفع عند بوابة الدفع.",
    desc_en: "The store's golden monthly membership — a digital subscription with instant delivery after payment completes at the payment gateway.",
    price_sar: 55, price_usd: 15, billing: "monthly", status: "available",
    stock_ar: "متاح — منتج رقمي من إنتاج المتجر", stock_en: "Available — the store's own digital product",
    image: "assets/member.webp",
    gallery: ["assets/member.webp", "assets/member-a2.webp", "assets/member-a3.webp", "assets/member-a4.webp"],
    video: "assets/member-promo.mp4",
    angles360: ["assets/member.webp", "assets/member-a2.webp", "assets/member-a3.webp", "assets/member-a4.webp"],
    model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج رقمي — عضوية", v_en: "Digital product — membership" },
      { k: "delivery", v_ar: "تسليم رقمي فوري بعد إتمام الدفع عند بوابة الدفع", v_en: "Instant digital delivery after payment completes at the gateway" },
      { k: "billing", v_ar: "اشتراك شهري", v_en: "Monthly subscription" },
      { k: "supply", v_ar: "منتج خاص بالمتجر — متاح الآن", v_en: "The store's own product — available now" }
    ],
    payment_link: "https://nowpayments.io/payment/?iid=4679495844",
    notify_link: null
  },

  /* ---------- RESEARCH CANDIDATES (2026-10) — NOT registry products ----------
     Injected from ~/workspace/zayro-store/trending-candidates-2026-10.md.
     Rule 15: a candidate is NOT sellable until its supply is verified inside
     a real supplier catalog. Therefore every candidate has status "notify",
     price_sar/price_usd = null (the storefront renders NO price for null),
     payment_link = null (NO buy button) — only the Instagram "notify me"
     action. The researched Gulf market prices from the research file are
     research references ONLY and are NEVER shown on the site.
     The foldable mini washing machine (research #1) is NOT duplicated here:
     it already exists on the storefront as ZAYRO_TEASER below. The 8th slot
     therefore goes to the next Top-12 candidate, the pressure washer (#10). */
  {
    id: "ZY-CAND-01", listed: 15,
    cats: ["home-decor", "trending"], icon: "🛞",
    name_ar: "منفاخ إطارات رقمي محمول", name_en: "Portable Digital Tire Inflator",
    desc_ar: "منفاخ إطارات محمول بشاشة رقمية لقياس الضغط — مرشّح من بحث السوق (أكتوبر 2026) ومن أكثر مستلزمات السيارات طلباً في السعودية. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً — فعّل «أعلمني» ليصلك جديد التوفر.",
    desc_en: "A portable tire inflator with a digital pressure display — a market-research candidate (October 2026) and one of the most in-demand car accessories in Saudi Arabia. Supply is not verified yet, so there is no price and no ordering yet — tap Notify Me for availability updates.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-tire-inflator.webp", gallery: ["assets/cand-tire-inflator.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-02", listed: 14,
    cats: ["home-decor", "gifts"], icon: "🚀",
    name_ar: "بروجكتر رائد الفضاء — نجوم وغالاكسي", name_en: "Astronaut Galaxy Star Projector",
    desc_ar: "بروجكتر إضاءة أجواء على شكل رائد فضاء يعرض النجوم والسُّدم الملونة على السقف والجدران ويعمل عبر USB — مرشّح رائج من بحث السوق (أكتوبر 2026) ومنتشر في فيديوهات تحويل الغرف. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "An astronaut-shaped ambient projector that casts colourful stars and nebulae onto ceilings and walls, USB-powered — a trending market-research candidate (October 2026) popular in room-makeover videos. Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-galaxy-projector.webp", gallery: ["assets/cand-galaxy-projector.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-03", listed: 13,
    cats: ["home-decor", "trending"], icon: "🧹",
    name_ar: "مكنسة سيارة لاسلكية 4 في 1", name_en: "Cordless 4-in-1 Car Vacuum",
    desc_ar: "مكنسة سيارة لاسلكية تجمع الشفط والنفخ، ومن موديلاتها المرصودة ما تصل قوة شفطه إلى 16000Pa — مرشّح من بحث السوق (أكتوبر 2026) بقوائم نشطة على متاجر سعودية. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "A cordless car vacuum combining suction and blowing, with researched models offering up to 16000Pa suction — a market-research candidate (October 2026) with active Saudi listings. Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-car-vacuum.webp", gallery: ["assets/cand-car-vacuum.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-04", listed: 12,
    cats: ["home-decor"], icon: "💡",
    name_ar: "إضاءة LED بحساس حركة للخزائن — حزمة", name_en: "Motion-Sensor LED Cabinet Light (Bundle)",
    desc_ar: "أشرطة إضاءة LED قابلة للشحن بحساس حركة لخزائن المطبخ والأدراج، تُباع كحزمة — مرشّح من بحث السوق (أكتوبر 2026) ضمن فئة تنظيم المنزل الرائجة. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "Rechargeable motion-sensor LED light bars for kitchen cabinets and drawers, sold as a bundle — a market-research candidate (October 2026) from the trending home-organization category. Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-led-light.webp", gallery: ["assets/cand-led-light.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-05", listed: 11,
    cats: ["smart-tech", "trending"], icon: "🥤",
    name_ar: "خلاط محمول قابل للشحن USB", name_en: "Portable USB Blender Cup",
    desc_ar: "كوب خلاط محمول قابل للشحن عبر USB للعصائر والسموذي، مناسب للجيم والمكتب والجامعة — مرشّح من بحث السوق (أكتوبر 2026) بقوائم نشطة على متاجر سعودية. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "A portable USB-rechargeable blender cup for juices and smoothies, suited to the gym, office and university — a market-research candidate (October 2026) with active Saudi listings. Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-blender.webp", gallery: ["assets/cand-blender.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-06", listed: 10,
    cats: ["home-decor", "trending"], icon: "🏮",
    name_ar: "مصباح تخييم شمسي قابل للشحن", name_en: "Solar Rechargeable Camping Lantern",
    desc_ar: "مصباح تخييم متعدد الوظائف يُشحن بالطاقة الشمسية أو عبر USB، مناسب لموسم الكشتات والبر — مرشّح موسمي من بحث السوق (أكتوبر 2026). التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "A multi-function camping lantern charged by solar power or USB, suited to the desert-camping (kashta) season — a seasonal market-research candidate (October 2026). Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-lantern.webp", gallery: ["assets/cand-lantern.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-07", listed: 9,
    cats: ["smart-tech", "trending"], icon: "🍱",
    name_ar: "صندوق غداء كهربائي للتسخين", name_en: "Electric Heated Lunch Box",
    desc_ar: "صندوق غداء كهربائي يسخّن الطعام خلال نحو 15 دقيقة في الموديلات المرصودة، ويعمل في المنزل والسيارة — مرشّح من بحث السوق (أكتوبر 2026) ومن أكثر منتجات فئته مبيعاً على متاجر سعودية. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "An electric lunch box that heats food in about 15 minutes in researched models, working at home and in the car — a market-research candidate (October 2026) and a top seller in its Saudi category. Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-lunch-box.webp", gallery: ["assets/cand-lunch-box.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAND-08", listed: 8,
    cats: ["home-decor", "trending"], icon: "💦",
    name_ar: "مسدس غسيل سيارة لاسلكي بالضغط", name_en: "Cordless Pressure Washer Gun",
    desc_ar: "مسدس غسيل سيارة لاسلكي يعمل بالبطارية لغسل السيارة في المنزل — مرشّح من بحث السوق (أكتوبر 2026) بقوائم سعودية عالية التفاعل. التوريد غير موثّق بعد، لذلك لا يوجد سعر ولا طلب حالياً.",
    desc_en: "A battery-powered cordless pressure washer gun for washing the car at home — a market-research candidate (October 2026) with highly engaged Saudi listings. Supply is not verified yet, so there is no price and no ordering yet.",
    price_sar: null, price_usd: null, billing: "once", status: "notify",
    stock_ar: "قريباً — مرشّح قيد التحقق من التوريد، غير متاح للطلب بعد", stock_en: "Coming soon — candidate still being supply-verified; not orderable yet",
    image: "assets/cand-pressure-washer.webp", gallery: ["assets/cand-pressure-washer.webp"], video: null,
    angles360: [], model_glb: null, model_usdz: null,
    specs: [
      { k: "type", v_ar: "منتج فيزيائي — مرشّح بحثي", v_en: "Physical product — research candidate" },
      { k: "delivery", v_ar: "لا يُطلب حتى يكتمل التحقق من التوريد", v_en: "Not orderable until supply verification is complete" },
      { k: "billing", v_ar: "دفعة واحدة", v_en: "One-time payment" },
      { k: "supply", v_ar: "مرشّح من بحث سوق أكتوبر 2026 — لم يُتحقق من وجوده في كتالوج مورّد بعد", v_en: "October 2026 market-research candidate — not yet verified in a supplier catalog" }
    ],
    payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
  }
];

/* Coming-soon teaser — NOT a registry product, NOT for sale, NO price.
   A candidate product (foldable mini washing machine) with a real published
   teaser video (Instagram, 2026-10-22); supply is not verified yet.
   angles360 frames were generated in-house for the interactive viewer. */
var ZAYRO_TEASER = {
  name_ar: "غسالة صغيرة قابلة للطي — قريباً",
  name_en: "Foldable Mini Washing Machine — Coming Soon",
  desc_ar: "منتج مرشّح قيد دراسة التوريد. شاهد الفيديو التشويقي واستكشف الزوايا — لا يوجد سعر ولا طلب حالياً.",
  desc_en: "A candidate product whose supply is still being verified. Watch the teaser and explore the angles — no price and no ordering yet.",
  image: "assets/washer.webp",
  gallery: ["assets/washer.webp", "assets/washer-a2.webp", "assets/washer-a3.webp", "assets/washer-a4.webp"],
  angles360: ["assets/washer.webp", "assets/washer-a2.webp", "assets/washer-a3.webp", "assets/washer-a4.webp"],
  model_glb: null, model_usdz: null,
  video: "assets/washer-teaser.mp4",
  reel_url: "https://www.instagram.com/reel/DeyOoy2KJam/",
  notify_link: "https://ig.me/m/aiuhkot"
};

/* Customer reviews — EMPTY. The reviews section renders ONLY when real,
   verifiable reviews are added here (name, product id, text, date).
   Never seed this with invented reviews. */
var ZAYRO_REVIEWS = [];

if (typeof window !== "undefined") {
  window.ZAYRO_CATEGORIES = ZAYRO_CATEGORIES;
  window.ZAYRO_PRODUCTS = ZAYRO_PRODUCTS;
  window.ZAYRO_TEASER = ZAYRO_TEASER;
  window.ZAYRO_REVIEWS = ZAYRO_REVIEWS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ZAYRO_CATEGORIES: ZAYRO_CATEGORIES, ZAYRO_PRODUCTS: ZAYRO_PRODUCTS, ZAYRO_TEASER: ZAYRO_TEASER, ZAYRO_REVIEWS: ZAYRO_REVIEWS };
}
