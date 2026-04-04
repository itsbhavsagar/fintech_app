import { useMemo } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { Button } from "../../src/components/ui/Button";
import { InvestmentCard } from "../../src/components/portfolio/InvestmentCard";
import { PortfolioChart } from "../../src/components/portfolio/PortfolioChart";
import { usePortfolio } from "../../src/hooks/useBackend";
import { usePortfolioInsights } from "../../src/hooks/usePortfolioInsights";

import Ionicons from "@expo/vector-icons/Ionicons";

const monthlyData = [
  { month: "Jan", value: 5 },
  { month: "Feb", value: 8 },
  { month: "Mar", value: 6 },
  { month: "Apr", value: 10 },
  { month: "May", value: 9 },
  { month: "Jun", value: 12 },
];

export default function PortfolioScreen() {
  const { data: portfolio, isLoading, isError, error } = usePortfolio();
  const investments = portfolio?.investments ?? [];
  const { insights, loading, generateInsights, hasGenerated } =
    usePortfolioInsights(investments);

  const totalInvested = useMemo(
    () => investments.reduce((sum, item) => sum + item.invested, 0),
    [investments],
  );
  const currentValue = useMemo(
    () => investments.reduce((sum, item) => sum + item.currentValue, 0),
    [investments],
  );
  const totalReturns = currentValue - totalInvested;
  const returnsPercent =
    totalInvested > 0
      ? ((totalReturns / totalInvested) * 100).toFixed(2)
      : "0.00";
  const isPositive = totalReturns >= 0;

  if (isLoading) {
    return (
      <ScreenWrapper scrollable className="bg-background">
        <View className="flex-1 items-center justify-center py-20 gap-3">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-base font-medium text-textSecondary">
            Loading portfolio…
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper scrollable className="bg-background">
        <View className="flex-1 items-center justify-center py-20 px-6">
          <Text className="text-lg font-semibold text-text">
            Unable to load portfolio
          </Text>
          <Text className="mt-2 text-sm text-textSecondary text-center">
            {(error as Error)?.message ?? "Please try again later."}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-text">My Portfolio</Text>
        <Text className="mt-1 text-sm text-textSecondary">
          {investments.length} investment{investments.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View className="mb-4 rounded-3xl bg-primary px-5 py-6 shadow-md">
        <Text className="text-sm font-medium text-background">
          Current Value
        </Text>
        <Text className="mt-1 text-3xl font-bold text-background">
          ₹{currentValue.toLocaleString("en-IN")}
        </Text>
        <View className="mt-3 flex-row items-center gap-2">
          <View
            className={`rounded-full px-2.5 py-1 ${
              isPositive ? "bg-success/20" : "bg-destructive/20"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {isPositive ? "▲" : "▼"} {returnsPercent}%
            </Text>
          </View>
          <Text className="text-sm text-background">
            {isPositive ? "+" : ""}₹{totalReturns.toLocaleString("en-IN")} all
            time
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-xs text-textSecondary">Invested</Text>
          <Text className="mt-1 text-base font-semibold text-text">
            ₹{totalInvested.toLocaleString("en-IN")}
          </Text>
        </View>
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-xs text-textSecondary">Returns</Text>
          <Text
            className={`mt-1 text-base font-semibold ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}₹{totalReturns.toLocaleString("en-IN")}
          </Text>
        </View>
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-xs text-textSecondary">Return %</Text>
          <Text
            className={`mt-1 text-base font-semibold ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}
            {returnsPercent}%
          </Text>
        </View>
      </View>

      <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-sm font-semibold text-text">
          6-Month Performance
        </Text>
        <PortfolioChart data={monthlyData} />
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-text">AI Insights</Text>
        <Button
          variant="secondary"
          size="sm"
          onPress={generateInsights}
          loading={loading}
          disabled={hasGenerated}
        >
          {hasGenerated ? "Generated" : "Generate"}
        </Button>
      </View>

      {insights ? (
        <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm gap-3">
          <View className="flex-row items-start gap-2">
            <Ionicons name="bulb-outline" size={18} color="#4F46E5" />
            <Text className="flex-1 text-sm font-semibold text-text">
              {insights.insight}
            </Text>
          </View>

          {insights.risk ? (
            <View className="flex-row items-start gap-2">
              <Ionicons name="warning-outline" size={18} color="#EF4444" />
              <Text className="flex-1 text-sm text-red-500">
                {insights.risk}
              </Text>
            </View>
          ) : null}

          {insights.opportunity ? (
            <View className="flex-row items-start gap-2">
              <Ionicons name="trending-up-outline" size={18} color="#3B82F6" />
              <Text className="flex-1 text-sm text-blue-500">
                {insights.opportunity}
              </Text>
            </View>
          ) : null}

          {insights.action ? (
            <View className="flex-row items-start gap-2">
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#10B981"
              />
              <Text className="flex-1 text-sm text-green-600">
                {insights.action}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <Text className="mb-4 text-lg font-semibold text-text">Investments</Text>
      <FlashList
        data={investments}
        renderItem={({ item }) => <InvestmentCard investment={item} />}
        estimatedItemSize={80}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}
