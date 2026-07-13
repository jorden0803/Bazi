(function () {
  var STORAGE_KEY = "bazi-quiz-stats-v1";
  var ALL_CATEGORY = "__all__";
  var ALL_SUB = "__all__";

  var categorySelect = document.getElementById("category");
  var topicSelect = document.getElementById("topic");
  var statsBar = document.getElementById("statsBar");
  var practiceBtn = document.getElementById("practiceBtn");
  var reviewBtn = document.getElementById("reviewBtn");
  var wrongCountEl = document.getElementById("wrongCount");
  var resetBtn = document.getElementById("resetBtn");
  var promptEl = document.getElementById("prompt");
  var optionsEl = document.getElementById("options");
  var feedbackEl = document.getElementById("feedback");
  var nextBtn = document.getElementById("nextBtn");
  var reviewEmptyEl = document.getElementById("reviewEmpty");

  var topics = window.BaziTopics || [];
  var categories = [];
  topics.forEach(function (t) {
    if (t.category && categories.indexOf(t.category) === -1) categories.push(t.category);
  });

  var currentCategory = ALL_CATEGORY;
  var currentSubId = ALL_SUB;
  var currentMode = "practice"; // "practice" | "review"
  var currentQuestion = null;
  var reviewQueue = [];
  var answered = false;

  function getTopic(id) {
    for (var i = 0; i < topics.length; i++) {
      if (topics[i].id === id) return topics[i];
    }
    return null;
  }

  function topicsInCategory(category) {
    if (category === ALL_CATEGORY) return topics.slice();
    return topics.filter(function (t) { return t.category === category; });
  }

  function currentScopeTopics() {
    if (currentSubId !== ALL_SUB) {
      var t = getTopic(currentSubId);
      return t ? [t] : [];
    }
    return topicsInCategory(currentCategory);
  }

  function currentScopeKey() {
    if (currentSubId !== ALL_SUB) return currentSubId;
    if (currentCategory === ALL_CATEGORY) return "scope:all";
    return "scope:cat:" + currentCategory;
  }

  function currentScopeLabel() {
    if (currentSubId !== ALL_SUB) {
      var t = getTopic(currentSubId);
      return t ? t.name : "";
    }
    if (currentCategory === ALL_CATEGORY) return "全部主題";
    return currentCategory + "(全部)";
  }

  function loadStats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveStats(stats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  function ensureTopicStats(stats, topicId) {
    if (!stats[topicId]) {
      stats[topicId] = { total: 0, correct: 0, wrong: {} };
    }
    return stats[topicId];
  }

  function renderCategoryOptions() {
    categorySelect.innerHTML = "";
    var allOpt = document.createElement("option");
    allOpt.value = ALL_CATEGORY;
    allOpt.textContent = "全部";
    categorySelect.appendChild(allOpt);
    categories.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categorySelect.appendChild(opt);
    });
    categorySelect.value = currentCategory;
  }

  function renderSubOptions() {
    topicSelect.innerHTML = "";
    var allOpt = document.createElement("option");
    allOpt.value = ALL_SUB;
    allOpt.textContent = "全部";
    topicSelect.appendChild(allOpt);
    topicsInCategory(currentCategory).forEach(function (t) {
      var opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      topicSelect.appendChild(opt);
    });
    topicSelect.value = currentSubId;
  }

  function updateStatsBar() {
    var stats = loadStats();
    var t = ensureTopicStats(stats, currentScopeKey());
    var rate = t.total ? Math.round((t.correct / t.total) * 100) : 0;
    statsBar.innerHTML =
      "<div class=\"stat-tile\"><strong>" + t.total + "</strong><span>已作答</span></div>" +
      "<div class=\"stat-tile\"><strong>" + t.correct + "</strong><span>答對</span></div>" +
      "<div class=\"stat-tile\"><strong>" + rate + "%</strong><span>正確率</span></div>";
    var wrongCount = Object.keys(t.wrong).length;
    wrongCountEl.textContent = wrongCount;
    reviewBtn.disabled = wrongCount === 0 && currentMode !== "review";
  }

  function setMode(mode) {
    currentMode = mode;
    practiceBtn.classList.toggle("active", mode === "practice");
    reviewBtn.classList.toggle("active", mode === "review");
  }

  function startPractice() {
    setMode("practice");
    reviewEmptyEl.style.display = "none";
    document.querySelector(".quiz-card").style.display = "block";
    nextQuestion();
  }

  function startReview() {
    var stats = loadStats();
    var t = ensureTopicStats(stats, currentScopeKey());
    reviewQueue = shuffleArray(Object.keys(t.wrong).map(function (k) { return t.wrong[k]; }));

    setMode("review");
    if (reviewQueue.length === 0) {
      promptEl.textContent = "";
      optionsEl.innerHTML = "";
      feedbackEl.textContent = "";
      nextBtn.style.display = "none";
      reviewEmptyEl.style.display = "block";
      return;
    }
    reviewEmptyEl.style.display = "none";
    nextQuestion();
  }

  function shuffleArray(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function nextQuestion() {
    answered = false;
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    nextBtn.style.display = "none";

    if (currentMode === "review") {
      if (reviewQueue.length === 0) {
        reviewEmptyEl.style.display = "block";
        promptEl.textContent = "";
        optionsEl.innerHTML = "";
        reviewEmptyEl.textContent = "這一輪錯題複習完了!";
        return;
      }
      currentQuestion = reviewQueue.shift();
    } else {
      var pool = currentScopeTopics();
      var topic = pool[Math.floor(Math.random() * pool.length)];
      currentQuestion = topic.generateQuestion();
    }

    renderQuestion(currentQuestion);
  }

  function renderQuestion(q) {
    window.BaziRenderQuizBody(promptEl, optionsEl, q, selectOption);
  }

  function selectOption(idx) {
    if (answered) return;
    answered = true;

    var isCorrect = idx === currentQuestion.answerIndex;
    var buttons = optionsEl.querySelectorAll(".option-btn");
    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === currentQuestion.answerIndex) btn.classList.add("correct");
      if (i === idx && !isCorrect) btn.classList.add("wrong");
    });

    feedbackEl.textContent = (isCorrect ? "答對了! " : "答錯了。 ") + currentQuestion.explanation;
    feedbackEl.className = "feedback " + (isCorrect ? "correct" : "wrong");
    nextBtn.style.display = "block";

    var stats = loadStats();
    var t = ensureTopicStats(stats, currentScopeKey());
    t.total += 1;
    if (isCorrect) {
      t.correct += 1;
      delete t.wrong[currentQuestion.prompt];
    } else {
      t.wrong[currentQuestion.prompt] = currentQuestion;
    }
    saveStats(stats);
    updateStatsBar();
  }

  function resetStats() {
    if (!confirm("確定要重設「" + currentScopeLabel() + "」的統計與錯題紀錄嗎?")) return;
    var stats = loadStats();
    stats[currentScopeKey()] = { total: 0, correct: 0, wrong: {} };
    saveStats(stats);
    updateStatsBar();
    startPractice();
  }

  categorySelect.addEventListener("change", function () {
    currentCategory = categorySelect.value;
    currentSubId = ALL_SUB;
    renderSubOptions();
    updateStatsBar();
    startPractice();
  });

  topicSelect.addEventListener("change", function () {
    currentSubId = topicSelect.value;
    updateStatsBar();
    startPractice();
  });

  practiceBtn.addEventListener("click", startPractice);
  reviewBtn.addEventListener("click", startReview);
  resetBtn.addEventListener("click", resetStats);
  nextBtn.addEventListener("click", nextQuestion);

  renderCategoryOptions();
  renderSubOptions();
  updateStatsBar();
  startPractice();
})();
