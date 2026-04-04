import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";

export default function ProfileScreen() {
  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-8 flex-row items-center gap-4">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primaryLight">
          <Text className="text-3xl font-bold text-primary">AG</Text>
        </View>
        <View>
          <Text className="text-2xl font-semibold text-text">Aman Gupta</Text>
          <Text className="mt-1 text-sm text-textSecondary">
            aman.gupta@brickshare.in
          </Text>
          <Text className="text-sm text-textSecondary">+91 98765 43210</Text>
        </View>
      </View>

      <View className="mb-6 flex-row justify-between rounded-3xl bg-white p-4 shadow-sm">
        <View>
          <Text className="text-sm text-textSecondary">Total Invested</Text>
          <Text className="mt-2 text-lg font-semibold text-text">₹360,000</Text>
        </View>
        <View>
          <Text className="text-sm text-textSecondary">Properties</Text>
          <Text className="mt-2 text-lg font-semibold text-text">4</Text>
        </View>
        <View>
          <Text className="text-sm text-textSecondary">Returns</Text>
          <Text className="mt-2 text-lg font-semibold text-success">
            ₹36,000
          </Text>
        </View>
      </View>

      <View className="space-y-3">
        {[
          { label: "KYC Status", value: "Verified", icon: "shield-checkmark" },
          { label: "Bank Account", value: "Active", icon: "card" },
          { label: "Transaction History", value: "View", icon: "receipt" },
          { label: "Watchlist", value: "3 saved", icon: "bookmark" },
          { label: "Notifications", value: "8 unread", icon: "notifications" },
          { label: "Help & Support", value: "", icon: "help-circle" },
          { label: "Terms & Privacy", value: "", icon: "document-text" },
        ].map((item) => (
          <Pressable
            key={item.label}
            className="flex-row items-center justify-between rounded-3xl bg-white p-4 shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primaryLight">
                <Ionicons name={item.icon as any} size={20} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-base font-semibold text-text">
                  {item.label}
                </Text>
                {item.value ? (
                  <Text className="text-sm text-textSecondary">
                    {item.value}
                  </Text>
                ) : null}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        ))}
      </View>

      <Pressable className="mt-8 rounded-3xl border border-error bg-errorLight px-4 py-4 flex-row items-center">
        <Text className="text-center text-base font-semibold text-white">
          Logout
        </Text>
      </Pressable>
    </ScreenWrapper>
  );
}
