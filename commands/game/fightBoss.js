const { SlashCommandBuilder } = require("discord.js");
const {
  getCharacter,
  updateExperience,
  addPotion,
  addItem,
} = require("../../utils/rpg/characters");
const { battle } = require("../../utils/rpg/battle");
const { getBoss, getAllBosses, loadBosses } = require("../../utils/rpg/bosses");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("fightboss")
    .setDescription("打 Boss")
    .addStringOption((option) => {
      // 重新加載 Boss 數據
      loadBosses();
      return option
        .setName("boss")
        .setDescription("選擇Boss")
        .setRequired(true)
        .addChoices(
          ...getAllBosses().map((boss) => ({
            name: boss.name,
            value: boss.name,
          }))
        );
    }),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const bossName = interaction.options.getString("boss");
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

      const boss = getBoss(bossName);
      if (!boss) {
        await interaction.reply("找不到匹配的Boss！");
        return;
      }

      await interaction.reply(
        `你挑戰了Boss **${boss.name}** (等級：${boss.level})！\n描述：${boss.description}\n劇情：${boss.story}`
      );

      const result = battle(userId, boss);

      if (result.result.includes("勝利")) {
        updateExperience(userId, boss.level * 10); // 根據Boss等級獲得經驗值

        // 處理掉落物品
        boss.drops.forEach((drop) => {
          if (Math.random() < drop.probability) {
            if (drop.type === "potion") {
              addPotion(userId, { name: drop.item, hpRestore: 50 }); // 假設紅藥水恢復50點HP
              result.result += ` 並獲得了一瓶${drop.item}！`;
            } else {
              addItem(userId, { name: drop.item, type: drop.type, value: 0 }); // 假設物品價值為0
              result.result += ` 並獲得了一件${
                drop.type === "weapon" ? "武器" : "防具"
              }：${drop.item}！`;
            }
          }
        });

        await interaction.followUp(
          `戰鬥結果：${result.result}\n剩餘 HP：${
            result.characterHp
          }\nBoss HP：${
            result.enemy.hp
          }\n戰鬥過程：\n\`\`\`${result.battleLog.join("\n")}\`\`\``
        );
      } else {
        await interaction.followUp(
          `戰鬥結果：${result.result}\n你的角色已死亡，請重新創建角色。`
        );
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
