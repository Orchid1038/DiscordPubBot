const { SlashCommandBuilder } = require("discord.js");
const {
  createScenario,
  addStepToScenario,
  getUserScenarios,
} = require("../../utils/rpg/scenarios");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("scenario")
    .setDescription("管理劇情")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("創建一個新劇情")
        .addStringOption((option) =>
          option.setName("name").setDescription("劇情名稱").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("劇情描述")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("addstep")
        .setDescription("添加劇情步驟")
        .addStringOption((option) =>
          option.setName("name").setDescription("劇情名稱").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("step")
            .setDescription("劇情步驟描述")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const userName = interaction.user.username;

    try {
      if (subcommand === "create") {
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");

        createScenario(userId, userName, name, description);
        await interaction.reply(
          `劇情 **${name}** 已創建！\n描述：${description}\n創建者：${userName}`
        );
      } else if (subcommand === "addstep") {
        const name = interaction.options.getString("name");
        const step = interaction.options.getString("step");

        addStepToScenario(userId, name, step);
        await interaction.reply(`劇情 **${name}** 已添加步驟：${step}`);
      }
    } catch (error) {
      await interaction.reply({
        content: "執行此命令時發生錯誤！",
        ephemeral: true,
      });
    }
  },
};
