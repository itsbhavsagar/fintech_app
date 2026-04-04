import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import {
  Notification,
  notifications as initialNotifications,
} from "../../src/constants/mockData";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
  };

  const handlePress = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-semibold text-text">
            Notifications
          </Text>
          <Text className="mt-1 text-sm text-textSecondary">
            Stay updated on your investments.
          </Text>
        </View>
        <Pressable
          onPress={markAllRead}
          className="rounded-full bg-surfaceRaised px-4 py-2"
        >
          <Text className="text-sm font-semibold text-primary">
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <Text className="mb-4 text-sm text-textSecondary">
        Unread {unreadCount}
      </Text>

      <FlashList<Notification>
        data={notifications}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePress(item.id)}
            className="mb-4 rounded-3xl bg-white p-4 shadow-sm"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-text">
                  {item.title}
                </Text>
                <Text className="mt-2 text-sm text-textSecondary">
                  {item.description}
                </Text>
              </View>
              {item.unread ? (
                <View className="mt-1 h-3 w-3 rounded-full bg-primary" />
              ) : null}
            </View>
            <Text className="mt-3 text-xs text-textSecondary">{item.date}</Text>
          </Pressable>
        )}
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}
