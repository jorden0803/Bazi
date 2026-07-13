(function () {
  // 旺 = 本季當令;相 = 生我者當令(次旺)
  var ELEMENT_SETS = {
    木: [{ zhi: "寅", role: "旺" }, { zhi: "卯", role: "旺" }, { zhi: "亥", role: "相" }, { zhi: "子", role: "相" }],
    火: [{ zhi: "巳", role: "旺" }, { zhi: "午", role: "旺" }, { zhi: "寅", role: "相" }, { zhi: "卯", role: "相" }],
    土: [{ zhi: "辰", role: "旺" }, { zhi: "戌", role: "旺" }, { zhi: "丑", role: "旺" }, { zhi: "未", role: "旺" }, { zhi: "巳", role: "相" }, { zhi: "午", role: "相" }],
    金: [{ zhi: "申", role: "旺" }, { zhi: "酉", role: "旺" }, { zhi: "辰", role: "相" }, { zhi: "戌", role: "相" }, { zhi: "丑", role: "相" }, { zhi: "未", role: "相" }],
    水: [{ zhi: "亥", role: "旺" }, { zhi: "子", role: "旺" }, { zhi: "申", role: "相" }, { zhi: "酉", role: "相" }]
  };

  // 本季當令(旺)的唯一歸屬,12地支不重複
  var PRIMARY_ELEMENT = {
    寅: "木", 卯: "木",
    巳: "火", 午: "火",
    辰: "土", 戌: "土", 丑: "土", 未: "土",
    申: "金", 酉: "金",
    亥: "水", 子: "水"
  };

  var ELEMENTS = Object.keys(ELEMENT_SETS);
  var ALL_ZHI = Object.keys(PRIMARY_ELEMENT);

  function pick(arr, n) {
    var copy = arr.slice();
    var result = [];
    while (result.length < n && copy.length) {
      var i = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(i, 1)[0]);
    }
    return result;
  }

  function shuffle(arr) {
    return pick(arr, arr.length);
  }

  function setZhiList(element) {
    return ELEMENT_SETS[element].map(function (e) { return e.zhi; });
  }

  function generateInSetQuestion() {
    var element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    var entries = ELEMENT_SETS[element];
    var correctEntry = entries[Math.floor(Math.random() * entries.length)];
    var inSet = setZhiList(element);
    var outPool = ALL_ZHI.filter(function (z) { return inSet.indexOf(z) === -1; });
    var distractors = pick(outPool, 3);
    var options = shuffle([correctEntry.zhi].concat(distractors));
    var answerIndex = options.indexOf(correctEntry.zhi);

    return {
      prompt: "下列哪個地支屬於「" + element + "旺」的範圍?",
      options: options,
      answerIndex: answerIndex,
      explanation: correctEntry.zhi + "屬於" + element + "旺之範圍"
    };
  }

  function generatePrimaryQuestion() {
    var zhi = ALL_ZHI[Math.floor(Math.random() * ALL_ZHI.length)];
    var answer = PRIMARY_ELEMENT[zhi];
    var distractorPool = ELEMENTS.filter(function (e) { return e !== answer; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "地支「" + zhi + "」本季是哪個五行當令(旺)?",
      options: options,
      answerIndex: answerIndex,
      explanation: zhi + "為" + answer + "旺之地"
    };
  }

  function generateQuestion() {
    return Math.random() < 0.5 ? generateInSetQuestion() : generatePrimaryQuestion();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "wuxing-wang",
    name: "五行旺於地支",
    category: "曆法與旺衰",
    generateQuestion: generateQuestion
  });
})();
