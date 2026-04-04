import { View, Text } from "react-native";

export type OccupancyBarProps = {
  value: number;
  className?: string;
};

const getBarColor = (value: number) => {
  if (value > 90) {
    return "bg-success";
  }
  if (value > 70) {
    return "bg-warning";
  }
  return "bg-error";
};

export const OccupancyBar = ({ value, className }: OccupancyBarProps) => {
  const colorClass = getBarColor(value);
  const filledWidth = value > 100 ? 100 : value < 0 ? 0 : value;

  return (
    <View className={`w-full ${className ?? ""}`}>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-text">Occupancy</Text>
        <Text className="text-sm text-textSecondary">{value}%</Text>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-border flex-row">
        <View className={`h-full ${colorClass} flex-[${filledWidth}]`} />
        <View className={`h-full flex-[${100 - filledWidth}]`} />
      </View>
    </View>
  );
};
