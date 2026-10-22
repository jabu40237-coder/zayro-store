/* ZAYRO STORE v5 — immersive product page, rendered entirely from data.js.
   Gallery slider: photo slides + the product's real marketing video +
   (only when real angle frames exist) a drag-to-rotate angle viewer +
   (only when a real GLB/USDZ model exists) a <model-viewer> 3D/AR slide —
   model-viewer's CDN script is loaded lazily at that point and never
   otherwise. Tabs: description / specifications (registry facts only) /
   shipping & returns. JSON-LD Product data carries the real price and
   availability — no ratings, no fake offers. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t();
    var id = new URLSearchParams(window.location.search).get("id") || "";
    var p = UI.byId(id);
    var body = document.getElementById("pdBody");
    if (!p) {
      body.innerHTML = '<p class="empty-msg">' + UI.esc(d.pdNotFound) + "</p>";
      return;
    }
    var name = UI.pname(p);
    document.title = "ZAYRO STORE — " + name;
    var ogImg = document.getElementById("ogImage");
    if (ogImg && p.image) ogImg.setAttribute("content", p.image);

    /* ---------- gallery slides ---------- */
    var slides = []; /* {type:"img"|"video"|"360"|"model", src} */
    (p.gallery && p.gallery.length ? p.gallery : (p.image ? [p.image] : [])).forEach(function (src) {
      slides.push({ type: "img", src: src });
    });
    if (p.video) slides.push({ type: "video", src: p.video });
    if (p.angles360 && p.angles360.length > 1) slides.push({ type: "360" });
    var hasModel = !!(p.model_glb || p.model_usdz);
    if (hasModel) slides.push({ type: "model" });

    var slideLabel = function (s) {
      return s.type === "video" ? d.viewerVideo : s.type === "360" ? d.view360 : s.type === "model" ? "3D / AR" : d.viewerPhoto;
    };
    var mainHTML, thumbsHTML = "";
    if (!slides.length) {
      mainHTML = '<div class="icon-fallback" aria-hidden="true">' + UI.esc(p.icon) + "</div>";
    } else {
      mainHTML = '<div class="gallery-main" id="galleryMain"></div>';
      if (slides.length > 1) {
        thumbsHTML = '<div class="gallery-thumbs" id="galleryThumbs">' + slides.map(function (s, i) {
          var thumb = s.type === "img" ? '<img src="' + UI.esc(s.src) + '" alt="">' :
            s.type === "video" ? '<img src="' + UI.esc(p.image || "") + '" alt="">' : "";
          return '<button type="button" class="gthumb' + (i === 0 ? " active" : "") + '" data-slide="' + i + '">' +
            thumb + '<span class="gthumb-label">' + UI.esc(slideLabel(s)) + "</span></button>";
        }).join("") + "</div>";
      }
    }

    var cats = p.cats.map(function (k) {
      return '<a href="category.html?cat=' + encodeURIComponent(k) + '">' + UI.esc(UI.catName(k)) + "</a>";
    }).join(" · ");

    var specsRows = (p.specs || []).map(function (s) {
      var key = { type: d.specType, delivery: d.specDelivery, billing: d.specBilling, supply: d.specSupply }[s.k] || s.k;
      return "<tr><td>" + UI.esc(key) + "</td><td>" + UI.esc(UI.lang() === "ar" ? s.v_ar : s.v_en) + "</td></tr>";
    }).join("");

    body.innerHTML =
      '<div class="pd-grid"><div class="gallery">' + mainHTML + thumbsHTML + "</div>" +
      '<div class="pd-info">' + UI.statusHTML(p) +
      "<h1>" + UI.esc(name) + "</h1>" +
      '<p class="card-desc">' + UI.esc(UI.pdesc(p)) + "</p>" +
      '<div class="pd-price-row">' + UI.priceHTML(p) + "</div>" +
      (UI.currency() !== "SAR" && p.price_sar != null ? '<p class="approx-note">' + UI.esc(d.approxNote) + "</p>" : "") +
      '<table class="pd-meta">' +
        "<tr><td>" + UI.esc(d.pdStatus) + "</td><td>" + UI.esc(UI.pstock(p)) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.pdCategory) + "</td><td>" + cats + "</td></tr>" +
      "</table>" +
      '<div class="pd-actions">' + UI.actionsHTML(p) + "</div>" +
      '<div class="tabs"><div class="tab-btns" role="tablist">' +
        '<button type="button" class="tab-btn active" data-tab="desc">' + UI.esc(d.tabDesc) + "</button>" +
        '<button type="button" class="tab-btn" data-tab="specs">' + UI.esc(d.tabSpecs) + "</button>" +
        '<button type="button" class="tab-btn" data-tab="ship">' + UI.esc(d.tabShip) + "</button>" +
      "</div>" +
      '<div class="tab-panel" data-panel="desc">' + UI.esc(UI.pdesc(p)) + "</div>" +
      '<div class="tab-panel" data-panel="specs" hidden><table class="pd-meta">' + specsRows + "</table></div>" +
      '<div class="tab-panel" data-panel="ship" hidden>' + UI.esc(d.pdShipText) +
        ' <a href="shipping.html">' + UI.esc(d.polShipping) + "</a> · " +
        '<a href="returns.html">' + UI.esc(d.polReturns) + "</a></div>" +
      "</div></div></div>";
    UI.bindCardButtons(body);

    /* ---------- gallery behaviour ---------- */
    var main = document.getElementById("galleryMain");
    var viewer360 = null;
    function renderSlide(i) {
      if (!main) return;
      var s = slides[i];
      UI.$all(".gthumb", body).forEach(function (b) { b.classList.toggle("active", +b.getAttribute("data-slide") === i); });
      if (s.type === "img") main.innerHTML = '<img src="' + UI.esc(s.src) + '" alt="' + UI.esc(name) + '">';
      else if (s.type === "video") main.innerHTML = '<video controls preload="metadata" src="' + UI.esc(s.src) + '"></video>';
      else if (s.type === "360") {
        main.innerHTML = '<div id="pd360"></div>';
        viewer360 = window.ZayroViewer.Viewer360(document.getElementById("pd360"), p.angles360, { alt: name, hint: d.dragHint });
      } else if (s.type === "model") {
        main.innerHTML = "";
        var mv = window.ZayroViewer.buildModelViewer(p, window.ZAYRO_CONFIG);
        if (mv) main.appendChild(mv);
      }
    }
    if (slides.length) renderSlide(0);
    UI.$all(".gthumb", body).forEach(function (b) {
      b.addEventListener("click", function () { renderSlide(+b.getAttribute("data-slide")); });
    });

    /* ---------- tabs ---------- */
    UI.$all(".tab-btn", body).forEach(function (b) {
      b.addEventListener("click", function () {
        UI.$all(".tab-btn", body).forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        UI.$all(".tab-panel", body).forEach(function (pn) { pn.hidden = pn.getAttribute("data-panel") !== b.getAttribute("data-tab"); });
      });
    });

    /* ---------- structured data (real price/availability only) ---------- */
    var ld = {
      "@context": "https://schema.org", "@type": "Product",
      name: name, description: UI.pdesc(p),
      image: p.image || undefined,
      offers: {
        "@type": "Offer", priceCurrency: "SAR", price: p.price_sar == null ? undefined : p.price_sar,
        availability: p.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: window.location.href
      }
    };
    var sTag = document.createElement("script");
    sTag.type = "application/ld+json"; sTag.textContent = JSON.stringify(ld);
    document.head.appendChild(sTag);

    /* ---------- similar products (same category) ---------- */
    var rel = UI.products().filter(function (x) {
      return x.id !== p.id && x.cats.some(function (k) { return p.cats.indexOf(k) >= 0; });
    }).slice(0, 4);
    var rg = document.getElementById("relatedGrid");
    rel.forEach(function (x) { rg.appendChild(UI.productCard(x)); });
    UI.bindCardButtons(rg);
  }
};
