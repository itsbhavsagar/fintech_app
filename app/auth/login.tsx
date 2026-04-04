import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { useHaptics } from "../../src/hooks/useHaptics";
import { getToken, login } from "../../src/lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { light } = useHaptics();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        router.replace("/home");
      }
    };

    checkAuth();
  }, [router]);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    await light();

    try {
      await login(email.trim(), password);
      router.replace("/home");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-10">
      <View className="flex-1">
        <View className="mb-10 mt-8">
          <Text className="text-4xl font-bold text-text">BrickShare</Text>
          <Text className="mt-4 text-lg text-textSecondary">Welcome back</Text>
        </View>
        <View className="space-y-4">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="hi@brickshare.in"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            className="mt-2"
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            rightElement={
              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            }
          />
          <Pressable onPress={() => {}} className="self-end">
            <Text className="text-sm font-semibold text-primary mt-6">
              Forgot password?
            </Text>
          </Pressable>
        </View>
        {error ? (
          <View className="rounded-3xl bg-errorLight p-3">
            <Text className="text-sm font-medium text-error">{error}</Text>
          </View>
        ) : null}
        <View className="mt-4">
          <Button onPress={handleSignIn} loading={loading} className="w-full">
            Sign In
          </Button>
        </View>
        <View className="my-8 flex-row items-center justify-center">
          <View className="h-px flex-1 bg-border" />
          <Text className="mx-3 text-sm text-textSecondary">
            or continue with
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>
        <View className="space-y-3">
          <Pressable className="flex-row items-center justify-center rounded-2xl border border-border bg-white py-3">
            <Ionicons name="logo-google" size={20} color="#4F46E5" />
            <Text className="ml-3 text-sm font-semibold text-text">
              Continue with Google
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center justify-center rounded-2xl border border-border bg-white py-3">
            <Ionicons name="logo-apple" size={20} color="#111827" />
            <Text className="ml-3 text-sm font-semibold text-text">
              Continue with Apple
            </Text>
          </Pressable>
        </View>
        <View className="mt-auto flex-row justify-center">
          <Text className="text-sm text-textSecondary">
            New to BrickShare?{" "}
          </Text>
          <Pressable onPress={() => router.push("/auth/sign-up")}>
            <Text className="text-sm font-semibold text-primary">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
