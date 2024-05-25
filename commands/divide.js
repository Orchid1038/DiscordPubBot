// divide.js
const { SlashCommandBuilder } = require("discord.js");
const math = require("../utils/math");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("divide")
    .setDescription("Divides two numbers")
    .addNumberOption((option) =>
      option
        .setName("num1")
        .setDescription("The first number")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("num2")
        .setDescription("The second number")
        .setRequired(true)
    ),
  async execute(interaction) {
    const num1 = interaction.options.getNumber("num1");
    const num2 = interaction.options.getNumber("num2");
    if (num2 === 0) {
      await interaction.reply("Cannot divide by zero!");
    } else {
      const result = math.divide(num1, num2);
      await interaction.reply(`${num1} / ${num2} = ${result}`);
    }
  },
};
