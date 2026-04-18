import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { useHaptics } from "../../src/hooks/useHaptics";
import { getToken, register } from "../../src/lib/auth";

const getStrength = (value: string) => {
  if (value.length >= 12 && /[A-Z]/.test(value) && /\d/.test(value)) {
    return { label: "Strong", color: "text-success" };
  }
  if (value.length >= 8) {
    return { label: "Medium", color: "text-warning" };
  }
  return { label: "Weak", color: "text-error" };
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

  const passwordStrength = useMemo(() => getStrength(password), [password]);

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

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    await light();

    if (!email || !password || !fullName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register(fullName.trim(), email.trim(), password, phone.trim());
      router.replace("/auth/kyc");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-10">
      <View className="mb-8 mt-10">
        <Text className="text-3xl font-semibold text-text">
          Create your account
        </Text>
        <Text className="mt-2 text-sm text-textSecondary">
          Start investing in commercial real estate from ₹10,000.
        </Text>
      </View>
      <View className="space-y-4">
        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Aman Gupta"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="hello@brickshare.in"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create password"
          secureTextEntry={!showPassword}
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          secureTextEntry={!showPassword}
        />
      </View>
      {error ? (
        <View className="rounded-3xl bg-errorLight p-3">
          <Text className="text-sm font-medium text-error">{error}</Text>
        </View>
      ) : null}
      <View className="mt-8">
        <Button onPress={handleSignUp} loading={loading} className="w-full">
          Sign Up
        </Button>
      </View>
      <View className="mt-auto flex-row justify-center">
        <Text className="text-sm text-textSecondary">
          Already have an account?{" "}
        </Text>
        <Pressable onPress={() => router.push("/auth/login")}>
          <Text className="text-sm font-semibold text-primary">Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}
