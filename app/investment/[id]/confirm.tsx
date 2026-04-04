import { useMemo, useEffect } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "../../../src/components/ui/Button";
import { properties } from "../../../src/constants/mockData";

export default function InvestmentConfirmScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const property = useMemo(
    () => properties.find((item) => item.id === params.id),
    [params.id],
  );
  const units = Number(params.units) || 1;
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 500 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-text">Property not found.</Text>
      </View>
    );
  }

  const amount = units * property.minimumInvestment;
  const expectedReturn = Math.round(
    (amount * Number(property.expectedReturn.replace("%", ""))) / 100,
  );

  return (
    <View className="flex-1 bg-background px-6 py-10">
      <View className="items-center justify-center">
        <Reanimated.View
          className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-primaryLight"
          style={animatedStyle}
        >
          <Ionicons name="checkmark" size={48} color="#4F46E5" />
        </Reanimated.View>
        <Text className="text-3xl font-semibold text-text">
          Investment Successful
        </Text>
        <Text className="mt-3 text-center text-sm text-textSecondary">
          Your units have been booked successfully.
        </Text>
      </View>
      <View className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-sm text-textSecondary">Amount invested</Text>
        <Text className="mt-2 text-2xl font-semibold text-text">
          ₹{amount.toLocaleString("en-IN")}
        </Text>
        <Text className="mt-4 text-sm text-textSecondary">
          Expected annual return
        </Text>
        <Text className="mt-2 text-2xl font-semibold text-gold">
          ₹{expectedReturn.toLocaleString("en-IN")}
        </Text>
      </View>
      <View className="mt-8 space-y-4">
        <Button
          onPress={() => router.push({ pathname: "/portfolio" })}
          className="w-full"
        >
          View Portfolio
        </Button>
        <Button
          variant="secondary"
          onPress={() => router.push({ pathname: "/explore" })}
          className="w-full"
        >
          Explore More
        </Button>
      </View>
    </View>
  );
}
