/* ZAYRO STORE v3 — shared UI: header/footer injection, language, product cards,
   cart drawer. No secrets, no backend calls. A payment is NEVER treated as
   verified by this front-end (see PAYMENTS.md / backend/). */
(function () {
  "use strict";
  var S = window.ZayroStore;
  var lang = localStorage.getItem("zayro_lang") || "ar";
  if (!window.ZAYRO_I18N[lang]) lang = "ar";

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

  function priceHTML(p) {
    var d = t();
    return '<span class="price">' + p.price_sar + " " + (lang === "ar" ? "ر.س" : "SAR") + "</span>" +
      '<span class="price-note">' + esc(p.billing === "monthly" ? d.perMonth : d.oneTime) + "</span>" +
      '<span class="usd-ref">≈ $' + p.price_usd + " · " + esc(d.usdRef) + "</span>";
  }
  function badgeHTML(p) {
    var d = t();
    if (p.status === "available") return '<span class="badge">' + esc(d.badgeDigital) + "</span>";
    if (p.status === "notify") return '<span class="badge soon">' + esc(d.badgeSoon) + "</span>";
    return '<span class="badge na">' + esc(d.badgeNA) + "</span>";
  }
  function mediaHTML(p, cls) {
    if (p.image) return '<div class="' + cls + '"><img src="' + esc(p.image) + '" alt="' + esc(pname(p)) + '" loading="lazy"></div>';
    return '<div class="' + cls + ' icon-fallback" aria-hidden="true">' + esc(p.icon) + "</div>";
  }
  function actionsHTML(p) {
    var d = t();
    var wish = S.getWishlist().indexOf(p.id) >= 0;
    var h = '<div class="card-actions">';
    if (p.status === "available") {
      h += '<a class="buy" href="' + esc(p.payment_link) + '" target="_blank" rel="noopener">' + esc(d.buyNow) + "</a>" +
           '<button class="add-cart" type="button" data-add="' + esc(p.id) + '">' + esc(d.addCart) + "</button>";
    } else if (p.status === "notify") {
      h += '<a class="notify" href="' + esc(p.notify_link) + '" target="_blank" rel="noopener">' + esc(d.notify) + "</a>";
    } else {
      h += '<a class="notify" href="' + esc(p.notify_link) + '" target="_blank" rel="noopener">' + esc(d.notifyDM) + "</a>";
    }
    h += '<a class="details-btn" href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(d.details) + "</a>" +
         '<button class="wish-btn' + (wish ? " on" : "") + '" type="button" data-wish="' + esc(p.id) + '" aria-label="' + esc(d.addWish) + '">♥</button></div>';
    return h;
  }
  function productCard(p) {
    var card = document.createElement("article");
    card.className = "product tilt";
    card.innerHTML = badgeHTML(p) + mediaHTML(p, "card-media") +
      "<h3>" + esc(pname(p)) + "</h3><p>" + esc(pdesc(p)) + "</p>" +
      '<div class="price-row">' + priceHTML(p) + "</div>" + actionsHTML(p);
    return card;
  }

  function buildChrome() {
    var d = t();
    var header = $("#siteHeader");
    if (header) {
      header.innerHTML =
      '<div class="wrap nav">' +
        '<a class="brand" href="index.html" aria-label="ZAYRO STORE"><span class="brand-mark" aria-hidden="true">Z</span>' +
        '<span class="brand-text"><b>ZAYRO</b><span>' + esc(d.brandTag) + "</span></span></a>" +
        '<nav class="nav-links" aria-label="Main">' +
          '<a href="index.html">' + esc(d.navHome) + "</a>" +
          '<a href="index.html#cats">' + esc(d.navCats) + "</a>" +
          '<a href="index.html#products">' + esc(d.navProducts) + "</a>" +
          '<a href="track.html">' + esc(d.navTrack) + "</a>" +
          '<a href="index.html#how">' + esc(d.navHow) + "</a>" +
        "</nav>" +
        '<div class="nav-actions">' +
          '<button class="lang-btn" id="langBtn" type="button" aria-label="Switch language">' + esc(d.langName) + "</button>" +
          '<a class="cart-btn" href="cart.html">♥<span class="cart-count" id="wishCount">0</span></a>' +
          '<button class="cart-btn" id="cartBtn" type="button">' + esc(d.cart) + '<span class="cart-count" id="cartCount">0</span></button>' +
        "</div></div>";
    }
    var footer = $("#siteFooter");
    if (footer) {
      var catLinks = window.ZAYRO_CATEGORIES.slice(0, 6).map(function (c) {
        return '<a href="category.html?cat=' + encodeURIComponent(c.key) + '">' + esc(cname(c)) + "</a>";
      }).join("");
      footer.innerHTML =
      '<div class="wrap"><div class="foot">' +
        '<div class="col" style="max-width:320px">' +
          '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">Z</span><span class="brand-text"><b>ZAYRO</b><span>' + esc(d.brandTag) + "</span></span></a>" +
          '<p style="color:var(--muted);font-size:14.5px;margin-top:12px">' + esc(d.footAbout) + "</p>" +
          '<p style="color:var(--gold);letter-spacing:3px;font-size:12px;font-weight:700;margin-top:10px">EVERYTHING YOU WANT. ONE PLACE.</p></div>' +
        '<div class="col"><h4>' + esc(d.footShop) + "</h4>" + catLinks + "</div>" +
        '<div class="col"><h4>' + esc(d.footPolicies) + "</h4>" +
          '<a href="shipping.html">' + esc(d.polShipping) + "</a>" +
          '<a href="returns.html">' + esc(d.polReturns) + "</a>" +
          '<a href="privacy.html">' + esc(d.polPrivacy) + "</a>" +
          '<a href="terms.html">' + esc(d.polTerms) + "</a></div>" +
        '<div class="col"><h4>' + esc(d.footHelp) + "</h4>" +
          '<a href="track.html">' + esc(d.navTrack) + "</a>" +
          '<a href="cart.html">' + esc(d.cartTitle) + "</a>" +
          '<div class="socials">' +
            '<a href="https://www.tiktok.com/@aiuhkot" target="_blank" rel="noopener">TikTok · @aiuhkot</a>' +
            '<a href="https://www.instagram.com/aiuhkot" target="_blank" rel="noopener">Instagram · @aiuhkot</a>' +
            '<a href="https://ig.me/m/aiuhkot" target="_blank" rel="noopener">Instagram DM</a>' +
          "</div></div>" +
      '</div><div class="copy">' + esc(d.rights) + "</div></div>";
    }
    /* Cart drawer */
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="drawer-overlay" id="drawerOverlay"></div>' +
      '<aside class="cart-drawer" id="cartDrawer" aria-label="Cart">' +
        '<button class="close-x" type="button" id="cartClose" aria-label="×">×</button>' +
        "<h3>" + esc(d.cart) + "</h3>" +
        '<div class="cart-items" id="cartItems"></div>' +
        '<div class="cart-total"><span>' + esc(d.total) + '</span><span id="cartTotal">0</span></div>' +
        '<p class="cart-note">' + esc(d.cartNote) + "</p>" +
        '<a class="pay-link" href="checkout.html">' + esc(d.checkoutBtn) + "</a>" +
      "</aside>";
    document.body.appendChild(wrap);
  }

  function renderCart() {
    var d = t(), cart = S.getCart();
    var entries = Object.keys(cart).map(function (id) { var p = byId(id); return p ? { p: p, qty: cart[id] } : null; }).filter(Boolean);
    var totals = S.pure.computeCartTotals(cart, products());
    var countEl = $("#cartCount"); if (countEl) countEl.textContent = totals.count;
    var wishEl = $("#wishCount"); if (wishEl) wishEl.textContent = S.getWishlist().length;
    var box = $("#cartItems"); if (!box) return;
    if (!entries.length) {
      box.innerHTML = '<p style="color:var(--muted)">' + esc(d.cartEmpty) + "</p>";
    } else {
      box.innerHTML = "";
      entries.forEach(function (e) {
        var row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = "<div><div class='nm'>" + esc(pname(e.p)) + "</div>" +
          "<div class='pr'>" + (e.p.price_sar * e.qty) + " " + (lang === "ar" ? "ر.س" : "SAR") + "</div>" +
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
    if (totalEl) totalEl.textContent = totals.total_sar + " " + (lang === "ar" ? "ر.س" : "SAR");
  }

  function bindCardButtons(root) {
    $all("[data-add]", root).forEach(function (b) {
      if (b._bound) return; b._bound = true;
      b.addEventListener("click", function () {
        S.addToCart(b.getAttribute("data-add")); renderCart();
        var old = b.textContent; b.textContent = t().addedToCart;
        setTimeout(function () { b.textContent = old; }, 1200);
      });
    });
    $all("[data-wish]", root).forEach(function (b) {
      if (b._bound) return; b._bound = true;
      b.addEventListener("click", function () {
        S.toggleWish(b.getAttribute("data-wish"));
        b.classList.toggle("on"); renderCart();
      });
    });
  }
  function bindTilt(root) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $all(".tilt", root).forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateY(" + (x * 6) + "deg) rotateX(" + (-y * 6) + "deg) translateY(-3px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
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
    t: t, esc: esc, $: $, $all: $all,
    pname: pname, pdesc: pdesc, pstock: pstock, cname: cname, catName: catName,
    products: products, byId: byId, priceHTML: priceHTML, badgeHTML: badgeHTML,
    mediaHTML: mediaHTML, actionsHTML: actionsHTML, productCard: productCard,
    renderCart: renderCart, bindCardButtons: bindCardButtons, bindTilt: bindTilt
  };

  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    applyI18n();
    renderCart();
    var lb = $("#langBtn");
    if (lb) lb.addEventListener("click", function () {
      lang = lang === "ar" ? "en" : "ar";
      localStorage.setItem("zayro_lang", lang);
      window.location.reload();
    });
    var cb = $("#cartBtn"), drawer = $("#cartDrawer"), dov = $("#drawerOverlay");
    function openCart() { drawer.classList.add("open"); dov.classList.add("open"); }
    function closeCart() { drawer.classList.remove("open"); dov.classList.remove("open"); }
    if (cb) cb.addEventListener("click", openCart);
    if (dov) dov.addEventListener("click", closeCart);
    var cc = $("#cartClose"); if (cc) cc.addEventListener("click", closeCart);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });
    if (window.ZayroPage && window.ZayroPage.init) window.ZayroPage.init(window.ZayroUI);
  });
})();
