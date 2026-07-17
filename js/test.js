(function () {
  var TOTAL_QUESTIONS = 20;
  var PENALTY_MS = 5000;
  var ADVANCE_DELAY_MS = 600;

  var introEl = document.getElementById("testIntro");
  var quizEl = document.getElementById("testQuiz");
  var resultEl = document.getElementById("testResult");
  var startBtn = document.getElementById("startTestBtn");
  var retakeBtn = document.getElementById("retakeTestBtn");
  var indexEl = document.getElementById("testIndex");
  var timerEl = document.getElementById("testTimer");
  var promptEl = document.getElementById("testPrompt");
  var optionsEl = document.getElementById("testOptions");
  var resultCorrectEl = document.getElementById("resultCorrect");
  var resultWrongEl = document.getElementById("resultWrong");
  var resultTimeEl = document.getElementById("resultTime");

  var topics = window.BaziTopics || [];
  var questions = [];
  var qIndex = 0;
  var correctCount = 0;
  var wrongCount = 0;
  var startTime = 0;
  var penaltyMs = 0;
  var timerHandle = null;
  var answered = false;

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function buildQuestionPool() {
    var n = topics.length;
    var base = Math.floor(TOTAL_QUESTIONS / n);
    var remainder = TOTAL_QUESTIONS - base * n;
    var bonusIds = shuffle(topics.map(function (t) { return t.id; })).slice(0, remainder);

    var pool = [];
    topics.forEach(function (t) {
      var count = base + (bonusIds.indexOf(t.id) !== -1 ? 1 : 0);
      for (var i = 0; i < count; i++) {
        pool.push(t.generateQuestion());
      }
    });
    return shuffle(pool);
  }

  function formatTime(ms) {
    var totalSec = Math.floor(ms / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function updateTimerDisplay() {
    timerEl.textContent = formatTime(Date.now() - startTime + penaltyMs);
  }

  function startTest() {
    questions = buildQuestionPool();
    qIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    penaltyMs = 0;
    startTime = Date.now();

    introEl.style.display = "none";
    resultEl.style.display = "none";
    quizEl.style.display = "block";

    clearInterval(timerHandle);
    timerHandle = setInterval(updateTimerDisplay, 250);
    updateTimerDisplay();
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    var q = questions[qIndex];
    indexEl.textContent = qIndex + 1;
    window.BaziRenderQuizBody(promptEl, optionsEl, q, selectOption);
  }

  function selectOption(idx) {
    if (answered) return;
    answered = true;

    var q = questions[qIndex];
    var isCorrect = idx === q.answerIndex;
    var buttons = optionsEl.querySelectorAll(".option-btn");
    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === q.answerIndex) btn.classList.add("correct");
      if (i === idx && !isCorrect) btn.classList.add("wrong");
    });

    if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
      penaltyMs += PENALTY_MS;
    }

    setTimeout(function () {
      qIndex += 1;
      if (qIndex >= questions.length) {
        finishTest();
      } else {
        renderQuestion();
      }
    }, ADVANCE_DELAY_MS);
  }

  function finishTest() {
    clearInterval(timerHandle);
    var totalMs = Date.now() - startTime + penaltyMs;

    quizEl.style.display = "none";
    resultEl.style.display = "block";
    resultCorrectEl.textContent = correctCount;
    resultWrongEl.textContent = wrongCount;
    resultTimeEl.textContent = formatTime(totalMs);
  }

  window.BaziTestReset = function () {
    clearInterval(timerHandle);
    quizEl.style.display = "none";
    resultEl.style.display = "none";
    introEl.style.display = "block";
  };

  startBtn.addEventListener("click", startTest);
  retakeBtn.addEventListener("click", startTest);
})();
