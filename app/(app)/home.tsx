import { View, Text, Pressable, ScrollView } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PropertyCard } from "../../src/components/property/PropertyCard";
import { PropertyCardSmall } from "../../src/components/property/PropertyCardSmall";
import { AuthUser, getStoredUser } from "../../src/lib/auth";
import {
  useAddToWatchlist,
  usePortfolio,
  useProperties,
  useRemoveFromWatchlist,
  useWatchlist,
} from "../../src/hooks/useBackend";

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    };

    loadUser();
  }, []);

  const {
    data: properties,
    isLoading: propertiesLoading,
    isError: propertiesError,
    error: propertiesFetchError,
  } = useProperties();

  const {
    data: portfolio,
    isLoading: portfolioLoading,
    isError: portfolioError,
    error: portfolioFetchError,
  } = usePortfolio();

  console.log("HomeScreen: propertiesLoading", propertiesLoading);
  console.log("HomeScreen: portfolioLoading", portfolioLoading);
  console.log("HomeScreen: properties", properties);
  console.log("HomeScreen: portfolio", portfolio);
  console.log("HomeScreen: propertiesError", propertiesError);
  console.log("HomeScreen: propertiesFetchError", propertiesFetchError);
  console.log("HomeScreen: portfolioError", portfolioError);
  console.log("HomeScreen: portfolioFetchError", portfolioFetchError);

  const { data: watchlist = [] } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const featured = useMemo(
    () => properties?.filter((property) => property.isFeatured) || [],
    [properties],
  );

  const trending = useMemo(
    () => properties?.filter((property) => !property.isFeatured) || [],
    [properties],
  );
  const watchlistIds = useMemo(
    () => new Set(watchlist.map((item) => item.propertyId)),
    [watchlist],
  );

  const totalInvested = portfolio?.totalInvested || 0;

  const currentValue =
    portfolio?.investments?.reduce((sum, item) => sum + item.currentValue, 0) ||
    0;

  const totalReturns = currentValue - totalInvested;
  const toggleWatchlist = async (propertyId: string) => {
    const isBookmarked = watchlistIds.has(propertyId);

    if (isBookmarked) {
      await removeFromWatchlist.mutateAsync(propertyId);
      return;
    }

    await addToWatchlist.mutateAsync(propertyId);
  };

  if (propertiesLoading || portfolioLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
        >
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-semibold text-text">
                Hi, {user?.name ?? "Investor"}
              </Text>
              <Text className="mt-1 text-sm text-textSecondary">
                Loading your dashboard...
              </Text>
            </View>
          </View>
          <View className="mb-6 rounded-3xl overflow-hidden bg-gray-200 h-40" />
          <View className="mb-4">
            <Text className="text-lg font-semibold text-text">
              Featured Properties
            </Text>
          </View>
          <View className="h-32 bg-gray-200 rounded-lg mb-8" />
          <View className="mb-4">
            <Text className="text-lg font-semibold text-text">
              Trending Now
            </Text>
          </View>
          <View className="h-64 bg-gray-200 rounded-lg" />
        </ScrollView>
      </View>
    );
  }

  const hasError = propertiesError || portfolioError;
  const errorMessage =
    (propertiesFetchError as Error | null)?.message ||
    (portfolioFetchError as Error | null)?.message ||
    "Unknown error";

  if (hasError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold text-text mb-3">
          Unable to load dashboard
        </Text>
        <Text className="text-sm text-textSecondary text-center">
          {errorMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
      >
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-semibold text-text capitalize">
              hi, {user?.name ?? "Investor"}
            </Text>
            <Text className="mt-1 text-sm text-textSecondary">
              Explore curated commercial opportunities.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/notifications")}
            className="rounded-3xl border border-border bg-white p-3"
          >
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 4 }}
        >
          {featured.map((item) => (
            <PropertyCard
              key={item.id}
              property={item}
              bookmarked={watchlistIds.has(item.id)}
              onBookmarkPress={() => void toggleWatchlist(item.id)}
              bookmarkDisabled={
                addToWatchlist.isPending || removeFromWatchlist.isPending
              }
              onPress={() =>
                router.push({
                  pathname: "/property/[id]",
                  params: { id: item.id },
                })
              }
              className="mb-2 mr-4 w-72"
            />
          ))}
        </ScrollView>

        <View className="mt-8 mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-text">Trending Now</Text>

          <Text className="text-sm font-semibold text-primary">
            {trending.length} listings
          </Text>
        </View>

        <View>
          {trending.map((item) => (
            <PropertyCardSmall
              key={item.id}
              property={item}
              onPress={() =>
                router.push({
                  pathname: "/property/[id]",
                  params: { id: item.id },
                })
              }
            />
          ))}
        </View>
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
