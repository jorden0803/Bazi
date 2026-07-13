(function () {
  var STAGES = ["長生", "沐浴", "冠帶", "臨官", "帝旺", "衰", "病", "死", "墓", "絕", "胎", "養"];
  var BRANCH_CYCLE = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  function rotateFrom(start) {
    var i = BRANCH_CYCLE.indexOf(start);
    return BRANCH_CYCLE.slice(i).concat(BRANCH_CYCLE.slice(0, i));
  }

  // 陽干順行十二長生(不含土,土寄生同火)
  var ELEMENTS = [
    { element: "木", gan: "甲", start: "亥" },
    { element: "火", gan: "丙", start: "寅" },
    { element: "金", gan: "庚", start: "巳" },
    { element: "水", gan: "壬", start: "申" }
  ].map(function (e) {
    var branches = rotateFrom(e.start);
    e.table = STAGES.map(function (stage, i) { return { stage: stage, zhi: branches[i] }; });
    return e;
  });

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

  function label(e) {
    return e.gan + "(" + e.element + ")";
  }

  // 題型一:十二長生順序
  function generateOrderQuestion() {
    var idx = Math.floor(Math.random() * STAGES.length);
    var forward = Math.random() < 0.5;
    var stage = STAGES[idx];
    var neighborIdx = forward ? (idx + 1) % STAGES.length : (idx - 1 + STAGES.length) % STAGES.length;
    var answer = STAGES[neighborIdx];

    var distractorPool = STAGES.filter(function (s) { return s !== answer && s !== stage; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: forward ? "「" + stage + "」的下一個階段是?" : "「" + stage + "」的前一個階段是?",
      options: options,
      answerIndex: answerIndex,
      explanation: "十二長生順序:長生→沐浴→冠帶→臨官→帝旺→衰→病→死→墓→絕→胎→養(循環)"
    };
  }

  // 題型二:五行(陽干)十二長生對應地支
  function generateStageToZhiQuestion() {
    var e = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    var entry = e.table[Math.floor(Math.random() * e.table.length)];

    var distractorPool = e.table
      .filter(function (row) { return row.zhi !== entry.zhi; })
      .map(function (row) { return row.zhi; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([entry.zhi].concat(distractors));
    var answerIndex = options.indexOf(entry.zhi);

    return {
      prompt: "「" + label(e) + "」的「" + entry.stage + "」在哪個地支?",
      options: options,
      answerIndex: answerIndex,
      explanation: label(e) + entry.stage + "於" + entry.zhi
    };
  }

  function generateZhiToStageQuestion() {
    var e = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    var entry = e.table[Math.floor(Math.random() * e.table.length)];

    var distractorPool = e.table
      .filter(function (row) { return row.stage !== entry.stage; })
      .map(function (row) { return row.stage; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([entry.stage].concat(distractors));
    var answerIndex = options.indexOf(entry.stage);

    return {
      prompt: "對「" + label(e) + "」來說,地支「" + entry.zhi + "」是十二長生的哪個階段?",
      options: options,
      answerIndex: answerIndex,
      explanation: label(e) + entry.stage + "於" + entry.zhi
    };
  }

  function generateQuestion() {
    var r = Math.random();
    if (r < 1 / 3) return generateOrderQuestion();
    if (r < 2 / 3) return generateStageToZhiQuestion();
    return generateZhiToStageQuestion();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "changsheng",
    name: "十二長生",
    category: "十二長生",
    generateQuestion: generateQuestion
  });
})();
