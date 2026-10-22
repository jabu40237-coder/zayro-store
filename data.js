/* ZAYRO STORE v3 — data layer.
   SOURCE OF TRUTH: ~/workspace/zayro-store/products-registry.json (snapshot 2026-10-22).
   Prices (SAR/USD), supply statuses and payment links are copied EXACTLY from the registry.
   Status mapping (registry supply_status -> storefront status):
     "verified — own product"          -> "available"  (real NOWPayments buy link)
     "route-verified-account-pending"  -> "notify"     (supply route verified, seller account
                                                        not yet opened -> NOT sold, notify only)
     "not-verified" (ZY-CALLIGRAPHY)   -> "unavailable" (registry stock_status:
                                                        "unavailable — do not sell")
   No ratings, no reviews, no invented variants/specs/stock counts.
   USD figures are the registry sale_price_usd, shown strictly as a labelled reference. */
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

var ZAYRO_PRODUCTS = [
  {
    id: "ZY-BAKHOOR",
    cats: ["perfumes", "gifts"],
    icon: "🪔",
    name_ar: "مبخرة إلكترونية + بخور فاخر",
    name_en: "Electric Bakhoor Burner + Premium Bakhoor",
    desc_ar: "مبخرة إلكترونية مع بخور فاخر — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "An electric bakhoor burner with premium bakhoor — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 139, price_usd: 37,
    billing: "once",
    status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد",
    stock_en: "Supply route verified — seller account not yet opened",
    image: "assets/bakhoor.webp",
    video: "assets/bakhoor-promo.mp4",
    payment_link: null,
    notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-MAGSAFE",
    cats: ["phone-acc"],
    icon: "📱",
    name_ar: "غطاء جوال MagSafe الفاخر",
    name_en: "MagSafe Luxury Phone Case",
    desc_ar: "غطاء جوال مغناطيسي فاخر متوافق مع MagSafe — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "A luxury magnetic phone case with MagSafe compatibility — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 49, price_usd: 13,
    billing: "once",
    status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد",
    stock_en: "Supply route verified — seller account not yet opened",
    image: "assets/magsafe.webp",
    video: null,
    payment_link: null,
    notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-PRAYER",
    cats: ["prayer", "gifts"],
    icon: "🕌",
    name_ar: "سجادة صلاة + مسبحة إلكترونية",
    name_en: "Prayer Mat + Digital Tasbeeh Set",
    desc_ar: "طقم سجادة صلاة مع مسبحة إلكترونية — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "A prayer mat with a digital tasbeeh counter — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 79, price_usd: 21,
    billing: "once",
    status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد",
    stock_en: "Supply route verified — seller account not yet opened",
    image: null,
    video: null,
    payment_link: null,
    notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CALLIGRAPHY",
    cats: ["home-decor", "gifts"],
    icon: "🖼️",
    name_ar: "لوحة خط عربي — كانفس",
    name_en: "Arabic Calligraphy Canvas",
    desc_ar: "لوحة خط عربي على كانفس — منتج فيزيائي. لم يتم التحقق من مورّد لهذا المنتج بعد، لذلك هو غير متاح للبيع حالياً.",
    desc_en: "An Arabic calligraphy canvas print — a physical product. No supplier has been verified for this product yet, so it is not available for sale at this time.",
    price_sar: 139, price_usd: 37,
    billing: "once",
    status: "unavailable",
    stock_ar: "غير متاح — لا يوجد مورّد موثّق بعد",
    stock_en: "Unavailable — no verified supplier yet",
    image: null,
    video: null,
    payment_link: null,
    notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-CAR",
    cats: ["home-decor"],
    icon: "🚗",
    name_ar: "منظّم إكسسوارات السيارة الداخلي",
    name_en: "Car Interior Organizer Pro",
    desc_ar: "منظّم عملي لمقصورة السيارة — منتج فيزيائي. مسار التوريد موثّق عبر منصات سعودية، لكن حساب البائع لم يُفتح بعد، لذلك الطلب غير مفعّل حالياً.",
    desc_en: "A practical car interior organizer — a physical product. The supply route is verified via Saudi platforms, but the seller account is not open yet, so ordering is not active yet.",
    price_sar: 89, price_usd: 24,
    billing: "once",
    status: "notify",
    stock_ar: "مسار التوريد موثّق — حساب البائع لم يُفتح بعد",
    stock_en: "Supply route verified — seller account not yet opened",
    image: null,
    video: null,
    payment_link: null,
    notify_link: "https://ig.me/m/aiuhkot"
  },
  {
    id: "ZY-AUDIO",
    cats: ["trending"],
    icon: "🎧",
    name_ar: "المكتبة الصوتية الحصرية",
    name_en: "Exclusive Audio Library (monthly)",
    desc_ar: "مكتبة صوتية حصرية من إنتاج المتجر — اشتراك شهري بتسليم رقمي فوري بعد إتمام الدفع عند بوابة الدفع.",
    desc_en: "An exclusive audio library produced by the store — a monthly subscription with instant digital delivery after payment completes at the payment gateway.",
    price_sar: 45, price_usd: 12,
    billing: "monthly",
    status: "available",
    stock_ar: "متاح — منتج رقمي من إنتاج المتجر",
    stock_en: "Available — the store's own digital product",
    image: "assets/audio.webp",
    video: "assets/audio-promo.mp4",
    payment_link: "https://nowpayments.io/payment/?iid=4839326645",
    notify_link: null
  },
  {
    id: "ZY-MEMBER",
    cats: ["trending"],
    icon: "👑",
    name_ar: "العضوية الذهبية",
    name_en: "Golden Membership (monthly)",
    desc_ar: "عضوية ذهبية شهرية من إنتاج المتجر — اشتراك رقمي بتسليم فوري بعد إتمام الدفع عند بوابة الدفع.",
    desc_en: "The store's golden monthly membership — a digital subscription with instant delivery after payment completes at the payment gateway.",
    price_sar: 55, price_usd: 15,
    billing: "monthly",
    status: "available",
    stock_ar: "متاح — منتج رقمي من إنتاج المتجر",
    stock_en: "Available — the store's own digital product",
    image: "assets/member.webp",
    video: "assets/member-promo.mp4",
    payment_link: "https://nowpayments.io/payment/?iid=4679495844",
    notify_link: null
  }
];

/* Coming-soon teaser — NOT a registry product, NOT for sale, no price.
   A real published teaser video (Instagram, 2026-10-22) for a candidate product
   whose supply is not verified yet. Shown on the homepage "New" section only. */
var ZAYRO_TEASER = {
  name_ar: "غسالة صغيرة قابلة للطي — قريباً",
  name_en: "Foldable Mini Washing Machine — Coming Soon",
  desc_ar: "منتج مرشّح قيد دراسة التوريد. شاهد الفيديو التشويقي — لا يوجد سعر ولا طلب حالياً.",
  desc_en: "A candidate product whose supply is still being verified. Watch the teaser — no price and no ordering yet.",
  video: "assets/washer-teaser.mp4",
  reel_url: "https://www.instagram.com/reel/DeyOoy2KJam/",
  notify_link: "https://ig.me/m/aiuhkot"
};

if (typeof window !== "undefined") {
  window.ZAYRO_CATEGORIES = ZAYRO_CATEGORIES;
  window.ZAYRO_PRODUCTS = ZAYRO_PRODUCTS;
  window.ZAYRO_TEASER = ZAYRO_TEASER;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ZAYRO_CATEGORIES: ZAYRO_CATEGORIES, ZAYRO_PRODUCTS: ZAYRO_PRODUCTS, ZAYRO_TEASER: ZAYRO_TEASER };
}
