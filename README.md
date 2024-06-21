# DiscordPubBot

**酒保機器人**

## 專案介紹

DiscordPubBot 是一個基於 Discord.js 的多功能機器人，旨在為 Discord 服務器提供多種實用且有趣的功能。無論是數學運算、遊戲冒險還是日常生活的便捷操作，這個機器人都能輕鬆應對。

## 功能列表

### 對話功能

- 講一些沒營養的對話，增加互動樂趣。

### 數學功能

- 精通十以內（或許更多）的加減法運算。

### 遊戲功能

- 提供多種 RPG 遊戲指令，讓用戶在 Discord 中進行冒險、戰鬥等活動。

### 日常功能

- 提供如天氣查詢、日程安排等便捷功能，讓用戶的生活更方便。

## 安裝

1. 克隆此倉庫到本地：

   ```sh
   git clone https://github.com/Orchid1038/DiscordPubBot.git
   ```

2. 安裝依賴項：

   ```sh
   cd DiscordPubBot
   npm install
   ```

3. 創建一個 `.env` 文件，並添加您的 Discord 機器人令牌：
   ```env
   DISCORD_TOKEN=your-bot-token-here
   CLIENT_ID=your-bot-client-id
   ```

## 使用

運行機器人：

```sh
node bot.js
```

## 目錄結構

### `commands/game`

- `adventure.js`：啟動一次冒險，探索新的地點並獲得獎勵。
- `battle.js`：發起與另一個玩家的戰鬥。
- `boss.js`：挑戰強大的 Boss，獲得豐厚的戰利品。
- `craftItem.js`：製作新的物品，使用收集到的材料。
- `createcharacter.js`：創建一個新角色，開始你的冒險之旅。
- `drinkPotion.js`：飲用藥水，恢復健康或獲得增益效果。
- `equip.js`：裝備物品，提高角色的屬性。
- `fightBoss.js`：與 Boss 戰鬥，挑戰自己的極限。
- `fightMonster.js`：與普通怪物戰鬥，獲得經驗和戰利品。
- `fishing.js`：進行釣魚活動，捕獲魚類並獲得獎勵。
- `level.js`：查看角色的等級和經驗值。
- `logging.js`：進行伐木活動，收集木材作為資源。
- `rest.js`：休息，恢復健康和能量。
- `roll.js`：擲骰子，隨機產生一個數字，用於決定某些事件的結果。
- `rps.js`：進行一場石頭剪刀布遊戲。
- `scenario.js`：觸發一個隨機事件，根據選擇做出不同的決定。
- `sellItem.js`：出售物品，獲得金幣。
- `status.js`：查看角色的當前狀態和屬性。

### `commands/math`

- `add.js`：執行加法運算。
- `calculus.js`：處理微積分相關計算。
- `combinations.js`：計算組合數。
- `divide.js`：執行除法運算。
- `multiply.js`：執行乘法運算。
- `permutations.js`：計算排列數。
- `subtract.js`：執行減法運算。

### `utils/rpg`

- `adventure.js`：處理冒險邏輯。
- `battle.js`：處理戰鬥邏輯。
- `bosses.js`：管理 Boss 數據和行為。
- `characters.js`：管理角色數據和行為。
- `classes.js`：管理角色職業數據和行為。
- `enemies.js`：管理敵人數據和行為。
- `items.js`：管理物品數據和行為。
- `scenarios.js`：管理隨機事件和場景。

### `utils/rpg/database`

- `armors.json`：裝甲數據。
- `artifacts.json`：神器數據。
- `bosses.json`：Boss 數據。
- `characters.json`：角色數據。
- `classes.json`：職業數據。
- `craftingRecipes.json`：製作配方數據。
- `enemies.json`：敵人數據。
- `fish.json`：魚類數據。
- `jobs.json`：職業數據。
- `potions.json`：藥水數據。
- `weapons.json`：武器數據。
- `wood.json`：木材數據。

