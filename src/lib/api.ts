import { getApiUrl } from "./env";
import { clearAuthData, getToken } from "./auth";
import type {
  Notification,
  PortfolioInvestment,
  Property,
  Transaction,
} from "../types/api";

const baseUrl = getApiUrl();

const fetcher = async <T>(path: string, options?: RequestInit) => {
  const url = `${baseUrl}${path}`;
  const token = await getToken();
  const headers = new Headers(options?.headers);

  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      await clearAuthData();
    }

    const errorMessage = `API request failed: ${response.status} ${errorBody}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (null as unknown as T);
};

export const getProperties = async (params?: {
  q?: string;
  type?: string;
  city?: string;
  returns?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Property[]; nextPage: number | null; total: number }> => {
  const query = new URLSearchParams();
  if (params?.q) query.append("q", params.q);
  if (params?.type) query.append("type", params.type);
  if (params?.city) query.append("city", params.city);
  if (params?.returns) query.append("returns", params.returns);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return fetcher<{ data: Property[]; nextPage: number | null; total: number }>(
    `/api/properties${queryString}`
  );
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
  { id: string; propertyId: string; property: Property }[]
> => {
  return fetcher<{ id: string; propertyId: string; property: Property }[]>(
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
