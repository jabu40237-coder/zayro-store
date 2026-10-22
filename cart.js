/* ZAYRO STORE v5 — cart page: full item list with quantity controls and
   totals from the pure cart math in store.js. Currency switcher affects
   display only. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    function render() {
      var cart = S.getCart();
      var entries = Object.keys(cart).map(function (id) { var p = UI.byId(id); return p ? { p: p, qty: cart[id] } : null; }).filter(Boolean);
      var box = document.getElementById("cartPageItems");
      if (!entries.length) {
        box.innerHTML = '<p class="empty-msg">' + UI.esc(d.cartEmpty) + "</p>";
      } else {
        box.innerHTML = "";
        entries.forEach(function (e) {
          var row = document.createElement("div");
          row.className = "cart-item";
          row.innerHTML = "<div><div class='nm'>" + UI.esc(UI.pname(e.p)) + "</div>" +
            "<div class='pr'>" + UI.esc(UI.fmtPrice(e.p.price_sar * e.qty)) + "</div>" +
            "<div class='qty-ctrl'><button type='button' data-dec='" + e.p.id + "' aria-label='-'>−</button><span>" + e.qty + "</span>" +
            "<button type='button' data-inc='" + e.p.id + "' aria-label='+'>+</button>" +
            "<button type='button' class='remove-btn' data-rem='" + e.p.id + "'>" + UI.esc(d.remove) + "</button></div></div>" +
            "<div>" + UI.statusHTML(e.p) + "</div>";
          box.appendChild(row);
        });
        UI.$all("[data-inc]", box).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); c[b.getAttribute("data-inc")]++; S.setCart(c); render(); UI.renderCart(); }); });
        UI.$all("[data-dec]", box).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); var id = b.getAttribute("data-dec"); c[id]--; if (c[id] <= 0) delete c[id]; S.setCart(c); render(); UI.renderCart(); }); });
        UI.$all("[data-rem]", box).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); delete c[b.getAttribute("data-rem")]; S.setCart(c); render(); UI.renderCart(); }); });
      }
      var totals = S.pure.computeCartTotals(cart, UI.products());
      document.getElementById("cartPageTotal").textContent = UI.fmtPrice(totals.total_sar);
    }
    render();
  }
};
