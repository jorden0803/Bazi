(function () {
  var GROUPS = [
    { members: ["寅", "卯", "辰"], hui: "木" },
    { members: ["巳", "午", "未"], hui: "火" },
    { members: ["申", "酉", "戌"], hui: "金" },
    { members: ["亥", "子", "丑"], hui: "水" }
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

  function explain(group) {
    return group.members.join("") + "三會,會" + group.hui;
  }

  function generateMissingQuestion() {
    var group = GROUPS[Math.floor(Math.random() * GROUPS.length)];
    var missingIdx = Math.floor(Math.random() * group.members.length);
    var answer = group.members[missingIdx];
    var shown = group.members.filter(function (m, i) { return i !== missingIdx; });

    var otherMembers = GROUPS
      .filter(function (g) { return g !== group; })
      .reduce(function (acc, g) { return acc.concat(g.members); }, []);
    var distractors = pick(otherMembers, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "「" + shown.join("、") + "」三會會" + group.hui + ",還缺哪個地支?",
      options: options,
      answerIndex: answerIndex,
      explanation: explain(group)
    };
  }

  function generateHuiQuestion() {
    var group = GROUPS[Math.floor(Math.random() * GROUPS.length)];
    var answer = group.hui;
    var distractorPool = GROUPS
      .filter(function (g) { return g !== group; })
      .map(function (g) { return g.hui; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "「" + group.members.join("") + "」三會會什麼?",
      options: options,
      answerIndex: answerIndex,
      explanation: explain(group)
    };
  }

  function generateQuestion() {
    return Math.random() < 0.5 ? generateMissingQuestion() : generateHuiQuestion();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dizhi-sanhui",
    name: "地支三會",
    category: "干支合沖會",
    generateQuestion: generateQuestion
  });
})();
