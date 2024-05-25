const { SlashCommandBuilder } = require("discord.js");
const {
  getCharacter,
  updateExperience,
  addPotion,
  equipWeapon,
  equipArmor,
  equipArtifact,
} = require("../../utils/rpg/characters");
const { battleMonster } = require("../../utils/rpg/battle");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("fightmonster")
    .setDescription("打小怪"),
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

      const result = battleMonster(userId);
      if (result.result.includes("勝利")) {
        updateExperience(userId, result.enemy.exp); // 根據小怪的經驗值更新角色經驗值
        if (result.enemy.loot) {
          if (
            result.enemy.loot.potions &&
            result.enemy.loot.potions.length > 0
          ) {
            const potion =
              result.enemy.loot.potions[
                Math.floor(Math.random() * result.enemy.loot.potions.length)
              ];
            addPotion(userId, potion);
            result.result += ` 並獲得了一瓶${potion.name}！`;
          }
          if (
            result.enemy.loot.weapons &&
            result.enemy.loot.weapons.length > 0
          ) {
            const weapon =
              result.enemy.loot.weapons[
                Math.floor(Math.random() * result.enemy.loot.weapons.length)
              ];
            equipWeapon(userId, weapon);
            result.result += ` 並獲得了一把武器：${weapon.name}！`;
          }
          if (result.enemy.loot.armors && result.enemy.loot.armors.length > 0) {
            const armor =
              result.enemy.loot.armors[
                Math.floor(Math.random() * result.enemy.loot.armors.length)
              ];
            equipArmor(userId, armor);
            result.result += ` 並獲得了一件防具：${armor.name}！`;
          }
          if (
            result.enemy.loot.artifacts &&
            result.enemy.loot.artifacts.length > 0
          ) {
            const artifact =
              result.enemy.loot.artifacts[
                Math.floor(Math.random() * result.enemy.loot.artifacts.length)
              ];
            equipArtifact(userId, artifact);
            result.result += ` 並獲得了一件神器：${artifact.name}！`;
          }
        }
      } else {
        await interaction.reply(
          `你遇到了 ${result.enemy.name}！\n戰鬥結果：${result.result}\n你的角色已死亡，請重新創建角色。`
        );
        return;
      }
      await interaction.reply(
        `你遇到了 ${result.enemy.name}！\n戰鬥結果：${
          result.result
        }\n剩餘 HP：${result.characterHp}\n敵人 HP：${
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
