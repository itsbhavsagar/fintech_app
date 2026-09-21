import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  addWatchlist,
  createInvestment,
  getProperties,
  getPropertyById,
  getNotifications,
  getPortfolio,
  getTransactions,
  getWatchlist,
  removeWatchlist,
} from "../lib/api";
import type {
  Notification,
  PortfolioInvestment,
  Property,
  Transaction,
} from "../types/api";

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: () => getProperties(),
  });
};

export const useInfiniteProperties = (filters: {
  q?: string;
  type?: string;
  city?: string;
  returns?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["properties", filters],
    queryFn: ({ pageParam = 1 }) => getProperties({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
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
  return useQuery<{ id: string; propertyId: string; property: Property }[]>({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWatchlist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWatchlist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};

export const useNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      units,
      amount,
    }: {
      propertyId: string;
      units: number;
      amount: number;
    }) => createInvestment(propertyId, units, amount),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      ]);
    },
  });
};
