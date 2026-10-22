/* ZAYRO STORE v5 — checkout as THREE NUMBERED STEPS (owner's choice):
     1) contact/shipping details — validated with the SAME pure validator
        as before; invalid input never advances the wizard.
     2) review & payment — order summary; placing the order here creates a
        LOCAL order with status "pending" (payment NOT verified), opens each
        item's own NOWPayments link, clears the cart.
     3) confirmation — order-success.html shows the order id + access token.
   Physical (notify-only) items BLOCK checkout with a clear message, as
   before. An order becomes "paid" ONLY via the backend IPN flow. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
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

    function setStep(n) {
      UI.$all("[data-panel]", form).forEach(function (pn) { pn.hidden = pn.getAttribute("data-panel") !== String(n); });
      UI.$all("[data-step-ind]").forEach(function (ind) {
        var k = +ind.getAttribute("data-step-ind");
        ind.classList.toggle("active", k === n);
        ind.classList.toggle("done", k < n);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function readFields() {
      return {
        name: document.getElementById("coName").value,
        email: document.getElementById("coEmail").value,
        phone: document.getElementById("coPhone").value,
        country: document.getElementById("coCountry").value,
        city: document.getElementById("coCity").value,
        address: document.getElementById("coAddress").value,
        notes: document.getElementById("coNotes").value
      };
    }
    function renderReview() {
      document.getElementById("coReview").innerHTML = ok.map(function (e) {
        return '<div class="cart-item"><div><div class="nm">' + UI.esc(UI.pname(e.p)) + "</div>" +
          '<div class="pr">' + UI.esc(d.qty) + ": " + e.qty + "</div></div>" +
          "<div class='pr'>" + UI.esc(UI.fmtPrice(e.p.price_sar * e.qty)) + "</div></div>";
      }).join("");
      var totals = S.pure.computeCartTotals(cart, UI.products());
      document.getElementById("coTotal").textContent = UI.fmtPrice(totals.total_sar);
    }

    document.getElementById("coNext1").addEventListener("click", function () {
      var msg = document.getElementById("coMsg");
      msg.className = "form-msg";
      var errs = S.pure.validateCheckout(readFields());
      if (errs.length) { msg.textContent = d[errs[0]]; msg.classList.add("err"); return; }
      msg.textContent = "";
      renderReview();
      setStep(2);
    });
    document.getElementById("coBack2").addEventListener("click", function () { setStep(1); });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var fields = readFields();
      var msg = document.getElementById("coMsg2");
      msg.className = "form-msg";
      var errs = S.pure.validateCheckout(fields);
      if (errs.length) { msg.textContent = d[errs[0]]; msg.classList.add("err"); setStep(1); return; }
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
