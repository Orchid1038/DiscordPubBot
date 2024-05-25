const breakfastOptions = [
  "雞蛋三明治",
  "燕麥粥",
  "水果沙拉",
  "法式吐司",
  "班尼迪克蛋",
  "鬆餅",
  "麥片",
  "烤馬鈴薯",
  "培根和雞蛋",
  "燕麥餅乾",
];

module.exports = {
  metadata: {
    name: "breakfast",
    description: "隨機選擇一種早餐",
  },
  execute: async (interaction) => {
    const randomIndex = Math.floor(Math.random() * breakfastOptions.length);
    const breakfast = breakfastOptions[randomIndex];
    await interaction.reply(`今天早餐吃 ${breakfast} 怎麼樣?`);
  },
};
