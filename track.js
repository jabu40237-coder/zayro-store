/* ZAYRO STORE v5 — order tracking, two modes over LOCAL orders:
   1) order id + access token (both required — no data without the token);
   2) the email used at checkout (lists this browser's local orders for
      that email). Server-side tracking activates in the backend phase. */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t(), S = window.ZayroStore;
    var statusKey = {
      pending: "stPending", paid: "stPaid", supplier_pending: "stSupplier",
      shipped: "stShipped", delivered: "stDelivered", failed: "stFailed",
      expired: "stExpired", refunded: "stRefunded"
    };
    function orderCard(order) {
      var items = order.items.map(function (it) {
        var p = UI.byId(it.id);
        return "<tr><td>" + UI.esc(p ? UI.pname(p) : it.id) + "</td><td>" + it.qty + "</td><td>" + UI.esc(UI.fmtPrice(it.price_sar * it.qty)) + "</td></tr>";
      }).join("");
      return '<div class="form-card" style="margin:0 0 18px;max-width:720px">' +
        '<div class="big-id">' + UI.esc(order.id) + "</div>" +
        '<table class="pd-meta">' +
        "<tr><td>" + UI.esc(d.trStatus) + "</td><td>" + UI.esc(d[statusKey[order.status] || "stPending"]) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.trPayment) + "</td><td>" + UI.esc(order.payment === "confirmed" ? d.payConfirmed : d.payPending) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.trTotal) + "</td><td>" + UI.esc(UI.fmtPrice(order.total_sar)) + "</td></tr>" +
        "<tr><td>" + UI.esc(d.trCreated) + "</td><td>" + UI.esc(order.created_at) + "</td></tr></table>" +
        "<h3 style='margin:14px 0 8px'>" + UI.esc(d.trItems) + "</h3>" +
        '<table class="data">' + items + "</table></div>";
    }
    function show(orders) {
      document.getElementById("trResult").innerHTML = orders.map(orderCard).join("");
    }

    var idForm = document.getElementById("trForm"), emForm = document.getElementById("trEmailForm");
    var idBtn = document.getElementById("modeIdBtn"), emBtn = document.getElementById("modeEmailBtn");
    function setMode(email) {
      emForm.hidden = !email; idForm.hidden = email;
      idBtn.classList.toggle("active", !email); emBtn.classList.toggle("active", email);
    }
    idBtn.addEventListener("click", function () { setMode(false); });
    emBtn.addEventListener("click", function () { setMode(true); });

    idForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("trMsg");
      msg.className = "form-msg";
      var order = S.findOrder(document.getElementById("trId").value, document.getElementById("trToken").value);
      if (!order) {
        document.getElementById("trResult").innerHTML = "";
        msg.textContent = d.trNotFound; msg.classList.add("err"); return;
      }
      msg.textContent = ""; show([order]);
    });
    emForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("trEmailMsg");
      msg.className = "form-msg";
      var orders = S.findOrdersByEmail(document.getElementById("trEmail").value);
      if (!orders.length) {
        document.getElementById("trResult").innerHTML = "";
        msg.textContent = d.trEmailNone; msg.classList.add("err"); return;
      }
      msg.textContent = ""; show(orders);
    });

    /* Deep link from the success page */
    var q = new URLSearchParams(window.location.search);
    if (q.get("id") && q.get("token")) {
      document.getElementById("trId").value = q.get("id");
      document.getElementById("trToken").value = q.get("token");
      var o = S.findOrder(q.get("id"), q.get("token"));
      if (o) show([o]);
    }
  }
};
