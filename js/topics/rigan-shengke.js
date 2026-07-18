(function () {
  var GAN = [
    { gan: "甲", element: "木", yinyang: "陽" },
    { gan: "乙", element: "木", yinyang: "陰" },
    { gan: "丙", element: "火", yinyang: "陽" },
    { gan: "丁", element: "火", yinyang: "陰" },
    { gan: "戊", element: "土", yinyang: "陽" },
    { gan: "己", element: "土", yinyang: "陰" },
    { gan: "庚", element: "金", yinyang: "陽" },
    { gan: "辛", element: "金", yinyang: "陰" },
    { gan: "壬", element: "水", yinyang: "陽" },
    { gan: "癸", element: "水", yinyang: "陰" }
  ];

  var GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  var OVERCOMES = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

  var RELATIONS = ["同我", "我生", "我剋", "剋我", "生我"];

  // 同陰陽為「偏」一組,異陰陽為「正」一組
  var TEN_GODS = {
    同我: { same: "比肩", diff: "劫財", group: "比劫" },
    我生: { same: "食神", diff: "傷官", group: "食傷" },
    我剋: { same: "偏財", diff: "正財", group: "財" },
    剋我: { same: "七殺", diff: "正官", group: "官殺" },
    生我: { same: "偏印", diff: "正印", group: "印" }
  };

  var ALL_TEN_GODS = RELATIONS.reduce(function (acc, rel) {
    return acc.concat([TEN_GODS[rel].same, TEN_GODS[rel].diff]);
  }, []);

  function relationOf(day, other) {
    if (day.element === other.element) return "同我";
    if (GENERATES[day.element] === other.element) return "我生";
    if (OVERCOMES[day.element] === other.element) return "我剋";
    if (GENERATES[other.element] === day.element) return "生我";
    return "剋我";
  }

  function tenGodOf(day, other) {
    var rel = relationOf(day, other);
    return day.yinyang === other.yinyang ? TEN_GODS[rel].same : TEN_GODS[rel].diff;
  }

  function relationPhrase(day, other) {
    var rel = relationOf(day, other);
    if (rel === "同我") return "兩者同屬" + day.element;
    if (rel === "我生") return day.element + "生" + other.element;
    if (rel === "我剋") return day.element + "剋" + other.element;
    if (rel === "生我") return other.element + "生" + day.element;
    return other.element + "剋" + day.element;
  }

  function ganLabel(row) {
    return row.gan + "(" + row.yinyang + row.element + ")";
  }

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

  function randomPair() {
    var day = GAN[Math.floor(Math.random() * GAN.length)];
    var others = GAN.filter(function (r) { return r !== day; });
    var other = others[Math.floor(Math.random() * others.length)];
    return { day: day, other: other };
  }

  function build(prompt, answer, distractorPool, explanation) {
    var distractors = pick(distractorPool.filter(function (d) { return d !== answer; }), 3);
    var options = shuffle([answer].concat(distractors));
    return {
      prompt: prompt,
      options: options,
      answerIndex: options.indexOf(answer),
      explanation: explanation
    };
  }

  var MODES = [
    // 日干+他干 → 生剋關係
    function () {
      var p = randomPair();
      var rel = relationOf(p.day, p.other);
      return build(
        "日干「" + p.day.gan + "」見「" + p.other.gan + "」,是哪種生剋關係?",
        rel,
        RELATIONS,
        ganLabel(p.day) + "見" + ganLabel(p.other) + "," + relationPhrase(p.day, p.other) + ",為「" + rel + "」"
      );
    },
    // 日干+他干 → 十神
    function () {
      var p = randomPair();
      var rel = relationOf(p.day, p.other);
      var god = tenGodOf(p.day, p.other);
      var samePolarity = p.day.yinyang === p.other.yinyang;
      // 干擾項優先放同關係的另一個十神(正偏之辨),再補其他十神
      var counterpart = samePolarity ? TEN_GODS[rel].diff : TEN_GODS[rel].same;
      var distractors = [counterpart].concat(
        pick(ALL_TEN_GODS.filter(function (g) { return g !== god && g !== counterpart; }), 2)
      );
      var options = shuffle([god].concat(distractors));
      return {
        prompt: "日干「" + p.day.gan + "」見「" + p.other.gan + "」,十神為何?",
        options: options,
        answerIndex: options.indexOf(god),
        explanation:
          ganLabel(p.day) + "見" + ganLabel(p.other) + "," + relationPhrase(p.day, p.other) +
          "(" + rel + "),陰陽" + (samePolarity ? "相同" : "不同") + ",故為「" + god + "」"
      };
    },
    // 日干+十神 → 他干
    function () {
      var day = GAN[Math.floor(Math.random() * GAN.length)];
      var others = GAN.filter(function (r) { return r !== day; });
      var other = others[Math.floor(Math.random() * others.length)];
      var god = tenGodOf(day, other);
      var answer = other.gan;
      var distractorPool = others
        .filter(function (r) { return r !== other; })
        .map(function (r) { return r.gan; });
      return build(
        "日干「" + day.gan + "」的「" + god + "」是哪個天干?",
        answer,
        distractorPool,
        ganLabel(day) + "見" + ganLabel(other) + "," + relationPhrase(day, other) + ",故" + other.gan + "為" + day.gan + "的「" + god + "」"
      );
    },
    // 生剋關係+陰陽同異 → 十神名稱
    function () {
      var rel = RELATIONS[Math.floor(Math.random() * RELATIONS.length)];
      var same = Math.random() < 0.5;
      var god = same ? TEN_GODS[rel].same : TEN_GODS[rel].diff;
      return build(
        "「" + rel + "」且兩干陰陽" + (same ? "相同" : "不同") + ",十神稱為?",
        god,
        ALL_TEN_GODS,
        rel + "者,陰陽相同為「" + TEN_GODS[rel].same + "」,陰陽不同為「" + TEN_GODS[rel].diff + "」"
      );
    },
    // 十神 → 所屬生剋關係
    function () {
      var rel = RELATIONS[Math.floor(Math.random() * RELATIONS.length)];
      var god = Math.random() < 0.5 ? TEN_GODS[rel].same : TEN_GODS[rel].diff;
      return build(
        "十神「" + god + "」屬於哪種生剋關係?",
        rel,
        RELATIONS,
        TEN_GODS[rel].same + "、" + TEN_GODS[rel].diff + "皆為「" + rel + "」,統稱" + TEN_GODS[rel].group
      );
    }
  ];

  function generateQuestion() {
    return MODES[Math.floor(Math.random() * MODES.length)]();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "rigan-shengke",
    name: "日干生剋與十神",
    category: "十神",
    generateQuestion: generateQuestion
  });
})();
