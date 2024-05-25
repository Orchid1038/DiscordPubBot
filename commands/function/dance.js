const { SlashCommandBuilder } = require("discord.js");
const path = require("path");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("dance")
    .setDescription("展示一個跳舞的GIF圖"),
  async execute(interaction) {
    // GIF 文件的路徑
    const gifPath = path.join(__dirname, "image", "dance.gif");

    // 發送GIF圖像
    await interaction.reply({
      files: [
        {
          attachment: gifPath,
          name: "dance.gif",
        },
      ],
      content: "媽的我真騷",
    });
  },
};
