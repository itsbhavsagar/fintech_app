import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Property } from "../../constants/mockData";
import { ReturnsBadge } from "./ReturnsBadge";

export type PropertyCardSmallProps = {
  property: Property;
  onPress?: () => void;
};

export const PropertyCardSmall = ({
  property,
  onPress,
}: PropertyCardSmallProps) => (
  <Pressable
    onPress={onPress}
    className="mb-4 overflow-hidden rounded-3xl bg-white p-3 shadow-sm"
  >
    <View className="flex-row gap-3">
      <Image
        source={property.images[0]}
        contentFit="cover"
        className="h-24 w-24 rounded-3xl"
      />
      <View className="flex-1 justify-between">
        <View>
          <Text className="text-base font-semibold text-text">
            {property.title}
          </Text>
          <Text className="mt-1 text-sm text-textSecondary">
            {property.location}
          </Text>
          <View className="mt-3 flex-row items-center gap-2">
            <ReturnsBadge value={property.expectedReturn.replace("%", "")} />
            <Text className="text-xs text-textSecondary">
              {property.occupancy}% occupancy
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="square" size={14} color="#4F46E5" />
            <Text className="text-sm text-textSecondary">Min ₹10,000</Text>
          </View>
          <Text className="text-sm font-semibold text-textSecondary">
            {property.funded}% funded
          </Text>
        </View>
      </View>
    </View>
  </Pressable>
);
