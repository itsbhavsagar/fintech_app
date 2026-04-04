import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { properties } from "../../src/constants/mockData";
import { Button } from "../../src/components/ui/Button";
import { useHaptics } from "../../src/hooks/useHaptics";

export default function InvestmentSelectScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const property = useMemo(
    () => properties.find((item) => item.id === params.id),
    [params.id],
  );
  const [units, setUnits] = useState(1);
  const { medium } = useHaptics();

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-text">Property not found.</Text>
      </View>
    );
  }

  const amount = units * property.minimumInvestment;
  const expectedReturn = Number(property.expectedReturn.replace("%", ""));
  const projectedReturn = Math.round((amount * expectedReturn) / 100);

  const adjustUnits = async (value: number) => {
    const nextUnits = Math.max(1, units + value);
    setUnits(nextUnits);
    await medium();
  };

  return (
    <View className="flex-1 bg-background px-6 py-8">
      <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-base font-semibold text-text">
          {property.title}
        </Text>
        <Text className="mt-2 text-sm text-textSecondary">
          {property.location}
        </Text>
        <View className="mt-4 rounded-3xl bg-surface p-4">
          <Text className="text-sm text-textSecondary">Expected return</Text>
          <Text className="mt-2 text-2xl font-semibold text-text">
            {property.expectedReturn}
          </Text>
          <Text className="mt-1 text-sm text-textSecondary">
            {property.type} • {property.city}
          </Text>
        </View>
      </View>

      <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-base font-semibold text-text">Select units</Text>
        <View className="mt-5 flex-row items-center justify-between rounded-3xl bg-surface px-4 py-4">
          <Pressable
            onPress={() => adjustUnits(-1)}
            className="rounded-2xl bg-white p-4"
          >
            <Ionicons name="remove" size={24} color="#4F46E5" />
          </Pressable>
          <View className="items-center">
            <Text className="text-5xl font-semibold text-text">{units}</Text>
            <Text className="text-sm text-textSecondary">units</Text>
          </View>
          <Pressable
            onPress={() => adjustUnits(1)}
            className="rounded-2xl bg-white p-4"
          >
            <Ionicons name="add" size={24} color="#4F46E5" />
          </Pressable>
        </View>
        <View className="mt-6 rounded-3xl bg-surface p-4">
          <Text className="text-sm text-textSecondary">
            Your available balance
          </Text>
          <Text className="mt-2 text-lg font-semibold text-text">
            ₹1,50,000
          </Text>
          <Text className="mt-4 text-sm text-textSecondary">
            Projected annual returns
          </Text>
          <Text className="mt-2 text-lg font-semibold text-gold">
            ₹{projectedReturn.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      <Button
        onPress={() =>
          router.push({
            pathname: `/investment/${property.id}/review`,
            params: { units: String(units) },
          })
        }
        className="w-full"
      >
        Review investment
      </Button>
    </View>
  );
}
