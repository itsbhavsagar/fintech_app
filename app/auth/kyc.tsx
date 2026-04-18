import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";

const steps = ["Personal", "Bank", "Documents"];

export default function KYCScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountName, setAccountName] = useState("");

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-background px-6 py-8">
      <View className="mb-8 mt-10">
        <Text className="text-3xl font-semibold text-text">Complete KYC</Text>
        <Text className="mt-2 text-sm text-textSecondary">
          Share your details to start investing safely.
        </Text>
      </View>
      <View className="mb-8 flex-row items-center justify-between">
        {steps.map((label, index) => (
          <View key={label} className="items-center flex-1">
            <View
              className={`mb-2 h-10 w-10 items-center justify-center rounded-full ${index <= step ? "bg-primary" : "bg-border"}`}
            >
              <Text className="text-sm font-semibold text-white">
                {index + 1}
              </Text>
            </View>
            <Text
              className={`text-xs font-semibold ${index <= step ? "text-text" : "text-textSecondary"}`}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
      {step === 0 ? (
        <View className="space-y-4">
          <Input
            label="PAN Number"
            value={pan}
            onChangeText={setPan}
            placeholder="ABCDE1234F"
            autoCapitalize="characters"
          />
          <Input
            label="Date of Birth"
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
          />
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="123, MG Road, Delhi"
            multiline
          />
        </View>
      ) : step === 1 ? (
        <View className="space-y-4">
          <Input
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="012345678901"
            keyboardType="numeric"
          />
          <Input
            label="IFSC Code"
            value={ifsc}
            onChangeText={setIfsc}
            placeholder="SBIN0001234"
            autoCapitalize="characters"
          />
          <Input
            label="Account Holder Name"
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Aman Gupta"
          />
        </View>
      ) : (
        <View className="space-y-4">
          <Pressable className="rounded-3xl border border-border bg-surface px-4 py-5">
            <Text className="text-base font-semibold text-text">
              Upload Aadhaar front
            </Text>
          </Pressable>
          <Pressable className="rounded-3xl border border-border bg-surface px-4 py-5">
            <Text className="text-base font-semibold text-text">
              Upload Aadhaar back
            </Text>
          </Pressable>
          <Pressable className="rounded-3xl border border-border bg-surface px-4 py-5">
            <Text className="text-base font-semibold text-text">
              Upload selfie
            </Text>
          </Pressable>
        </View>
      )}
      <View className="mt-10 space-y-4">
        <Button onPress={handleNext} className="w-full">
          {step === steps.length - 1 ? "Submit" : "Next"}
        </Button>
        <Pressable onPress={() => router.replace("/home")}>
          <Text className="text-center text-sm font-semibold text-primary mt-8">
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
