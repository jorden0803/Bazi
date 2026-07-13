(function () {
  var VIEWBOX_W = 350;
  var VIEWBOX_H = 380;

  // 左手掌訣,左→右:食指、中指、無名指、小指(拇指在食指外側)
  // 食指(根→尖)寅卯辰巳;中指只標根、尖 丑...午;
  // 無名指只標根、尖 子...未;小指(根→尖)亥戌酉申
  var POSITIONS = [
    { zhi: "子", x: 210, y: 200, label: "無名指根部" },
    { zhi: "丑", x: 140, y: 200, label: "中指根部" },
    { zhi: "寅", x: 70, y: 200, label: "食指根部" },
    { zhi: "卯", x: 70, y: 155, label: "食指第二節" },
    { zhi: "辰", x: 70, y: 110, label: "食指第三節" },
    { zhi: "巳", x: 70, y: 65, label: "食指指尖" },
    { zhi: "午", x: 140, y: 52, label: "中指指尖" },
    { zhi: "未", x: 210, y: 58, label: "無名指指尖" },
    { zhi: "申", x: 280, y: 85, label: "小指指尖" },
    { zhi: "酉", x: 280, y: 123, label: "小指第三節" },
    { zhi: "戌", x: 280, y: 162, label: "小指第二節" },
    { zhi: "亥", x: 280, y: 200, label: "小指根部" }
  ];

  // Palm-up view of a LEFT hand: thumb attaches on the left of the palm, next to
  // the index finger; pinky is the rightmost finger. Includes joint-crease lines
  // (even where a finger only carries 2 marked positions) and palm lines so it
  // reads unambiguously as a palm, not the back of a hand.
  var BACKGROUND =
    "<rect class=\"hand-shape\" x=\"20\" y=\"195\" width=\"300\" height=\"165\" rx=\"55\" ry=\"45\"/>" +
    "<ellipse class=\"hand-shape\" cx=\"40\" cy=\"250\" rx=\"26\" ry=\"50\" transform=\"rotate(-35 40 250)\"/>" +
    "<rect class=\"hand-shape\" x=\"50\" y=\"50\" width=\"40\" height=\"158\" rx=\"20\"/>" +
    "<rect class=\"hand-shape\" x=\"120\" y=\"37\" width=\"40\" height=\"171\" rx=\"20\"/>" +
    "<rect class=\"hand-shape\" x=\"190\" y=\"53\" width=\"40\" height=\"155\" rx=\"20\"/>" +
    "<rect class=\"hand-shape\" x=\"260\" y=\"70\" width=\"40\" height=\"138\" rx=\"20\"/>" +
    "<path class=\"hand-crease\" d=\"M55,155 Q70,159 85,155\"/>" +
    "<path class=\"hand-crease\" d=\"M55,110 Q70,114 85,110\"/>" +
    "<path class=\"hand-crease\" d=\"M125,101 Q140,105 155,101\"/>" +
    "<path class=\"hand-crease\" d=\"M125,151 Q140,155 155,151\"/>" +
    "<path class=\"hand-crease\" d=\"M195,106 Q210,110 225,106\"/>" +
    "<path class=\"hand-crease\" d=\"M195,153 Q210,157 225,153\"/>" +
    "<path class=\"hand-crease\" d=\"M265,123 Q280,127 295,123\"/>" +
    "<path class=\"hand-crease\" d=\"M265,162 Q280,166 295,162\"/>" +
    "<path class=\"hand-crease palm-line\" d=\"M45,240 Q180,268 295,232\"/>" +
    "<path class=\"hand-crease palm-line\" d=\"M40,285 Q180,318 290,275\"/>" +
    "<text x=\"70\" y=\"228\" class=\"hand-finger-label\">食指</text>" +
    "<text x=\"140\" y=\"228\" class=\"hand-finger-label\">中指</text>" +
    "<text x=\"210\" y=\"228\" class=\"hand-finger-label\">無名指</text>" +
    "<text x=\"280\" y=\"228\" class=\"hand-finger-label\">小指</text>";

  window.BaziHandDiagram = {
    viewBoxW: VIEWBOX_W,
    viewBoxH: VIEWBOX_H,
    positions: POSITIONS,
    backgroundMarkup: BACKGROUND
  };
})();
