import { getApiUrl } from "./env";
import { getToken } from "./auth";
import type {
  Notification,
  Property,
  PortfolioInvestment,
  Transaction,
} from "../types/api";

const baseUrl = getApiUrl();

const fetcher = async <T>(path: string, options?: RequestInit) => {
  const url = `${baseUrl}${path}`;
  const token = await getToken();
  console.log("fetcher request", {
    method: options?.method || "GET",
    url,
    options,
  });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const errorMessage = `API request failed: ${response.status} ${errorBody}`;
    console.error("fetcher error", { url, status: response.status, errorBody });
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as T;
  console.log("fetcher response", { url, result: json });
  return json;
};

export const getProperties = async (): Promise<Property[]> => {
  return fetcher<Property[]>("/api/properties");
};

export const getPropertyById = async (id: string): Promise<Property> => {
  return fetcher<Property>(`/api/properties/${id}`);
};

export const getPortfolio = async (): Promise<{
  investments: PortfolioInvestment[];
  totalInvested: number;
}> => {
  return fetcher<{ investments: PortfolioInvestment[]; totalInvested: number }>(
    "/api/portfolio",
  );
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return fetcher<Transaction[]>("/api/transactions");
};

export const getWatchlist = async (): Promise<
  Array<{ id: string; propertyId: string; property: Property }>
> => {
  return fetcher<Array<{ id: string; propertyId: string; property: Property }>>(
    "/api/watchlist",
  );
};

export const getNotifications = async (): Promise<Notification[]> => {
  return fetcher<Notification[]>("/api/notifications");
};

export const addWatchlist = async (propertyId: string) => {
  return fetcher(`/api/watchlist/${propertyId}`, { method: "POST" });
};

export const removeWatchlist = async (propertyId: string) => {
  return fetcher(`/api/watchlist/${propertyId}`, { method: "DELETE" });
};

export const createInvestment = async (
  propertyId: string,
  units: number,
  amount: number,
) => {
  return fetcher(`/api/investments`, {
    method: "POST",
    body: JSON.stringify({ propertyId, units, amount }),
  });
};
