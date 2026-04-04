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
      <View className="relative h-52 overflow-hidden rounded-t-3xl">
        <Image
          source={property.images[0]}
          contentFit="cover"
          className="h-full w-full"
        />
        <View className="absolute inset-x-0 top-4 flex-row items-center justify-between px-4">
          <Text className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-textSecondary">
            {property.type}
          </Text>
          <Pressable
            onPress={() => setBookmarked((prev) => !prev)}
            className="rounded-full bg-white/90 p-3"
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#4F46E5"
            />
          </Pressable>
        </View>
      </View>
      <View className="space-y-3 px-4 py-4">
        <View>
          <Text className="text-lg font-semibold text-text">
            {property.title}
          </Text>
          <Text className="mt-1 text-sm text-textSecondary">
            {property.location}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <ReturnsBadge value={property.expectedReturn.replace("%", "")} />
          <Text className="text-sm font-semibold text-textSecondary">
            Min ₹10,000
          </Text>
        </View>
        <OccupancyBar value={property.occupancy} />
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-textSecondary">
            {property.funded}% funded
          </Text>
          <Text className="text-sm font-semibold text-textSecondary">
            {property.availableUnits} units left
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
