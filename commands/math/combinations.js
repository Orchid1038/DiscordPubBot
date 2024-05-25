const { SlashCommandBuilder } = require("discord.js");
const math = require("../../utils/math");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("combinations")
    .setDescription("計算排列組合的 C(n, k)")
    .addIntegerOption((option) =>
      option.setName("n").setDescription("總數量").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("k").setDescription("選取數量").setRequired(true)
    ),
  async execute(interaction) {
    const n = interaction.options.getInteger("n");
    const k = interaction.options.getInteger("k");

    try {
      // 計算 C(n, k)
      const result = math.combinations(n, k);
      await interaction.reply(`C(${n}, ${k}) = ${result}`);
    } catch (error) {
      console.error("計算排列組合時發生錯誤:", error);
      await interaction.reply({
        content: "計算時發生錯誤，請檢查你的輸入。",
        ephemeral: true,
      });
    }
  },
};
