const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getCharacter, usePotion } = require("../../utils/rpg/characters");
const { getPotionByName } = require("../../utils/rpg/items");

const potionsFilePath = path.join(
  __dirname,
  "../../utils/rpg/database/potions.json"
);

function loadPotions() {
  if (fs.existsSync(potionsFilePath)) {
    const data = fs.readFileSync(potionsFilePath, "utf-8");
    return JSON.parse(data);
  } else {
    throw new Error("紅藥水數據文件不存在！");
  }
}

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("drinkpotion")
    .setDescription("喝紅藥水")
    .addStringOption((option) => {
      const potions = loadPotions();
      const choices = potions.map((potion) => ({
        name: potion.name,
        value: potion.name,
      }));
      return option
        .setName("potion")
        .setDescription("選擇你要喝的紅藥水")
        .setRequired(true)
        .addChoices(...choices);
    }),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const potionName = interaction.options.getString("potion");
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

      const potion = getPotionByName(potionName);
      if (!potion) {
        await interaction.reply(`找不到對應的紅藥水：${potionName}`);
        return;
      }

      const result = usePotion(userId, potionName);
      if (result.success) {
        await interaction.reply(
          `你使用了一瓶${result.data.name}，恢復了${result.data.hpRestore}HP。\n剩餘 HP：${character.hp}`
        );
      } else {
        await interaction.reply(result.message);
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
