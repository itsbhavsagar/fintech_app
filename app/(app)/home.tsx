import { View, Text, Pressable } from "react-native";
import { useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "../../src/components/ui/Button";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { PropertyCard } from "../../src/components/property/PropertyCard";
import { PropertyCardSmall } from "../../src/components/property/PropertyCardSmall";
import {
  Property,
  properties,
  portfolioInvestments,
} from "../../src/constants/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const featured = useMemo(
    () => properties.filter((property) => property.isFeatured),
    [],
  );
  const trending = useMemo(
    () => properties.filter((property) => !property.isFeatured),
    [],
  );

  const totalInvested = portfolioInvestments.reduce(
    (sum, item) => sum + item.invested,
    0,
  );
  const currentValue = portfolioInvestments.reduce(
    (sum, item) => sum + item.currentValue,
    0,
  );
  const totalReturns = currentValue - totalInvested;

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-semibold text-text">
            Good morning, Aman
          </Text>
          <Text className="mt-1 text-sm text-textSecondary">
            Explore curated commercial opportunities.
          </Text>
        </View>
        <Pressable className="rounded-3xl border border-border bg-white p-3">
          <Ionicons name="notifications-outline" size={22} color="#4F46E5" />
        </Pressable>
      </View>

      <View className="mb-6 overflow-hidden rounded-3xl">
        <LinearGradient
          colors={["#4F46E5", "#3730A3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-6 py-6"
        >
          <Text className="text-sm font-semibold text-primaryLight">
            Portfolio summary
          </Text>
          <Text className="mt-3 text-3xl font-semibold text-white">
            ₹{currentValue.toLocaleString("en-IN")}
          </Text>
          <Text className="mt-2 text-sm text-primaryLight">
            Total invested ₹{totalInvested.toLocaleString("en-IN")} • Returns ₹
            {totalReturns.toLocaleString("en-IN")}
          </Text>
        </LinearGradient>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-text">
          Featured Properties
        </Text>
        <Pressable onPress={() => router.push("/explore")}>
          <Text className="text-sm font-semibold text-primary">View all</Text>
        </Pressable>
      </View>

      <FlashList<Property>
        data={featured}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push({ pathname: `/property/${item.id}` })}
            className="mr-4"
          />
        )}
        estimatedItemSize={320}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View className="mt-8 mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-text">Trending Now</Text>
        <Text className="text-sm font-semibold text-primary">
          {trending.length} listings
        </Text>
      </View>

      <FlashList<Property>
        data={trending}
        renderItem={({ item }) => (
          <PropertyCardSmall
            property={item}
            onPress={() => router.push({ pathname: `/property/${item.id}` })}
          />
        )}
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        onPress={() => router.push({ pathname: "/assistant" })}
        className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
      >
        <Ionicons name="business" size={28} color="#FFFFFF" />
      </Pressable>
    </ScreenWrapper>
  );
}
