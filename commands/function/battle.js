const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("battle")
    .setDescription("向另一個使用者發出戰鬥邀請")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("你想挑戰的使用者")
        .setRequired(true)
    ),
  async execute(interaction) {
    const challenger = interaction.user;
    const target = interaction.options.getUser("target");

    if (challenger.id === target.id) {
      await interaction.reply("你不能挑戰自己！");
      return;
    }

    const challengerMember = interaction.guild.members.cache.get(challenger.id);
    const targetMember = interaction.guild.members.cache.get(target.id);

    await interaction.reply(
      `${challengerMember.displayName} 向 ${targetMember.displayName} 發出戰鬥邀請！`
    );

    // 模擬戰鬥過程
    const battleThemes = [
      [
        `${challengerMember.displayName} 發起了猛烈的攻擊，拳頭如雨點般落在 ${targetMember.displayName} 身上！`,
        `${targetMember.displayName} 靈巧地躲過了攻擊，迅速反擊，擊中了 ${challengerMember.displayName} 的腹部！`,
        `${challengerMember.displayName} 不甘示弱，使用了必殺技，一招「龍捲風腿」直奔 ${targetMember.displayName} 而去！`,
        `${targetMember.displayName} 使出了一招絕技「鐵布衫」，硬生生擋住了攻擊，雙方陷入激烈的纏鬥！`,
      ],
      [
        `${challengerMember.displayName} 偷偷下毒，試圖毒倒 ${targetMember.displayName}，但 ${targetMember.displayName} 早有防備！`,
        `${targetMember.displayName} 發現了毒藥，迅速解毒，並反手一擊，讓 ${challengerMember.displayName} 吞下了自己的毒藥！`,
        `${challengerMember.displayName} 開始感到不適，但仍然堅持戰鬥，試圖用最後的力量擊倒 ${targetMember.displayName}！`,
        `${targetMember.displayName} 利用毒藥的效果，發起猛烈攻擊，最終將 ${challengerMember.displayName} 打倒在地！`,
      ],
      [
        `${challengerMember.displayName} 開始放冷箭，每一箭都直奔 ${targetMember.displayName} 的要害！`,
        `${targetMember.displayName} 靈巧地躲避，並迅速反擊，一箭射中了 ${challengerMember.displayName} 的肩膀！`,
        `${challengerMember.displayName} 忍住疼痛，射出一箭，這次命中了 ${targetMember.displayName} 的腿！`,
        `${targetMember.displayName} 雖然受傷，但依然堅持戰鬥，最終用一箭擊中了 ${challengerMember.displayName} 的心臟！`,
      ],
      [
        `${challengerMember.displayName} 開始施展魔法，火球術、冰封術輪番上陣，試圖壓制 ${targetMember.displayName}！`,
        `${targetMember.displayName} 使用魔法盾抵擋，並反擊，以閃電術回應，雙方魔法交織，場面壯觀！`,
        `${challengerMember.displayName} 施放了一個強大的火球，直奔 ${targetMember.displayName} 而去，燃燒了整個戰場！`,
        `${targetMember.displayName} 施展治癒術，迅速恢復體力，並用冰封術將 ${challengerMember.displayName} 凍住，最終取得勝利！`,
      ],
      [
        `${challengerMember.displayName} 開始嘴砲攻擊，言辭犀利，每一句話都讓 ${targetMember.displayName} 無法反駁！`,
        `${targetMember.displayName} 不甘示弱，回嘴更猛烈，雙方你來我往，嘴砲戰鬥激烈！`,
        `${challengerMember.displayName} 嘴砲更猛烈了，試圖用言語擊倒 ${targetMember.displayName}，讓對方啞口無言！`,
        `${targetMember.displayName} 最後一句話直擊 ${challengerMember.displayName} 的心臟，讓對方無力反駁，最終取得嘴砲勝利！`,
      ],
      [
        `${challengerMember.displayName} 開始背誦論語，試圖用文化的力量壓倒 ${targetMember.displayName}！`,
        `${targetMember.displayName} 不甘示弱，流利地背誦出更多的論語章句！`,
        `${challengerMember.displayName} 背誦速度加快，聲音洪亮，震撼全場！`,
        `${targetMember.displayName} 展現了驚人的記憶力，背誦了整部論語，最終以文化勝利！`,
      ],
      [
        `${challengerMember.displayName} 開始背誦化學元素表，試圖用知識壓倒 ${targetMember.displayName}！`,
        `${targetMember.displayName} 不甘示弱，背誦出更多的化學元素及其原子序數！`,
        `${challengerMember.displayName} 背誦速度加快，連續背誦出多個元素，讓人目瞪口呆！`,
        `${targetMember.displayName} 展現了驚人的記憶力，背誦了整個化學元素表，最終以知識勝利！`,
      ],
      [
        `${challengerMember.displayName} 開始進行數學挑戰，試圖用數學題擊倒 ${targetMember.displayName}！`,
        `${targetMember.displayName} 不甘示弱，迅速解答出多道複雜的數學題！`,
        `${challengerMember.displayName} 提出了一道高難度的數學題，讓 ${targetMember.displayName} 一時無法解答！`,
        `${targetMember.displayName} 最終解出了所有數學題，展現了驚人的數學天賦，取得勝利！`,
      ],
    ];

    // 隨機選擇一組戰鬥描述
    const battleDescriptions =
      battleThemes[Math.floor(Math.random() * battleThemes.length)];

    for (const description of battleDescriptions) {
      await interaction.followUp(description);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待2秒
    }

    // 隨機選擇贏家
    const winner = Math.random() < 0.5 ? challengerMember : targetMember;
    await interaction.followUp(`戰鬥結束！勝利者是 ${winner.displayName}！`);
  },
};
