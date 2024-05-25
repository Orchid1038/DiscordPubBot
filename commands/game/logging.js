const { SlashCommandBuilder } = require("discord.js");
const {
  getCharacter,
  addItem,
  saveCharacters,
} = require("../../utils/rpg/characters");

const LOGGING_STAMINA_COST = 20; // 每次伐木消耗的體力

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("logging")
    .setDescription(`進行伐木（消耗 ${LOGGING_STAMINA_COST} 體力）`),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
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

      if (character.stamina < LOGGING_STAMINA_COST) {
        await interaction.reply(`你的體力不足，無法進行伐木。`);
        return;
      }

      // 消耗體力
      character.stamina -= LOGGING_STAMINA_COST;
      saveCharacters();

      // 簡單的伐木小遊戲
      const success = Math.random() < 0.7; // 70%的成功率
      if (success) {
        const woodTypes = ["橡木", "松木", "杉木", "楓木", "竹子"];
        const woodName =
          woodTypes[Math.floor(Math.random() * woodTypes.length)];
        addItem(userId, {
          name: woodName,
          type: "wood",
          value: 10,
          quantity: 1,
        });
        await interaction.reply(`你成功伐木並獲得了一些 ${woodName}。`);
      } else {
        await interaction.reply(`伐木失敗，你沒有獲得任何木材。`);
      }
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: `執行此命令時發生錯誤：${error.message}`,
        ephemeral: true,
      });
    }
  },
};
