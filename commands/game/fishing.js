const { SlashCommandBuilder } = require("discord.js");
const {
  getCharacter,
  addItem,
  saveCharacters,
} = require("../../utils/rpg/characters");

const FISHING_STAMINA_COST = 10; // 每次釣魚消耗的體力

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("fishing")
    .setDescription(`進行釣魚（消耗 ${FISHING_STAMINA_COST} 體力）`),
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

      if (character.stamina < FISHING_STAMINA_COST) {
        await interaction.reply(`你的體力不足，無法進行釣魚。`);
        return;
      }

      // 消耗體力
      character.stamina -= FISHING_STAMINA_COST;
      saveCharacters();

      // 簡單的釣魚小遊戲
      const success = Math.random() < 0.5; // 50%的成功率
      if (success) {
        const fishTypes = ["鯉魚", "金魚", "鮭魚", "鯖魚", "青魚"];
        const fishName =
          fishTypes[Math.floor(Math.random() * fishTypes.length)];
        addItem(userId, {
          name: fishName,
          type: "fish",
          value: 10,
          quantity: 1,
        });
        await interaction.reply(`你成功釣魚並獲得了一條 ${fishName}。`);
      } else {
        await interaction.reply(`釣魚失敗，你沒有獲得任何魚。`);
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
