const { SlashCommandBuilder } = require("discord.js");
const { getCharacter, getBackpack } = require("../../utils/rpg/characters");
const moment = require("moment");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("status")
    .setDescription("查詢角色狀態"),
  async execute(interaction) {
    const userId = interaction.user.id;
    const character = getCharacter(userId);
    const backpack = getBackpack(userId);

    if (!character) {
      await interaction.reply(
        `你還沒有創建角色，請使用 /createcharacter 指令來創建角色。`
      );
      return;
    }

    const weaponName =
      character.weapon && character.weapon.name ? character.weapon.name : "無";
    const armorName =
      character.armor && character.armor.name ? character.armor.name : "無";
    const artifactName =
      character.artifact && character.artifact.name
        ? character.artifact.name
        : "無";

    // 計算每種紅藥水的數量
    const potionCounts = character.potions.reduce((counts, potion) => {
      counts[potion.name] = (counts[potion.name] || 0) + 1;
      return counts;
    }, {});

    const potionList =
      Object.entries(potionCounts)
        .map(([name, count]) => `${name} x${count}`)
        .join(", ") || "無";

    const itemsCount = backpack.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const itemsList =
      backpack.items
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", ") || "無";

    const maxLoggingTimes = 1 + Math.floor(character.level / 100) * 2; // 每100等增加1次伐木次數
    const maxFishingTimes = 1 + Math.floor(character.level / 100) * 2; // 每100等增加1次釣魚次數

    const today = moment().startOf("day");
    const lastLoggingTime = moment(character.lastLoggingTime).startOf("day");
    const lastFishingTime = moment(character.lastFishingTime).startOf("day");

    const remainingLoggingTimes = today.isSame(lastLoggingTime)
      ? maxLoggingTimes - (character.loggingTimesToday || 0)
      : maxLoggingTimes;
    const remainingFishingTimes = today.isSame(lastFishingTime)
      ? maxFishingTimes - (character.fishingTimesToday || 0)
      : maxFishingTimes;

    await interaction.reply(
      `\`\`\`
角色狀態：
冒險者：<@${userId}>
職業：${character.class || "未知"}
攻擊：${character.attack || 0}
防禦：${character.defense || 0}
敏捷：${character.agility || 0}
HP：${character.hp || 0}
等級：${character.level || 1}
經驗值：${character.experience || 0}
紅藥水：${potionList}
武器：${weaponName}
防具：${armorName}
神器：${artifactName}
創建時間：${character.createdAt || "未知"}
今日剩餘伐木次數：${remainingLoggingTimes}
今日剩餘釣魚次數：${remainingFishingTimes}
背包持有物品：${itemsList}
\`\`\``
    );
  },
};
