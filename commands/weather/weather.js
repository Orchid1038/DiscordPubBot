const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config(); // 加載環境變數

const availableCities = [
  "宜蘭縣",
  "花蓮縣",
  "臺東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
  "臺北市",
  "新北市",
  "桃園市",
  "臺中市",
  "臺南市",
  "高雄市",
  "基隆市",
  "新竹縣",
  "新竹市",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "嘉義市",
  "屏東縣",
];

module.exports = {
  metadata: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("查詢天氣預報")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("城市名稱")
        .setRequired(true)
        .addChoices(
          ...availableCities.map((city) => ({ name: city, value: city }))
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("days")
        .setDescription("查詢天數（最多兩天）")
        .setRequired(true)
        .addChoices({ name: "1天", value: 1 }, { name: "2天", value: 2 })
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const days = interaction.options.getInteger("days");
    const apiKey = process.env.CWA_GOV_AUTHKEY; // 從環境變數中讀取 API 密鑰
    if (!apiKey) {
      await interaction.reply("API 密鑰未配置，請聯繫管理員。");
      return;
    }
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001`;

    const params = {
      Authorization: apiKey,
      locationName: city,
      elementName: ["Wx", "PoP", "MinT", "MaxT"].join(","),
      format: "JSON",
    };

    try {
      console.log(`Request URL: ${url}`);
      console.log(`Request Params: ${JSON.stringify(params)}`);
      const { data } = await axios.get(url, { params });
      console.log(data); // 打印 API 回應資料以進行調試

      if (data.success !== "true" || !data.records || !data.records.location) {
        await interaction.reply(`無法找到城市 ${city} 的天氣資料。`);
        return;
      }

      const location = data.records.location.find(
        (loc) => loc.locationName === city
      );
      if (!location) {
        await interaction.reply(`無法找到城市 ${city} 的天氣資料。`);
        return;
      }

      const weatherElements = location.weatherElement.reduce((acc, element) => {
        acc[element.elementName] = element.time
          .slice(0, days * 2)
          .map((timeData) => ({
            startTime: new Date(timeData.startTime).toLocaleString("zh-TW", {
              hour12: false,
              timeZone: "Asia/Taipei",
            }),
            endTime: new Date(timeData.endTime).toLocaleString("zh-TW", {
              hour12: false,
              timeZone: "Asia/Taipei",
            }),
            value: timeData.parameter.parameterName,
            unit:
              timeData.parameter.parameterUnit === "百分比"
                ? "%"
                : timeData.parameter.parameterUnit,
          }));
        return acc;
      }, {});

      const weatherDescription = `
\`\`\`
城市：${location.locationName}

天氣狀況：
${weatherElements.Wx.map(
  (e) => `${e.startTime} - ${e.endTime}: ${e.value}`
).join("\n")}

氣溫：
最低：
${weatherElements.MinT.map(
  (e) => `${e.startTime} - ${e.endTime}: ${e.value}°${e.unit}`
).join("\n")}
最高：
${weatherElements.MaxT.map(
  (e) => `${e.startTime} - ${e.endTime}: ${e.value}°${e.unit}`
).join("\n")}

降雨機率：
${weatherElements.PoP.map(
  (e) => `${e.startTime} - ${e.endTime}: ${e.value}${e.unit}`
).join("\n")}
\`\`\`
      `;

      await interaction.reply(weatherDescription);
    } catch (error) {
      console.error("抓取天氣資料時發生錯誤:", error);
      if (error.response && error.response.status === 401) {
        await interaction.reply("API 密鑰無效，請聯繫管理員。");
      } else {
        await interaction.reply("抓取天氣資料時發生錯誤，請稍後再試。");
      }
    }
  },
};
