/* ZAYRO STORE v3 — product detail page, rendered entirely from data.js
   (registry truth). Shows the real product image and promo video when they
   exist, exact SAR price (+ USD as labelled reference), registry availability
   text, policy links and same-category related products. No invented
   variants, specs, ratings or delivery promises. */
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
    document.title = "ZAYRO STORE — " + UI.pname(p);
    var media = "";
    if (p.image) media += '<img src="' + UI.esc(p.image) + '" alt="' + UI.esc(UI.pname(p)) + '">';
    else media += '<div class="icon-fallback" aria-hidden="true">' + UI.esc(p.icon) + "</div>";
    if (p.video) media += '<h3 style="margin-top:18px;color:var(--gold-light)">' + UI.esc(d.pdVideo) + '</h3><video controls preload="metadata" src="' + UI.esc(p.video) + '"></video>';

    var cats = p.cats.map(function (k) {
      return '<a href="category.html?cat=' + encodeURIComponent(k) + '">' + UI.esc(UI.catName(k)) + "</a>";
    }).join(" · ");

    body.innerHTML =
      '<div class="pd-grid"><div class="pd-media">' + media + "</div>" +
      "<div>" + UI.badgeHTML(p) +
      '<h1 style="font-size:clamp(26px,4vw,36px);font-weight:900;margin:14px 0 10px">' + UI.esc(UI.pname(p)) + "</h1>" +
      '<p style="color:var(--muted)">' + UI.esc(UI.pdesc(p)) + "</p>" +
      '<div class="price-row" style="margin-top:16px">' + UI.priceHTML(p) + "</div>" +
      '<table class="pd-meta">' +
        "<tr><td>" + UI.esc(d.pdStatus) + "</td><td>" + UI.esc(UI.pstock(p)) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.pdCategory) + "</td><td>" + cats + "</td></tr>" +
        "<tr><td>" + UI.esc(d.pdShipNote) + "</td><td>" + UI.esc(d.pdShipText) +
          ' <a href="shipping.html" style="color:var(--gold-light)">' + UI.esc(d.polShipping) + "</a> · " +
          '<a href="returns.html" style="color:var(--gold-light)">' + UI.esc(d.polReturns) + "</a></td></tr>" +
      "</table>" +
      UI.actionsHTML(p) +
      "</div></div>";
    UI.bindCardButtons(body);

    var rel = UI.products().filter(function (x) {
      return x.id !== p.id && x.cats.some(function (k) { return p.cats.indexOf(k) >= 0; });
    });
    var rg = document.getElementById("relatedGrid");
    rel.forEach(function (x) { rg.appendChild(UI.productCard(x)); });
    UI.bindCardButtons(rg); UI.bindTilt(rg);
  }
};
