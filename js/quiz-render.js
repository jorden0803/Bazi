(function () {
  // Renders a question's answerable body into containerEl. Supports plain text
  // options (default) and a click-on-image "hand" layout (see js/topics/shouzhang-dizhi.js).
  // Every clickable element gets class "option-btn" so callers can keep using a single
  // ".option-btn" query to disable/mark correct/wrong after an answer, regardless of layout.
  window.BaziRenderQuizBody = function (promptEl, containerEl, q, onSelect) {
    promptEl.textContent = q.prompt;
    containerEl.innerHTML = "";
    containerEl.classList.toggle("hand-quiz", q.type === "hand");

    if (q.type === "hand") {
      var wrap = document.createElement("div");
      wrap.className = "hand-wrap";
      wrap.innerHTML = q.handSvg;
      q.hotspots.forEach(function (h, idx) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-btn hand-dot";
        btn.style.left = h.x + "%";
        btn.style.top = h.y + "%";
        btn.addEventListener("click", function () { onSelect(idx); });
        wrap.appendChild(btn);
      });
      containerEl.appendChild(wrap);
      return;
    }

    q.options.forEach(function (opt, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", function () { onSelect(idx); });
      containerEl.appendChild(btn);
    });
  };
})();
