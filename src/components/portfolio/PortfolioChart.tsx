import { View, Text } from "react-native";

export type PortfolioChartProps = {
  data: { month: string; value: number }[];
};

export const PortfolioChart = ({ data }: PortfolioChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm">
      <Text className="mb-4 text-base font-semibold text-text">
        Monthly returns
      </Text>
      <View className="flex-row items-end justify-between gap-2">
        {data.map((item) => {
          const rawHeight = maxValue > 0 ? (item.value / maxValue) * 120 : 0;
          const heightClass = `h-[${Math.max(16, Math.round(rawHeight))}px]`;
          return (
            <View key={item.month} className="items-center">
              <View className="relative h-32 w-8 overflow-hidden rounded-full bg-surface">
                <View
                  className={`absolute bottom-0 w-full bg-primary ${heightClass}`}
                />
              </View>
              <Text className="mt-2 text-xs text-textSecondary">
                {item.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
