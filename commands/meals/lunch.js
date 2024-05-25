const lunchOptions = [
  "漢堡包",
  "沙拉",
  "墨西哥卷餅",
  "意式pasta",
  "越式河粉",
  "日式便當",
  "泰式咖哩",
  "中式炒飯",
  "三明治",
  "Pizza",
];

module.exports = {
  metadata: {
    name: "lunch",
    description: "隨機選擇一種午餐",
  },
  execute: async (interaction) => {
    const randomIndex = Math.floor(Math.random() * lunchOptions.length);
    const lunch = lunchOptions[randomIndex];
    await interaction.reply(`午餐吃 ${lunch} 如何?`);
  },
};
