# DiscordPubBot

遊戲機器人測試使用

## 指令列表

### Game Commands

#### `adventure.js`

啟動一次冒險。

#### `battle.js`

發起與另一個玩家的戰鬥。

#### `boss.js`

挑戰強大的 Boss，獲得豐厚的戰利品。

#### `craftItem.js`

製作新的物品，使用收集到的材料。

#### `createcharacter.js`

創建一個新角色，開始你的冒險之旅。

#### `drinkPotion.js`

飲用藥水，恢復健康或獲得增益效果。

#### `equip.js`

裝備物品，提高角色的屬性。

#### `fightBoss.js`

與 Boss 戰鬥，挑戰自己的極限。

#### `fightMonster.js`

與普通怪物戰鬥，獲得經驗和戰利品。

#### `fishing.js`

進行釣魚活動，捕獲魚類並獲得獎勵。

#### `level.js`

查看角色的等級和經驗值。

#### `logging.js`

進行伐木活動，收集木材作為資源。

#### `rest.js`

休息，恢復健康和能量。

#### `roll.js`

擲骰子，隨機產生一個數字，用於決定某些事件的結果。

#### `rps.js`

進行一場石頭剪刀布遊戲。

#### `scenario.js`

觸發一個隨機事件，根據選擇做出不同的決定。

#### `sellItem.js`

出售物品，獲得金幣。

#### `status.js`

查看角色的當前狀態和屬性。

## 安裝與使用

1. 克隆此倉庫到本地：

   ```sh
   git clone https://github.com/yourusername/DiscordPubBot.git
   ```

2. 安裝依賴：

   ```sh
   cd DiscordPubBot
   npm install
   ```

3. 配置你的 Discord Bot Token：
   在項目根目錄下創建一個 `.env` 文件，並添加以下內容：

   ```env
   DISCORD_BOT_TOKEN=你的機器人令牌
   ```

4. 啟動機器人：
   ```sh
   node index.js
   ```

## 貢獻

歡迎任何形式的貢獻！請閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多詳情。

## 許可

此項目遵循 MIT 許可。詳情請參見 [LICENSE](LICENSE) 文件。
