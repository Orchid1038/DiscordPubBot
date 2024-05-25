const { SlashCommandBuilder } = require("discord.js");
const { getLevel } = require("../../utils/levels");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("level")
    .setDescription("顯示你的廢話等級")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("要查看等級的使用者")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const { points, level } = getLevel(user.id);

    await interaction.reply(
      `${user} 到底講了多少廢話：\n廢話等級：${level}\n多少句廢話：${points}`
    );
  },
};
