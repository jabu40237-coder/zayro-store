/* ZAYRO STORE v3 — checkout: validated shipping/contact form -> order review ->
   place order. Placing an order:
     1. builds the item list from the cart (digital/available items only —
        physical notify-only items BLOCK checkout with a clear message),
     2. creates a LOCAL order record with status "pending" (payment NOT verified),
     3. opens each item's own NOWPayments payment link in a new tab,
     4. clears the cart and goes to order-success.html with id+token.
   The order becomes "paid" ONLY through the backend IPN verification flow —
   never from this page. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var cur = UI.lang() === "ar" ? "ر.س" : "SAR";
    var cart = S.getCart();
    var entries = Object.keys(cart).map(function (id) { var p = UI.byId(id); return p ? { p: p, qty: cart[id] } : null; }).filter(Boolean);
    var blocked = entries.filter(function (e) { return e.p.status !== "available"; });
    var ok = entries.filter(function (e) { return e.p.status === "available"; });
    var blockedBox = document.getElementById("coBlocked");
    var form = document.getElementById("coForm");

    if (!entries.length) {
      blockedBox.innerHTML = '<p class="form-msg err">' + UI.esc(d.coEmptyCart) + "</p>";
      form.style.display = "none"; return;
    }
    if (blocked.length) {
      blockedBox.innerHTML = '<p class="form-msg err">' + UI.esc(d.coPhysicalBlocked) + " (" +
        blocked.map(function (e) { return UI.esc(UI.pname(e.p)); }).join("، ") + ")</p>";
      form.style.display = "none"; return;
    }

    var review = document.getElementById("coReview");
    review.innerHTML = ok.map(function (e) {
      return '<div class="cart-item"><div><div class="nm">' + UI.esc(UI.pname(e.p)) + "</div>" +
        '<div class="pr">' + UI.esc(d.qty) + ": " + e.qty + "</div></div>" +
        "<div class='pr'>" + (e.p.price_sar * e.qty) + " " + cur + "</div></div>";
    }).join("");
    var totals = S.pure.computeCartTotals(cart, UI.products());
    document.getElementById("coTotal").textContent = totals.total_sar + " " + cur;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var fields = {
        name: document.getElementById("coName").value,
        email: document.getElementById("coEmail").value,
        phone: document.getElementById("coPhone").value,
        country: document.getElementById("coCountry").value,
        city: document.getElementById("coCity").value,
        address: document.getElementById("coAddress").value,
        notes: document.getElementById("coNotes").value
      };
      var msg = document.getElementById("coMsg");
      msg.className = "form-msg";
      var errs = S.pure.validateCheckout(fields);
      if (errs.length) { msg.textContent = d[errs[0]]; msg.classList.add("err"); return; }
      try {
        var items = ok.map(function (e) { return { id: e.p.id, qty: e.qty, price_sar: e.p.price_sar }; });
        var order = S.createOrder(items, fields);
        ok.forEach(function (e) { window.open(e.p.payment_link, "_blank", "noopener"); });
        S.setCart({});
        window.location.href = "order-success.html?id=" + encodeURIComponent(order.id) + "&token=" + encodeURIComponent(order.token);
      } catch (e) {
        window.location.href = "order-error.html";
      }
    });
  }
};
