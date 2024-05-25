// 導入所需的模組
const { Client, GatewayIntentBits, Routes } = require("discord.js"); // Discord.js 主要模組
const { REST } = require("@discordjs/rest"); // 用於註冊應用程式命令的模組
const dotenv = require("dotenv"); // 用於載入環境變數的模組
const fs = require("fs"); // Node.js 內建的檔案系統模組
const path = require("path"); // Node.js 內建的路徑模組

// 載入環境變數
dotenv.config();

// 建立 Discord 用戶端實例,並設置所需的權限
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // 讀取伺服器資訊的權限
    GatewayIntentBits.GuildMessages, // 讀取伺服器訊息的權限
    GatewayIntentBits.MessageContent, // 讀取訊息內容的權限
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
  Object.values(chatHandlers).forEach((handler) => {
    handler.handleMessage(message);
  });
});

// 建立一個 Map 物件,用於存放所有命令
client.commands = new Map();

// 定義一個函式,用於遞迴讀取命令資料夾中的所有命令檔案
const loadCommands = (dirPath) => {
  // 獲取資料夾中所有 JavaScript 檔案
  const commandFiles = fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith(".js"));

  // 遍歷每個指令檔案
  for (const fileName of commandFiles) {
    const filePath = path.join(dirPath, fileName);
    const command = require(filePath);

    // 檢查指令是否包含必要的屬性
    if (command.metadata && typeof command.metadata.name === "string") {
      client.commands.set(command.metadata.name, command);
      console.log(`讀取到指令：${command.metadata.name}`); // 列印指令名稱
    } else {
      console.log(
        `[警告] 檔案 ${fileName} 中的指令缺少 metadata 或 name 屬性。`
      );
    }
  }

  // 獲取資料夾中的所有子資料夾
  const subDirs = fs
    .readdirSync(dirPath)
    .filter((fileName) =>
      fs.lstatSync(path.join(dirPath, fileName)).isDirectory()
    );

  // 遞迴讀取每個子資料夾中的指令
  for (const subDir of subDirs) {
    loadCommands(path.join(dirPath, subDir));
  }
};

// 載入 commands 資料夾中的所有指令
loadCommands(path.join(__dirname, "commands"));

// 當用戶端準備就緒時執行以下程式碼
client.once("ready", async () => {
  console.log(`已成功登入為 ${client.user.tag}!`);

  // 建立 REST 實例,用於註冊應用程式命令
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("正在重新載入應用程式 (/) 命令...");

    // 註冊應用程式命令
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

// 監聽 interactionCreate 事件,處理使用者的指令互動
client.on("interactionCreate", async (interaction) => {
  // 如果互動不是指令,則直接返回
  if (!interaction.isCommand()) return;

  // 獲取對應的指令資料
  const command = client.commands.get(interaction.commandName);

  // 如果找不到指令,則直接返回
  if (!command) return;

  try {
    // 執行指令
    await command.execute(interaction);
  } catch (error) {
    console.error(`執行指令 ${interaction.commandName} 時發生錯誤:`, error);
    await interaction.reply({
      content: "執行此命令時發生錯誤!",
      ephemeral: true, // 僅向發送者顯示錯誤訊息
    });
  }
});

// 登入 Discord 用戶端
client.login(process.env.DISCORD_TOKEN);
