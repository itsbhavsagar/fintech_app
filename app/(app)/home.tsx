import { View, Text, Pressable, ScrollView } from "react-native";
import { useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

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
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
      >
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

        <View className="mb-6 rounded-3xl overflow-hidden">
          <LinearGradient
            colors={["#4F46E5", "#6366F1", "#3730A3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-6"
          >
            <Text className="text-xs font-semibold uppercase tracking-wider text-white/70 mt-4 ml-4">
              Portfolio Summary
            </Text>

            <Text className="mt-3 text-3xl font-semibold text-white ml-4">
              ₹{currentValue.toLocaleString("en-IN")}
            </Text>

            <View className="my-4 h-px bg-white/20" />

            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs text-white/60 ml-4">Invested</Text>
                <Text className="mt-1 text-base font-semibold text-white mb-4 ml-4">
                  ₹{totalInvested.toLocaleString("en-IN")}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-white/60 mr-4">Returns</Text>
                <Text className="mt-1 text-base font-semibold text-green-300 mr-4">
                  ₹{totalReturns.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
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
              className="mr-4 mb-2"
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
      </ScrollView>

      <Pressable
        onPress={() => router.push("/assistant")}
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
      >
        <Ionicons name="business" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
