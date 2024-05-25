const { SlashCommandBuilder } = require("discord.js");
const { restCharacter } = require("../../utils/rpg/characters");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("rest")
    .setDescription("休息（一天只能使用一次，恢復體力和生命值）"),
  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      const result = restCharacter(userId);

      await interaction.reply(result.message);
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: `執行此命令時發生錯誤：${error.message}`,
        ephemeral: true,
      });
    }
  },
};
