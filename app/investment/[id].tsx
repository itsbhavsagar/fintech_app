import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useProperty } from "../../src/hooks/useBackend";
import { Button } from "../../src/components/ui/Button";
import { useHaptics } from "../../src/hooks/useHaptics";

export default function InvestmentSelectScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: property, isLoading, isError, error } = useProperty(id);
  const [units, setUnits] = useState(1);
  const { medium } = useHaptics();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-textSecondary">Loading...</Text>
      </View>
    );
  }

  if (isError || !property) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-base font-semibold text-text">
          Property not found.
        </Text>
        <Text className="mt-2 text-center text-sm text-textSecondary">
          {(error as Error)?.message ?? "Please try again."}
        </Text>
      </View>
    );
  }

  const amount = units * property.minimumInvestment;
  const expectedReturn = Number(property.expectedReturn.replace("%", ""));
  const projectedReturn = Math.round((amount * expectedReturn) / 100);

  const adjustUnits = async (value: number) => {
    const next = Math.max(1, units + value);
    setUnits(next);
    await medium();
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="border-b border-border px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="mb-4 h-9 w-9 items-center justify-center rounded-full bg-surface border border-border"
        >
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </Pressable>
        <Text className="text-2xl font-bold text-text">Invest</Text>
        <Text className="mt-1 text-sm text-textSecondary" numberOfLines={1}>
          {property.title}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <View className="mb-4 overflow-hidden rounded-3xl bg-primary">
          <View className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <View className="p-5">
            <Text className="text-xs text-white/60">Expected return</Text>
            <Text className="mt-1 text-3xl font-bold text-white">
              {property.expectedReturn}
            </Text>
            <Text className="mt-1 text-xs text-white/60">
              {property.type} · {property.city}
            </Text>
          </View>
        </View>

        <View className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="mb-5 text-base font-semibold text-text">
            Select units
          </Text>
          <View className="flex-row items-center justify-between rounded-2xl bg-surface px-4 py-4">
            <Pressable
              onPress={() => adjustUnits(-1)}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white border border-border"
            >
              <Ionicons name="remove" size={20} color="#4F46E5" />
            </Pressable>
            <View className="items-center">
              <Text className="text-5xl font-bold text-text">{units}</Text>
              <Text className="text-xs text-textSecondary">units</Text>
            </View>
            <Pressable
              onPress={() => adjustUnits(1)}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-primary"
            >
              <Ionicons name="add" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-textSecondary">Amount</Text>
            <Text className="text-sm font-semibold text-text">
              ₹{amount.toLocaleString("en-IN")}
            </Text>
          </View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-textSecondary">
              Available balance
            </Text>
            <Text className="text-sm font-semibold text-text">₹1,50,000</Text>
          </View>
          <View className="h-px bg-border my-1" />
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-sm text-textSecondary">
              Projected annual return
            </Text>
            <Text className="text-sm font-bold text-success">
              +₹{projectedReturn.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
      </View>

      <View
        className="border-t border-border px-6 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          onPress={() =>
            router.push({
              pathname: "/investment/[id]/review",
              params: { id: property.id, units: String(units) },
            })
          }
          className="w-full"
        >
          Review investment
        </Button>
      </View>
    </View>
  );
}
