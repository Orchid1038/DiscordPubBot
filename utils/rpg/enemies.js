const fs = require("fs");
const path = require("path");

const {
  getWeaponByName,
  getArmorByName,
  getPotionByName,
  getArtifactByName,
} = require("./items");

const enemiesFilePath = path.join(__dirname, "database", "enemies.json");

let enemies = [];

// 加载敌人数据
function loadEnemies() {
  if (fs.existsSync(enemiesFilePath)) {
    const data = fs.readFileSync(enemiesFilePath, "utf-8");
    const parsedData = JSON.parse(data);

    // 处理掉落物品
    parsedData.forEach((enemy) => {
      if (enemy.loot) {
        enemy.loot.potions = enemy.loot.potions.map((potion) =>
          getPotionByName(potion.name)
        );
        enemy.loot.weapons = enemy.loot.weapons.map((weapon) =>
          getWeaponByName(weapon.name)
        );
        enemy.loot.armors = enemy.loot.armors.map((armor) =>
          getArmorByName(armor.name)
        );
        enemy.loot.artifacts = enemy.loot.artifacts.map((artifact) =>
          getArtifactByName(artifact.name)
        );
      }
    });

    enemies = parsedData;
  } else {
    throw new Error("敵人資料不存在！");
  }
}

function getRandomEnemy() {
  return enemies[Math.floor(Math.random() * enemies.length)];
}

// 初始化时加载敌人数据
loadEnemies();

module.exports = { enemies, getRandomEnemy };
