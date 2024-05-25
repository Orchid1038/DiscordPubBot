// 在你的指令檔案中
module.exports = {
  metadata: {
    name: "members",
    description: "顯示伺服器的成員數量",
  },
  execute: async (interaction) => {
    const guild = interaction.guild;
    const memberCount = guild.memberCount;
    await interaction.reply(`伺服器成員數量：${memberCount} 人`);
  },
};
