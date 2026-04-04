import Constants from "expo-constants";
import { Platform } from "react-native";

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

const resolveLocalhostUrl = (apiUrl: string): string => {
  const debuggerHost =
    (Constants.manifest as any)?.debuggerHost ||
    (Constants.expoConfig as any)?.hostUri ||
    null;

  if (!debuggerHost) {
    return apiUrl;
  }

  const host = debuggerHost.split(":")[0];
  if (!host || host === "localhost") {
    return apiUrl;
  }

  return apiUrl.replace("localhost", host);
};

export const getApiUrl = (): string => {
  const apiUrl =
    getRuntimeConfig().EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_URL ||
    "http://localhost:4000";

  if (!apiUrl) {
    throw new Error("Missing EXPO_PUBLIC_API_URL");
  }

  let resolvedApiUrl = apiUrl;

  if (Platform.OS === "android" && apiUrl.startsWith("http://localhost")) {
    resolvedApiUrl = apiUrl.replace("http://localhost", "http://10.0.2.2");
  } else if (Platform.OS !== "web" && apiUrl.startsWith("http://localhost")) {
    resolvedApiUrl = resolveLocalhostUrl(apiUrl);
  }

  console.log("getApiUrl", {
    platform: Platform.OS,
    configuredApiUrl: apiUrl,
    resolvedApiUrl,
  });

  return resolvedApiUrl;
};
