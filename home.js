/* ZAYRO STORE v5 — homepage. Every section renders from data.js.
   Section sources (all data-driven, no invented claims):
   - Trending picks: the catalog in registry order ("store picks" — never
     labelled as sales/best-sellers; there is no sales data).
   - Offers: the products that are actually purchasable now (status
     "available") at their true registry prices — no discounts invented.
   - New in: teaser (candidate, no price) + newest-listed products.
   - Picked for you: the full catalog, default sort (newest first).
   - Experience: the interactive angle viewer for the first product that
     has real angles360 frames; the section hides itself if none exist.
   - Reviews: rendered ONLY when ZAYRO_REVIEWS has real entries. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var all = UI.products();
    var flags = S.homeFlags();

    /* Hero imagery: the store's flagship digital product image. */
    var heroP = UI.byId("ZY-MEMBER") || all[0];
    if (heroP && heroP.image) document.getElementById("heroImg").src = heroP.image;

    /* Category circular strip */
    var strip = document.getElementById("catStrip");
    strip.innerHTML = window.ZAYRO_CATEGORIES.map(function (c) {
      return '<a class="cat-circle" href="category.html?cat=' + encodeURIComponent(c.key) + '">' +
        '<span class="ring" aria-hidden="true">' + UI.esc(c.icon) + "</span><span>" + UI.esc(UI.cname(c)) + "</span></a>";
    }).join("");

    function fill(id, list) {
      var g = document.getElementById(id); if (!g) return;
      g.innerHTML = "";
      list.forEach(function (p) { g.appendChild(UI.productCard(p)); });
      UI.bindCardButtons(g);
    }

    /* Trending picks — registry order (data array order), labelled as picks. */
    fill("trendingGrid", all);

    /* Offers — only actually purchasable products, real prices. */
    var offersSec = document.getElementById("offers");
    if (!flags.featured) { offersSec.style.display = "none"; }
    else fill("offersGrid", all.filter(function (p) { return p.status === "available"; }));

    /* New in — teaser card + newest-listed products. */
    var newSec = document.getElementById("newsec");
    if (!flags.newsec) { newSec.style.display = "none"; }
    else {
      var tz = window.ZAYRO_TEASER;
      document.getElementById("teaserCard").innerHTML =
        '<video controls preload="metadata" src="' + UI.esc(tz.video) + '" poster="' + UI.esc(tz.image) + '"></video>' +
        '<div class="teaser-body"><span class="teaser-badge">' + UI.esc(d.teaserBadge) + "</span>" +
        "<h3>" + UI.esc(UI.lang() === "ar" ? tz.name_ar : tz.name_en) + "</h3>" +
        "<p>" + UI.esc(UI.lang() === "ar" ? tz.desc_ar : tz.desc_en) + "</p>" +
        '<div class="hero-actions"><a class="btn btn-navy" href="' + UI.esc(tz.reel_url) + '" target="_blank" rel="noopener">' + UI.esc(d.teaserWatch) + "</a>" +
        '<a class="btn btn-ghost" href="' + UI.esc(tz.notify_link) + '" target="_blank" rel="noopener">' + UI.esc(d.notify) + "</a></div></div>";
      fill("newGrid", S.pure.sortProducts(all, "newest", UI.lang()).slice(0, 4));
    }

    /* Interactive experience — first product with real angle frames. */
    var expSec = document.getElementById("experience");
    var expP = null;
    for (var i = 0; i < all.length; i++) if (all[i].angles360 && all[i].angles360.length > 1) { expP = all[i]; break; }
    if (!expP && window.ZAYRO_TEASER.angles360 && window.ZAYRO_TEASER.angles360.length > 1) {
      expP = { id: null, name_ar: window.ZAYRO_TEASER.name_ar, name_en: window.ZAYRO_TEASER.name_en, angles360: window.ZAYRO_TEASER.angles360 };
    }
    if (expP && window.ZayroViewer) {
      window.ZayroViewer.Viewer360(document.getElementById("view3dMount"), expP.angles360, {
        alt: UI.pname(expP), hint: d.dragHint + " · " + d.view360
      });
      var link = document.getElementById("view3dLink");
      link.textContent = UI.pname(expP) + " — " + d.details;
      link.href = expP.id ? "product.html?id=" + encodeURIComponent(expP.id) : window.ZAYRO_TEASER.reel_url;
    } else if (expSec) { expSec.style.display = "none"; }

    /* Picked for you — full catalog, default (newest) sort. */
    fill("forYouGrid", S.pure.sortProducts(all, "newest", UI.lang()));

    /* Reviews — only when real review data exists. */
    var reviews = window.ZAYRO_REVIEWS || [];
    if (reviews.length) {
      var sec = document.getElementById("reviewsSec");
      sec.hidden = false;
      document.getElementById("reviewsGrid").innerHTML = reviews.map(function (r) {
        var p = UI.byId(r.product);
        return '<div class="review-card"><p class="who">' + UI.esc(r.name) + "</p>" +
          (p ? '<p class="muted">' + UI.esc(UI.pname(p)) + "</p>" : "") +
          "<p>" + UI.esc(UI.lang() === "ar" ? r.text_ar : r.text_en) + "</p></div>";
      }).join("");
    }

    /* FAQ — first four questions as an accordion. */
    document.getElementById("faqList").innerHTML = [1, 2, 3, 4].map(function (n) {
      return '<details class="faq-item"><summary>' + UI.esc(d["faqQ" + n]) + "</summary><p>" + UI.esc(d["faqA" + n]) + "</p></details>";
    }).join("");

    /* How-to section toggle (admin prototype flag). */
    if (!flags.how) document.getElementById("how").style.display = "none";

    /* Notify form — local record only (labelled as such in the UI). */
    var sel = document.getElementById("nfProduct");
    all.filter(function (p) { return p.status !== "available"; }).forEach(function (p) {
      var o = document.createElement("option");
      o.value = p.id; o.textContent = UI.pname(p); sel.appendChild(o);
    });
    document.getElementById("notifyForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("formMsg");
      msg.className = "form-msg";
      var contact = document.getElementById("nfContact").value;
      if (!S.pure.validateContact(contact)) { msg.textContent = d.errContact; msg.classList.add("err"); return; }
      var recs = [];
      try { recs = JSON.parse(localStorage.getItem("zayro_notify") || "[]"); } catch (e2) {}
      recs.push({ name: document.getElementById("nfName").value, contact: contact, product: sel.value, at: new Date().toISOString() });
      try { localStorage.setItem("zayro_notify", JSON.stringify(recs)); } catch (e3) {}
      msg.textContent = d.okForm; msg.classList.add("ok");
    });
  }
};
