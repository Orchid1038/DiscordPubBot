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
    throw new Error("Boss數據文件不存在！");
  }
}

function getAllBosses() {
  return bosses;
}

function getBoss(name) {
  return bosses.find((boss) => boss.name === name);
}

function getUserBosses(userId) {
  // 假設有一個用戶Boss數據結構
  // 這裡應該根據實際需求實現
  return bosses.filter((boss) => boss.userId === userId);
}

// 初始化時加載Boss數據
loadBosses();

module.exports = {
  getAllBosses,
  getBoss,
  getUserBosses,
};
