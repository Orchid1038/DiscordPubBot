const fs = require("fs");
const path = require("path");

const classesFilePath = path.join(__dirname, "database", "classes.json");

let classes = [];

// 加載職業數據
function loadClasses() {
  if (fs.existsSync(classesFilePath)) {
    const data = fs.readFileSync(classesFilePath, "utf-8");
    classes = JSON.parse(data);
  } else {
    throw new Error("職業數據文件不存在！");
  }
}

function getRandomClass() {
  return classes[Math.floor(Math.random() * classes.length)];
}

// 初始化時加載職業數據
loadClasses();

module.exports = { classes, getRandomClass };
