import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="px-6 pt-4 pb-2 self-start"
      >
        <Text className="text-indigo-600 text-base font-medium">← Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-8 pt-4 pb-10">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900">
                Welcome back
              </Text>
              <Text className="text-gray-500 text-base mt-1">
                Sign in to your QueryFlow account
              </Text>
            </View>

            {/* Fields */}
            <View className="gap-4">
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  Email address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-base"
                />
              </View>

              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-base pr-16"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                    <Text className="text-indigo-600 text-sm font-medium">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity className="self-end">
                <Text className="text-indigo-600 text-sm font-medium">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In */}
            <TouchableOpacity className="bg-indigo-600 rounded-2xl py-4 items-center mt-8 active:opacity-80">
              <Text className="text-white text-lg font-bold">Sign In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-7">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-400 text-sm">
                or continue with
              </Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Social */}
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 border border-gray-200 rounded-xl py-3 items-center bg-gray-50 active:opacity-80">
                <Text className="text-gray-700 font-semibold">🌐 Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-gray-200 rounded-xl py-3 items-center bg-gray-50 active:opacity-80">
                <Text className="text-gray-700 font-semibold"> Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign up */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signUp")}>
                <Text className="text-indigo-600 text-sm font-semibold">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
