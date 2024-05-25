const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("擲骰子")
    .addIntegerOption((option) =>
      option.setName("sides").setDescription("骰子的面數").setRequired(true)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides");

    if (sides < 1) {
      await interaction.reply("骰子的面數必須大於零！");
      return;
    }

    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`你擲出了 ${result}（1-${sides} 面）`);
  },
};
