const fs = require("fs");
const path = require("path");

const weaponsFilePath = path.join(__dirname, "database", "weapons.json");
const armorsFilePath = path.join(__dirname, "database", "armors.json");
const potionsFilePath = path.join(__dirname, "database", "potions.json");
const artifactsFilePath = path.join(__dirname, "database", "artifacts.json");

let weapons = [];
let armors = [];
let potions = [];
let artifacts = [];

// 加載武器數據
function loadWeapons() {
  if (fs.existsSync(weaponsFilePath)) {
    const data = fs.readFileSync(weaponsFilePath, "utf-8");
    weapons = JSON.parse(data);
  } else {
    throw new Error("武器數據文件不存在！");
  }
}

// 加載防具數據
function loadArmors() {
  if (fs.existsSync(armorsFilePath)) {
    const data = fs.readFileSync(armorsFilePath, "utf-8");
    armors = JSON.parse(data);
  } else {
    throw new Error("防具數據文件不存在！");
  }
}

// 加載紅藥水數據
function loadPotions() {
  if (fs.existsSync(potionsFilePath)) {
    const data = fs.readFileSync(potionsFilePath, "utf-8");
    potions = JSON.parse(data);
  } else {
    throw new Error("紅藥水數據文件不存在！");
  }
}

// 加載神器數據
function loadArtifacts() {
  if (fs.existsSync(artifactsFilePath)) {
    const data = fs.readFileSync(artifactsFilePath, "utf-8");
    artifacts = JSON.parse(data);
  } else {
    throw new Error("神器數據文件不存在！");
  }
}

function getWeaponByName(name) {
  return weapons.find((weapon) => weapon.name === name);
}

function getArmorByName(name) {
  return armors.find((armor) => armor.name === name);
}

function getPotionByName(name) {
  return potions.find((potion) => potion.name === name);
}

function getArtifactByName(name) {
  return artifacts.find((artifact) => artifact.name === name);
}

// 初始化時加載所有數據
loadWeapons();
loadArmors();
loadPotions();
loadArtifacts();

module.exports = {
  weapons,
  armors,
  potions,
  artifacts,
  getWeaponByName,
  getArmorByName,
  getPotionByName,
  getArtifactByName,
};
