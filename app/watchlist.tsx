import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useRouter } from "expo-router";
import { Property, properties } from "../src/constants/mockData";
import { PropertyCardSmall } from "../src/components/property/PropertyCardSmall";
import { ScreenWrapper } from "../src/components/layout/ScreenWrapper";
import Ionicons from "@expo/vector-icons/Ionicons";

const initialWatchlist = ["p2", "p3", "p6"];

export default function WatchlistScreen() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState(initialWatchlist);

  const items = useMemo(
    () => properties.filter((property) => watchlist.includes(property.id)),
    [watchlist],
  );

  const removeItem = (id: string) => {
    setWatchlist((current) => current.filter((item) => item !== id));
  };

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
          <Text className="mt-2 text-sm text-textSecondary">
            Browse properties and save the ones you like.
          </Text>
        </View>
      ) : (
        <FlashList<Property>
          data={items}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <Pressable
                  onPress={() => removeItem(item.id)}
                  className="h-full justify-center rounded-l-3xl bg-error px-4"
                >
                  <Text className="text-sm font-semibold text-white">
                    Remove
                  </Text>
                </Pressable>
              )}
            >
              <PropertyCardSmall
                property={item}
                onPress={() =>
                  router.push({ pathname: `/property/${item.id}` })
                }
              />
            </Swipeable>
          )}
          estimatedItemSize={120}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
