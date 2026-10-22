/* ZAYRO STORE v5 — site configuration.
   ONE place for integration settings. Everything here is inert until a real
   service is connected:
   - analyticsId: EMPTY on purpose. Paste a real measurement ID (e.g. a GA4
     "G-..." id) here ONLY after the owner creates the analytics property —
     no fake ID is shipped. When empty, no analytics script is loaded.
   - currency: DISPLAY-ONLY conversion rates against SAR. Checkout always
     uses the original SAR prices and the original NOWPayments links.
   - modelViewerSrc: Google's <model-viewer> CDN. Loaded lazily by product.js
     ONLY when a product actually has a model_glb/model_usdz file — in this
     build no product has one, so the script never loads. */
var ZAYRO_CONFIG = {
  analyticsId: "",
  currency: {
    base: "SAR",
    rates: { SAR: 1, USD: 0.2666, IQD: 349.5 },
    symbols: { SAR: "SAR", USD: "USD", IQD: "IQD" },
    decimals: { SAR: 0, USD: 2, IQD: 0 }
  },
  modelViewerSrc: "https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js",
  siteUrl: "https://jabu40237-coder.github.io/zayro-store/",
  instagram: "https://www.instagram.com/aiuhkot",
  instagramDM: "https://ig.me/m/aiuhkot",
  tiktok: "https://www.tiktok.com/@aiuhkot",
  email: "ddndn9172@gmail.com"
};
if (typeof window !== "undefined") { window.ZAYRO_CONFIG = ZAYRO_CONFIG; }
if (typeof module !== "undefined" && module.exports) { module.exports = ZAYRO_CONFIG; }
