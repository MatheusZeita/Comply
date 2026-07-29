import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="accountBalance" />
      <Stack.Screen name="myProducts" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="myPurchases" />
      <Stack.Screen name="support" />
    </Stack>
  );
}
