// app/(tabs)/_layout.tsx
import CustomTabBar from "@/components/CustomTabBar";
import { router, Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Início" }} />
      <Tabs.Screen name="search" options={{ title: "Explorar" }} />
      <Tabs.Screen
        name="createProduct"
        options={{
          title: "Anunciar",
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/createProduct");
          },
        }}
      />
      <Tabs.Screen name="watchList" options={{ title: "Favoritos" }} />
      <Tabs.Screen name="profile" options={{ title: "Menu" }} />
    </Tabs>
  );
}
