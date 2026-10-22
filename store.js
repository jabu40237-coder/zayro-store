/* ZAYRO STORE v5 — store logic.
   Pure functions (cart math, validation, sorting/filtering, currency
   conversion, admin override merge) are exported for Node tests; browser
   state (cart / orders) lives in localStorage. NO wishlist — the owner
   removed it (2026-10-22). Orders created here are LOCAL records with
   status "pending" — a payment is NEVER marked verified by the front-end;
   only the backend IPN flow can do that (see backend/). */
(function () {
  "use strict";

  /* ---------- pure logic (also used by tests/run-tests.js) ---------- */

  function computeCartTotals(cartMap, products) {
    var count = 0, total = 0;
    Object.keys(cartMap || {}).forEach(function (id) {
      var p = null;
      for (var i = 0; i < products.length; i++) if (products[i].id === id) p = products[i];
      var qty = Math.max(0, parseInt(cartMap[id], 10) || 0);
      if (p && qty > 0) { count += qty; total += qty * p.price_sar; }
    });
    return { count: count, total_sar: total };
  }

  function validateContact(v) {
    v = String(v || "").trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return true;
    return /^\+?[0-9\s-]{9,15}$/.test(v) && v.replace(/[^0-9]/g, "").length >= 9;
  }

  /* Returns an array of error keys; empty array = valid. */
  function validateCheckout(f) {
    var errs = [];
    if (!f || String(f.name || "").trim().length < 3) errs.push("errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(f.email || "").trim())) errs.push("errEmail");
    var digits = String(f.phone || "").replace(/[^0-9]/g, "");
    if (!/^\+?[0-9\s-]{9,15}$/.test(String(f.phone || "").trim()) || digits.length < 9) errs.push("errPhone");
    if (!String(f.country || "").trim()) errs.push("errCountry");
    if (!String(f.city || "").trim()) errs.push("errCity");
    if (!String(f.address || "").trim()) errs.push("errAddress");
    return errs;
  }

  /* Default sort = newest first (the product's "listed" rank, descending). */
  function sortProducts(list, mode, lang) {
    var out = list.slice();
    /* Price-less candidates (price_sar null) always sort last in price modes. */
    if (mode === "asc" || mode === "desc") out.sort(function (a, b) {
      if (a.price_sar == null && b.price_sar == null) return 0;
      if (a.price_sar == null) return 1;
      if (b.price_sar == null) return -1;
      return mode === "asc" ? a.price_sar - b.price_sar : b.price_sar - a.price_sar;
    });
    else if (mode === "name") out.sort(function (a, b) {
      var an = lang === "ar" ? a.name_ar : a.name_en, bn = lang === "ar" ? b.name_ar : b.name_en;
      return an < bn ? -1 : an > bn ? 1 : 0;
    });
    else out.sort(function (a, b) { return (b.listed || 0) - (a.listed || 0); });
    return out;
  }

  /* filters: {q, status, cat, price: "any"|"u50"|"50-100"|"o100"} */
  function filterProducts(list, f, lang) {
    f = f || {};
    var q = String(f.q || "").trim().toLowerCase();
    return list.filter(function (p) {
      if (f.status && f.status !== "all" && p.status !== f.status) return false;
      if (f.cat && f.cat !== "all" && p.cats.indexOf(f.cat) < 0) return false;
      if (f.price && f.price !== "any" && p.price_sar == null) return false; /* no public price -> never in a price band */
      if (f.price === "u50" && !(p.price_sar < 50)) return false;
      if (f.price === "50-100" && !(p.price_sar >= 50 && p.price_sar <= 100)) return false;
      if (f.price === "o100" && !(p.price_sar > 100)) return false;
      if (q) {
        var hay = (p.name_ar + " " + p.name_en + " " + p.desc_ar + " " + p.desc_en).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  /* DISPLAY-ONLY currency conversion. Checkout never uses this. */
  function convertPrice(sar, currency, rates) {
    var rate = (rates && rates[currency]) || 1;
    return sar * rate;
  }

  /* Admin prototype override layer: {added:[product], edited:{id:patch}, removed:[id]} */
  function mergeProducts(base, override) {
    if (!override) return base.slice();
    var removed = override.removed || [];
    var out = base.filter(function (p) { return removed.indexOf(p.id) === -1; }).map(function (p) {
      var patch = (override.edited || {})[p.id];
      if (!patch) return p;
      var c = {}; for (var k in p) c[k] = p[k];
      for (var k2 in patch) c[k2] = patch[k2];
      return c;
    });
    (override.added || []).forEach(function (p) { out.push(p); });
    return out;
  }

  var PURE = {
    computeCartTotals: computeCartTotals,
    validateContact: validateContact,
    validateCheckout: validateCheckout,
    sortProducts: sortProducts,
    filterProducts: filterProducts,
    convertPrice: convertPrice,
    mergeProducts: mergeProducts
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = PURE; }
  if (typeof window === "undefined") return;

  /* ---------- browser state ---------- */
  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  var Store = {
    pure: PURE,
    getProducts: function () {
      return mergeProducts(window.ZAYRO_PRODUCTS, read("zayro_admin_override", null));
    },
    getCart: function () { return read("zayro_cart", {}); },
    setCart: function (c) { write("zayro_cart", c); },
    addToCart: function (id) { var c = this.getCart(); c[id] = (c[id] || 0) + 1; this.setCart(c); return c; },
    getOrders: function () { return read("zayro_orders", []); },
    createOrder: function (items, customer) {
      var orders = this.getOrders();
      var seq = read("zayro_order_seq", 0) + 1;
      write("zayro_order_seq", seq);
      var id = "ZY-2026-" + ("0000" + seq).slice(-4);
      var token = "";
      var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      for (var i = 0; i < 10; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
      var total = items.reduce(function (s, e) { return s + e.qty * e.price_sar; }, 0);
      var order = {
        id: id, token: token, items: items, total_sar: total,
        customer: customer, status: "pending", payment: "pending",
        created_at: new Date().toISOString()
      };
      orders.push(order); write("zayro_orders", orders);
      return order;
    },
    findOrder: function (id, token) {
      var list = this.getOrders();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === String(id || "").trim() && list[i].token === String(token || "").trim()) return list[i];
      }
      return null;
    },
    /* Email lookup over LOCAL orders only (this browser's records). */
    findOrdersByEmail: function (email) {
      var e = String(email || "").trim().toLowerCase();
      if (!e) return [];
      return this.getOrders().filter(function (o) {
        return o.customer && String(o.customer.email || "").trim().toLowerCase() === e;
      });
    },
    homeFlags: function () {
      var d = { featured: true, newsec: true, how: true };
      var f = read("zayro_admin_home", null);
      if (f) for (var k in d) if (typeof f[k] === "boolean") d[k] = f[k];
      return f ? { featured: f.featured, newsec: f.newsec, how: f.how } : d;
    }
  };
  window.ZayroStore = Store;
})();
