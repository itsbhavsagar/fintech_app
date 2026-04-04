const { config } = require("dotenv");
const appJson = require("./app.json");

config();

module.exports = () => ({
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo?.extra ?? {}),
      EXPO_PUBLIC_GROQ_API_KEY: process.env.EXPO_PUBLIC_GROQ_API_KEY,
      EXPO_PUBLIC_COHERE_API_KEY: process.env.EXPO_PUBLIC_COHERE_API_KEY,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    },
  },
});
