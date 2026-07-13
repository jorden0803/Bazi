(function () {
  var diagram = window.BaziHandDiagram;

  var HAND_SVG =
    "<svg viewBox=\"0 0 " + diagram.viewBoxW + " " + diagram.viewBoxH + "\" class=\"hand-bg\" aria-hidden=\"true\">" +
      diagram.backgroundMarkup +
    "</svg>";

  function pick(arr, n) {
    var copy = arr.slice();
    var result = [];
    while (result.length < n && copy.length) {
      var i = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(i, 1)[0]);
    }
    return result;
  }

  function generateQuestion() {
    var shuffled = pick(diagram.positions, diagram.positions.length);
    var answerIndex = Math.floor(Math.random() * shuffled.length);
    var target = shuffled[answerIndex];

    return {
      prompt: "地支「" + target.zhi + "」在手掌的哪個位置?(直接點圖上的位置)",
      type: "hand",
      handSvg: HAND_SVG,
      hotspots: shuffled.map(function (p) {
        return { x: (p.x / diagram.viewBoxW) * 100, y: (p.y / diagram.viewBoxH) * 100 };
      }),
      answerIndex: answerIndex,
      explanation: target.zhi + "在" + target.label
    };
  }

  window.BaziTopics = window.BaziTopics || [];
  window.BaziTopics.push({
    id: "shouzhang-dizhi",
    name: "手掌地支圖",
    category: "手掌地支",
    generateQuestion: generateQuestion
  });
})();
