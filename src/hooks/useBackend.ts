import { useQuery } from "@tanstack/react-query";
import {
  getProperties,
  getPropertyById,
  getPortfolio,
  getTransactions,
  getWatchlist,
  getNotifications,
} from "../lib/api";
import type {
  Notification,
  Property,
  PortfolioInvestment,
  Transaction,
} from "../types/api";

export const useProperties = () => {
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: getProperties,
  });
};

export const useProperty = (id?: string) => {
  return useQuery<Property>({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id ?? ""),
    enabled: Boolean(id),
  });
};

export const usePortfolio = () => {
  return useQuery<{
    investments: PortfolioInvestment[];
    totalInvested: number;
  }>({
    queryKey: ["portfolio"],
    queryFn: getPortfolio,
  });
};

export const useTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
};

export const useWatchlist = () => {
  return useQuery<
    Array<{ id: string; propertyId: string; property: Property }>
  >({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });
};

export const useNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};
