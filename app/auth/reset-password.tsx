import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AuthDivider,
  AuthErrorBanner,
  AuthField,
  AuthSecondaryButton,
  AuthShell,
} from "../../src/components/auth/AuthPrimitives";
import { Button } from "../../src/components/ui/Button";
import { getApiUrl } from "../../src/lib/env";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setError("Please enter both the OTP and your new password");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      if (data.email) {
        setResetEmail(data.email);
      }
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        title="Password Reset!"
        subtitle={`Your password has been successfully updated for ${resetEmail || 'your account'}. You can now login with your new credentials.`}
      >
        <Button onPress={() => router.replace("/auth/login")} className="w-full mt-4">
          Go to Login
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify Reset Code"
      subtitle={`Enter the 6-digit code we sent to ${phone} and your new password.`}
      footer={
        <>
          <AuthDivider label="Didn't receive the code?" />
          <AuthSecondaryButton
            label="Request again"
            icon="refresh-outline"
            onPress={() => router.back()}
          />
        </>
      }
    >
      <View className="space-y-4">
        {error ? <AuthErrorBanner message={error} /> : null}

        <AuthField
          label="Reset Code"
          icon="keypad-outline"
          placeholder="123456"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <AuthField
          label="New Password"
          icon="lock-closed-outline"
          placeholder="Min. 8 characters"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Button
          onPress={handleReset}
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </View>
    </AuthShell>
  );
}
