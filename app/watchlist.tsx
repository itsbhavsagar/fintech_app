import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useRouter } from "expo-router";
import { useWatchlist } from "../src/hooks/useBackend";
import { PropertyCardSmall } from "../src/components/property/PropertyCardSmall";
import { ScreenWrapper } from "../src/components/layout/ScreenWrapper";
import { removeWatchlist } from "../src/lib/api";
import queryClient from "../src/lib/queryClient";
import type { Property } from "../src/types/api";

type WatchlistEntry = {
  id: string;
  propertyId: string;
  property: Property;
};

export default function WatchlistScreen() {
  const router = useRouter();
  const { data: watchlist, isLoading, isError, error } = useWatchlist();
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const items = useMemo(
    () =>
      (watchlist ?? []).filter((item) => !removedIds.includes(item.propertyId)),
    [watchlist, removedIds],
  );

  const removeItem = async (propertyId: string) => {
    setActionError(null);
    setRemovedIds((current) => [...current, propertyId]);

    try {
      await removeWatchlist(propertyId);
      queryClient.setQueryData<WatchlistEntry[]>(
        ["watchlist"],
        (current) =>
          (current ?? []).filter((item) => item.propertyId !== propertyId),
      );
      await queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    } catch (removeError) {
      setActionError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove property from watchlist.",
      );
    } finally {
      setRemovedIds((current) => current.filter((id) => id !== propertyId));
    }
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
      {actionError ? (
        <View className="mb-4 rounded-3xl bg-errorLight p-3">
          <Text className="text-sm font-medium text-error">{actionError}</Text>
        </View>
      ) : null}
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
        <View>
          {items.map((item) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => (
                <Pressable
                  onPress={() => void removeItem(item.propertyId)}
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
          ))}
        </View>
      )}
    </ScreenWrapper>
  );
}
