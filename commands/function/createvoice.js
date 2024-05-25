const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("createvoice")
    .setDescription("創建一個臨時語音頻道，並在一小時後刪除")
    .addStringOption((option) =>
      option.setName("name").setDescription("語音頻道名稱").setRequired(true)
    ),
  async execute(interaction) {
    const channelName = interaction.options.getString("name");

    try {
      // 創建語音頻道
      const voiceChannel = await interaction.guild.channels.create({
        name: channelName,
        type: 2, // 2 代表語音頻道
        reason: "臨時語音頻道，將在一小時後刪除",
      });

      await interaction.reply(`已創建語音頻道：${voiceChannel.name}`);

      // 設置計時器，在一小時後刪除該頻道
      setTimeout(async () => {
        await voiceChannel.delete("一小時到期，刪除臨時語音頻道");
        console.log(`已刪除語音頻道：${voiceChannel.name}`);
      }, 3600000); // 3600000 毫秒等於 1 小時
    } catch (error) {
      console.error("創建語音頻道時發生錯誤:", error);
      await interaction.reply("創建語音頻道時發生錯誤，請稍後再試。");
    }
  },
};
