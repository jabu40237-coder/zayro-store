/* ZAYRO STORE v3 — admin PROTOTYPE logic.
   *** NOT SECURE — NO SERVER AUTHENTICATION. ***
   Everything here runs in the visitor's browser: product edits live in a
   localStorage override layer (zayro_admin_override) on top of data.js,
   orders are the local checkout records, coupons are local experiments.
   Production admin requires the backend phase with real authentication —
   see FEATURES.md and the hardcoded banner in admin.html. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var cur = UI.lang() === "ar" ? "ر.س" : "SAR";
    function read(key, fb) { try { var v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fb : v; } catch (e) { return fb; } }
    function write(key, v) { localStorage.setItem(key, JSON.stringify(v)); }
    function getOverride() { return read("zayro_admin_override", { added: [], edited: {}, removed: [] }); }
    function setOverride(o) { write("zayro_admin_override", o); }

    /* Tabs */
    UI.$all("[data-tab]").forEach(function (b) {
      b.addEventListener("click", function () {
        UI.$all("[data-tab]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        ["products", "orders", "coupons", "home", "summary"].forEach(function (k) {
          document.getElementById("tab-" + k).style.display = k === b.getAttribute("data-tab") ? "block" : "none";
        });
        renderAll();
      });
    });

    function renderProducts() {
      var box = document.getElementById("adminProductList");
      var rows = S.getProducts().map(function (p) {
        return "<tr><td>" + UI.esc(p.id) + "</td><td>" + UI.esc(UI.pname(p)) + "</td>" +
          "<td><input type='number' min='0' step='1' value='" + p.price_sar + "' data-price='" + UI.esc(p.id) + "' style='width:90px;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--ink-3);color:var(--cream)'></td>" +
          "<td><span class='pill " + (p.status === "available" ? "ok" : "warn") + "'>" + UI.esc(p.status) + "</span></td>" +
          "<td><button type='button' class='remove-btn' data-save='" + UI.esc(p.id) + "' style='color:var(--gold-light)'>" + UI.esc(d.adminSave) + "</button> · " +
          "<button type='button' class='remove-btn' data-del='" + UI.esc(p.id) + "'>" + UI.esc(d.adminDelete) + "</button></td></tr>";
      }).join("");
      box.innerHTML = '<table class="data"><tr><th>ID</th><th>' + UI.esc(d.adminColName) + "</th><th>" + UI.esc(d.adminColPrice) +
        "</th><th>" + UI.esc(d.adminColStatus) + "</th><th>" + UI.esc(d.adminColActions) + "</th></tr>" + rows + "</table>";
      UI.$all("[data-save]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-save");
          var inp = box.querySelector("[data-price='" + id + "']");
          var o = getOverride();
          o.edited[id] = o.edited[id] || {};
          o.edited[id].price_sar = Math.max(0, parseInt(inp.value, 10) || 0);
          setOverride(o); renderAll();
        });
      });
      UI.$all("[data-del]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-del"), o = getOverride();
          o.added = o.added.filter(function (p) { return p.id !== id; });
          if (window.ZAYRO_PRODUCTS.some(function (p) { return p.id === id; }) && o.removed.indexOf(id) === -1) o.removed.push(id);
          setOverride(o); renderAll();
        });
      });
    }

    function renderOrders() {
      var box = document.getElementById("adminOrders");
      var orders = S.getOrders();
      if (!orders.length) { box.innerHTML = '<p class="empty-msg">' + UI.esc(d.adminOrdersEmpty) + "</p>"; return; }
      var statuses = ["pending", "paid", "supplier_pending", "shipped", "delivered", "failed", "expired", "refunded"];
      var rows = orders.map(function (o, i) {
        var opts = statuses.map(function (s) { return "<option value='" + s + "'" + (o.status === s ? " selected" : "") + ">" + s + "</option>"; }).join("");
        return "<tr><td>" + UI.esc(o.id) + "</td><td>" + UI.esc(o.customer && o.customer.name || "") + "</td><td>" +
          o.total_sar + " " + cur + "</td><td>" + UI.esc(o.payment) + "</td><td>" + UI.esc(o.created_at) + "</td>" +
          "<td><select data-ostatus='" + i + "' style='padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--ink-3);color:var(--cream)'>" + opts + "</select></td></tr>";
      }).join("");
      box.innerHTML = '<table class="data"><tr><th>' + UI.esc(d.adminColOrder) + "</th><th>" + UI.esc(d.adminColCustomer) + "</th><th>" +
        UI.esc(d.adminColTotal) + "</th><th>" + UI.esc(d.adminColPay) + "</th><th>" + UI.esc(d.adminColDate) + "</th><th>" +
        UI.esc(d.trStatus) + "</th></tr>" + rows + "</table>";
      UI.$all("[data-ostatus]", box).forEach(function (sel) {
        sel.addEventListener("change", function () {
          var list = S.getOrders();
          list[parseInt(sel.getAttribute("data-ostatus"), 10)].status = sel.value;
          write("zayro_orders", list); renderAll();
        });
      });
    }

    function renderCoupons() {
      var box = document.getElementById("adminCoupons");
      var cps = read("zayro_admin_coupons", []);
      box.innerHTML = cps.length ? '<table class="data"><tr><th>' + UI.esc(d.adminCouponCode) + "</th><th>" + UI.esc(d.adminCouponPct) +
        "</th><th></th></tr>" + cps.map(function (c, i) {
          return "<tr><td>" + UI.esc(c.code) + "</td><td>" + c.pct + "%</td><td><button type='button' class='remove-btn' data-cpdel='" + i + "'>" + UI.esc(d.adminDelete) + "</button></td></tr>";
        }).join("") + "</table>" : "";
      UI.$all("[data-cpdel]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          var list = read("zayro_admin_coupons", []);
          list.splice(parseInt(b.getAttribute("data-cpdel"), 10), 1);
          write("zayro_admin_coupons", list); renderAll();
        });
      });
    }

    function renderHome() {
      var f = S.homeFlags();
      document.getElementById("hfFeatured").checked = f.featured;
      document.getElementById("hfNew").checked = f.newsec;
      document.getElementById("hfHow").checked = f.how;
    }
    ["hfFeatured", "hfNew", "hfHow"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", function () {
        write("zayro_admin_home", {
          featured: document.getElementById("hfFeatured").checked,
          newsec: document.getElementById("hfNew").checked,
          how: document.getElementById("hfHow").checked
        });
      });
    });

    function renderSummary() {
      var box = document.getElementById("adminSummary");
      var orders = S.getOrders();
      var revenue = orders.reduce(function (s, o) { return s + (o.total_sar || 0); }, 0);
      var pending = orders.filter(function (o) { return o.status === "pending"; }).length;
      box.innerHTML = '<table class="data">' +
        "<tr><td>" + UI.esc(d.adminSumRevenue) + "</td><td>" + revenue + " " + cur + "</td></tr>" +
        "<tr><td>" + UI.esc(d.adminSumOrders) + "</td><td>" + orders.length + "</td></tr>" +
        "<tr><td>" + UI.esc(d.adminSumPending) + "</td><td>" + pending + "</td></tr></table>";
    }

    function renderAll() { renderProducts(); renderOrders(); renderCoupons(); renderHome(); renderSummary(); }

    document.getElementById("npAdd").addEventListener("click", function () {
      var msg = document.getElementById("npMsg");
      msg.className = "form-msg";
      var id = document.getElementById("npId").value.trim();
      var price = parseInt(document.getElementById("npPrice").value, 10);
      if (!id || !price || price < 1) { msg.textContent = "ID + price required"; msg.classList.add("err"); return; }
      var o = getOverride();
      o.removed = o.removed.filter(function (x) { return x !== id; });
      o.added = o.added.filter(function (p) { return p.id !== id; });
      o.added.push({
        id: id, cats: ["trending"], icon: "🛍️",
        name_ar: document.getElementById("npNameAr").value.trim() || id,
        name_en: document.getElementById("npNameEn").value.trim() || id,
        desc_ar: "", desc_en: "", price_sar: price, price_usd: 0, billing: "once",
        status: document.getElementById("npStatus").value,
        stock_ar: "", stock_en: "", image: null, video: null,
        payment_link: null, notify_link: "https://ig.me/m/aiuhkot"
      });
      setOverride(o); msg.textContent = "OK"; msg.classList.add("ok"); renderAll();
    });
    document.getElementById("cpAdd").addEventListener("click", function () {
      var code = document.getElementById("cpCode").value.trim();
      var pct = parseInt(document.getElementById("cpPct").value, 10);
      if (!code || !pct) return;
      var list = read("zayro_admin_coupons", []);
      list.push({ code: code, pct: pct });
      write("zayro_admin_coupons", list); renderAll();
    });
    document.getElementById("expBtn").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify({ override: getOverride(), coupons: read("zayro_admin_coupons", []) }, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "zayro-admin-export.json"; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
    });
    document.getElementById("impFile").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var j = JSON.parse(r.result);
          if (j.override) setOverride(j.override);
          if (j.coupons) write("zayro_admin_coupons", j.coupons);
          renderAll();
        } catch (err) { /* invalid file: ignore, prototype */ }
      };
      r.readAsText(f);
    });
    document.getElementById("resetBtn").addEventListener("click", function () {
      localStorage.removeItem("zayro_admin_override");
      localStorage.removeItem("zayro_admin_coupons");
      renderAll();
    });

    renderAll();
  }
};
