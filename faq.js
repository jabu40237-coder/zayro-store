/* ZAYRO STORE v5 — FAQ page: renders all questions from the i18n
   dictionary (answers written strictly from confirmed store facts). */
window.ZayroPage = {
  init: function (UI) {
    var d = UI.t();
    document.getElementById("faqList").innerHTML = [1, 2, 3, 4, 5, 6].map(function (n) {
      return '<details class="faq-item"><summary>' + UI.esc(d["faqQ" + n]) + "</summary><p>" + UI.esc(d["faqA" + n]) + "</p></details>";
    }).join("");
  }
};
