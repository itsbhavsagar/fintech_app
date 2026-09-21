import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  AuthErrorBanner,
  AuthField,
  AuthShell,
  AuthStrengthMeter,
} from "../../src/components/auth/AuthPrimitives";
import { Button } from "../../src/components/ui/Button";
import { useHaptics } from "../../src/hooks/useHaptics";
import { getToken, register } from "../../src/lib/auth";

type PasswordStrength = {
  score: 0 | 1 | 2 | 3;
  label: string;
  helper: string;
};

const getPasswordStrength = (value: string): PasswordStrength => {
  const hasLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const checks = [hasLength, hasUppercase, hasNumber, hasSymbol].filter(Boolean);

  if (!value) {
    return {
      score: 0,
      label: "Empty",
      helper: "Use at least 8 characters with a number.",
    };
  }

  if (checks.length >= 4) {
    return {
      score: 3,
      label: "Strong",
      helper: "Great. This password is ready for a financial account.",
    };
  }

  if (checks.length >= 2) {
    return {
      score: 2,
      label: "Medium",
      helper: "Add uppercase, numbers, or a symbol to make it stronger.",
    };
  }

  return {
    score: 1,
    label: "Weak",
    helper: "Use 8+ characters and include a number.",
  };
};

export default function SignUpScreen() {
  const router = useRouter();
  const { light } = useHaptics();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );
  const canSubmit = useMemo(
    () =>
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      !loading,
    [fullName, email, password, confirmPassword, loading],
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

  const validateForm = () => {
    if (!fullName.trim() || !email.trim() || !password) {
      return "Full name, email, and password are required.";
    }

    if (!email.includes("@")) {
      return "Enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSignUp = async () => {
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    await light();
    setLoading(true);

    try {
      await register(
        fullName.trim(),
        email.trim().toLowerCase(),
        password,
        phone.trim(),
      );
      router.replace("/auth/kyc");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const passwordToggle = (
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
  );

  return (
    <AuthShell
      eyebrow="Create account"
      title="Start investing smarter"
      subtitle="Create your BrickShare account to access curated commercial real estate opportunities."
      footer={
        <View className="items-center rounded-3xl border border-border bg-white px-4 py-4">
          <View className="flex-row flex-wrap items-center justify-center">
            <Text className="text-sm text-textSecondary">
              Already have an account?{" "}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/auth/login")}
              hitSlop={8}
            >
              <Text className="text-sm font-semibold text-primary">Log in</Text>
            </Pressable>
          </View>
        </View>
      }
    >
      <View className="gap-y-4">
        <AuthField
          label="Full name"
          icon="person-outline"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Aman Gupta"
          textContentType="name"
          autoComplete="name"
          returnKeyType="next"
        />

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
          label="Phone"
          icon="call-outline"
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType="next"
        />

        <AuthField
          label="Password"
          icon="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          placeholder="Create password"
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          autoComplete="new-password"
          autoCapitalize="none"
          returnKeyType="next"
          rightElement={passwordToggle}
        />

        <AuthStrengthMeter
          score={passwordStrength.score}
          label={passwordStrength.label}
          helper={passwordStrength.helper}
        />

        <AuthField
          label="Confirm password"
          icon="checkmark-circle-outline"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          autoComplete="new-password"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={() => {
            if (canSubmit) {
              void handleSignUp();
            }
          }}
          rightElement={passwordToggle}
        />
      </View>

      <View className="mt-5 rounded-2xl bg-primaryLight px-4 py-3">
        <View className="flex-row items-start">
          <Ionicons name="shield-checkmark-outline" size={18} color="#4F46E5" />
          <Text className="ml-2 flex-1 text-sm leading-5 text-primaryDark">
            Your details are used for onboarding and investment compliance.
          </Text>
        </View>
      </View>

      {error ? (
        <View className="mt-5">
          <AuthErrorBanner message={error} />
        </View>
      ) : null}

      <View className="mt-5">
        <Button
          onPress={handleSignUp}
          loading={loading}
          disabled={!canSubmit}
          size="lg"
          className="w-full"
        >
          Create account
        </Button>
      </View>
    </AuthShell>
  );
}
