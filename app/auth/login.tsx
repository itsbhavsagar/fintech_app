import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  AuthDivider,
  AuthErrorBanner,
  AuthField,
  AuthSecondaryButton,
  AuthShell,
} from "../../src/components/auth/AuthPrimitives";
import { Button } from "../../src/components/ui/Button";
import { useHaptics } from "../../src/hooks/useHaptics";
import { getToken, login } from "../../src/lib/auth";

const socialProviders = [
  {
    label: "Google",
    icon: "logo-google" as const,
    message: "Google sign-in is not configured yet.",
  },
  {
    label: "Apple",
    icon: "logo-apple" as const,
    message: "Apple sign-in is not configured yet.",
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const { light } = useHaptics();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0 && !loading,
    [email, password, loading],
  );

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

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    await light();
    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      router.replace("/home");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Track your portfolio, discover new properties, and manage your investments in one secure place."
      footer={
        <View className="items-center rounded-3xl border border-border bg-white px-4 py-4">
          <View className="flex-row flex-wrap items-center justify-center">
            <Text className="text-sm text-textSecondary">
              New to BrickShare?{" "}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/auth/sign-up")}
              hitSlop={8}
            >
              <Text className="text-sm font-semibold text-primary">
                Create account
              </Text>
            </Pressable>
          </View>
        </View>
      }
    >
      <View className="gap-y-4">
        <AuthField
          label="Email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <AuthField
          label="Password"
          icon="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          textContentType="password"
          autoComplete="password"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={() => {
            if (canSubmit) {
              void handleSignIn();
            }
          }}
          rightElement={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              hitSlop={10}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </Pressable>
          }
        />
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="shield-checkmark-outline" size={16} color="#10B981" />
          <Text className="ml-1.5 text-xs font-semibold text-textSecondary">
            Protected session
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/auth/forgot-password")}
          hitSlop={8}
        >
          <Text className="text-sm font-semibold text-primary">
            Forgot password?
          </Text>
        </Pressable>
      </View>

      {error ? (
        <View className="mt-5">
          <AuthErrorBanner message={error} />
        </View>
      ) : null}

      <View className="mt-5">
        <Button
          onPress={handleSignIn}
          loading={loading}
          disabled={!canSubmit}
          size="lg"
          className="w-full"
        >
          Sign in
        </Button>
      </View>

      <AuthDivider label="OR CONTINUE WITH" />

      <View className="flex-row gap-x-3">
        {socialProviders.map((provider) => (
          <AuthSecondaryButton
            key={provider.label}
            icon={provider.icon}
            label={provider.label}
            onPress={() => setError(provider.message)}
          />
        ))}
      </View>

      <View className="mt-5 rounded-2xl bg-primaryLight px-4 py-3">
        <View className="flex-row items-start">
          <Ionicons name="trending-up-outline" size={18} color="#4F46E5" />
          <Text className="ml-2 flex-1 text-sm leading-5 text-primaryDark">
            Review live property performance and transaction history after
            signing in.
          </Text>
        </View>
      </View>
    </AuthShell>
  );
}
