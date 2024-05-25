const dinnerOptions = [
  "牛排",
  "燴飯",
  "烤雞",
  "魚類料理",
  "素食咖哩",
  "燉肉",
  "麵食",
  "火鍋",
  "燒烤",
  "冷盤",
];

module.exports = {
  metadata: {
    name: "dinner",
    description: "隨機選擇一種晚餐",
  },
  execute: async (interaction) => {
    const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
    const dinner = dinnerOptions[randomIndex];
    await interaction.reply(`晚餐吃 ${dinner} 如何?`);
  },
};
