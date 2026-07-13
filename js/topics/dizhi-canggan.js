(function () {
  var DATA = [
    { zhi: "子", gan: ["癸"] },
    { zhi: "丑", gan: ["己", "癸", "辛"] },
    { zhi: "寅", gan: ["甲", "丙", "戊"] },
    { zhi: "卯", gan: ["乙"] },
    { zhi: "辰", gan: ["戊", "乙", "癸"] },
    { zhi: "巳", gan: ["丙", "戊", "庚"] },
    { zhi: "午", gan: ["丁", "己"] },
    { zhi: "未", gan: ["己", "丁", "乙"] },
    { zhi: "申", gan: ["庚", "壬", "戊"] },
    { zhi: "酉", gan: ["辛"] },
    { zhi: "戌", gan: ["戊", "辛", "丁"] },
    { zhi: "亥", gan: ["壬", "甲"] }
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

  function ganStr(row) {
    return row.gan.join("、");
  }

  function explain(row) {
    return row.zhi + "藏" + ganStr(row) + "(本氣" + row.gan[0] + ")";
  }

  function generateBenqiQuestion() {
    var row = DATA[Math.floor(Math.random() * DATA.length)];
    var answer = row.gan[0];

    var distractorPool = DATA
      .filter(function (r) { return r !== row; })
      .map(function (r) { return r.gan[0]; })
      .filter(function (v, i, arr) { return v !== answer && arr.indexOf(v) === i; });
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "地支「" + row.zhi + "」的本氣(主氣)是?",
      options: options,
      answerIndex: answerIndex,
      explanation: explain(row)
    };
  }

  function generateFullSetQuestion() {
    var row = DATA[Math.floor(Math.random() * DATA.length)];
    var answer = ganStr(row);

    var distractorPool = DATA
      .filter(function (r) { return r !== row; })
      .map(ganStr);
    var distractors = pick(distractorPool, 3);
    var options = shuffle([answer].concat(distractors));
    var answerIndex = options.indexOf(answer);

    return {
      prompt: "地支「" + row.zhi + "」藏干有哪些?",
      options: options,
      answerIndex: answerIndex,
      explanation: explain(row)
    };
  }

  function generateQuestion() {
    return Math.random() < 0.5 ? generateBenqiQuestion() : generateFullSetQuestion();
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "dizhi-canggan",
    name: "地支藏干",
    category: "地支藏干",
    generateQuestion: generateQuestion
  });
})();
