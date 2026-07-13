(function () {
  var TITLES = { reference: "背誦模式", practice: "練習模式", test: "測驗模式" };

  var views = {
    reference: document.getElementById("referenceView"),
    practice: document.getElementById("practiceView"),
    test: document.getElementById("testView")
  };
  var tabBtns = document.querySelectorAll(".tab-btn");
  var titleEl = document.getElementById("appTitle");
  var current = "practice";

  function showView(name) {
    if (current === "test" && name !== "test" && window.BaziTestReset) {
      window.BaziTestReset();
    }
    current = name;

    Object.keys(views).forEach(function (k) {
      views[k].style.display = k === name ? "block" : "none";
    });
    tabBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === name);
    });
    titleEl.textContent = TITLES[name] || "";

    if (name === "reference" && window.BaziReferenceInit) window.BaziReferenceInit();
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showView(btn.getAttribute("data-view"));
    });
  });

  showView(current);
})();
