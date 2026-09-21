import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthDivider,
  AuthErrorBanner,
  AuthField,
  AuthSecondaryButton,
  AuthShell,
} from "../../src/components/auth/AuthPrimitives";
import { Button } from "../../src/components/ui/Button";
import { getApiUrl } from "../../src/lib/env";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      router.push({
        pathname: "/auth/reset-password",
        params: { phone },
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter the phone number associated with your account to receive a reset code."
      footer={
        <>
          <AuthDivider label="Remembered your password?" />
          <AuthSecondaryButton
            label="Back to login"
            icon="log-in-outline"
            onPress={() => router.back()}
          />
        </>
      }
    >
      <View className="space-y-4">
        {error ? <AuthErrorBanner message={error} /> : null}

        <AuthField
          label="Phone Number"
          icon="call-outline"
          placeholder="9999999999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          onPress={handleSendOTP}
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </Button>
      </View>
    </AuthShell>
  );
}
