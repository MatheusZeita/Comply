import { store } from "@/store/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import Toast from "react-native-toast-message";
import { StatusBar, View } from "react-native";
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#059669" }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <GluestackUIProvider>
            <OverlayProvider>
              <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="createProduct" />
                    <Stack.Screen name="product" />
                    <Stack.Screen name="profile" />
                    <Stack.Screen name="payment" />
                    <Stack.Screen name="citySelector" />
                    <Stack.Screen name="notifications" />
                    <Stack.Screen name="editProduct" />
                    <Stack.Screen
                      name="search"
                      options={{
                        presentation: "transparentModal",
                        animation: "fade_from_bottom",
                      }}
                    />
                    <Stack.Screen name="login" options={{ title: "Login" }} />
                    <Stack.Screen
                      name="register"
                      options={{ title: "Criar Conta" }}
                    />
                  </Stack>
                </QueryClientProvider>
              </Provider>
            </OverlayProvider>
          </GluestackUIProvider>
        </View>
        <Toast />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
