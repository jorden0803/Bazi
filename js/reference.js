(function () {
  var tabsEl = document.getElementById("refTabs");
  var contentEl = document.getElementById("refContent");
  var data = window.BaziReference || [];
  var currentIndex = 0;

  function renderTabs() {
    tabsEl.innerHTML = "";
    data.forEach(function (cat, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ref-tab" + (i === currentIndex ? " active" : "");
      btn.textContent = cat.category;
      btn.addEventListener("click", function () {
        currentIndex = i;
        renderTabs();
        renderContent();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderContent() {
    var cat = data[currentIndex];
    if (!cat) {
      contentEl.innerHTML = "";
      return;
    }
    contentEl.innerHTML = cat.sections.map(function (s) {
      return "<div class=\"ref-section\"><h3>" + s.title + "</h3>" + s.html + "</div>";
    }).join("");
  }

  window.BaziReferenceInit = function () {
    currentIndex = 0;
    renderTabs();
    renderContent();
  };
})();
