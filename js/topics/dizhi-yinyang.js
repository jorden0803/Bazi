(function () {
  var DATA = [
    { zhi: "子", element: "水", yinyang: "陽" },
    { zhi: "丑", element: "土", yinyang: "陰" },
    { zhi: "寅", element: "木", yinyang: "陽" },
    { zhi: "卯", element: "木", yinyang: "陰" },
    { zhi: "辰", element: "土", yinyang: "陽" },
    { zhi: "巳", element: "火", yinyang: "陰" },
    { zhi: "午", element: "火", yinyang: "陽" },
    { zhi: "未", element: "土", yinyang: "陰" },
    { zhi: "申", element: "金", yinyang: "陽" },
    { zhi: "酉", element: "金", yinyang: "陰" },
    { zhi: "戌", element: "土", yinyang: "陽" },
    { zhi: "亥", element: "水", yinyang: "陰" }
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

  function label(row) {
    return row.yinyang + row.element;
  }

  var MODES = [
    {
      key: "zhi-to-combo",
      makePrompt: function (row) { return "地支「" + row.zhi + "」屬於?"; },
      answer: label,
      distractor: function (row) { return label(row); },
      makeExplanation: function (row) { return row.zhi + "為" + label(row); }
    },
    {
      key: "zhi-to-element",
      makePrompt: function (row) { return "地支「" + row.zhi + "」屬於哪個五行?"; },
      answer: function (row) { return row.element; },
      distractor: function (row) { return row.element; },
      makeExplanation: function (row) { return row.zhi + "屬" + row.element; }
    },
    {
      key: "zhi-to-yinyang",
      makePrompt: function (row) { return "地支「" + row.zhi + "」屬陰還是屬陽?"; },
      answer: function (row) { return row.yinyang; },
      distractor: function (row) { return row.yinyang; },
      makeExplanation: function (row) { return row.zhi + "為" + label(row); }
    }
  ];

  function generateQuestion() {
    var mode = MODES[Math.floor(Math.random() * MODES.length)];
    var row = DATA[Math.floor(Math.random() * DATA.length)];
    var answer = mode.answer(row);

    var distractorPool = DATA
      .filter(function (r) { return r !== row; })
      .map(mode.distractor)
      .filter(function (v, i, arr) { return v !== answer && arr.indexOf(v) === i; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: mode.makePrompt(row),
      options: options,
      answerIndex: answerIndex,
      explanation: mode.makeExplanation(row)
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dizhi-yinyang",
    name: "地支五行陰陽",
    category: "五行基礎",
    generateQuestion: generateQuestion
  });
})();
