const handleMessage = (message) => {
  // 忽略機器人自己發送的訊息
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // 定義每個關鍵字對應的隨機回覆選項
  const responses = {
    嗨: [
      "嗨！你今天吃藥了嗎？",
      "嘿，看到你真是笑死我了！",
      "你好啊，今天又犯啥傻了？",
      "嗨嗨，準備好鬧笑話了嗎？",
      "嗨！有啥事啊？",
    ],
    再見: [
      "拜拜！記得吃藥喔！",
      "再見啦，我會想你犯傻的樣子的！",
      "掰掰，下次見！別再犯傻了！",
      "拜拜，保重腦袋喔！",
      "再見，祝你別再犯傻！",
    ],
    謝謝: [
      "不客氣，客氣啥啦！",
      "你太客氣了，不用謝啦！",
      "謝啥謝，這是我應該做的！",
      "沒啥好謝的，這是我應該做的！",
      "你的謝意我心領了！",
    ],
    怎麼: [
      "我怎麼知道？我又不是神仙！",
      "這個問題我也很困惑呢！",
      "這可真是個好問題，讓我想想...",
      "你問的太難了，我還在學習中！",
      "我只是個小機器人，這個問題超出我的能力範圍了！",
    ],
    晚安: [
      "晚安！別做噩夢啊，夢到我就笑死了！",
      "晚安，祝你有個好夢！",
      "好好睡一覺，明天別再犯傻了！",
      "晚安，睡個好覺，養足精神！",
      "晚安，希望你做個香甜的夢！",
    ],
    早安: [
      "早安！新的一天又開始犯傻了！",
      "你早啊，準備好迎接新的一天了嗎？",
      "早安，希望你今天別再犯傻！",
      "你可真夠早的，我剛剛才笑醒呢！",
      "清晨的第一件事就是說早安？你昨晚是不是忘記吃藥了？",
    ],
    你好: [
      "你好嗎？我現在很好，因為我剛剛笑了一個三明治！",
      "哈囉，很高興認識你這個傻瓜！",
      "你好啊，我是一個樂於助人的小機器人！",
      "嗨，有啥能為你效勞的嗎？",
      "你好，今天過得怎麼樣呢？",
    ],
    問題: [
      "問題？我有一百萬個問題！你先問一個吧！",
      "好的，你有啥問題嗎？儘管問吧！",
      "問題不是問題，解決問題才是問題！",
      "每個問題都有答案，就看你是否願意尋找了！",
      "人生就是由無數個問題組成的，讓我們一起思考吧！",
    ],
  };

  // 從對應的回覆選項中隨機選擇一個
  const keys = Object.keys(responses);
  for (const key of keys) {
    if (content.includes(key)) {
      const randomResponse =
        responses[key][Math.floor(Math.random() * responses[key].length)];
      message.reply(randomResponse);
      return;
    }
  }
};

module.exports = {
  handleMessage,
};
