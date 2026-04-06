import { Text, View } from "react-native";
import { PortfolioInvestment } from "../../types/api";

export type InvestmentCardProps = {
  investment: PortfolioInvestment;
};

export const InvestmentCard = ({ investment }: InvestmentCardProps) => {
  const returns = investment.currentValue - investment.invested;
  const isPositive = returns >= 0;

  return (
    <View className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
      <View className="border-b border-border px-5 py-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text
              className="text-base font-semibold text-text"
              numberOfLines={1}
            >
              {investment.title}
            </Text>
            <Text className="mt-0.5 text-xs text-textSecondary">
              {investment.city}
            </Text>
          </View>
          <View className="rounded-full bg-primaryLight px-3 py-1">
            <Text className="text-xs font-bold text-primary">
              {investment.returnPercent}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 py-4">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-xs text-textSecondary mb-1">Units</Text>
            <Text className="text-sm font-semibold text-text">
              {investment.units}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-textSecondary mb-1">Invested</Text>
            <Text className="text-sm font-semibold text-text">
              ₹{investment.invested.toLocaleString("en-IN")}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-xs text-textSecondary mb-1">
              Current Value
            </Text>
            <Text className="text-sm font-semibold text-text">
              ₹{investment.currentValue.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-surface px-4 py-3">
          <Text className="text-xs text-textSecondary">Total returns</Text>
          <Text
            className={`text-sm font-bold ${isPositive ? "text-success" : "text-error"}`}
          >
            {isPositive ? "+" : ""}₹{returns.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>
    </View>
  );
};
