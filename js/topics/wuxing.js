(function () {
  var ELEMENTS = ["木", "火", "土", "金", "水"];

  // 順向:木生火、火生土、土生金、金生水、水生木
  var GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  // 隔位:木剋土、土剋水、水剋火、火剋金、金剋木
  var OVERCOMES = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

  function invert(map) {
    var inv = {};
    Object.keys(map).forEach(function (k) {
      inv[map[k]] = k;
    });
    return inv;
  }

  var GENERATED_BY = invert(GENERATES); // 誰生我
  var OVERCOME_BY = invert(OVERCOMES); // 誰剋我

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
      makePrompt: function (e) { return "「" + e + "」生什麼?"; },
      makeExplanation: function (e, a) { return e + "生" + a; }
    },
    {
      key: "gen-backward",
      map: GENERATED_BY,
      makePrompt: function (e) { return "什麼「生」" + e + "?"; },
      makeExplanation: function (e, a) { return a + "生" + e; }
    },
    {
      key: "ke-forward",
      map: OVERCOMES,
      makePrompt: function (e) { return "「" + e + "」剋什麼?"; },
      makeExplanation: function (e, a) { return e + "剋" + a; }
    },
    {
      key: "ke-backward",
      map: OVERCOME_BY,
      makePrompt: function (e) { return "什麼「剋」" + e + "?"; },
      makeExplanation: function (e, a) { return a + "剋" + e; }
    }
  ];

  function generateQuestion() {
    var mode = MODES[Math.floor(Math.random() * MODES.length)];
    var element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    var answer = mode.map[element];

    var distractorPool = ELEMENTS.filter(function (e) { return e !== answer; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: mode.makePrompt(element),
      options: options,
      answerIndex: answerIndex,
      explanation: mode.makeExplanation(element, answer)
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "wuxing-shengke",
    name: "五行生剋",
    category: "五行基礎",
    generateQuestion: generateQuestion
  });
})();
