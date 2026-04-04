import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboardingSeen";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlow = async () => {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!seen) {
        router.replace("/onboarding");
        return;
      }

      //   router.replace("/auth/login");
      router.replace("/onboarding");
    };

    checkFlow().finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return null;
}
