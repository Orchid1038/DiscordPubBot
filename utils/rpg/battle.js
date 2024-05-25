const {
  getCharacter,
  addPotion,
  updateExperience,
  deleteCharacter,
  equipWeapon,
  equipArmor,
} = require("./characters");
const { getRandomEnemy } = require("./enemies");
const { getRandomWeapon, getRandomArmor } = require("./items");

function battle(userId, boss) {
  const character = getCharacter(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  let characterHp = character.hp;
  let enemyHp = boss.hp;
  let battleLog = [];

  // 根據敏捷值決定誰先出手
  const characterFirst = character.agility >= boss.agility;

  while (characterHp > 0 && enemyHp > 0) {
    if (characterFirst) {
      // 角色攻擊
      const characterDamage = Math.max(0, character.attack - boss.defense);
      enemyHp -= characterDamage;
      battleLog.push(`你對 ${boss.name} 造成了 ${characterDamage} 點傷害。`);

      if (enemyHp > 0) {
        // Boss攻擊
        const enemyDamage = Math.max(0, boss.attack - character.defense);
        characterHp -= enemyDamage;
        battleLog.push(`${boss.name} 對你造成了 ${enemyDamage} 點傷害。`);
      }
    } else {
      // Boss攻擊
      const enemyDamage = Math.max(0, boss.attack - character.defense);
      characterHp -= enemyDamage;
      battleLog.push(`${boss.name} 對你造成了 ${enemyDamage} 點傷害。`);

      if (characterHp > 0) {
        // 角色攻擊
        const characterDamage = Math.max(0, character.attack - boss.defense);
        enemyHp -= characterDamage;
        battleLog.push(`你對 ${boss.name} 造成了 ${characterDamage} 點傷害。`);
      }
    }

    // 根據敏捷值決定是否連續攻擊
    if (character.agility >= 2 * boss.agility && enemyHp > 0) {
      const characterDamage = Math.max(0, character.attack - boss.defense);
      enemyHp -= characterDamage;
      battleLog.push(
        `你再次對 ${boss.name} 造成了 ${characterDamage} 點傷害。`
      );
    } else if (boss.agility >= 2 * character.agility && characterHp > 0) {
      const enemyDamage = Math.max(0, boss.attack - character.defense);
      characterHp -= enemyDamage;
      battleLog.push(`${boss.name} 再次對你造成了 ${enemyDamage} 點傷害。`);
    }
  }

  character.hp = characterHp; // 記錄戰鬥結束後的HP

  let result;
  if (characterHp > 0) {
    result = "勝利";
    if (Math.random() < 0.5) {
      // 50%的機率掉落紅藥水
      addPotion(userId);
      result += " 並獲得了一瓶紅藥水！";
    }
  } else {
    result = "失敗";
    deleteCharacter(userId); // 刪除角色
  }

  return { result, characterHp, enemy: boss, battleLog };
}

function battleMonster(userId) {
  const character = getCharacter(userId);
  if (!character) {
    throw new Error("角色不存在");
  }

  const enemy = getRandomEnemy();
  let characterHp = character.hp;
  let enemyHp = enemy.hp;
  let battleLog = [];

  // 根據敏捷值決定誰先出手
  const characterFirst = character.agility >= enemy.agility;

  while (characterHp > 0 && enemyHp > 0) {
    if (characterFirst) {
      // 角色攻擊
      const characterDamage = Math.max(0, character.attack - enemy.defense);
      enemyHp -= characterDamage;
      battleLog.push(`你對 ${enemy.name} 造成了 ${characterDamage} 點傷害。`);

      if (enemyHp > 0) {
        // 敵人攻擊
        const enemyDamage = Math.max(0, enemy.attack - character.defense);
        characterHp -= enemyDamage;
        battleLog.push(`${enemy.name} 對你造成了 ${enemyDamage} 點傷害。`);
      }
    } else {
      // 敵人攻擊
      const enemyDamage = Math.max(0, enemy.attack - character.defense);
      characterHp -= enemyDamage;
      battleLog.push(`${enemy.name} 對你造成了 ${enemyDamage} 點傷害。`);

      if (characterHp > 0) {
        // 角色攻擊
        const characterDamage = Math.max(0, character.attack - enemy.defense);
        enemyHp -= characterDamage;
        battleLog.push(`你對 ${enemy.name} 造成了 ${characterDamage} 點傷害。`);
      }
    }
  }

  character.hp = characterHp; // 記錄戰鬥結束後的HP

  let result;
  if (characterHp > 0) {
    result = "勝利";
    updateExperience(userId, enemy.exp); // 根據小怪的經驗值更新角色經驗值
    if (Math.random() < 0.2) {
      // 20%的機率掉落紅藥水
      addPotion(userId);
      result += " 並獲得了一瓶紅藥水！";
    }
    if (Math.random() < 0.1) {
      // 10%的機率掉落武器
      const weapon = getRandomWeapon();
      equipWeapon(userId, weapon);
      result += ` 並獲得了一把武器：${weapon.name}！`;
    }
    if (Math.random() < 0.1) {
      // 10%的機率掉落防具
      const armor = getRandomArmor();
      equipArmor(userId, armor);
      result += ` 並獲得了一件防具：${armor.name}！`;
    }
  } else {
    result = "失敗";
    deleteCharacter(userId); // 刪除角色
  }

  return { result, characterHp, enemy, battleLog };
}

module.exports = { battle, battleMonster };
