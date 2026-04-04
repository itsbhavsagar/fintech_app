import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useRouter } from "expo-router";
import { useWatchlist } from "../src/hooks/useBackend";
import { PropertyCardSmall } from "../src/components/property/PropertyCardSmall";
import { ScreenWrapper } from "../src/components/layout/ScreenWrapper";

export default function WatchlistScreen() {
  const router = useRouter();
  const { data: watchlist, isLoading, isError, error } = useWatchlist();
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const items = useMemo(
    () =>
      (watchlist ?? []).filter((item) => !removedIds.includes(item.propertyId)),
    [watchlist, removedIds],
  );

  const removeItem = (propertyId: string) => {
    setRemovedIds((current) => [...current, propertyId]);
  };

  if (isLoading) {
    return (
      <ScreenWrapper scrollable className="bg-background">
        <View className="items-center justify-center py-20">
          <Text className="text-lg font-semibold text-text">
            Loading watchlist...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper scrollable className="bg-background">
        <View className="items-center justify-center py-20 px-6">
          <Text className="text-lg font-semibold text-text">
            Unable to load watchlist
          </Text>
          <Text className="mt-2 text-sm text-textSecondary text-center">
            {(error as Error)?.message ?? "Please try again later."}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-text">Watchlist</Text>
        <Text className="mt-1 text-sm text-textSecondary">
          Saved properties you are tracking.
        </Text>
      </View>
      {items.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Text className="text-lg font-semibold text-text">
            No saved properties yet
          </Text>
          <Text className="mt-2 text-sm text-textSecondary text-center">
            Browse properties and save the ones you like.
          </Text>
        </View>
      ) : (
        <FlashList
          data={items}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <Pressable
                  onPress={() => removeItem(item.propertyId)}
                  className="h-full justify-center rounded-l-3xl bg-error px-4"
                >
                  <Text className="text-sm font-semibold text-white">
                    Remove
                  </Text>
                </Pressable>
              )}
            >
              <PropertyCardSmall
                property={item.property}
                onPress={() =>
                  router.push({
                    pathname: "/property/[id]",
                    params: { id: item.property.id },
                  })
                }
              />
            </Swipeable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
