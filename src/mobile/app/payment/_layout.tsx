import { Stack } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="address" />
      <Stack.Screen name="method" />

      <Stack.Screen
        name="success"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
