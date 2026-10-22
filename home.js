/* ZAYRO STORE v3 — homepage logic: category grid, featured, teaser, all-products
   with search / status filter / sorting, notify form. Honors the admin
   prototype's homepage toggles (ZayroStore.homeFlags). */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var flags = S.homeFlags();
    if (!flags.featured) { var fs = document.getElementById("featured"); if (fs) fs.style.display = "none"; }
    if (!flags.newsec) { var ns = document.getElementById("newsec"); if (ns) ns.style.display = "none"; }
    if (!flags.how) { var hs = document.getElementById("how"); if (hs) hs.style.display = "none"; }

    /* Category grid */
    var cg = document.getElementById("catGrid");
    if (cg) {
      window.ZAYRO_CATEGORIES.forEach(function (c) {
        var n = UI.products().filter(function (p) { return p.cats.indexOf(c.key) >= 0; }).length;
        var a = document.createElement("a");
        a.className = "cat-card";
        a.href = "category.html?cat=" + encodeURIComponent(c.key);
        a.innerHTML = '<div class="ci" aria-hidden="true">' + UI.esc(c.icon) + "</div><h3>" + UI.esc(UI.cname(c)) + "</h3><p>" +
          (n > 0 ? n + " " + (UI.lang() === "ar" ? "منتج" : "product(s)") : UI.esc(d.badgeSoon)) + "</p>";
        cg.appendChild(a);
      });
    }

    /* Featured: the available (digital, own) products */
    var fg = document.getElementById("featuredGrid");
    if (fg) {
      UI.products().filter(function (p) { return p.status === "available"; })
        .forEach(function (p) { fg.appendChild(UI.productCard(p)); });
      UI.bindCardButtons(fg); UI.bindTilt(fg);
    }

    /* New: washer teaser (candidate, not for sale, no price) */
    var tc = document.getElementById("teaserCard");
    if (tc) {
      var tz = window.ZAYRO_TEASER;
      tc.innerHTML = '<span class="badge soon" style="position:static">' + UI.esc(d.teaserBadge) + "</span>" +
        "<h3 style='font-size:24px;margin-top:12px'>" + UI.esc(UI.lang() === "ar" ? tz.name_ar : tz.name_en) + "</h3>" +
        "<p style='color:var(--muted)'>" + UI.esc(UI.lang() === "ar" ? tz.desc_ar : tz.desc_en) + "</p>" +
        '<video controls preload="metadata" src="' + UI.esc(tz.video) + '"></video>' +
        '<div class="card-actions" style="justify-content:center">' +
        '<a class="notify" href="' + UI.esc(tz.reel_url) + '" target="_blank" rel="noopener">' + UI.esc(d.teaserWatch) + "</a>" +
        '<a class="notify" href="' + UI.esc(tz.notify_link) + '" target="_blank" rel="noopener">' + UI.esc(d.notify) + "</a></div>";
    }

    /* All products: search + status filter + sort */
    var grid = document.getElementById("grid"), empty = document.getElementById("emptyMsg");
    var si = document.getElementById("searchInput"), sf = document.getElementById("statusFilter"), so = document.getElementById("sortSel");
    function render() {
      var q = (si.value || "").trim().toLowerCase();
      var st = sf.value, sort = so.value;
      var list = UI.products().filter(function (p) {
        var stOk = st === "all" || p.status === st;
        var qOk = !q || (p.name_ar + " " + p.name_en + " " + p.desc_ar + " " + p.desc_en).toLowerCase().indexOf(q) !== -1;
        return stOk && qOk;
      });
      if (sort === "asc") list.sort(function (a, b) { return a.price_sar - b.price_sar; });
      if (sort === "desc") list.sort(function (a, b) { return b.price_sar - a.price_sar; });
      if (sort === "name") list.sort(function (a, b) { return UI.pname(a).localeCompare(UI.pname(b)); });
      grid.innerHTML = "";
      list.forEach(function (p) { grid.appendChild(UI.productCard(p)); });
      empty.style.display = list.length ? "none" : "block";
      UI.bindCardButtons(grid); UI.bindTilt(grid);
    }
    if (grid) {
      si.addEventListener("input", render);
      sf.addEventListener("change", render);
      so.addEventListener("change", render);
      render();
    }
    var hsf = document.getElementById("heroSearch");
    if (hsf) hsf.addEventListener("submit", function (e) {
      e.preventDefault();
      si.value = document.getElementById("heroSearchInput").value;
      render();
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    });

    /* Notify form (same validated behaviour as v2, stored locally only) */
    var sel = document.getElementById("nfProduct");
    if (sel) {
      UI.products().filter(function (p) { return p.status !== "available"; }).forEach(function (p) {
        var o = document.createElement("option"); o.value = p.id; o.textContent = UI.pname(p); sel.appendChild(o);
      });
    }
    var form = document.getElementById("notifyForm");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("formMsg");
      var name = document.getElementById("nfName").value.trim(), contact = document.getElementById("nfContact").value;
      msg.className = "form-msg";
      if (name.length < 2) { msg.textContent = d.errName; msg.classList.add("err"); return; }
      if (!S.pure.validateContact(contact)) { msg.textContent = d.errContact; msg.classList.add("err"); return; }
      var leads = [];
      try { leads = JSON.parse(localStorage.getItem("zayro_notify") || "[]"); } catch (err) { leads = []; }
      leads.push({ name: name, contact: contact.trim(), product: sel ? sel.value : "", at: new Date().toISOString() });
      localStorage.setItem("zayro_notify", JSON.stringify(leads));
      msg.textContent = d.okForm; msg.classList.add("ok");
      form.reset();
    });
  }
};
