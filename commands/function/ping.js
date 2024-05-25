module.exports = {
  metadata: {
    name: "ping",
    description: "回覆 Pong!",
  },
  execute: async (interaction) => {
    const sentTime = interaction.createdTimestamp;
    const reply = await interaction.reply({
      content: "Pong!",
      fetchReply: true,
    }); // 初始回應並獲取回應消息
    const receivedTime = reply.createdTimestamp;
    const ping = receivedTime - sentTime;
    await interaction.editReply(`Pong! 延遲時間: ${ping} 毫秒`); // 編輯回應並顯示延遲時間
  },
};
