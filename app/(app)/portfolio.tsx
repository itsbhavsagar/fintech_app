import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { Button } from "../../src/components/ui/Button";
import { InvestmentCard } from "../../src/components/portfolio/InvestmentCard";
import { PortfolioChart } from "../../src/components/portfolio/PortfolioChart";
import {
  PortfolioInvestment,
  portfolioInvestments,
} from "../../src/constants/mockData";
import { usePortfolioInsights } from "../../src/hooks/usePortfolioInsights";

const monthlyData = [
  { month: "Jan", value: 5 },
  { month: "Feb", value: 8 },
  { month: "Mar", value: 6 },
  { month: "Apr", value: 10 },
  { month: "May", value: 9 },
  { month: "Jun", value: 12 },
];

export default function PortfolioScreen() {
  const { insights, loading, generateInsights } =
    usePortfolioInsights(portfolioInvestments);

  const totalInvested = useMemo(
    () => portfolioInvestments.reduce((sum, item) => sum + item.invested, 0),
    [],
  );

  const currentValue = useMemo(
    () =>
      portfolioInvestments.reduce((sum, item) => sum + item.currentValue, 0),
    [],
  );

  const totalReturns = currentValue - totalInvested;

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-text">My Portfolio</Text>
      </View>

      <View className="mb-4 space-y-4">
        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <Text className="text-sm text-textSecondary">Total Invested</Text>
          <Text className="mt-2 text-2xl font-semibold text-text">
            ₹{totalInvested.toLocaleString("en-IN")}
          </Text>
        </View>
        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <Text className="text-sm text-textSecondary">Current Value</Text>
          <Text className="mt-2 text-2xl font-semibold text-text">
            ₹{currentValue.toLocaleString("en-IN")}
          </Text>
        </View>
        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <Text className="text-sm text-textSecondary">Total Returns</Text>
          <Text className="mt-2 text-2xl font-semibold text-success">
            ₹{totalReturns.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      <PortfolioChart data={monthlyData} />

      <View className="mt-6 mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-text">AI Insights</Text>
        <Button
          variant="secondary"
          size="sm"
          onPress={generateInsights}
          loading={loading}
        >
          Get Portfolio Insights
        </Button>
      </View>

      {insights ? (
        <View className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
          <Text className="text-sm text-textSecondary">Insights</Text>
          <Text className="mt-3 text-base leading-6 text-text">{insights}</Text>
        </View>
      ) : null}

      <Text className="mb-4 text-lg font-semibold text-text">Investments</Text>
      <FlashList<PortfolioInvestment>
        data={portfolioInvestments}
        renderItem={({ item }) => <InvestmentCard investment={item} />}
        estimatedItemSize={140}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}
