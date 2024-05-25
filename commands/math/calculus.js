const { SlashCommandBuilder } = require("discord.js");
const math = require("mathjs");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function trapezoidalIntegration(fn, a, b, n) {
  const h = (b - a) / n;
  let sum = 0.5 * (fn(a) + fn(b));
  for (let i = 1; i < n; i++) {
    sum += fn(a + i * h);
  }
  return sum * h;
}

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("calculus")
    .setDescription("選擇微分或積分，並提供三個數字參數進行運算")
    .addStringOption((option) =>
      option
        .setName("operation")
        .setDescription("選擇微分或積分")
        .setRequired(true)
        .addChoices(
          { name: "微分", value: "derivative" },
          { name: "積分", value: "integral" }
        )
    )
    .addNumberOption((option) =>
      option.setName("a").setDescription("係數 a").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("b").setDescription("係數 b").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("c").setDescription("係數 c").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("min").setDescription("最小值").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("max").setDescription("最大值").setRequired(true)
    ),
  async execute(interaction) {
    const operation = interaction.options.getString("operation");
    const a = interaction.options.getNumber("a");
    const b = interaction.options.getNumber("b");
    const c = interaction.options.getNumber("c");
    const min = interaction.options.getNumber("min");
    const max = interaction.options.getNumber("max");

    try {
      const expression = `${a}*x^2 + ${b}*x + ${c}`;
      let result;
      let steps = [];

      if (operation === "derivative") {
        const derivative = math.derivative(expression, "x");
        result = derivative.toString();
        steps.push(`原始表達式: ${expression}`);
        steps.push(`微分結果: ${result}`);
      } else if (operation === "integral") {
        const fn = (x) => math.evaluate(expression, { x });
        result = trapezoidalIntegration(fn, min, max, 1000);
        steps.push(`原始表達式: ${expression}`);
        steps.push(`積分結果: ${result}`);
      }

      // 計算繪圖點，確保步長有效
      const step = (max - min) / 100;
      const xValues = math.range(min, max, step > 0 ? step : 1).toArray();
      const yValues = xValues.map((x) => {
        if (operation === "derivative") {
          return math.evaluate(result, { x });
        } else if (operation === "integral") {
          return math.evaluate(expression, { x });
        }
      });

      // 繪圖
      const canvas = createCanvas(800, 600);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 繪製 X 和 Y 軸
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;

      // Y 軸
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // X 軸
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // 繪製座標標記
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("X", canvas.width - 10, canvas.height / 2 - 10);
      ctx.fillText("Y", canvas.width / 2 + 10, 10);

      // 繪製函數曲線
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;

      const xScale = canvas.width / (max - min);
      const yMax = Math.max(...yValues);
      const yMin = Math.min(...yValues);
      const yScale = canvas.height / (yMax - yMin);

      ctx.beginPath();
      ctx.moveTo(0, canvas.height - (yValues[0] - yMin) * yScale);

      xValues.forEach((x, i) => {
        const y = yValues[i];
        ctx.lineTo((x - min) * xScale, canvas.height - (y - yMin) * yScale);
      });

      ctx.stroke();

      // 保存圖像
      const buffer = canvas.toBuffer("image/png");
      const filePath = path.join(__dirname, "calculus-result.png");
      fs.writeFileSync(filePath, buffer);

      // 發送圖像
      await interaction.reply({
        files: [
          {
            attachment: filePath,
            name: "calculus-result.png",
          },
        ],
        content: "```\n微積分？反正也就小case\n" + steps.join("\n") + "\n```",
      });

      // 刪除圖像
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("計算微積分時發生錯誤:", error);
      await interaction.reply({
        content: "計算時發生錯誤，請檢查你的輸入。",
        ephemeral: true,
      });
    }
  },
};
