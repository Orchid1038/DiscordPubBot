// 導入所需的模組
const { Client, GatewayIntentBits, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// 載入環境變數
dotenv.config();

// 建立 Discord 用戶端實例,並設置所需的權限
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 載入所有 chat 處理函式
const chatHandlers = {};
const chatDir = path.join(__dirname, "chat");
const chatFiles = fs
  .readdirSync(chatDir)
  .filter((file) => file.endsWith(".js"));

for (const file of chatFiles) {
  const filePath = path.join(chatDir, file);
  const handler = require(filePath);
  const handlerName = path.basename(file, ".js");
  chatHandlers[handlerName] = handler;
}

// 監聽 messageCreate 事件,並執行所有註冊的 chat 處理函式
client.on("messageCreate", (message) => {
  if (!message.author.bot) {
    // 更新用戶等級（如果有等級系統）
    // updateLevel(message.author.id, 1);
  }
  Object.values(chatHandlers).forEach((handler) => {
    handler.handleMessage(message);
  });
});

// 建立一個 Map 物件,用於存放所有命令
client.commands = new Map();

// 定義一個函式,用於遞迴讀取命令資料夾中的所有命令檔案
const loadCommands = (dirPath) => {
  const commandFiles = fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith(".js"));

  for (const fileName of commandFiles) {
    const filePath = path.join(dirPath, fileName);
    const command = require(filePath);

    if (command.metadata && typeof command.metadata.name === "string") {
      client.commands.set(command.metadata.name, command);
      console.log(`讀取到指令：${command.metadata.name}`);
    } else {
      console.log(
        `[警告] 檔案 ${fileName} 中的指令缺少 metadata 或 name 屬性。`
      );
    }
  }

  const subDirs = fs
    .readdirSync(dirPath)
    .filter((fileName) =>
      fs.lstatSync(path.join(dirPath, fileName)).isDirectory()
    );

  for (const subDir of subDirs) {
    loadCommands(path.join(dirPath, subDir));
  }
};

loadCommands(path.join(__dirname, "commands"));

client.once("ready", async () => {
  console.log(`已成功登入為 ${client.user.tag}!`);

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("正在重新載入應用程式 (/) 命令...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: Array.from(client.commands.values()).map(
        (command) => command.metadata
      ),
    });

    console.log("成功重新載入應用程式 (/) 命令。");
  } catch (error) {
    console.error("重新載入應用程式 (/) 命令時發生錯誤:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
    await interaction.reply({
      content: "執行此命令時發生錯誤!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
