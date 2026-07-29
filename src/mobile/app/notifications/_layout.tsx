import { Stack } from "expo-router";

export default function NotificationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "Suas Notificações", presentation: "modal" }}
      />
    </Stack>
  );
}
