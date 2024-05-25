const fs = require("fs");
const path = require("path");
const { classes, getRandomClass } = require("./classes");
const { getPotionByName } = require("./items");
const moment = require("moment");

const charactersFilePath = path.join(__dirname, "database", "characters.json");
let characters = new Map();

// 加載角色
function loadCharacters() {
  if (fs.existsSync(charactersFilePath)) {
    try {
      const data = fs.readFileSync(charactersFilePath, "utf-8");
      if (data.trim()) {
        const parsedData = JSON.parse(data);
        characters = new Map(
          parsedData.map((character) => [character.userId, character])
        );
      } else {
        characters = new Map();
      }
    } catch (error) {
      console.error("加載角色數據時發生錯誤：", error);
      characters = new Map();
    }
  }
}

// 保存角色
function saveCharacters() {
  const data = JSON.stringify(Array.from(characters.values()), null, 2);
  fs.writeFileSync(charactersFilePath, data, "utf-8");
}

function createCharacter(userId, userName, serverId, serverName, className) {
  if (characters.has(userId)) {
    return { success: false, message: "你已經創建過角色，無法再次創建。" };
  }

  const characterClass =
    classes.find((c) => c.name === className) || getRandomClass();
  const character = {
    userId,
    userName,
    serverId,
    serverName,
    class: characterClass.name,
    attack: characterClass.attack,
    defense: characterClass.defense,
    agility: characterClass.agility,
    stamina: 100, // 初始體力值
    maxStamina: 100, // 初始最大體力值
    hp: 100,
    level: 1,
    experience: 0,
    attackGrowth: characterClass.attackGrowth,
    defenseGrowth: characterClass.defenseGrowth,
    agilityGrowth: characterClass.agilityGrowth,
    staminaGrowth: 1, // 每級增加的體力值
    hpGrowth: characterClass.hpGrowth,
    potions: [], // 初始無紅藥水
    items: [], // 初始無物品
    gold: 0, // 初始無金錢
    weapon: null, // 初始無武器
    armor: null, // 初始無防具
    artifact: null, // 初始無神器
    createdAt: new Date().toISOString(),
    lastLoggingTime: null, // 上次伐木時間
    lastWorkingTime: null, // 上次打工時間
    lastFishingTime: null, // 上次釣魚時間
    lastRestTime: null, // 上次休息時間
    loggingTimesToday: 0, // 今天的伐木次數
    fishingTimesToday: 0, // 今天的釣魚次數
  };
  characters.set(userId, character);
  saveCharacters();
  return {
    success: true,
    message: `角色創建成功！你的職業是 ${className}`,
    character,
  };
}

function getCharacter(userId) {
  return characters.get(userId);
}

function deleteCharacter(userId) {
  characters.delete(userId);
  saveCharacters();
}

function updateExperience(userId, experience) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  character.experience += experience;

  // 防止經驗值變成負數
  if (character.experience < 0) {
    character.experience = 0;
  }

  // 升級曲線：每升一級需要的經驗值增加
  const experienceToNextLevel = character.level * 100;

  if (character.experience >= experienceToNextLevel) {
    character.level += 1;
    character.experience -= experienceToNextLevel;
    character.attack += character.attackGrowth; // 升級增加攻擊
    character.defense += character.defenseGrowth; // 升級增加防禦
    character.agility += character.agilityGrowth; // 升級增加敏捷
    character.hp += character.hpGrowth; // 升級增加生命值
    character.maxStamina += character.staminaGrowth; // 升級增加最大體力值
  }

  characters.set(userId, character);
  saveCharacters();
}

function restCharacter(userId) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  const today = moment().startOf("day");
  const lastRestTime = moment(character.lastRestTime).startOf("day");

  if (today.isSame(lastRestTime)) {
    return { success: false, message: "你今天已經休息過了，無法再次休息。" };
  }

  character.hp = 100; // 回滿狀態
  character.stamina = character.maxStamina; // 回滿體力
  character.lastRestTime = new Date().toISOString(); // 記錄休息時間
  characters.set(userId, character);
  saveCharacters();

  return { success: true, message: "你已經休息過了，體力和生命值已回滿。" };
}

function usePotion(userId) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  if (character.potions.length > 0) {
    const potionName = character.potions.pop();
    const potion = getPotionByName(potionName);
    if (!potion) {
      throw new Error("找不到對應的紅藥水");
    }
    character.hp = Math.min(100, character.hp + potion.hpRestore); // 回復HP
    characters.set(userId, character);
    saveCharacters();
    return potion;
  } else {
    return null;
  }
}

function addPotion(userId, potion) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  if (!potion || !potion.name) {
    throw new Error("無效的紅藥水");
  }

  character.potions.push(potion.name);
  characters.set(userId, character);
  saveCharacters();
}

function addItem(userId, item) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  if (!character.items) {
    character.items = [];
  }

  if (!item || !item.name || !item.type) {
    throw new Error("無效的物品");
  }

  const existingItem = character.items.find(
    (i) => i.name === item.name && i.type === item.type
  );
  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    character.items.push({ ...item, quantity: item.quantity || 1 });
  }
  characters.set(userId, character);
  saveCharacters();
}

function sellItem(userId, itemName) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  const itemIndex = character.items.findIndex((item) => item.name === itemName);
  if (itemIndex === -1) {
    throw new Error("找不到對應的物品");
  }

  const item = character.items[itemIndex];
  character.gold += item.value;
  character.items.splice(itemIndex, 1);
  characters.set(userId, character);
  saveCharacters();
  return item;
}

function equipWeapon(userId, weapon) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  if (character.weapon) {
    character.attack -= character.weapon.attack; // 解除當前武器的攻擊加成
  }

  character.weapon = weapon;
  character.attack += weapon.attack;
  characters.set(userId, character);
  saveCharacters();
}

function equipArmor(userId, armor) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  if (character.armor) {
    character.defense -= character.armor.defense; // 解除當前防具的防禦加成
  }

  character.armor = armor;
  character.defense += armor.defense;
  characters.set(userId, character);
  saveCharacters();
}

function equipArtifact(userId, artifact) {
  const character = characters.get(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  if (character.artifact) {
    character.attack -= character.artifact.attack || 0;
    character.defense -= character.artifact.defense || 0;
    character.agility -= character.artifact.agility || 0;
  }

  character.artifact = artifact;
  character.attack += artifact.attack || 0;
  character.defense += artifact.defense || 0;
  character.agility += artifact.agility || 0;
  characters.set(userId, character);
  saveCharacters();
}

// 初始化時加載角色
loadCharacters();

module.exports = {
  createCharacter,
  getCharacter,
  deleteCharacter,
  updateExperience,
  restCharacter,
  usePotion,
  addPotion,
  addItem,
  sellItem,
  equipWeapon,
  equipArmor,
  equipArtifact,
};
