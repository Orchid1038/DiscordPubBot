const scenarios = new Map();

function createScenario(userId, userName, name, description) {
  const scenario = {
    name,
    description,
    creatorId: userId,
    creatorName: userName,
    steps: [],
  };
  scenarios.set(name, scenario);
  return scenario;
}

function addStepToScenario(userId, name, step) {
  const scenario = scenarios.get(name);
  if (scenario && scenario.creatorId === userId) {
    scenario.steps.push(step);
  } else {
    throw new Error("你沒有權限編輯這個劇情");
  }
}

function getScenario(name) {
  return scenarios.get(name);
}

function getUserScenarios(userId) {
  return Array.from(scenarios.values()).filter(
    (scenario) => scenario.creatorId === userId
  );
}

module.exports = {
  createScenario,
  addStepToScenario,
  getScenario,
  getUserScenarios,
};
