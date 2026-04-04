import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProperty } from "../../../src/hooks/useBackend";
import { Button } from "../../../src/components/ui/Button";

export default function InvestmentReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: property, isLoading, isError, error } = useProperty(id);
  const units = Number(params.units) || 1;
  const [accepted, setAccepted] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold text-text">
          Loading investment review...
        </Text>
      </View>
    );
  }

  if (isError || !property) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-base font-semibold text-text">
          Property not found.
        </Text>
        <Text className="mt-2 text-sm text-textSecondary text-center">
          {(error as Error)?.message ?? "Please try again."}
        </Text>
      </View>
    );
  }

  const amount = units * property.minimumInvestment;
  const fee = Math.round(amount * 0.02);
  const total = amount + fee;
  const expectedReturn = Math.round(
    (amount * Number(property.expectedReturn.replace("%", ""))) / 100,
  );

  return (
    <View className="flex-1 bg-background px-6 py-8">
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-text">
          Review investment
        </Text>
        <Text className="mt-2 text-sm text-textSecondary">
          Confirm your order details before checkout.
        </Text>
      </View>

      <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-sm text-textSecondary">Property</Text>
        <Text className="mt-2 text-lg font-semibold text-text">
          {property.title}
        </Text>
        <Text className="mt-4 text-sm text-textSecondary">Units</Text>
        <Text className="mt-1 text-base font-semibold text-text">
          {units} × ₹{property.minimumInvestment.toLocaleString("en-IN")}
        </Text>
        <View className="mt-4 rounded-3xl bg-surface p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-textSecondary">
              Platform fee (2%)
            </Text>
            <Text className="text-sm font-semibold text-text">
              ₹{fee.toLocaleString("en-IN")}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-text">
              Total amount
            </Text>
            <Text className="text-sm font-semibold text-text">
              ₹{total.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
        <View className="mt-4 rounded-3xl bg-surface p-4">
          <Text className="text-sm text-textSecondary">
            Expected annual return
          </Text>
          <Text className="mt-2 text-lg font-semibold text-gold">
            ₹{expectedReturn.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setAccepted((prev) => !prev)}
        className="mb-6 flex-row items-center gap-3"
      >
        <View
          className={`h-5 w-5 rounded-lg border ${accepted ? "bg-primary border-primary" : "bg-white border-border"}`}
        />
        <Text className="text-sm text-textSecondary">
          I agree to the terms and conditions.
        </Text>
      </Pressable>

      <Button
        onPress={() =>
          router.push({
            pathname: "/investment/[id]/confirm",
            params: { id: property.id, units: String(units) },
          })
        }
        disabled={!accepted}
        className="w-full"
      >
        Confirm investment
      </Button>
    </View>
  );
}
