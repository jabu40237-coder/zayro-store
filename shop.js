/* ZAYRO STORE v5 — shop grid: LIVE search (filters as you type), category /
   status / price-range filters, sorting (default: newest first). All logic
   runs through the pure helpers in store.js so it is unit-tested. */
window.ZayroPage = {
  init: function (UI) {
    var S = window.ZayroStore;
    var q = new URLSearchParams(window.location.search);
    var catSel = document.getElementById("catFilter");
    var allOpt = document.createElement("option");
    allOpt.value = "all"; allOpt.textContent = UI.t().stAll; catSel.appendChild(allOpt);
    window.ZAYRO_CATEGORIES.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c.key; o.textContent = UI.cname(c); catSel.appendChild(o);
    });
    if (q.get("cat")) catSel.value = q.get("cat");
    var search = document.getElementById("shopSearch");
    if (q.get("q")) search.value = q.get("q");

    function render() {
      var f = {
        q: search.value,
        cat: catSel.value,
        status: document.getElementById("statusFilter").value,
        price: document.getElementById("priceFilter").value
      };
      var list = S.pure.filterProducts(UI.products(), f, UI.lang());
      list = S.pure.sortProducts(list, document.getElementById("sortSel").value, UI.lang());
      var g = document.getElementById("shopGrid");
      g.innerHTML = "";
      list.forEach(function (p) { g.appendChild(UI.productCard(p)); });
      UI.bindCardButtons(g);
      document.getElementById("shopEmpty").style.display = list.length ? "none" : "block";
    }
    search.addEventListener("input", render); /* live search while typing */
    ["catFilter", "statusFilter", "priceFilter", "sortSel"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", render);
    });
    render();
  }
};
