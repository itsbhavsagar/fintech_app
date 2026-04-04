import { Text, View } from "react-native";
import { PortfolioInvestment } from "../../types/api";

export type InvestmentCardProps = {
  investment: PortfolioInvestment;
};

export const InvestmentCard = ({ investment }: InvestmentCardProps) => (
  <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
    <View className="flex-row items-start justify-between">
      <View>
        <Text className="text-base font-semibold text-text">
          {investment.title}
        </Text>
        <Text className="mt-1 text-sm text-textSecondary">
          {investment.city}
        </Text>
      </View>
      <Text className="text-sm font-semibold text-primary">
        {investment.returnPercent}
      </Text>
    </View>
    <View className="mt-4 space-y-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-textSecondary">Units</Text>
        <Text className="text-sm font-semibold text-text">
          {investment.units}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-textSecondary">Invested</Text>
        <Text className="text-sm font-semibold text-text">
          ₹{investment.invested.toLocaleString("en-IN")}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-textSecondary">Current value</Text>
        <Text className="text-sm font-semibold text-text">
          ₹{investment.currentValue.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  </View>
);
