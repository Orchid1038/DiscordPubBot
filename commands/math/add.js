const { SlashCommandBuilder } = require("discord.js");
const math = require("../../utils/math");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("add")
    .setDescription("我只會這樣的加法")
    .addNumberOption((option) =>
      option.setName("num1").setDescription("第一個數字").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("num2").setDescription("第二個數字").setRequired(true)
    ),
  async execute(interaction) {
    const num1 = interaction.options.getNumber("num1");
    const num2 = interaction.options.getNumber("num2");
    const result = math.add(num1, num2);
    await interaction.reply(`${num1} + ${num2} = ${result}`);
  },
};
