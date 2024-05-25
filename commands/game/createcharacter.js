const { SlashCommandBuilder } = require("discord.js");
const { createCharacter } = require("../../utils/rpg/characters");
const { classes } = require("../../utils/rpg/classes");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("createcharacter")
    .setDescription("創建一個新角色")
    .addStringOption((option) =>
      option
        .setName("class")
        .setDescription("選擇職業")
        .setRequired(true)
        .addChoices(...classes.map((c) => ({ name: c.name, value: c.name })))
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const userName = interaction.user.username;
    const serverId = interaction.guild.id;
    const serverName = interaction.guild.name;
    const className = interaction.options.getString("class");

    const result = createCharacter(
      userId,
      userName,
      serverId,
      serverName,
      className
    );

    if (!result.success) {
      await interaction.reply(result.message);
      return;
    }

    const character = result.character;

    await interaction.reply(
      `你的角色已創建！\n冒險者：<@${userId}>\n職業：${character.class}\n攻擊：${character.attack}\n防禦：${character.defense}\n敏捷：${character.agility}\nHP：${character.hp}\n等級：${character.level}\n經驗值：${character.experience}\n紅藥水數量：${character.potions.length}\n創建時間：${character.createdAt}`
    );
  },
};
