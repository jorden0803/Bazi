(function () {
  var PAIRS = [
    { a: "子", b: "午" },
    { a: "丑", b: "未" },
    { a: "寅", b: "申" },
    { a: "卯", b: "酉" },
    { a: "辰", b: "戌" },
    { a: "巳", b: "亥" }
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

  function generateQuestion() {
    var pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    var askA = Math.random() < 0.5;
    var known = askA ? pair.a : pair.b;
    var answer = askA ? pair.b : pair.a;

    var pool = PAIRS.reduce(function (acc, p) { return acc.concat([p.a, p.b]); }, []);
    var distractorPool = pool.filter(function (z) { return z !== known && z !== answer; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "地支「" + known + "」與哪個地支相沖(六沖)?",
      options: options,
      answerIndex: answerIndex,
      explanation: pair.a + pair.b + "沖"
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dizhi-liuchong",
    name: "地支六沖",
    category: "干支合沖會",
    generateQuestion: generateQuestion
  });
})();
