const { SlashCommandBuilder } = require("discord.js");
const { getCharacter, addItem } = require("../../utils/rpg/characters");
const fs = require("fs");
const path = require("path");

const recipesFilePath = path.join(
  __dirname,
  "../../utils/rpg/database",
  "craftingRecipes.json"
);

let craftingRecipes = [];

// 加載製作配方數據
function loadRecipes() {
  if (fs.existsSync(recipesFilePath)) {
    const data = fs.readFileSync(recipesFilePath, "utf-8");
    craftingRecipes = JSON.parse(data).recipes;
  } else {
    throw new Error("製作配方數據文件不存在！");
  }
}

loadRecipes();

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("craftitem")
    .setDescription("製作物品")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("要製作的物品名稱")
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

      const recipe = craftingRecipes.find((r) => r.name === itemName);
      if (!recipe) {
        await interaction.reply(`找不到名稱為 ${itemName} 的製作配方。`);
        return;
      }

      // 檢查是否有足夠的材料
      const hasIngredients = recipe.ingredients.every((ingredient) => {
        const item = character.items.find(
          (i) => i.name === ingredient.name && i.type === ingredient.type
        );
        return item && item.quantity >= ingredient.quantity;
      });

      if (!hasIngredients) {
        await interaction.reply(`你沒有足夠的材料來製作 ${itemName}。`);
        return;
      }

      // 消耗材料
      recipe.ingredients.forEach((ingredient) => {
        const item = character.items.find(
          (i) => i.name === ingredient.name && i.type === ingredient.type
        );
        item.quantity -= ingredient.quantity;
        if (item.quantity <= 0) {
          character.items = character.items.filter((i) => i !== item);
        }
      });

      // 添加製作結果
      addItem(userId, recipe.result);

      await interaction.reply(`你成功製作了 ${itemName}。`);
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: `執行此命令時發生錯誤：${error.message}`,
        ephemeral: true,
      });
    }
  },
};
