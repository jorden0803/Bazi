(function () {
  var ROWS = [
    { big: "三天", small: "一歲" },
    { big: "一天", small: "四個月" },
    { big: "一時辰", small: "十天" },
    { big: "一分鐘", small: "一時辰" }
  ];

  var FULL_FORMULA = "三天等於一歲、一天等於四個月、一時辰等於十天、一分鐘等於一時辰";

  // 補充干擾選項,避免「一時辰」同時是換算前後單位時,同一題的干擾選項不足三個
  var EXTRA_DISTRACTORS = {
    big: ["兩天", "半天", "兩個時辰"],
    small: ["兩歲", "三個月", "五天"]
  };

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
      key: "big-to-small",
      subject: function (row) { return row.big; },
      makePrompt: function (row) { return "大運計算公式中,「" + row.big + "」相當於多少?"; },
      answer: function (row) { return row.small; },
      field: "small",
      explain: function (row) { return row.big + "等於" + row.small + "。" + FULL_FORMULA; }
    },
    {
      key: "small-to-big",
      subject: function (row) { return row.small; },
      makePrompt: function (row) { return "大運計算公式中,「" + row.small + "」是由多少換算而來?"; },
      answer: function (row) { return row.big; },
      field: "big",
      explain: function (row) { return row.small + "是由" + row.big + "換算而來。" + FULL_FORMULA; }
    }
  ];

  function generateQuestion() {
    var mode = MODES[Math.floor(Math.random() * MODES.length)];
    var row = ROWS[Math.floor(Math.random() * ROWS.length)];
    var answer = mode.answer(row);
    var subject = mode.subject(row);

    var distractorPool = ROWS
      .filter(function (r) { return r !== row; })
      .map(function (r) { return r[mode.field]; })
      .concat(EXTRA_DISTRACTORS[mode.field])
      .filter(function (v) { return v !== subject && v !== answer; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: mode.makePrompt(row),
      options: options,
      answerIndex: answerIndex,
      explanation: mode.explain(row)
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dayun-jisuan",
    name: "大運計算公式",
    category: "曆法與旺衰",
    generateQuestion: generateQuestion
  });
})();
