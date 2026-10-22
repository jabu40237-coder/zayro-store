/* ZAYRO STORE v5 — category page: products of one category from data.js
   (default sort newest first), with an honest empty state — categories with
   no supply-verified products show the explanation, never fake products. */
window.ZayroPage = {
  init: function (UI) {
    var S = window.ZayroStore;
    var key = new URLSearchParams(window.location.search).get("cat") || "";
    var cat = null;
    window.ZAYRO_CATEGORIES.forEach(function (c) { if (c.key === key) cat = c; });
    document.getElementById("catTitle").textContent = cat ? UI.cname(cat) : key;
    document.title = "ZAYRO STORE — " + (cat ? UI.cname(cat) : key);
    var list = S.pure.sortProducts(
      UI.products().filter(function (p) { return p.cats.indexOf(key) >= 0; }), "newest", UI.lang());
    var g = document.getElementById("catGrid");
    list.forEach(function (p) { g.appendChild(UI.productCard(p)); });
    UI.bindCardButtons(g);
    document.getElementById("catEmpty").style.display = list.length ? "none" : "block";
  }
};
