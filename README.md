# 超強酒保 無敵林昱合機器人

## 林昱合介紹

- 五歲抬頭
- 資深早餐店店員
- 凌雪閣第一水果
- 社交恐怖份子
- 呀咧呀咧

## 專案介紹

這個專案是一個基於 Discord.js 的機器人，具有以下功能:

- 講一些沒營養的對話
- 精通十以內(或許更多)加減法

## 安裝

1. clone 此存儲庫到本地:

```bash
git clone https://github.com/Orchid1038/DiscordPubBot.git
```

2. 安裝依賴項:

```bash
cd discord-bot
npm install
```

3. 創建一個 .env 文件,並添加您的 Discord 機器人令牌:

```bash
DISCORD_TOKEN=your-bot-token-here
CLIENT_ID=your-bot-client-id
```

## 使用

運行機器人:

```bash
node bot.js
```

## 一些例子

1. 對話回應

```js
const handleMessage = (message) => {
  // 忽略機器人自己發送的訊息
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // 定義每個關鍵字對應的隨機回覆選項
  const responses = {
    嗨: [
      "嗨!你今天有刷牙嗎?",
      "嘿,很高興看到你!",
      "你好啊,今天過得怎麼樣?",
      "嗨,我正在想一些有趣的笑話呢!",
      "嗨嗨,準備好開心一天了嗎?",
    ],
    // 其他關鍵字及對應回覆...
  };

  // 從對應的回覆選項中隨機選擇一個
  const keys = Object.keys(responses);
  for (const key of keys) {
    if (content.includes(key)) {
      const randomResponse =
        responses[key][Math.floor(Math.random() * responses[key].length)];
      message.reply(randomResponse);
      return;
    }
  }
};

module.exports = {
  handleMessage,
};
```

2. 命令執行

- 加法運算

```js
const { SlashCommandBuilder } = require("discord.js");
const math = require("../utils/math");

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds two numbers")
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
    const result = math.add(num1, num2);
    await interaction.reply(`${num1} + ${num2} = ${result}`);
  },
};
```

3. 我真的不知道你想吃什麼

- 我準備了晚餐？

```js
const dinnerOptions = [
  "牛排",
  "燴飯",
  "烤雞",
  "魚類料理",
  "素食咖哩",
  "燉肉",
  "麵食",
  "火鍋",
  "燒烤",
  "冷盤",
];

module.exports = {
  metadata: {
    name: "dinner",
    description: "隨機選擇一種晚餐",
  },
  execute: async (interaction) => {
    const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
    const dinner = dinnerOptions[randomIndex];
    await interaction.reply(`晚餐吃 ${dinner} 如何?`);
  },
};
```
