const { SlashCommandBuilder } = require("discord.js");
const {
  getCharacter,
  equipWeapon,
  equipArmor,
  equipArtifact,
} = require("../../utils/rpg/characters");
const {
  getWeaponByName,
  getArmorByName,
  getArtifactByName,
  weapons,
  armors,
  artifacts,
} = require("../../utils/rpg/items");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("equip")
    .setDescription("裝備或卸下裝備")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("選擇裝備類型")
        .setRequired(true)
        .addChoices(
          { name: "武器", value: "weapon" },
          { name: "防具", value: "armor" },
          { name: "神器", value: "artifact" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("裝備名稱")
        .setRequired(true)
        .addChoices(
          ...weapons.map((w) => ({ name: w.name, value: w.name })),
          ...armors.map((a) => ({ name: a.name, value: a.name })),
          ...artifacts.map((ar) => ({ name: ar.name, value: ar.name }))
        )
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const type = interaction.options.getString("type");
    const name = interaction.options.getString("name");
    const character = getCharacter(userId);

    if (!character) {
      await interaction.reply(
        `你還沒有創建角色，請使用 /createcharacter 指令來創建角色。`
      );
      return;
    }

    let item;
    if (type === "weapon") {
      item = getWeaponByName(name);
      if (!item) {
        await interaction.reply(`找不到名稱為 ${name} 的武器。`);
        return;
      }
      equipWeapon(userId, item);
    } else if (type === "armor") {
      item = getArmorByName(name);
      if (!item) {
        await interaction.reply(`找不到名稱為 ${name} 的防具。`);
        return;
      }
      equipArmor(userId, item);
    } else if (type === "artifact") {
      item = getArtifactByName(name);
      if (!item) {
        await interaction.reply(`找不到名稱為 ${name} 的神器。`);
        return;
      }
      equipArtifact(userId, item);
    }

    await interaction.reply(
      `你已裝備 ${type}：${item.name}\n當前狀態：\n攻擊：${character.attack}\n防禦：${character.defense}\n敏捷：${character.agility}`
    );
  },
};
