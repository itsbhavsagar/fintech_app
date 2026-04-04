import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl } from "./env";

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
};

const AUTH_TOKEN_KEY = "brickshare_auth_token";
const AUTH_USER_KEY = "brickshare_auth_user";

export const getToken = async () => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

export const getStoredUser = async (): Promise<AuthUser | null> => {
  const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
  return userJson ? (JSON.parse(userJson) as AuthUser) : null;
};

export const setStoredUser = async (user: AuthUser) => {
  await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const setAuthData = async (token: string, user: AuthUser) => {
  await AsyncStorage.multiSet([
    [AUTH_TOKEN_KEY, token],
    [AUTH_USER_KEY, JSON.stringify(user)],
  ]);
};

export const clearAuthData = async () => {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${getApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Login failed.");
  }

  const json = await response.json();
  await setAuthData(json.token, json.user);
  return json;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
) => {
  const response = await fetch(`${getApiUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Registration failed.");
  }

  const json = await response.json();
  await setAuthData(json.token, json.user);
  return json;
};

export const logout = async () => {
  await clearAuthData();
};

export type { AuthUser };
