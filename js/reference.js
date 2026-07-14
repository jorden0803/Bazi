(function () {
  var tabsEl = document.getElementById("refTabs");
  var contentEl = document.getElementById("refContent");
  var data = window.BaziReference || [];
  var currentIndex = 0;

  tabsEl.addEventListener("wheel", function (e) {
    if (e.deltaY === 0) return;
    tabsEl.scrollLeft += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  var isDragging = false;
  var dragged = false;
  var dragStartX = 0;
  var dragStartScrollLeft = 0;

  tabsEl.addEventListener("mousedown", function (e) {
    isDragging = true;
    dragged = false;
    dragStartX = e.pageX;
    dragStartScrollLeft = tabsEl.scrollLeft;
    tabsEl.classList.add("dragging");
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    var walk = e.pageX - dragStartX;
    if (Math.abs(walk) > 5) dragged = true;
    tabsEl.scrollLeft = dragStartScrollLeft - walk;
  });

  window.addEventListener("mouseup", function () {
    isDragging = false;
    tabsEl.classList.remove("dragging");
  });

  tabsEl.addEventListener("click", function (e) {
    if (dragged) {
      e.stopPropagation();
      e.preventDefault();
      dragged = false;
    }
  }, true);

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
