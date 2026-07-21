(function () {
  function table(headers, rows) {
    var thead = "<thead><tr>" + headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead>";
    var tbody = "<tbody>" + rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    return "<table class=\"ref-table\">" + thead + tbody + "</table>";
  }

  function cangganTable(rows) {
    var thead =
      "<thead><tr><th rowspan=\"2\">地支</th><th colspan=\"3\">藏干</th></tr>" +
      "<tr><th>主氣</th><th>中氣</th><th>餘氣</th></tr></thead>";
    var tbody = "<tbody>" + rows.map(function (r) {
      var zhi = r[0], gans = r[1];
      var cells = [0, 1, 2].map(function (i) { return gans[i] || "-"; });
      return "<tr><td>" + zhi + "</td>" + cells.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    return "<table class=\"ref-table\">" + thead + tbody + "</table>";
  }

  window.BaziReference = [
    {
      category: "五行基礎",
      sections: [
        {
          title: "五行生剋",
          html: "<p>順向(生):木生火、火生土、土生金、金生水、水生木</p>" +
                "<p>隔位(剋):木剋土、土剋水、水剋火、火剋金、金剋木</p>"
        },
        {
          title: "五行對應身體器官",
          html: table(["五行", "臟(陰)", "腑(陽)"], [
            ["木", "肝", "膽"],
            ["火", "心", "小腸"],
            ["土", "脾", "胃"],
            ["金", "肺", "大腸"],
            ["水", "腎", "膀胱"]
          ])
        },
        {
          title: "天干五行陰陽",
          html: table(["天干", "五行", "陰陽"], [
            ["甲", "木", "陽"], ["乙", "木", "陰"],
            ["丙", "火", "陽"], ["丁", "火", "陰"],
            ["戊", "土", "陽"], ["己", "土", "陰"],
            ["庚", "金", "陽"], ["辛", "金", "陰"],
            ["壬", "水", "陽"], ["癸", "水", "陰"]
          ])
        },
        {
          title: "地支五行陰陽",
          html: table(["地支", "五行", "陰陽"], [
            ["子", "水", "陽"], ["丑", "土", "陰"],
            ["寅", "木", "陽"], ["卯", "木", "陰"],
            ["辰", "土", "陽"], ["巳", "火", "陰"],
            ["午", "火", "陽"], ["未", "土", "陰"],
            ["申", "金", "陽"], ["酉", "金", "陰"],
            ["戌", "土", "陽"], ["亥", "水", "陰"]
          ])
        }
      ]
    },
    {
      category: "曆法與旺衰",
      sections: [
        {
          title: "二十四節氣與月支",
          html: table(["月份", "地支", "節", "氣"], [
            ["正月", "寅", "立春", "雨水"],
            ["二月", "卯", "驚蟄", "春分"],
            ["三月", "辰", "清明", "穀雨"],
            ["四月", "巳", "立夏", "小滿"],
            ["五月", "午", "芒種", "夏至"],
            ["六月", "未", "小暑", "大暑"],
            ["七月", "申", "立秋", "處暑"],
            ["八月", "酉", "白露", "秋分"],
            ["九月", "戌", "寒露", "霜降"],
            ["十月", "亥", "立冬", "小雪"],
            ["十一月", "子", "大雪", "冬至"],
            ["十二月", "丑", "小寒", "大寒"]
          ])
        },
        {
          title: "五行旺於地支",
          html: table(["五行", "旺於地支"], [
            ["木", "寅、卯、亥、子"],
            ["火", "巳、午、寅、卯"],
            ["土", "辰、戌、丑、未、巳、午"],
            ["金", "申、酉、辰、戌、丑、未"],
            ["水", "亥、子、申、酉"]
          ])
        },
        {
          title: "大運計算公式",
          html: table(["換算前", "換算後"], [
            ["三天", "一歲"],
            ["一天", "四個月"],
            ["一時辰", "十天"],
            ["一分鐘", "一時辰"]
          ]) +
          "<p>用於將出生時刻與最近節氣之間的差距(天、時辰、分鐘),換算成大運的起運歲數(歲、月)。</p>"
        }
      ]
    },
    {
      category: "十二長生",
      sections: [
        {
          title: "十二長生順序",
          html: "<p>長生 → 沐浴 → 冠帶 → 臨官 → 帝旺 → 衰 → 病 → 死 → 墓 → 絕 → 胎 → 養(養之後接回長生,循環)</p>"
        },
        {
          title: "五行(陽干)長生對照表(不含土,土寄生同火)",
          html: table(["階段", "木(甲)", "火(丙)", "金(庚)", "水(壬)"], [
            ["長生", "亥", "寅", "巳", "申"],
            ["沐浴", "子", "卯", "午", "酉"],
            ["冠帶", "丑", "辰", "未", "戌"],
            ["臨官", "寅", "巳", "申", "亥"],
            ["帝旺", "卯", "午", "酉", "子"],
            ["衰", "辰", "未", "戌", "丑"],
            ["病", "巳", "申", "亥", "寅"],
            ["死", "午", "酉", "子", "卯"],
            ["墓", "未", "戌", "丑", "辰"],
            ["絕", "申", "亥", "寅", "巳"],
            ["胎", "酉", "子", "卯", "午"],
            ["養", "戌", "丑", "辰", "未"]
          ]) + "<p>對照三合局:木長生亥、帝旺卯、墓未 → 亥卯未;火長生寅、帝旺午、墓戌 → 寅午戌;金長生巳、帝旺酉、墓丑 → 巳酉丑;水長生申、帝旺子、墓辰 → 申子辰</p>"
        }
      ]
    },
    {
      category: "干支合沖會",
      sections: [
        {
          title: "天干五合",
          html: table(["組合", "化"], [
            ["甲己合", "化土"],
            ["乙庚合", "化金"],
            ["丙辛合", "化水"],
            ["丁壬合", "化木"],
            ["戊癸合", "化火"]
          ])
        },
        {
          title: "地支六合",
          html: table(["組合", "化"], [
            ["子丑合", "化土或水"],
            ["寅亥合", "化木"],
            ["卯戌合", "化火"],
            ["辰酉合", "化金"],
            ["巳申合", "化水"],
            ["午未合", "化火"]
          ])
        },
        {
          title: "地支六沖",
          html: "<p>子午沖、丑未沖、寅申沖、卯酉沖、辰戌沖、巳亥沖</p>"
        },
        {
          title: "地支三合",
          html: table(["組合", "局"], [
            ["申子辰", "化水局"],
            ["亥卯未", "化木局"],
            ["寅午戌", "化火局"],
            ["巳酉丑", "化金局"]
          ])
        },
        {
          title: "地支三會",
          html: table(["組合", "會"], [
            ["寅卯辰", "會木"],
            ["巳午未", "會火"],
            ["申酉戌", "會金"],
            ["亥子丑", "會水"]
          ])
        }
      ]
    },
    {
      category: "地支藏干",
      sections: [
        {
          title: "地支藏干",
          html: cangganTable([
            ["子", ["癸"]],
            ["丑", ["己", "癸", "辛"]],
            ["寅", ["甲", "丙", "戊"]],
            ["卯", ["乙"]],
            ["辰", ["戊", "乙", "癸"]],
            ["巳", ["丙", "戊", "庚"]],
            ["午", ["丁", "己"]],
            ["未", ["己", "丁", "乙"]],
            ["申", ["庚", "壬", "戊"]],
            ["酉", ["辛"]],
            ["戌", ["戊", "辛", "丁"]],
            ["亥", ["壬", "甲"]]
          ])
        }
      ]
    },
    {
      category: "十神",
      sections: [
        {
          title: "十神(生剋 × 陰陽)",
          html: (function () {
            var BOX_W = 116, BOX_H = 72;
            function godLine(gods) {
              return gods.map(function (g) {
                return "<tspan" + (g[1] ? " class=\"ss-god-diff\"" : "") + ">" + g[0] + "</tspan>";
              }).join("<tspan>　</tspan>");
            }
            function box(x, y, gods, group) {
              var cx = x + BOX_W / 2;
              return "<rect class=\"ss-box\" x=\"" + x + "\" y=\"" + y + "\" width=\"" + BOX_W + "\" height=\"" + BOX_H + "\" rx=\"12\"/>" +
                "<text class=\"ss-god\" x=\"" + cx + "\" y=\"" + (y + 31) + "\" text-anchor=\"middle\">" + godLine(gods) + "</text>" +
                "<text class=\"ss-group\" x=\"" + cx + "\" y=\"" + (y + 55) + "\" text-anchor=\"middle\">" + group + "</text>";
            }
            function arrow(x, y1, y2) {
              return "<line class=\"ss-line\" x1=\"" + x + "\" y1=\"" + y1 + "\" x2=\"" + x + "\" y2=\"" + y2 + "\" marker-end=\"url(#ssArrowHead)\"/>";
            }
            function rel(x, y, label) {
              return "<text class=\"ss-rel\" x=\"" + x + "\" y=\"" + y + "\" text-anchor=\"middle\">" + label + "</text>";
            }
            var svg =
              "<svg class=\"shishen-svg\" viewBox=\"0 0 400 390\" role=\"img\" aria-label=\"十神生剋圖\">" +
                "<defs><marker id=\"ssArrowHead\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">" +
                  "<path d=\"M0,0 L8,4 L0,8 Z\" fill=\"var(--muted)\"/>" +
                "</marker></defs>" +
                box(34, 16, [["正官", true], ["七殺", false]], "官殺") +
                box(158, 16, [["正印", true], ["偏印", false]], "印") +
                arrow(92, 88, 156) + rel(64, 126, "剋我") +
                arrow(216, 88, 156) + rel(244, 126, "生我") +
                "<rect class=\"ss-center\" x=\"40\" y=\"162\" width=\"196\" height=\"62\" rx=\"14\"/>" +
                "<text class=\"ss-center-text\" x=\"138\" y=\"200\" text-anchor=\"middle\">日主為我</text>" +
                "<line class=\"ss-line\" x1=\"236\" y1=\"193\" x2=\"276\" y2=\"193\"/>" + rel(257, 184, "同我") +
                box(278, 157, [["比肩", false], ["劫財", true]], "比劫") +
                arrow(92, 232, 294) + rel(64, 266, "我剋") +
                arrow(216, 232, 294) + rel(244, 266, "我生") +
                box(34, 300, [["正財", true], ["偏財", false]], "財") +
                box(158, 300, [["食神", false], ["傷官", true]], "食傷") +
              "</svg>";
            return "<p>口訣:<strong>陰陽不同:財、官、印、劫、傷</strong></p>" +
              "<p>紅字是陰陽不同,黑字是陰陽相同。</p>" +
              "<div class=\"shishen-wrap\">" + svg + "</div>";
          })()
        },
        {
          title: "十神相生相剋",
          html: (function () {
            function chain(title, verb, nodes) {
              var items = nodes.map(function (n, i) {
                var node = "<span class=\"ss-chain-node" + (i === nodes.length - 1 ? " ss-chain-loop" : "") + "\">" + n + "</span>";
                return i === 0 ? node : "<span class=\"ss-chain-arrow\">" + verb + "<br>↓</span>" + node;
              }).join("");
              return "<div class=\"ss-chain\"><div class=\"ss-chain-title\">" + title + "</div>" + items + "</div>";
            }
            return "<div class=\"ss-chains\">" +
              chain("相生", "生", ["財", "官殺", "印", "比劫", "食傷", "財"]) +
              chain("相剋", "剋", ["財", "印", "食傷", "官殺", "比劫", "財"]) +
              "</div>" +
              "<p>一條唸下來,最後又回到財(循環)。</p>";
          })()
        }
      ]
    },
    {
      category: "手掌地支",
      sections: [
        {
          title: "左手掌訣地支圖",
          html: (function () {
            var diagram = window.BaziHandDiagram;
            var dots = diagram.positions.map(function (p) {
              return "<circle cx=\"" + p.x + "\" cy=\"" + p.y + "\" r=\"14\" class=\"hand-label-dot\"/>" +
                     "<text x=\"" + p.x + "\" y=\"" + (p.y + 5) + "\" class=\"hand-label-text\">" + p.zhi + "</text>";
            }).join("");
            return "<div class=\"hand-wrap\">" +
                "<svg viewBox=\"0 0 " + diagram.viewBoxW + " " + diagram.viewBoxH + "\" class=\"hand-bg\">" +
                  diagram.backgroundMarkup + dots +
                "</svg>" +
              "</div>";
          })()
        }
      ]
    }
  ];
})();
