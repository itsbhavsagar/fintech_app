import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { getToken } from "../src/lib/auth";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlow = async () => {
      const token = await getToken();
      router.replace(token ? "/home" : "/onboarding");
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
