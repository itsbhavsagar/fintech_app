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
    <View className="flex-1 bg-background px-6 pt-14 pb-10">
      <View className="flex-row items-center gap-2 mb-10">
        <View className="w-9 h-9 bg-primary rounded-xl items-center justify-center">
          <Ionicons name="business" size={17} color="#fff" />
        </View>
        <Text className="text-lg font-semibold text-text tracking-tight">
          BrickShare
        </Text>
      </View>

      <View className="mb-7">
        <Text className="text-2xl font-bold text-text tracking-tight">
          Welcome back
        </Text>
        <Text className="text-sm text-textSecondary mt-1">
          Sign in to your account to continue
        </Text>
      </View>

      <View className="gap-y-3">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="hi@brickshare.in"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          rightElement={
            <Pressable onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          }
        />
      </View>

      <Pressable onPress={() => {}} className="self-end mt-3 mb-5">
        <Text className="text-sm font-semibold text-primary">
          Forgot password?
        </Text>
      </Pressable>

      {error ? (
        <View className="bg-errorLight rounded-2xl px-4 py-3 mb-4">
          <Text className="text-sm font-medium text-error">{error}</Text>
        </View>
      ) : null}

      <Button onPress={handleSignIn} loading={loading} className="w-full">
        Sign In
      </Button>

      <View className="flex-row items-center my-5">
        <View className="flex-1 bg-border h-px" />
        <Text className="text-xs text-textMuted mx-3">or continue with</Text>
        <View className="flex-1 bg-border h-px" />
      </View>

      <View className="gap-y-3">
        <Pressable className="flex-row items-center justify-center rounded-xl border border-border bg-background py-3 gap-x-2">
          <Ionicons name="logo-google" size={18} color="#4F46E5" />
          <Text className="text-sm font-semibold text-text">
            Continue with Google
          </Text>
        </Pressable>

        <Pressable className="flex-row items-center justify-center rounded-xl border border-border bg-background py-3 gap-x-2">
          <Ionicons name="logo-apple" size={18} color="#111827" />
          <Text className="text-sm font-semibold text-text">
            Continue with Apple
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-end">
        <View className="flex-row">
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
