(function () {
  var DATA = [
    { element: "木", yin: "肝", yang: "膽" },
    { element: "火", yin: "心", yang: "小腸" },
    { element: "土", yin: "脾", yang: "胃" },
    { element: "金", yin: "肺", yang: "大腸" },
    { element: "水", yin: "腎", yang: "膀胱" }
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

  var MODES = [
    {
      key: "element-to-yin",
      makePrompt: function (row) { return "五行「" + row.element + "」對應的臟(陰)是?"; },
      answer: function (row) { return row.yin; },
      distractorField: "yin",
      makeExplanation: function (row) { return row.element + "屬" + row.yin + "(臟)、" + row.yang + "(腑)"; }
    },
    {
      key: "element-to-yang",
      makePrompt: function (row) { return "五行「" + row.element + "」對應的腑(陽)是?"; },
      answer: function (row) { return row.yang; },
      distractorField: "yang",
      makeExplanation: function (row) { return row.element + "屬" + row.yin + "(臟)、" + row.yang + "(腑)"; }
    },
    {
      key: "yin-to-element",
      makePrompt: function (row) { return "「" + row.yin + "」屬於哪個五行?"; },
      answer: function (row) { return row.element; },
      distractorField: "element",
      makeExplanation: function (row) { return row.yin + "屬" + row.element + "(臟)"; }
    },
    {
      key: "yang-to-element",
      makePrompt: function (row) { return "「" + row.yang + "」屬於哪個五行?"; },
      answer: function (row) { return row.element; },
      distractorField: "element",
      makeExplanation: function (row) { return row.yang + "屬" + row.element + "(腑)"; }
    }
  ];

  function generateQuestion() {
    var mode = MODES[Math.floor(Math.random() * MODES.length)];
    var row = DATA[Math.floor(Math.random() * DATA.length)];
    var answer = mode.answer(row);

    var distractorPool = DATA
      .filter(function (r) { return r !== row; })
      .map(function (r) { return r[mode.distractorField]; });
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
    id: "wuxing-zangfu",
    name: "五行對應身體器官",
    category: "五行基礎",
    generateQuestion: generateQuestion
  });
})();
