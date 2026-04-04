import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Property } from "../../constants/mockData";
import { ReturnsBadge } from "./ReturnsBadge";
import { OccupancyBar } from "./OccupancyBar";

export type PropertyCardProps = {
  property: Property;
  onPress?: () => void;
  className?: string;
};

export const PropertyCard = ({
  property,
  onPress,
  className,
}: PropertyCardProps) => {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-3xl bg-white shadow-sm ${className ?? ""}`}
    >
      <View className="relative h-40 overflow-hidden rounded-t-3xl">
        <Image
          source={{ uri: property.images[0] }}
          contentFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
        <View className="absolute inset-x-0 top-3 flex-row items-center justify-between px-3">
          <Text className="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-textSecondary">
            {property.type}
          </Text>
          <Pressable
            onPress={() => setBookmarked((prev) => !prev)}
            className="rounded-full bg-white/90 p-2"
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color="#4F46E5"
            />
          </Pressable>
        </View>
      </View>

      <View className="px-3 py-3 gap-2">
        <View>
          <Text className="text-sm font-semibold text-text" numberOfLines={2}>
            {property.title}
          </Text>
          <Text className="mt-0.5 text-xs text-textSecondary" numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <ReturnsBadge value={property.expectedReturn.replace("%", "")} />
          <Text className="text-xs text-textSecondary">Min ₹10k</Text>
        </View>

        <OccupancyBar value={property.occupancy} />

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-textSecondary">
            {property.funded}% funded
          </Text>
          <Text className="text-xs font-semibold text-textSecondary">
            {property.availableUnits} left
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
