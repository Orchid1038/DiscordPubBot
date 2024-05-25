const { SlashCommandBuilder } = require("discord.js");
const {
  createBoss,
  getUserBosses,
  getAllBosses,
} = require("../../utils/rpg/bosses");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("boss")
    .setDescription("管理Boss")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("創建一個新Boss")
        .addStringOption((option) =>
          option.setName("name").setDescription("Boss名稱").setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("Boss等級 (1-100)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Boss描述")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("story").setDescription("Boss劇情").setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("列出你創建的Boss")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("all").setDescription("列出所有Boss")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const userName = interaction.user.username;

    if (subcommand === "create") {
      const name = interaction.options.getString("name");
      const level = interaction.options.getInteger("level");
      const description = interaction.options.getString("description");
      const story =
        interaction.options.getString("story") ||
        "這是一個非常強大的Boss，準備好迎接挑戰吧！";

      createBoss(userId, userName, name, level, description, story);
      await interaction.reply(
        `Boss **${name}** 已創建！\n等級：${level}\n描述：${description}\n劇情：${story}\n創建者：${userName}`
      );
    } else if (subcommand === "list") {
      const bosses = getUserBosses(userId);
      if (bosses.length === 0) {
        await interaction.reply("你還沒有創建任何Boss！");
      } else {
        const bossList = bosses
          .map(
            (boss) =>
              `**${boss.name}** (等級：${boss.level}) - ${boss.description}`
          )
          .join("\n");
        await interaction.reply(`你創建的Boss：\n${bossList}`);
      }
    } else if (subcommand === "all") {
      const bosses = getAllBosses();
      if (bosses.length === 0) {
        await interaction.reply("沒有任何Boss！");
      } else {
        const bossList = bosses
          .map(
            (boss) =>
              `**${boss.name}** (等級：${boss.level}) - ${boss.description}`
          )
          .join("\n");
        await interaction.reply(`所有Boss：\n${bossList}`);
      }
    }
  },
};
