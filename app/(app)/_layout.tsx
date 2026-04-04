import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar } from "../../src/components/layout/TabBar";

export default function AppLayout() {
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
