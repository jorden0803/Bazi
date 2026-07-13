(function () {
  var PAIRS = [
    { a: "子", b: "丑", hua: "土或水" },
    { a: "寅", b: "亥", hua: "木" },
    { a: "卯", b: "戌", hua: "火" },
    { a: "辰", b: "酉", hua: "金" },
    { a: "巳", b: "申", hua: "水" },
    { a: "午", b: "未", hua: "火" }
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

  function dedupExcept(values, answer) {
    return values.filter(function (v, i, arr) { return v !== answer && arr.indexOf(v) === i; });
  }

  function generatePartnerQuestion() {
    var pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    var askA = Math.random() < 0.5;
    var known = askA ? pair.a : pair.b;
    var answer = askA ? pair.b : pair.a;

    var pool = PAIRS.reduce(function (acc, p) { return acc.concat([p.a, p.b]); }, []);
    var distractorPool = dedupExcept(pool.filter(function (z) { return z !== known; }), answer);
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "地支「" + known + "」與哪個地支相合(六合)?",
      options: options,
      answerIndex: answerIndex,
      explanation: pair.a + pair.b + "合,化" + pair.hua
    };
  }

  function generateHuaQuestion() {
    var pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    var answer = pair.hua;
    var distractorPool = dedupExcept(PAIRS.map(function (p) { return p.hua; }), answer);
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "「" + pair.a + pair.b + "合」化什麼?",
      options: options,
      answerIndex: answerIndex,
      explanation: pair.a + pair.b + "合,化" + pair.hua
    };
  }

  function generateQuestion() {
    return Math.random() < 0.5 ? generatePartnerQuestion() : generateHuaQuestion();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dizhi-liuhe",
    name: "地支六合",
    category: "干支合沖會",
    generateQuestion: generateQuestion
  });
})();
