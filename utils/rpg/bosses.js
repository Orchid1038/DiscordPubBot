const fs = require("fs");
const path = require("path");

const bossesFilePath = path.join(__dirname, "database", "bosses.json");

let bosses = [];

// 加載Boss數據
function loadBosses() {
  if (fs.existsSync(bossesFilePath)) {
    const data = fs.readFileSync(bossesFilePath, "utf-8");
    bosses = JSON.parse(data);
  } else {
    // 如果文件不存在，創建一個空的Boss數據文件
    bosses = [];
    saveBosses();
  }
}

function saveBosses() {
  fs.writeFileSync(bossesFilePath, JSON.stringify(bosses, null, 2), "utf-8");
}

function getAllBosses() {
  return bosses;
}

function getBoss(name) {
  return bosses.find((boss) => boss.name === name);
}

function getUserBosses(userId) {
  return bosses.filter((boss) => boss.userId === userId);
}

function createBoss(userId, userName, name, level, description, story, drops) {
  const newBoss = {
    userId,
    userName,
    name,
    level,
    description,
    story,
    hp: level * 10, // 假設每級增加10點HP
    attack: level * 2, // 假設每級增加2點攻擊力
    defense: level * 1.5, // 假設每級增加1.5點防禦力
    agility: level * 1.2, // 假設每級增加1.2點敏捷
    drops, // 添加掉落物品信息
  };
  bosses.push(newBoss);
  saveBosses();
}

// 初始化時加載Boss數據
loadBosses();

module.exports = {
  getAllBosses,
  getBoss,
  getUserBosses,
  createBoss,
  loadBosses,
};
