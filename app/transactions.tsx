import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenWrapper } from "../src/components/layout/ScreenWrapper";
import { transactions } from "../src/constants/mockData";

const filterOptions = ["All", "Investments", "Returns", "Withdrawals"] as const;

const monthLabel = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("All");

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      if (filter === "All") return true;
      if (filter === "Investments") return item.type === "Investment";
      if (filter === "Returns") return item.type === "Return";
      return item.type === "Withdrawal";
    });
  }, [filter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, typeof filtered>>((groups, item) => {
      const month = monthLabel(item.date);
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(item);
      return groups;
    }, {});
  }, [filtered]);

  const iconName = (type: string) => {
    if (type === "Investment") return "trending-up";
    if (type === "Return") return "cash";
    return "wallet";
  };

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-text">Transactions</Text>
        <Text className="mt-1 text-sm text-textSecondary">
          Track activity across your investments.
        </Text>
      </View>
      <View className="mb-6 flex-row flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setFilter(option)}
            className={`rounded-full border px-4 py-2 ${filter === option ? "border-primary bg-primaryLight" : "border-border bg-white"}`}
          >
            <Text
              className={`${filter === option ? "text-primary" : "text-textSecondary"} text-sm font-semibold`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      {Object.entries(grouped).map(([month, items]) => (
        <View key={month} className="mb-6">
          <Text className="mb-4 text-base font-semibold text-text">
            {month}
          </Text>
          {items.map((item) => (
            <View
              key={item.id}
              className="mb-4 rounded-3xl bg-white p-4 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-surface">
                    <Ionicons
                      name={iconName(item.type) as any}
                      size={20}
                      color="#4F46E5"
                    />
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-text">
                      {item.property}
                    </Text>
                    <Text className="text-sm text-textSecondary">
                      {item.type}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    className={`text-sm font-semibold ${item.type === "Withdrawal" ? "text-error" : "text-success"}`}
                  >
                    ₹{item.amount.toLocaleString("en-IN")}
                  </Text>
                  <Text className="text-xs text-textSecondary">
                    {item.date}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScreenWrapper>
  );
}
