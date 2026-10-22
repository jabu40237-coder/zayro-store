/* ZAYRO STORE v5 — product media viewers.
   1) Viewer360: a drag/swipe rotate viewer over REAL multi-angle frames
      (data.js angles360). It is a 2D image-sequence viewer and is labelled
      as an angle view — never as "3D".
   2) ModelViewer: Google's <model-viewer> integration for TRUE 3D + AR.
      It activates ONLY for a product whose data carries a real model file
      (model_glb / model_usdz). The CDN script is injected lazily at that
      moment and at no other time — with no models in the catalog (the
      current state) the script is never requested and no 3D/AR button is
      ever rendered. See NEEDS-3D.md. */
(function () {
  "use strict";

  function Viewer360(el, frames, opts) {
    opts = opts || {};
    if (!el || !frames || frames.length < 2) return null;
    var idx = 0, dragging = false, startX = 0, acc = 0;
    el.classList.add("viewer360");
    el.innerHTML = "";
    var img = document.createElement("img");
    img.src = frames[0]; img.alt = opts.alt || ""; img.draggable = false;
    img.loading = "eager"; img.decoding = "async";
    el.appendChild(img);
    /* Preload remaining frames so rotation feels continuous. */
    frames.slice(1).forEach(function (f) { var i = new Image(); i.src = f; });
    var hint = document.createElement("div");
    hint.className = "viewer360-hint";
    hint.textContent = opts.hint || "";
    el.appendChild(hint);
    function show(i) {
      idx = ((i % frames.length) + frames.length) % frames.length;
      img.src = frames[idx];
    }
    function down(x) { dragging = true; startX = x; acc = 0; el.classList.add("grabbing"); }
    function move(x) {
      if (!dragging) return;
      var dx = x - startX; acc += dx; startX = x;
      var step = 14; /* px of drag per frame */
      while (acc > step) { show(idx + 1); acc -= step; }
      while (acc < -step) { show(idx - 1); acc += step; }
    }
    function up() { dragging = false; el.classList.remove("grabbing"); }
    el.addEventListener("pointerdown", function (e) { el.setPointerCapture(e.pointerId); down(e.clientX); });
    el.addEventListener("pointermove", function (e) { move(e.clientX); });
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("touchmove", function (e) { if (dragging) e.preventDefault(); }, { passive: false });
    return { show: show, element: el };
  }

  var modelScriptPromise = null;
  function loadModelViewerScript(src) {
    if (window.customElements && window.customElements.get("model-viewer")) return Promise.resolve(true);
    if (!modelScriptPromise) {
      modelScriptPromise = new Promise(function (resolve) {
        var s = document.createElement("script");
        s.type = "module"; s.src = src;
        s.onload = function () { resolve(true); };
        s.onerror = function () { resolve(false); };
        document.head.appendChild(s);
      });
    }
    return modelScriptPromise;
  }

  /* Returns a <model-viewer> element ONLY when the product has a real model.
     Returns null otherwise — callers must render nothing in that case. */
  function buildModelViewer(product, config) {
    if (!product || (!product.model_glb && !product.model_usdz)) return null;
    var mv = document.createElement("model-viewer");
    if (product.model_glb) mv.setAttribute("src", product.model_glb);
    if (product.model_usdz) mv.setAttribute("ios-src", product.model_usdz);
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("touch-action", "pan-y");
    mv.setAttribute("shadow-intensity", "0.6");
    mv.setAttribute("exposure", "1");
    if (product.model_usdz || product.model_glb) mv.setAttribute("ar", "");
    mv.setAttribute("ar-modes", "webxr scene-viewer quick-look");
    mv.setAttribute("alt", product.name_en || product.id);
    mv.className = "model-viewer-el";
    loadModelViewerScript(config && config.modelViewerSrc);
    return mv;
  }

  window.ZayroViewer = { Viewer360: Viewer360, buildModelViewer: buildModelViewer, loadModelViewerScript: loadModelViewerScript };
})();
