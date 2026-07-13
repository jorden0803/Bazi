(function () {
  var GROUPS = [
    { members: ["申", "子", "辰"], hua: "水" },
    { members: ["亥", "卯", "未"], hua: "木" },
    { members: ["寅", "午", "戌"], hua: "火" },
    { members: ["巳", "酉", "丑"], hua: "金" }
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
    return group.members.join("") + "三合,化" + group.hua + "局";
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
      prompt: "「" + shown.join("、") + "」三合化" + group.hua + "局,還缺哪個地支?",
      options: options,
      answerIndex: answerIndex,
      explanation: explain(group)
    };
  }

  function generateHuaQuestion() {
    var group = GROUPS[Math.floor(Math.random() * GROUPS.length)];
    var answer = group.hua;
    var distractorPool = GROUPS
      .filter(function (g) { return g !== group; })
      .map(function (g) { return g.hua; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "「" + group.members.join("") + "」三合化什麼局?",
      options: options,
      answerIndex: answerIndex,
      explanation: explain(group)
    };
  }

  function generateQuestion() {
    return Math.random() < 0.5 ? generateMissingQuestion() : generateHuaQuestion();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dizhi-sanhe",
    name: "地支三合",
    category: "干支合沖會",
    generateQuestion: generateQuestion
  });
})();
