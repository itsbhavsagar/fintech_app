import { Tabs, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { TabBar } from "../../src/components/layout/TabBar";
import { getToken } from "../../src/lib/auth";

export default function AppLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      setCheckingAuth(false);
    };

    verifyAuth();
  }, [router]);

  if (checkingAuth) {
    return null;
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#ffffff" }}
    >
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
      />
    </SafeAreaView>
  );
}
