(function () {
  var GROUPS = ["比劫", "食傷", "財", "官殺", "印"];

  // 循環與五行生剋同構:比劫生食傷、食傷生財、財生官殺、官殺生印、印生比劫
  var GENERATES = { 比劫: "食傷", 食傷: "財", 財: "官殺", 官殺: "印", 印: "比劫" };
  // 比劫剋財、財剋印、印剋食傷、食傷剋官殺、官殺剋比劫
  var OVERCOMES = { 比劫: "財", 財: "印", 印: "食傷", 食傷: "官殺", 官殺: "比劫" };

  function invert(map) {
    var inv = {};
    Object.keys(map).forEach(function (k) {
      inv[map[k]] = k;
    });
    return inv;
  }

  var GENERATED_BY = invert(GENERATES);
  var OVERCOME_BY = invert(OVERCOMES);

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
      key: "gen-forward",
      map: GENERATES,
      makePrompt: function (g) { return "「" + g + "」生什麼?"; },
      makeExplanation: function (g, a) { return g + "生" + a; }
    },
    {
      key: "gen-backward",
      map: GENERATED_BY,
      makePrompt: function (g) { return "什麼「生」" + g + "?"; },
      makeExplanation: function (g, a) { return a + "生" + g; }
    },
    {
      key: "ke-forward",
      map: OVERCOMES,
      makePrompt: function (g) { return "「" + g + "」剋什麼?"; },
      makeExplanation: function (g, a) { return g + "剋" + a; }
    },
    {
      key: "ke-backward",
      map: OVERCOME_BY,
      makePrompt: function (g) { return "什麼「剋」" + g + "?"; },
      makeExplanation: function (g, a) { return a + "剋" + g; }
    }
  ];

  function generateQuestion() {
    var mode = MODES[Math.floor(Math.random() * MODES.length)];
    var group = GROUPS[Math.floor(Math.random() * GROUPS.length)];
    var answer = mode.map[group];

    var distractorPool = GROUPS.filter(function (g) { return g !== answer; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));

    return {
      prompt: mode.makePrompt(group),
      options: options,
      answerIndex: options.indexOf(answer),
      explanation: mode.makeExplanation(group, answer)
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "shishen-shengke",
    name: "十神相生相剋",
    category: "十神",
    generateQuestion: generateQuestion
  });
})();
