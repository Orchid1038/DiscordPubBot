const {
  addItem,
  getCharacter,
  updateExperience,
  deleteCharacter,
} = require("./characters");
const fs = require("fs");
const path = require("path");

const fishFilePath = path.join(__dirname, "database", "fish.json");
const woodFilePath = path.join(__dirname, "database", "wood.json");
const jobsFilePath = path.join(__dirname, "database", "jobs.json");

let fish = [];
let wood = [];
let jobs = [];

// 加載數據
function loadData() {
  try {
    if (fs.existsSync(fishFilePath)) {
      const data = fs.readFileSync(fishFilePath, "utf-8");
      if (data.trim()) {
        fish = JSON.parse(data);
      } else {
        throw new Error("魚種數據文件為空！");
      }
    } else {
      throw new Error("魚種數據文件不存在！");
    }

    if (fs.existsSync(woodFilePath)) {
      const data = fs.readFileSync(woodFilePath, "utf-8");
      if (data.trim()) {
        wood = JSON.parse(data);
      } else {
        throw new Error("木頭數據文件為空！");
      }
    } else {
      throw new Error("木頭數據文件不存在！");
    }

    if (fs.existsSync(jobsFilePath)) {
      const data = fs.readFileSync(jobsFilePath, "utf-8");
      if (data.trim()) {
        jobs = JSON.parse(data);
      } else {
        throw new Error("職業數據文件為空！");
      }
    } else {
      throw new Error("職業數據文件不存在！");
    }
  } catch (error) {
    console.error("加載數據時發生錯誤：", error);
    throw error;
  }
}

loadData();

const adventureActions = {
  fishing: {
    message: "你進行了釣魚，獲得了一條魚。",
    staminaCost: 10,
    getItem: () => {
      const fishItem = fish[Math.floor(Math.random() * fish.length)];
      return {
        name: fishItem.name,
        type: "fish",
        value: fishItem.value,
        quantity: 1,
      };
    },
  },
  logging: {
    message: "你進行了伐木，獲得了一些木材。",
    staminaCost: 20,
    getItem: () => {
      const woodItem = wood[Math.floor(Math.random() * wood.length)];
      return {
        name: woodItem.name,
        type: "wood",
        value: woodItem.value,
        quantity: 1,
      };
    },
  },
  working: {
    getMessage: (jobItem) => `你當了${jobItem.name}，獲得了一些工資。`,
    staminaCost: 15,
    getItem: () => {
      const jobItem = jobs[Math.floor(Math.random() * jobs.length)];
      return {
        name: jobItem.name,
        type: "money",
        value: jobItem.earnings,
        quantity: 1,
      };
    },
    getAccidentMessage: (jobItem) => {
      const accidents = {
        司機: "你發生了車禍。",
        廚師: "你被燒傷了。",
        清潔工: "你被盆栽砸到了。",
      };
      return accidents[jobItem.name] || "你發生了意外。";
    },
    accidentProbability: 0.1, // 10%的機率發生意外
  },
};

function performAdventure(userId, action) {
  const adventure = adventureActions[action];
  if (!adventure) {
    throw new Error("未知的冒險行為");
  }

  const character = getCharacter(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  // 檢查體力是否足夠
  if (character.stamina < adventure.staminaCost) {
    return { success: false, message: "你的體力不足，無法進行此行為。" };
  }

  // 消耗體力
  character.stamina -= adventure.staminaCost;

  const item = adventure.getItem();
  addItem(userId, item);

  let message = adventure.getMessage
    ? adventure.getMessage(item)
    : `${adventure.message} 你獲得了 ${item.name}。`;

  // 檢查是否發生意外
  if (
    adventure.accidentProbability &&
    Math.random() < adventure.accidentProbability
  ) {
    message += ` ${adventure.getAccidentMessage(
      item
    )} 你的角色已死亡，請重新創建角色。`;
    deleteCharacter(userId);
  } else {
    message += ` 剩餘體力：${character.stamina} / ${character.maxStamina}`;
  }

  return { success: true, message };
}

module.exports = { performAdventure };
