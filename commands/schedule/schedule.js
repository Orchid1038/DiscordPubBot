const { SlashCommandBuilder } = require("discord.js");
const schedule = require("node-schedule");

const events = new Map();

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("calendar")
    .setDescription("管理行事曆")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("添加行事曆事件")
        .addStringOption((option) =>
          option.setName("title").setDescription("事件標題").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("content").setDescription("事件內容").setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("month").setDescription("月份").setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("day").setDescription("日期").setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("hour").setDescription("小時").setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("minute").setDescription("分鐘").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("repeat")
            .setDescription("重複頻率")
            .addChoices(
              { name: "每天", value: "daily" },
              { name: "每週", value: "weekly" },
              { name: "每月", value: "monthly" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("view").setDescription("查看行事曆事件")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("刪除行事曆事件")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("選擇要刪除的事件")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      const title = interaction.options.getString("title");
      const content = interaction.options.getString("content");
      const month = interaction.options.getInteger("month");
      const day = interaction.options.getInteger("day");
      const hour = interaction.options.getInteger("hour");
      const minute = interaction.options.getInteger("minute");
      const repeat = interaction.options.getString("repeat") || "none";

      const currentYear = new Date().getFullYear();
      const dateTime = new Date(currentYear, month - 1, day, hour, minute);

      if (isNaN(dateTime.getTime())) {
        await interaction.reply("無效的時間格式！");
        return;
      }

      if (events.has(title)) {
        await interaction.reply("事件標題已存在！");
        return;
      }

      let job;
      if (repeat === "daily") {
        job = schedule.scheduleJob(
          { hour: dateTime.getHours(), minute: dateTime.getMinutes() },
          () => {
            interaction.followUp(`提醒：${title}\n內容：${content}`);
          }
        );
      } else if (repeat === "weekly") {
        job = schedule.scheduleJob(
          {
            dayOfWeek: dateTime.getDay(),
            hour: dateTime.getHours(),
            minute: dateTime.getMinutes(),
          },
          () => {
            interaction.followUp(`提醒：${title}\n內容：${content}`);
          }
        );
      } else if (repeat === "monthly") {
        job = schedule.scheduleJob(
          {
            date: dateTime.getDate(),
            hour: dateTime.getHours(),
            minute: dateTime.getMinutes(),
          },
          () => {
            interaction.followUp(`提醒：${title}\n內容：${content}`);
          }
        );
      } else {
        job = schedule.scheduleJob(dateTime, () => {
          interaction.followUp(`提醒：${title}\n內容：${content}`);
          events.delete(title);
        });
      }

      events.set(title, {
        job,
        creator: interaction.user.id,
        content,
        repeat,
      });
      await interaction.reply(
        `事件 **${title}** 已添加到行事曆，時間：${dateTime}`
      );
    } else if (subcommand === "view") {
      if (events.size === 0) {
        await interaction.reply("行事曆中沒有事件！");
        return;
      }

      const eventList = Array.from(events.entries())
        .map(
          ([title, { creator, content, repeat }]) =>
            `- **${title}**\n  創建者：<@${creator}>\n  內容：${content}\n  重複：${
              repeat === "daily"
                ? "每天"
                : repeat === "weekly"
                ? "每週"
                : repeat === "monthly"
                ? "每月"
                : "無"
            }`
        )
        .join("\n\n");
      await interaction.reply(`行事曆事件：\n${eventList}`);
    } else if (subcommand === "delete") {
      const title = interaction.options.getString("title");

      if (!events.has(title)) {
        await interaction.reply(`找不到事件 **${title}**`);
        return;
      }

      const event = events.get(title);
      if (event.creator !== interaction.user.id) {
        await interaction.reply("你只能刪除自己創建的事件！");
        return;
      }

      event.job.cancel();
      events.delete(title);
      await interaction.reply(`事件 **${title}** 已從行事曆中刪除`);
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const userEvents = Array.from(events.entries())
      .filter(([title, { creator }]) => creator === interaction.user.id)
      .map(([title]) => title);

    const filtered = userEvents.filter((title) =>
      title.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((title) => ({ name: title, value: title }))
    );
  },
};
