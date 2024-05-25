const { SlashCommandBuilder } = require("discord.js");
const { getCharacter, usePotion } = require("../../utils/rpg/characters");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("drinkpotion")
    .setDescription("喝紅藥水"),
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

      const potion = usePotion(userId);
      if (potion) {
        await interaction.reply(
          `你使用了一瓶${potion.name}，恢復了${potion.hpRestore}HP。\n剩餘 HP：${character.hp}`
        );
      } else {
        await interaction.reply("你沒有紅藥水！");
      }
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: "執行此命令時發生錯誤！",
        ephemeral: true,
      });
    }
  },
};
