import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const tabConfig: Record<string, { label: string; icon: string }> = {
  home: { label: "Home", icon: "home-outline" },
  explore: { label: "Explore", icon: "search-outline" },
  portfolio: { label: "Portfolio", icon: "pie-chart-outline" },
  notifications: { label: "Alerts", icon: "notifications-outline" },
  profile: { label: "Profile", icon: "person-outline" },
};

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => (
  <View className="bg-white border-t border-border px-4 py-2">
    <View className="flex-row items-center justify-between">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = tabConfig[route.name] ?? {
          label: route.name,
          icon: "ellipse-outline",
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = isFocused
          ? config.icon.replace("-outline", "")
          : config.icon;
        const iconColor = isFocused ? "#4F46E5" : "#9CA3AF";
        const textClass = isFocused
          ? "text-primary text-xs font-semibold"
          : "text-textSecondary text-xs";

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="items-center justify-center flex-1"
          >
            <Ionicons name={iconName as any} size={20} color={iconColor} />
            <Text className={`${textClass} mt-1`}>{config.label}</Text>
            {isFocused ? (
              <View className="absolute -bottom-2 h-0.5 w-8 rounded-full bg-primary" />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  </View>
);
