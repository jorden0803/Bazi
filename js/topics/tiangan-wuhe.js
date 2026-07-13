(function () {
  var PAIRS = [
    { a: "甲", b: "己", hua: "土" },
    { a: "乙", b: "庚", hua: "金" },
    { a: "丙", b: "辛", hua: "水" },
    { a: "丁", b: "壬", hua: "木" },
    { a: "戊", b: "癸", hua: "火" }
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
    var distractorPool = dedupExcept(pool.filter(function (g) { return g !== known; }), answer);
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "天干「" + known + "」與哪個天干相合?",
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
    id: "tiangan-wuhe",
    name: "天干五合",
    category: "干支合沖會",
    generateQuestion: generateQuestion
  });
})();
