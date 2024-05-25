// divide.js
const { SlashCommandBuilder } = require("discord.js");
const math = require("../../utils/math");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("divide")
    .setDescription("除以兩個數字")
    .addNumberOption((option) =>
      option.setName("num1").setDescription("第一個數字").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("num2").setDescription("第二個數字").setRequired(true)
    ),
  async execute(interaction) {
    const num1 = interaction.options.getNumber("num1");
    const num2 = interaction.options.getNumber("num2");
    if (num2 === 0) {
      await interaction.reply("不能除以零！");
    } else {
      const result = math.divide(num1, num2);
      await interaction.reply(`${num1} / ${num2} = ${result}`);
    }
  },
};
