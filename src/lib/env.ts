import Constants from "expo-constants";

const getRuntimeConfig = (): Record<string, string | undefined> => {
  const extras =
    (Constants.expoConfig && Constants.expoConfig.extra) ||
    ((Constants.manifest as any)?.extra ?? {}) ||
    {};

  return extras as Record<string, string | undefined>;
};

export const getGroqApiKey = (): string => {
  const apiKey =
    getRuntimeConfig().EXPO_PUBLIC_GROQ_API_KEY ||
    process.env.EXPO_PUBLIC_GROQ_API_KEY;
  console.log("getGroqApiKey", { hasKey: !!apiKey });

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
  }

  return apiKey;
};

export const getCohereApiKey = (): string => {
  const apiKey =
    getRuntimeConfig().EXPO_PUBLIC_COHERE_API_KEY ||
    process.env.EXPO_PUBLIC_COHERE_API_KEY;
  console.log("getCohereApiKey", { hasKey: !!apiKey });

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_COHERE_API_KEY");
  }

  return apiKey;
};
