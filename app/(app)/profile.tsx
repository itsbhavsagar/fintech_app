import { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getStoredUser, logout, setStoredUser } from "../../src/lib/auth";

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
  { label: "Total Invested", value: "₹3.6L", isSuccess: false },
  { label: "Properties", value: "4", isSuccess: false },
  { label: "Returns", value: "₹36K", isSuccess: true },
];

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/6.x/pixel-art/png?seed=Investor",
  "https://api.dicebear.com/6.x/pixel-art/png?seed=Market",
  "https://api.dicebear.com/6.x/pixel-art/png?seed=Portfolio",
  "https://api.dicebear.com/6.x/pixel-art/png?seed=Growth",
];

type UserType = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>(AVATAR_OPTIONS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setEditName(storedUser.name ?? "");
        setEditPhone(storedUser.phone ?? "");
        setEditAvatarUrl(storedUser.avatarUrl ?? AVATAR_OPTIONS[0]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadUser();
    setIsRefreshing(false);
  }, [loadUser]);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const handleStartEdit = () => {
    if (user) {
      setEditName(user.name ?? "");
      setEditPhone(user.phone ?? "");
      setEditAvatarUrl(user.avatarUrl ?? AVATAR_OPTIONS[0]);
    }
    setError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditName(user.name ?? "");
      setEditPhone(user.phone ?? "");
      setEditAvatarUrl(user.avatarUrl ?? AVATAR_OPTIONS[0]);
    }
    setError(null);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!editName.trim()) {
      setError("Please enter your name.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updatedUser: UserType = {
        ...user,
        name: editName.trim(),
        phone: editPhone.trim() || user.phone,
        avatarUrl: editAvatarUrl,
      };
      await setStoredUser(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch {
      setError("Unable to save changes. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatar = isEditing
    ? editAvatarUrl
    : (user?.avatarUrl ?? AVATAR_OPTIONS[0]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GB";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-4 pt-6 pb-12"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="mb-8">
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-text">My Profile</Text>
          {!isEditing && (
            <Pressable
              onPress={handleStartEdit}
              className="rounded-full border border-border bg-surface px-4 py-2 active:opacity-70"
            >
              <Text className="text-sm font-medium text-text">Edit</Text>
            </Pressable>
          )}
        </View>

        <View className="flex-row items-center gap-4">
          <View style={{ width: 80, height: 80 }} className="relative">
            <Image
              source={{ uri: displayAvatar }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              contentFit="cover"
              cachePolicy="none"
            />
            <View
              style={{ position: "absolute", bottom: 0, right: 0 }}
              className="h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-success"
            >
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-xl font-bold text-text">
              {user?.name ?? "Investor"}
            </Text>
            <Text className="mt-0.5 text-sm text-textSecondary">
              {user?.email ?? "member@brickshare.in"}
            </Text>
            <Text className="mt-0.5 text-sm text-textSecondary">
              {user?.phone ?? "+91 98765 43210"}
            </Text>
          </View>
        </View>
      </View>

      {isEditing && (
        <View className="mb-6 rounded-3xl border border-border bg-white px-4 py-5">
          <Text className="mb-4 text-lg font-semibold text-text">
            Update your profile
          </Text>

          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-text">
              Full name
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              className="rounded-2xl border border-border bg-background px-4 py-3 text-base text-text"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-text">
              Phone number
            </Text>
            <TextInput
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              className="rounded-2xl border border-border bg-background px-4 py-3 text-base text-text"
            />
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-text">
              Profile picture
            </Text>
            <View className="flex-row gap-3">
              {AVATAR_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setEditAvatarUrl(option)}
                  style={{ width: 64, height: 64 }}
                  className={`overflow-hidden rounded-2xl border-2 ${
                    editAvatarUrl === option
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  <Image
                    source={{ uri: option }}
                    style={{ width: 64, height: 64 }}
                    contentFit="cover"
                    cachePolicy="none"
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {error && <Text className="mb-3 text-sm text-error">{error}</Text>}

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleSaveProfile}
              disabled={isSaving}
              className="flex-1 rounded-2xl bg-primary px-4 py-3 active:opacity-80"
            >
              <Text className="text-center text-sm font-semibold text-white">
                {isSaving ? "Saving…" : "Save changes"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCancelEdit}
              disabled={isSaving}
              className="flex-1 items-center justify-center rounded-2xl border border-border bg-surface px-4 py-3 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-text">Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View className="mb-6 overflow-hidden rounded-3xl bg-primary">
        <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <View className="absolute -right-2 top-8 h-16 w-16 rounded-full bg-white/5" />
        <View className="flex-row p-6">
          {STATS.map((stat, index) => (
            <View
              key={stat.label}
              className={`flex-1 ${index !== 0 ? "border-l border-white/20 pl-4" : ""}`}
            >
              <Text className="mb-1 text-xs text-white/60">{stat.label}</Text>
              <Text
                className={`text-lg font-bold ${stat.isSuccess ? "text-emerald-300" : "text-white"}`}
              >
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-6 overflow-hidden rounded-3xl border border-border bg-white">
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 active:bg-background ${
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
                  <Text className={`mt-0.5 text-xs ${item.valueColor}`}>
                    {item.value}
                  </Text>
                ) : null}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center justify-center gap-2 rounded-3xl border border-error/30 bg-errorLight px-4 py-4 active:opacity-80"
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-base font-semibold text-error">Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}
