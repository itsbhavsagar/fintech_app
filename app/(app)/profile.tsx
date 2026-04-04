import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";

const MENU_ITEMS = [
  {
    label: "KYC Status",
    value: "Verified",
    icon: "shield-checkmark",
    valueColor: "text-success",
  },
  {
    label: "Bank Account",
    value: "Active",
    icon: "card",
    valueColor: "text-textSecondary",
  },
  {
    label: "Transaction History",
    value: "",
    icon: "receipt",
    valueColor: "text-textSecondary",
  },
  {
    label: "Watchlist",
    value: "3 saved",
    icon: "bookmark",
    valueColor: "text-textSecondary",
  },
  {
    label: "Notifications",
    value: "8 unread",
    icon: "notifications",
    valueColor: "text-primary",
  },
  {
    label: "Help & Support",
    value: "",
    icon: "help-circle",
    valueColor: "text-textSecondary",
  },
  {
    label: "Terms & Privacy",
    value: "",
    icon: "document-text",
    valueColor: "text-textSecondary",
  },
] as const;

const STATS = [
  {
    label: "Total Invested",
    value: "₹3.6L",
    color: "text-text",
  },
  {
    label: "Properties",
    value: "4",
    color: "text-text",
  },
  {
    label: "Returns",
    value: "₹36K",
    color: "text-success",
  },
];

export default function ProfileScreen() {
  return (
    <ScreenWrapper scrollable className="bg-background">
      <View className="mb-8">
        <Text className="mb-6 text-2xl font-bold text-text">My Profile</Text>
        <View className="flex-row items-center gap-4">
          <View className="relative">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primaryLight border-2 border-primary/20">
              <Text className="text-2xl font-bold text-primary">AG</Text>
            </View>

            <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full bg-success border-2 border-white">
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-xl font-bold text-text">Aman Gupta</Text>
            <Text className="mt-0.5 text-sm text-textSecondary">
              aman.gupta@brickshare.in
            </Text>
            <Text className="text-sm text-textSecondary">+91 98765 43210</Text>
          </View>

          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface border border-border">
            <Ionicons name="pencil" size={16} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <View className="mb-8 overflow-hidden rounded-3xl bg-primary">
        <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <View className="absolute -right-2 top-8 h-16 w-16 rounded-full bg-white/5" />

        <View className="flex-row p-6">
          {STATS.map((stat, index) => (
            <View
              key={stat.label}
              className={`flex-1 ${index !== 0 ? "border-l border-white/20 pl-4" : ""}`}
            >
              <Text className="text-xs text-white/60 mb-1">{stat.label}</Text>
              <Text
                className={`text-lg font-bold ${
                  stat.color === "text-success"
                    ? "text-emerald-300"
                    : "text-white"
                }`}
              >
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-6 overflow-hidden rounded-3xl bg-white border border-border">
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 ${
              index !== MENU_ITEMS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primaryLight">
                <Ionicons name={item.icon as any} size={18} color="#4F46E5" />
              </View>

              <View>
                <Text className="text-base font-medium text-text">
                  {item.label}
                </Text>
                {item.value ? (
                  <Text className={`text-xs mt-0.5 ${item.valueColor}`}>
                    {item.value}
                  </Text>
                ) : null}
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </Pressable>
        ))}
      </View>

      <Pressable className="mb-8 flex-row items-center justify-center gap-2 rounded-3xl border border-error/30 bg-errorLight px-4 py-4">
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-base font-semibold text-error">Log Out</Text>
      </Pressable>
    </ScreenWrapper>
  );
}