```plaintext
DiscordPubBot/
├── commands/
│ ├── function/
│ │ ├── createvoice.js：創建語音頻道。
│ │ ├── dance.js：舞蹈指令。
│ │ ├── members.js：列出服務器成員。
│ │ └── ping.js：檢查機器人的延遲。
│ ├── game/
│ │ ├── adventure.js：啟動一次冒險，探索新的地點並獲得獎勵。
│ │ ├── battle.js：發起與另一個玩家的戰鬥。
│ │ ├── boss.js：挑戰強大的 Boss，獲得豐厚的戰利品。
│ │ ├── craftItem.js：製作新的物品，使用收集到的材料。
│ │ ├── createcharacter.js：創建一個新角色，開始你的冒險之旅。
│ │ ├── drinkPotion.js：飲用藥水，恢復健康或獲得增益效果。
│ │ ├── equip.js：裝備物品，提高角色的屬性。
│ │ ├── fightBoss.js：與 Boss 戰鬥，挑戰自己的極限。
│ │ ├── fightMonster.js：與普通怪物戰鬥，獲得經驗和戰利品。
│ │ ├── fishing.js：進行釣魚活動，捕獲魚類並獲得獎勵。
│ │ ├── level.js：查看角色的等級和經驗值。
│ │ ├── logging.js：進行伐木活動，收集木材作為資源。
│ │ ├── rest.js：休息，恢復健康和能量。
│ │ ├── roll.js：擲骰子，隨機產生一個數字，用於決定某些事件的結果。
│ │ ├── rps.js：進行一場石頭剪刀布遊戲。
│ │ ├── scenario.js：觸發一個隨機事件，根據選擇做出不同的決定。
│ │ ├── sellItem.js：出售物品，獲得金幣。
│ │ └── status.js：查看角色的當前狀態和屬性。
│ ├── math/
│ │ ├── add.js：執行加法運算。
│ │ ├── calculus.js：處理微積分相關計算。
│ │ ├── combinations.js：計算組合數。
│ │ ├── divide.js：執行除法運算。
│ │ ├── multiply.js：執行乘法運算。
│ │ ├── permutations.js：計算排列數。
│ │ └── subtract.js：執行減法運算。
│ ├── meals/
│ │ ├── breakfast.js：隨機選擇早餐。
│ │ ├── dinner.js：隨機選擇晚餐。
│ │ └── lunch.js：隨機選擇午餐。
│ ├── schedule/
│ │ └── schedule.js：管理日程安排。
│ └── weather/
│ └── weather.js：查詢天氣資訊。
├── utils/rpg/
│ ├── database/
│ │ ├── armors.json：裝甲數據。
│ │ ├── artifacts.json：神器數據。
│ │ ├── bosses.json：Boss 數據。
│ │ ├── characters.json：角色數據。
│ │ ├── classes.json：職業數據。
│ │ ├── craftingRecipes.json：製作配方數據。
│ │ ├── enemies.json：敵人數據。
│ │ ├── fish.json：魚類數據。
│ │ ├── jobs.json：職業數據。
│ │ ├── potions.json：藥水數據。
│ │ ├── weapons.json：武器數據。
│ │ └── wood.json：木材數據。
│ ├── adventure.js：處理冒險邏輯。
│ ├── battle.js：處理戰鬥邏輯。
│ ├── bosses.js：管理 Boss 數據和行為。
│ ├── characters.js：管理角色數據和行為。
│ ├── classes.js：管理角色職業數據和行為。
│ ├── enemies.js：管理敵人數據和行為。
│ ├── items.js：管理物品數據和行為。
│ └── scenarios.js：管理隨機事件和場景。
├── .env：環境變量文件。
├── .gitattributes：Git 屬性配置文件。
├── .gitignore：Git 忽略文件配置。
├── bot.js：機器人主文件。
├── LICENSE：許可證文件。
├── package-lock.json：NPM 鎖定文件。
├── package.json：NPM 配置文件。
└── README.md：專案說明文件。
```

## 簡單使用示例

### 數學指令

- `!add 2 3`：返回 2 + 3 的結果。
- `!subtract 5 2`：返回 5 - 2 的結果。
- `!multiply 4 3`：返回 4 \* 3 的結果。
- `!divide 10 2`：返回 10 / 2 的結果。
- `!combinations 5 3`：計算 5 選 3 的組合數。
- `!permutations 5 3`：計算 5 選 3 的排列數。
- `!calculus`：進行微積分相關計算（具體使用方式需參考詳細指令說明）。


## 許可

此項目遵循 MIT 許可。詳情請參見 [LICENSE](LICENSE) 文件。
