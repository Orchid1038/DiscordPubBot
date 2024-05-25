const { SlashCommandBuilder } = require("discord.js");
const { getCharacter, sellItem } = require("../../utils/rpg/characters");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("sellitem")
    .setDescription("出售物品以賺取金錢")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("要出售的物品名稱")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const itemName = interaction.options.getString("item");
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

      const item = sellItem(userId, itemName);
      await interaction.reply(
        `你已出售 ${item.name}，獲得了 ${item.value} 金幣。當前金幣：${character.gold}`
      );
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: `執行此命令時發生錯誤：${error.message}`,
        ephemeral: true,
      });
    }
  },
};
