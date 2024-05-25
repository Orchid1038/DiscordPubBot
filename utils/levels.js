const userLevels = new Map();

function updateLevel(userId, points) {
  if (!userLevels.has(userId)) {
    userLevels.set(userId, { points: 0, level: 1 });
  }

  const userData = userLevels.get(userId);
  userData.points += points;

  // 計算等級（例如，每100分升一級）
  const newLevel = Math.floor(userData.points / 20) + 1;
  if (newLevel > userData.level) {
    userData.level = newLevel;
  }

  userLevels.set(userId, userData);
}

function getLevel(userId) {
  if (!userLevels.has(userId)) {
    return { points: 0, level: 1 };
  }
  return userLevels.get(userId);
}

module.exports = { updateLevel, getLevel };
