/* ZAYRO STORE v3 — order tracking: looks up LOCAL orders by id + access token
   (both required — no order data leaks without the token). Server-side
   tracking (backend GET /order/:id) activates in the backend phase. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var cur = UI.lang() === "ar" ? "ر.س" : "SAR";
    var statusKey = {
      pending: "stPending", paid: "stPaid", supplier_pending: "stSupplier",
      shipped: "stShipped", delivered: "stDelivered", failed: "stFailed",
      expired: "stExpired", refunded: "stRefunded"
    };
    function show(order) {
      var box = document.getElementById("trResult");
      var items = order.items.map(function (it) {
        var p = UI.byId(it.id);
        return "<tr><td>" + UI.esc(p ? UI.pname(p) : it.id) + "</td><td>" + it.qty + "</td><td>" + (it.price_sar * it.qty) + " " + cur + "</td></tr>";
      }).join("");
      box.innerHTML = '<div class="form-card" style="margin:0;max-width:720px">' +
        '<div class="big-id">' + UI.esc(order.id) + "</div>" +
        '<table class="pd-meta">' +
        "<tr><td>" + UI.esc(d.trStatus) + "</td><td>" + UI.esc(d[statusKey[order.status] || "stPending"]) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.trPayment) + "</td><td>" + UI.esc(order.payment === "confirmed" ? d.payConfirmed : d.payPending) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.trTotal) + "</td><td>" + order.total_sar + " " + cur + "</td></tr>" +
        "<tr><td>" + UI.esc(d.trCreated) + "</td><td>" + UI.esc(order.created_at) + "</td></tr></table>" +
        "<h3 style='margin-bottom:8px'>" + UI.esc(d.trItems) + "</h3>" +
        '<table class="data">' + items + "</table></div>";
    }
    document.getElementById("trForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("trMsg");
      msg.className = "form-msg";
      var order = S.findOrder(document.getElementById("trId").value, document.getElementById("trToken").value);
      if (!order) {
        document.getElementById("trResult").innerHTML = "";
        msg.textContent = d.trNotFound; msg.classList.add("err"); return;
      }
      msg.textContent = ""; show(order);
    });
    /* Deep link from the success page */
    var q = new URLSearchParams(window.location.search);
    if (q.get("id") && q.get("token")) {
      document.getElementById("trId").value = q.get("id");
      document.getElementById("trToken").value = q.get("token");
      var o = S.findOrder(q.get("id"), q.get("token"));
      if (o) show(o);
    }
  }
};
