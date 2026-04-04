import { Tabs } from "expo-router";
import { TabBar } from "../../src/components/layout/TabBar";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    />
  );
}
