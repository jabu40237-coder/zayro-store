/* ZAYRO STORE v5 — shared UI chrome.
   Minimal LEVAR-inspired header (text wordmark), top welcome bar, live
   search, currency display switcher (display-only), dark-mode toggle
   (light default), language by browser on first visit, cart drawer,
   top add-to-cart confirmation bar, floating contact button, 4-column
   footer. NO wishlist (owner removed it). No secrets, no backend calls.
   A payment is NEVER treated as verified by this front-end. */
(function () {
  "use strict";
  var S = window.ZayroStore;
  var CFG = window.ZAYRO_CONFIG || { currency: { rates: { SAR: 1 }, decimals: {} } };

  /* ---------- language: stored choice, else browser language, else Arabic ---------- */
  var lang = null;
  try { lang = localStorage.getItem("zayro_lang"); } catch (e) {}
  if (!lang) {
    var bl = (navigator.language || "ar").toLowerCase();
    lang = bl.indexOf("ar") === 0 ? "ar" : "en";
  }
  if (!window.ZAYRO_I18N[lang]) lang = "ar";

  /* ---------- theme: light default, persisted ---------- */
  var theme = "light";
  try { theme = localStorage.getItem("zayro_theme") || "light"; } catch (e) {}
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");

  /* ---------- currency: display-only, persisted ---------- */
  var currency = "SAR";
  try { currency = localStorage.getItem("zayro_currency") || "SAR"; } catch (e) {}
  if (!CFG.currency.rates[currency]) currency = "SAR";

  function t() { return window.ZAYRO_I18N[lang]; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pname(p) { return lang === "ar" ? p.name_ar : p.name_en; }
  function pdesc(p) { return lang === "ar" ? p.desc_ar : p.desc_en; }
  function pstock(p) { return lang === "ar" ? p.stock_ar : p.stock_en; }
  function cname(c) { return lang === "ar" ? c.name_ar : c.name_en; }
  function products() { return S.getProducts(); }
  function byId(id) { var l = products(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function catName(key) { var cs = window.ZAYRO_CATEGORIES; for (var i = 0; i < cs.length; i++) if (cs[i].key === key) return cname(cs[i]); return key; }

  var CUR_LABEL = { SAR: { ar: "ر.س", en: "SAR" }, USD: { ar: "$", en: "$" }, IQD: { ar: "د.ع", en: "IQD" } };
  function fmtPrice(sar) {
    var v = S.pure.convertPrice(sar, currency, CFG.currency.rates);
    var dec = CFG.currency.decimals[currency] || 0;
    var num = dec > 0 ? v.toFixed(dec) : String(Math.round(v));
    return num + " " + (CUR_LABEL[currency] ? CUR_LABEL[currency][lang] : currency);
  }
  function statusText(p) {
    var d = t();
    return p.status === "available" ? d.statusAvailable : p.status === "notify" ? d.statusNotify : d.statusNA;
  }
  function priceHTML(p) {
    var d = t();
    if (p.price_sar == null) return ""; /* candidates (rule 15): NO public price until supply is verified */
    return '<span class="price">' + esc(fmtPrice(p.price_sar)) + "</span>" +
      '<span class="price-note">' + esc(p.billing === "monthly" ? d.perMonth : d.oneTime) + "</span>";
  }
  function statusHTML(p) {
    return '<p class="status-line st-' + p.status + '"><span class="dot" aria-hidden="true"></span>' + esc(statusText(p)) + "</p>";
  }
  function mediaHTML(p, cls) {
    if (p.image) return '<div class="' + cls + '"><img src="' + esc(p.image) + '" alt="' + esc(pname(p)) + '" loading="lazy" decoding="async"></div>';
    return '<div class="' + cls + ' icon-fallback" aria-hidden="true">' + esc(p.icon) + "</div>";
  }
  function actionsHTML(p) {
    var d = t();
    var h = '<div class="card-actions">';
    if (p.status === "available") {
      h += '<a class="buy" href="' + esc(p.payment_link) + '" target="_blank" rel="noopener">' + esc(d.buyNow) + "</a>" +
           '<button class="add-cart" type="button" data-add="' + esc(p.id) + '">' + esc(d.addCart) + "</button>";
    } else if (p.status === "notify") {
      h += '<a class="notify" href="' + esc(p.notify_link) + '" target="_blank" rel="noopener">' + esc(d.notify) + "</a>";
    } else {
      h += '<a class="notify" href="' + esc(p.notify_link) + '" target="_blank" rel="noopener">' + esc(d.notifyDM) + "</a>";
    }
    h += '<a class="details-btn" href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(d.details) + "</a></div>";
    return h;
  }
  function productCard(p) {
    var card = document.createElement("article");
    card.className = "product";
    card.innerHTML =
      '<a class="card-media-link" href="product.html?id=' + encodeURIComponent(p.id) + '">' + mediaHTML(p, "card-media") + "</a>" +
      statusHTML(p) +
      '<h3><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(pname(p)) + "</a></h3>" +
      '<p class="card-desc">' + esc(pdesc(p)) + "</p>" +
      '<div class="price-row">' + priceHTML(p) + "</div>" + actionsHTML(p);
    return card;
  }

  function buildChrome() {
    var d = t();
    var header = $("#siteHeader");
    if (header) {
      var curOpts = Object.keys(CFG.currency.rates).map(function (c) {
        return '<option value="' + c + '"' + (c === currency ? " selected" : "") + ">" + c + "</option>";
      }).join("");
      header.innerHTML =
      '<div class="topbar"><div class="wrap topbar-in">' + esc(d.topbarText) + "</div></div>" +
      '<div class="wrap nav">' +
        '<a class="brand" href="index.html" aria-label="ZAYRO STORE">ZAYRO<em>STORE</em></a>' +
        '<nav class="nav-links" aria-label="Main">' +
          '<a href="index.html">' + esc(d.navHome) + "</a>" +
          '<a href="shop.html">' + esc(d.navShop) + "</a>" +
          '<a href="index.html#cats">' + esc(d.navCats) + "</a>" +
          '<a href="track.html">' + esc(d.navTrack) + "</a>" +
          '<a href="faq.html">' + esc(d.navFaq) + "</a>" +
          '<a href="contact.html">' + esc(d.navContact) + "</a>" +
        "</nav>" +
        '<div class="nav-actions">' +
          '<div class="live-search">' +
            '<input type="search" id="liveSearchInput" data-i18n-ph="searchPh" placeholder="' + esc(d.searchPh) + '" aria-label="' + esc(d.searchBtn) + '" autocomplete="off">' +
            '<div class="live-results" id="liveResults" hidden></div>' +
          "</div>" +
          '<select id="currencySel" class="cur-sel" aria-label="' + esc(d.currencyLabel) + '">' + curOpts + "</select>" +
          '<button class="icon-btn" id="themeBtn" type="button" aria-label="' + esc(d.themeLabel) + '">' + (theme === "dark" ? "☀️" : "🌙") + "</button>" +
          '<button class="icon-btn lang-btn" id="langBtn" type="button" aria-label="Switch language">' + esc(d.langName) + "</button>" +
          '<button class="icon-btn cart-btn" id="cartBtn" type="button" aria-label="' + esc(d.cart) + '">🛍️<span class="cart-count" id="cartCount">0</span></button>' +
        "</div></div>";
    }
    var footer = $("#siteFooter");
    if (footer) {
      var catLinks = window.ZAYRO_CATEGORIES.slice(0, 6).map(function (c) {
        return '<a href="category.html?cat=' + encodeURIComponent(c.key) + '">' + esc(cname(c)) + "</a>";
      }).join("");
      footer.innerHTML =
      '<div class="wrap"><div class="foot">' +
        '<div class="col foot-about">' +
          '<a class="brand" href="index.html">ZAYRO<em>STORE</em></a>' +
          '<p>' + esc(d.footAbout) + "</p>" +
          '<p class="slogan-line">EVERYTHING YOU WANT. ONE PLACE.</p></div>' +
        '<div class="col"><h4>' + esc(d.footShop) + "</h4>" + catLinks +
          '<a href="shop.html">' + esc(d.navShop) + "</a></div>" +
        '<div class="col"><h4>' + esc(d.footPolicies) + "</h4>" +
          '<a href="shipping.html">' + esc(d.polShipping) + "</a>" +
          '<a href="returns.html">' + esc(d.polReturns) + "</a>" +
          '<a href="privacy.html">' + esc(d.polPrivacy) + "</a>" +
          '<a href="terms.html">' + esc(d.polTerms) + "</a></div>" +
        '<div class="col"><h4>' + esc(d.footHelp) + "</h4>" +
          '<a href="track.html">' + esc(d.navTrack) + "</a>" +
          '<a href="faq.html">' + esc(d.navFaq) + "</a>" +
          '<a href="contact.html">' + esc(d.navContact) + "</a>" +
          '<a href="cart.html">' + esc(d.cartTitle) + "</a>" +
          '<div class="socials">' +
            '<a href="' + esc(CFG.instagram || "https://www.instagram.com/aiuhkot") + '" target="_blank" rel="noopener">Instagram · @aiuhkot</a>' +
            '<a href="' + esc(CFG.tiktok || "https://www.tiktok.com/@aiuhkot") + '" target="_blank" rel="noopener">TikTok · @aiuhkot</a>' +
            '<a href="' + esc(CFG.instagramDM || "https://ig.me/m/aiuhkot") + '" target="_blank" rel="noopener">Instagram DM</a>' +
          "</div></div>" +
      '</div><div class="copy">' + esc(d.rights) + "</div></div>";
    }
    /* Cart drawer */
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="drawer-overlay" id="drawerOverlay"></div>' +
      '<aside class="cart-drawer" id="cartDrawer" aria-label="' + esc(d.cart) + '">' +
        '<button class="close-x" type="button" id="cartClose" aria-label="' + esc(d.close) + '">×</button>' +
        "<h3>" + esc(d.cart) + "</h3>" +
        '<div class="cart-items" id="cartItems"></div>' +
        '<div class="cart-total"><span>' + esc(d.total) + '</span><span id="cartTotal">0</span></div>' +
        '<p class="cart-note">' + esc(d.cartNote) + "</p>" +
        '<a class="pay-link" href="checkout.html">' + esc(d.checkoutBtn) + "</a>" +
      "</aside>" +
      /* Top add-to-cart confirmation bar */
      '<div class="toast-bar" id="toastBar" role="status" aria-live="polite" hidden>' +
        '<span id="toastText"></span><a href="cart.html">' + esc(d.toastView) + '</a>' +
        '<button type="button" id="toastClose" aria-label="' + esc(d.close) + '">×</button></div>' +
      /* Floating contact button */
      '<a class="float-contact" href="contact.html" aria-label="' + esc(d.contactBtn) + '">💬</a>';
    document.body.appendChild(wrap);

    /* Analytics — only when a REAL measurement ID is configured. */
    if (CFG.analyticsId) {
      var ga = document.createElement("script");
      ga.async = true; ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CFG.analyticsId);
      document.head.appendChild(ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", CFG.analyticsId);
    }
  }

  function showToast(productName) {
    var bar = $("#toastBar"); if (!bar) return;
    $("#toastText").textContent = t().toastAdded + (productName ? ": " + productName : "");
    bar.hidden = false; bar.classList.add("show");
    clearTimeout(bar._tm);
    bar._tm = setTimeout(function () { bar.classList.remove("show"); bar.hidden = true; }, 3500);
  }

  function renderCart() {
    var d = t(), cart = S.getCart();
    var entries = Object.keys(cart).map(function (id) { var p = byId(id); return p ? { p: p, qty: cart[id] } : null; }).filter(Boolean);
    var totals = S.pure.computeCartTotals(cart, products());
    var countEl = $("#cartCount"); if (countEl) countEl.textContent = totals.count;
    var box = $("#cartItems"); if (!box) return;
    if (!entries.length) {
      box.innerHTML = '<p class="muted">' + esc(d.cartEmpty) + "</p>";
    } else {
      box.innerHTML = "";
      entries.forEach(function (e) {
        var row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = "<div><div class='nm'>" + esc(pname(e.p)) + "</div>" +
          "<div class='pr'>" + esc(fmtPrice(e.p.price_sar * e.qty)) + "</div>" +
          "<div class='qty-ctrl'><button type='button' data-dec='" + e.p.id + "' aria-label='-'>−</button><span>" + e.qty + "</span>" +
          "<button type='button' data-inc='" + e.p.id + "' aria-label='+'>+</button>" +
          "<button type='button' class='remove-btn' data-rem='" + e.p.id + "'>" + esc(d.remove) + "</button></div></div>";
        box.appendChild(row);
      });
      $all("[data-inc]", box).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); c[b.getAttribute("data-inc")]++; S.setCart(c); renderCart(); }); });
      $all("[data-dec]", box).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); var id = b.getAttribute("data-dec"); c[id]--; if (c[id] <= 0) delete c[id]; S.setCart(c); renderCart(); }); });
      $all("[data-rem]", box).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); delete c[b.getAttribute("data-rem")]; S.setCart(c); renderCart(); }); });
    }
    var totalEl = $("#cartTotal");
    if (totalEl) totalEl.textContent = fmtPrice(totals.total_sar);
  }

  function bindCardButtons(root) {
    $all("[data-add]", root).forEach(function (b) {
      if (b._bound) return; b._bound = true;
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-add");
        S.addToCart(id); renderCart();
        var p = byId(id); showToast(p ? pname(p) : "");
        var old = b.textContent; b.textContent = t().addedToCart;
        setTimeout(function () { b.textContent = old; }, 1200);
      });
    });
  }

  function bindLiveSearch() {
    var input = $("#liveSearchInput"), box = $("#liveResults");
    if (!input || !box) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.hidden = true; box.innerHTML = ""; return; }
      var hits = S.pure.filterProducts(products(), { q: q }, lang).slice(0, 6);
      if (!hits.length) {
        box.innerHTML = '<p class="live-none">' + esc(t().liveEmpty) + "</p>";
      } else {
        box.innerHTML = hits.map(function (p) {
          return '<a class="live-hit" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
            '<span class="live-hit-name">' + esc(pname(p)) + "</span>" +
            '<span class="live-hit-price">' + esc(p.price_sar == null ? statusText(p) : fmtPrice(p.price_sar)) + "</span></a>";
        }).join("");
      }
      box.hidden = false;
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); window.location.href = "shop.html?q=" + encodeURIComponent(input.value.trim()); }
    });
    document.addEventListener("click", function (e) {
      if (!box.hidden && !e.target.closest(".live-search")) box.hidden = true;
    });
  }

  function applyI18n() {
    var d = t();
    document.documentElement.lang = lang;
    document.documentElement.dir = d.dir;
    document.documentElement.setAttribute("data-lang", lang);
    $all("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (d[k] != null) el.textContent = d[k];
    });
    $all("[data-i18n-ph]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-ph");
      if (d[k] != null) el.setAttribute("placeholder", d[k]);
    });
  }

  window.ZayroUI = {
    lang: function () { return lang; },
    currency: function () { return currency; },
    t: t, esc: esc, $: $, $all: $all,
    pname: pname, pdesc: pdesc, pstock: pstock, cname: cname, catName: catName,
    products: products, byId: byId, priceHTML: priceHTML, statusHTML: statusHTML, statusText: statusText,
    fmtPrice: fmtPrice, mediaHTML: mediaHTML, actionsHTML: actionsHTML, productCard: productCard,
    renderCart: renderCart, bindCardButtons: bindCardButtons, showToast: showToast
  };

  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    applyI18n();
    renderCart();
    bindLiveSearch();
    var lb = $("#langBtn");
    if (lb) lb.addEventListener("click", function () {
      lang = lang === "ar" ? "en" : "ar";
      try { localStorage.setItem("zayro_lang", lang); } catch (e) {}
      window.location.reload();
    });
    var tb = $("#themeBtn");
    if (tb) tb.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("zayro_theme", theme); } catch (e) {}
      if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      tb.textContent = theme === "dark" ? "☀️" : "🌙";
    });
    var cs = $("#currencySel");
    if (cs) cs.addEventListener("change", function () {
      currency = cs.value;
      try { localStorage.setItem("zayro_currency", currency); } catch (e) {}
      window.location.reload();
    });
    var cb = $("#cartBtn"), drawer = $("#cartDrawer"), dov = $("#drawerOverlay");
    function openCart() { if (drawer) drawer.classList.add("open"); if (dov) dov.classList.add("open"); }
    function closeCart() { if (drawer) drawer.classList.remove("open"); if (dov) dov.classList.remove("open"); }
    if (cb) cb.addEventListener("click", openCart);
    if (dov) dov.addEventListener("click", closeCart);
    var cc = $("#cartClose"); if (cc) cc.addEventListener("click", closeCart);
    var tc = $("#toastClose"); if (tc) tc.addEventListener("click", function () { var b = $("#toastBar"); if (b) { b.classList.remove("show"); b.hidden = true; } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });
    if (window.ZayroPage && window.ZayroPage.init) window.ZayroPage.init(window.ZayroUI);
  });
})();
