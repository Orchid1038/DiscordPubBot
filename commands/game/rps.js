const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("與指定使用者玩猜拳遊戲")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("選擇你的對手")
        .setRequired(true)
    ),
  async execute(interaction) {
    const opponent = interaction.options.getUser("opponent");

    if (opponent.bot) {
      await interaction.reply("你不能與機器人玩猜拳！");
      return;
    }

    const choices = ["剪刀", "石頭", "布"];
    const buttons = choices.map((choice) =>
      new ButtonBuilder()
        .setCustomId(choice)
        .setLabel(choice)
        .setStyle(ButtonStyle.Primary)
    );

    const row = new ActionRowBuilder().addComponents(buttons);

    await interaction.reply({
      content: `${opponent}, 你被挑戰了！請選擇你的出拳：`,
      components: [row],
    });

    const filter = (i) =>
      i.user.id === interaction.user.id || i.user.id === opponent.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 2,
      time: 60000,
    });

    const userChoices = {};

    collector.on("collect", async (i) => {
      if (userChoices[i.user.id]) {
        await i.reply({ content: "你已經選擇了！", ephemeral: true });
        return;
      }

      userChoices[i.user.id] = i.customId;
      await i.reply({ content: `你選擇了 ${i.customId}`, ephemeral: true });

      if (Object.keys(userChoices).length === 2) {
        collector.stop();
      }
    });

    collector.on("end", async () => {
      if (Object.keys(userChoices).length < 2) {
        await interaction.followUp("遊戲因為時間過長而取消！");
        return;
      }

      const user1Choice = userChoices[interaction.user.id];
      const user2Choice = userChoices[opponent.id];

      let result;
      if (user1Choice === user2Choice) {
        result = "平手！";
      } else if (
        (user1Choice === "剪刀" && user2Choice === "布") ||
        (user1Choice === "石頭" && user2Choice === "剪刀") ||
        (user1Choice === "布" && user2Choice === "石頭")
      ) {
        result = `${interaction.user} 獲勝！`;
      } else {
        result = `${opponent} 獲勝！`;
      }

      await interaction.followUp(
        `結果：\n${interaction.user} 選擇了 ${user1Choice}\n${opponent} 選擇了 ${user2Choice}\n${result}`
      );
    });
  },
};
