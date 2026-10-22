/* ZAYRO STORE v3 — cart page: full line items with quantity controls and SAR
   totals (pure math from store.js), plus the wishlist grid. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var list = document.getElementById("cartList");
    var cur = UI.lang() === "ar" ? "ر.س" : "SAR";
    function render() {
      var cart = S.getCart();
      var entries = Object.keys(cart).map(function (id) { var p = UI.byId(id); return p ? { p: p, qty: cart[id] } : null; }).filter(Boolean);
      var totals = S.pure.computeCartTotals(cart, UI.products());
      if (!entries.length) {
        list.innerHTML = '<p class="empty-msg">' + UI.esc(d.cartEmpty) + "</p>";
      } else {
        var rows = entries.map(function (e) {
          return "<tr><td>" + UI.esc(UI.pname(e.p)) + "</td><td>" + e.p.price_sar + " " + cur + "</td>" +
            "<td><div class='qty-ctrl'><button type='button' data-dec='" + e.p.id + "'>−</button><span>" + e.qty + "</span>" +
            "<button type='button' data-inc='" + e.p.id + "'>+</button></div></td>" +
            "<td>" + (e.p.price_sar * e.qty) + " " + cur + "</td>" +
            "<td><button type='button' class='remove-btn' data-rem='" + e.p.id + "'>" + UI.esc(d.remove) + "</button></td></tr>";
        }).join("");
        list.innerHTML = '<table class="data"><tr><th>' + UI.esc(d.adminColName) + "</th><th>" + UI.esc(d.pdPrice) + "</th><th>" +
          UI.esc(d.qty) + "</th><th>" + UI.esc(d.subtotal) + "</th><th></th></tr>" + rows + "</table>";
        UI.$all("[data-inc]", list).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); c[b.getAttribute("data-inc")]++; S.setCart(c); UI.renderCart(); render(); }); });
        UI.$all("[data-dec]", list).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); var id = b.getAttribute("data-dec"); c[id]--; if (c[id] <= 0) delete c[id]; S.setCart(c); UI.renderCart(); render(); }); });
        UI.$all("[data-rem]", list).forEach(function (b) { b.addEventListener("click", function () { var c = S.getCart(); delete c[b.getAttribute("data-rem")]; S.setCart(c); UI.renderCart(); render(); }); });
      }
      document.getElementById("pageTotal").textContent = totals.total_sar + " " + cur;

      var wg = document.getElementById("wishGrid");
      wg.innerHTML = "";
      var wished = S.getWishlist().map(function (id) { return UI.byId(id); }).filter(Boolean);
      wished.forEach(function (p) { wg.appendChild(UI.productCard(p)); });
      document.getElementById("wishEmpty").style.display = wished.length ? "none" : "block";
      UI.bindCardButtons(wg); UI.bindTilt(wg);
    }
    render();
  }
};
