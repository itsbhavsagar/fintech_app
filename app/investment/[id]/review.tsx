import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useCreateInvestment,
  useProperty,
} from "../../../src/hooks/useBackend";
import { Button } from "../../../src/components/ui/Button";

export default function InvestmentReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: property, isLoading, isError, error } = useProperty(id);
  const units = Number(params.units) || 1;
  const [accepted, setAccepted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createInvestment = useCreateInvestment();

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
  const fee = Math.round(amount * 0.02);
  const total = amount + fee;
  const expectedReturn = Math.round(
    (amount * Number(property.expectedReturn.replace("%", ""))) / 100,
  );
  const handleConfirm = async () => {
    if (createInvestment.isPending) {
      return;
    }

    setSubmitError(null);

    try {
      await createInvestment.mutateAsync({
        propertyId: property.id,
        units,
        amount,
      });

      router.replace({
        pathname: "/investment/[id]/confirm",
        params: { id: property.id, units: String(units) },
      });
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to complete your investment right now.",
      );
    }
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
        <Text className="text-2xl font-bold text-text">Review</Text>
        <Text className="mt-1 text-sm text-textSecondary">
          Confirm your order before checkout.
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <View className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <View className="border-b border-border px-5 py-4">
            <Text className="text-xs text-textSecondary">Property</Text>
            <Text className="mt-1 text-base font-semibold text-text">
              {property.title}
            </Text>
            <Text className="mt-0.5 text-xs text-textSecondary">
              {property.city} · {property.type}
            </Text>
          </View>

          <View className="px-5 py-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-textSecondary">
                {units} units × ₹
                {property.minimumInvestment.toLocaleString("en-IN")}
              </Text>
              <Text className="text-sm font-semibold text-text">
                ₹{amount.toLocaleString("en-IN")}
              </Text>
            </View>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-textSecondary">
                Platform fee (2%)
              </Text>
              <Text className="text-sm font-semibold text-text">
                ₹{fee.toLocaleString("en-IN")}
              </Text>
            </View>
            <View className="h-px bg-border mb-3" />
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-text">Total</Text>
              <Text className="text-base font-bold text-text">
                ₹{total.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6 flex-row items-center justify-between rounded-3xl bg-primaryLight px-5 py-4">
          <View>
            <Text className="text-xs text-textSecondary">
              Expected annual return
            </Text>
            <Text className="mt-1 text-xl font-bold text-primary">
              ₹{expectedReturn.toLocaleString("en-IN")}
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Ionicons name="trending-up" size={20} color="#fff" />
          </View>
        </View>

        <Pressable
          onPress={() => setAccepted((prev) => !prev)}
          className="mb-6 flex-row items-center gap-3"
        >
          <View
            className={`h-5 w-5 items-center justify-center rounded-md border ${
              accepted ? "bg-primary border-primary" : "bg-white border-border"
            }`}
          >
            {accepted && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
          <Text className="flex-1 text-sm text-textSecondary">
            I agree to the terms and conditions of this investment.
          </Text>
        </Pressable>

        {submitError ? (
          <View className="rounded-3xl bg-errorLight p-3">
            <Text className="text-sm font-medium text-error">
              {submitError}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        className="border-t border-border px-6 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          onPress={() => void handleConfirm()}
          disabled={!accepted || createInvestment.isPending}
          loading={createInvestment.isPending}
          className="w-full"
        >
          Confirm investment
        </Button>
      </View>
    </View>
  );
}
