const { SlashCommandBuilder } = require("discord.js");
const { getCharacter } = require("../../utils/rpg/characters");
const { performAdventure } = require("../../utils/rpg/adventure");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("adventure")
    .setDescription("進行冒險行為")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("選擇冒險行為")
        .setRequired(true)
        .addChoices(
          { name: "釣魚", value: "fishing" },
          { name: "伐木", value: "logging" },
          { name: "打工", value: "working" }
        )
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const action = interaction.options.getString("action");
      let character = getCharacter(userId);

      if (!character) {
        await interaction.reply(
          `你還沒有創建角色，請使用 /createcharacter 指令來創建角色。`
        );
        return;
      }

      if (character.hp <= 0) {
        await interaction.reply(`你的角色已死亡，請重新創建角色。`);
        return;
      }

      const result = performAdventure(userId, action);
      await interaction.reply(result.message);
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: "執行此命令時發生錯誤！",
        ephemeral: true,
      });
    }
  },
};
