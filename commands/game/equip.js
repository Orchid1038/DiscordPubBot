const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const {
  getCharacter,
  getBackpack,
  equipWeapon,
  equipArmor,
  equipArtifact,
  addItem,
  removeItem,
} = require("../../utils/rpg/characters");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("equip")
    .setDescription("裝備或卸下裝備")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("選擇動作")
        .setRequired(true)
        .addChoices(
          { name: "裝備", value: "equip" },
          { name: "卸下", value: "unequip" }
        )
    )
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
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const action = interaction.options.getString("action");
    const type = interaction.options.getString("type");
    const character = getCharacter(userId);

    if (!character) {
      await interaction.reply(
        `你還沒有創建角色，請使用 /createcharacter 指令來創建角色。`
      );
      return;
    }

    const backpack = getBackpack(userId);

    if (action === "equip") {
      let items = [];
      if (type === "weapon") {
        items = backpack.items.filter((item) => item.type === "weapon");
      } else if (type === "armor") {
        items = backpack.items.filter((item) => item.type === "armor");
      } else if (type === "artifact") {
        items = backpack.items.filter((item) => item.type === "artifact");
      }

      if (items.length === 0) {
        await interaction.reply(`你的背包裡沒有可用的${type}。`);
        return;
      }

      // 動態生成選項
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select_item")
        .setPlaceholder(`選擇要裝備的${type}`)
        .addOptions(
          items.map((item) => ({
            label: item.name,
            value: item.name,
          }))
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        content: `請選擇你要裝備的${type}：`,
        components: [row],
        ephemeral: true,
      });

      const filter = (i) =>
        i.customId === "select_item" && i.user.id === userId;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        const itemName = i.values[0];
        let item;
        if (type === "weapon") {
          item = items.find((item) => item.name === itemName);
          if (!item) {
            await i.update({
              content: `找不到名稱為 ${itemName} 的武器。`,
              components: [],
            });
            return;
          }
          equipWeapon(userId, item);
        } else if (type === "armor") {
          item = items.find((item) => item.name === itemName);
          if (!item) {
            await i.update({
              content: `找不到名稱為 ${itemName} 的防具。`,
              components: [],
            });
            return;
          }
          equipArmor(userId, item);
        } else if (type === "artifact") {
          item = items.find((item) => item.name === itemName);
          if (!item) {
            await i.update({
              content: `找不到名稱為 ${itemName} 的神器。`,
              components: [],
            });
            return;
          }
          equipArtifact(userId, item);
        }
        removeItem(userId, item.name, item.type); // 從背包中移除物品

        await i.update({
          content: `你已裝備 ${type}：${item.name}\n當前狀態：\n攻擊：${character.attack}\n防禦：${character.defense}\n敏捷：${character.agility}`,
          components: [],
        });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          interaction.editReply({
            content: "操作超時，請重新嘗試。",
            components: [],
          });
        }
      });
    } else if (action === "unequip") {
      let item;
      if (type === "weapon" && character.weapon) {
        item = character.weapon;
        character.weapon = null;
        character.attack -= item.attack;
        addItem(userId, item);
      } else if (type === "armor" && character.armor) {
        item = character.armor;
        character.armor = null;
        character.defense -= item.defense;
        addItem(userId, item);
      } else if (type === "artifact" && character.artifact) {
        item = character.artifact;
        character.artifact = null;
        character.attack -= item.attack || 0;
        character.defense -= item.defense || 0;
        character.agility -= item.agility || 0;
        addItem(userId, item);
      } else {
        await interaction.reply(`你沒有裝備任何${type}。`);
        return;
      }

      await interaction.reply(
        `你已卸下 ${type}：${item.name}\n當前狀態：\n攻擊：${character.attack}\n防禦：${character.defense}\n敏捷：${character.agility}`
      );
    }
  },
};
