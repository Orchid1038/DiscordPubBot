module.exports = {
  metadata: {
    name: "ping",
    description: "Replies with Pong!",
  },
  execute: async (interaction) => {
    const sentTime = interaction.createdTimestamp;
    await interaction.reply("Pong!"); // Initial reply
    const receivedTime = Date.now();
    const ping = receivedTime - sentTime;
    await interaction.editReply(`Pong! Ping: ${ping} ms`); // Edit reply with ping
  },
};
