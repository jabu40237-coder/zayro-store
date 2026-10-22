/* ZAYRO STORE v3 — category view: products of one category with search,
   status filter and sorting. Empty categories show the honest "coming soon"
   state — never invented products. */
window.ZayroPage = {
  init: function (UI) {
    var params = new URLSearchParams(window.location.search);
    var key = params.get("cat") || "";
    var cat = null;
    window.ZAYRO_CATEGORIES.forEach(function (c) { if (c.key === key) cat = c; });
    var title = document.getElementById("catTitle");
    if (cat) { title.textContent = UI.cname(cat); document.title = "ZAYRO STORE — " + UI.cname(cat); }
    else { title.textContent = key || "—"; }

    var grid = document.getElementById("grid"), empty = document.getElementById("emptyMsg"), catEmpty = document.getElementById("catEmpty");
    var si = document.getElementById("searchInput"), sf = document.getElementById("statusFilter"), so = document.getElementById("sortSel");
    var inCat = UI.products().filter(function (p) { return p.cats.indexOf(key) >= 0; });

    function render() {
      var q = (si.value || "").trim().toLowerCase();
      var st = sf.value, sort = so.value;
      var list = inCat.filter(function (p) {
        var stOk = st === "all" || p.status === st;
        var qOk = !q || (p.name_ar + " " + p.name_en + " " + p.desc_ar + " " + p.desc_en).toLowerCase().indexOf(q) !== -1;
        return stOk && qOk;
      });
      if (sort === "asc") list.sort(function (a, b) { return a.price_sar - b.price_sar; });
      if (sort === "desc") list.sort(function (a, b) { return b.price_sar - a.price_sar; });
      if (sort === "name") list.sort(function (a, b) { return UI.pname(a).localeCompare(UI.pname(b)); });
      grid.innerHTML = "";
      list.forEach(function (p) { grid.appendChild(UI.productCard(p)); });
      catEmpty.style.display = inCat.length === 0 ? "block" : "none";
      empty.style.display = (inCat.length > 0 && list.length === 0) ? "block" : "none";
      UI.bindCardButtons(grid); UI.bindTilt(grid);
    }
    si.addEventListener("input", render);
    sf.addEventListener("change", render);
    so.addEventListener("change", render);
    render();
  }
};
