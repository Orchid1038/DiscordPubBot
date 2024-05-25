const { SlashCommandBuilder } = require("discord.js");
const {
  getCharacter,
  updateExperience,
  addPotion,
  equipWeapon,
  equipArmor,
  equipArtifact,
} = require("../../utils/rpg/characters");
const { battle } = require("../../utils/rpg/battle");
const { getBoss, getAllBosses } = require("../../utils/rpg/bosses");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("fightboss")
    .setDescription("打 Boss")
    .addStringOption((option) =>
      option
        .setName("boss")
        .setDescription("選擇Boss")
        .setRequired(true)
        .addChoices(
          ...getAllBosses().map((boss) => ({
            name: boss.name,
            value: boss.name,
          }))
        )
    ),
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
        if (boss.loot) {
          if (boss.loot.potions && boss.loot.potions.length > 0) {
            const potion =
              boss.loot.potions[
                Math.floor(Math.random() * boss.loot.potions.length)
              ];
            addPotion(userId, potion);
            result.result += ` 並獲得了一瓶${potion.name}！`;
          }
          if (boss.loot.weapons && boss.loot.weapons.length > 0) {
            const weapon =
              boss.loot.weapons[
                Math.floor(Math.random() * boss.loot.weapons.length)
              ];
            equipWeapon(userId, weapon);
            result.result += ` 並獲得了一把武器：${weapon.name}！`;
          }
          if (boss.loot.armors && boss.loot.armors.length > 0) {
            const armor =
              boss.loot.armors[
                Math.floor(Math.random() * boss.loot.armors.length)
              ];
            equipArmor(userId, armor);
            result.result += ` 並獲得了一件防具：${armor.name}！`;
          }
          if (boss.loot.artifacts && boss.loot.artifacts.length > 0) {
            const artifact =
              boss.loot.artifacts[
                Math.floor(Math.random() * boss.loot.artifacts.length)
              ];
            equipArtifact(userId, artifact);
            result.result += ` 並獲得了一件神器：${artifact.name}！`;
          }
        }
      } else {
        await interaction.followUp(
          `戰鬥結果：${result.result}\n你的角色已死亡，請重新創建角色。`
        );
        return;
      }
      await interaction.followUp(
        `戰鬥結果：${result.result}\n剩餘 HP：${result.characterHp}\nBoss HP：${
          result.enemy.hp
        }\n戰鬥過程：\n\`\`\`${result.battleLog.join("\n")}\`\`\``
      );
    } catch (error) {
      console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
      await interaction.reply({
        content: "執行此命令時發生錯誤！",
        ephemeral: true,
      });
    }
  },
};
