(function () {
  var DATA = [
    { month: "正月", zhi: "寅", jie: "立春", qi: "雨水" },
    { month: "二月", zhi: "卯", jie: "驚蟄", qi: "春分" },
    { month: "三月", zhi: "辰", jie: "清明", qi: "穀雨" },
    { month: "四月", zhi: "巳", jie: "立夏", qi: "小滿" },
    { month: "五月", zhi: "午", jie: "芒種", qi: "夏至" },
    { month: "六月", zhi: "未", jie: "小暑", qi: "大暑" },
    { month: "七月", zhi: "申", jie: "立秋", qi: "處暑" },
    { month: "八月", zhi: "酉", jie: "白露", qi: "秋分" },
    { month: "九月", zhi: "戌", jie: "寒露", qi: "霜降" },
    { month: "十月", zhi: "亥", jie: "立冬", qi: "小雪" },
    { month: "十一月", zhi: "子", jie: "大雪", qi: "冬至" },
    { month: "十二月", zhi: "丑", jie: "小寒", qi: "大寒" }
  ];

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

  function explain(row) {
    return row.zhi + "月(" + row.month + "):節為「" + row.jie + "」、氣為「" + row.qi + "」";
  }

  var MODES = [
    {
      key: "zhi-to-month",
      makePrompt: function (row) { return "地支「" + row.zhi + "」月是農曆幾月?"; },
      answer: function (row) { return row.month; },
      field: "month"
    },
    {
      key: "month-to-zhi",
      makePrompt: function (row) { return "農曆「" + row.month + "」對應哪個地支?"; },
      answer: function (row) { return row.zhi; },
      field: "zhi"
    },
    {
      key: "zhi-to-jie",
      makePrompt: function (row) { return "「" + row.zhi + "」月的「節」是?"; },
      answer: function (row) { return row.jie; },
      field: "jie"
    },
    {
      key: "jie-to-zhi",
      makePrompt: function (row) { return "「" + row.jie + "」是進入哪個地支月?"; },
      answer: function (row) { return row.zhi; },
      field: "zhi"
    },
    {
      key: "zhi-to-qi",
      makePrompt: function (row) { return "「" + row.zhi + "」月的「氣」是?"; },
      answer: function (row) { return row.qi; },
      field: "qi"
    },
    {
      key: "qi-to-zhi",
      makePrompt: function (row) { return "「" + row.qi + "」是哪個地支月的中氣?"; },
      answer: function (row) { return row.zhi; },
      field: "zhi"
    }
  ];

  function generateQuestion() {
    var mode = MODES[Math.floor(Math.random() * MODES.length)];
    var row = DATA[Math.floor(Math.random() * DATA.length)];
    var answer = mode.answer(row);

    var distractorPool = DATA
      .filter(function (r) { return r !== row; })
      .map(function (r) { return r[mode.field]; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: mode.makePrompt(row),
      options: options,
      answerIndex: answerIndex,
      explanation: explain(row)
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "jieqi-yuezhi",
    name: "二十四節氣與月支",
    category: "曆法與旺衰",
    generateQuestion: generateQuestion
  });
})();
