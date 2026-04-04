import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-indigo-600">
      <StatusBar barStyle="light-content" />

      {/* Decorative circles */}
      <View className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-30 -translate-y-16 translate-x-16" />
      <View className="absolute top-20 right-8 w-32 h-32 bg-purple-400 rounded-full opacity-20" />

      <View className="flex-1 justify-between px-8 py-12">
        {/* Brand */}
        <View className="items-center mt-10">
          <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center mb-5">
            <Ionicons name="flash" size={32} color="#4F46E5" />
          </View>
          <Text className="text-white text-4xl font-bold tracking-tight">
            QueryFlow
          </Text>
          <Text className="text-indigo-200 text-base mt-2 text-center">
            Your intelligent data companion
          </Text>
        </View>

        {/* Illustration */}
        <View className="items-center">
          <View className="w-56 h-56 bg-indigo-500 rounded-full items-center justify-center">
            <View className="w-44 h-44 bg-indigo-400 rounded-full items-center justify-center">
              <Ionicons name="search" size={64} color="white" />
            </View>
          </View>
        </View>

        {/* CTA */}
        <View className="gap-5">
          <View className="items-center">
            <Text className="text-white text-2xl font-semibold text-center">
              Explore. Query. Discover.
            </Text>
            <Text className="text-indigo-200 text-sm mt-2 text-center leading-5">
              Seamlessly search and analyze your data with AI-driven queries.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            className="bg-white rounded-full py-4 items-center active:opacity-75"
          >
            <Text className="text-indigo-600 text-lg font-bold">Continue</Text>
          </TouchableOpacity>

          {/* Pagination dots */}
          <View className="flex-row justify-center gap-2">
            <View className="w-6 h-2 bg-white rounded-full" />
            <View className="w-2 h-2 bg-indigo-400 rounded-full" />
            <View className="w-2 h-2 bg-indigo-400 rounded-full" />
          </View>
        </View>
      </View>
    </View>
  );
}
