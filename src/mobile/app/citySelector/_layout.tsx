import { Stack } from "expo-router";

export default function citySelectorLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Selecionar Cidade",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
