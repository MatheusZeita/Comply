// components/CustomTabBar.tsx
import React, { JSX } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CirclePlus, Eye, House, Menu, Search } from "lucide-react-native";

const ICONS: Record<string, (props: { color: string }) => JSX.Element> = {
  index: (props) => <House size={22} {...props} />,
  search: (props) => <Search size={22} {...props} />,
  createProduct: (props) => <CirclePlus size={28} {...props} />,
  watchList: (props) => <Eye size={22} {...props} />,
  profile: (props) => <Menu size={22} {...props} />,
};

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom:
            insets.bottom > 0
              ? insets.bottom
              : Platform.OS === "android"
              ? 12
              : 0,
        },
      ]}
    >
      <View style={styles.container}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = ICONS[route.name];
          if (!Icon) return null;

          const color = isFocused ? "#047857" : "#9CA3AF";

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={styles.item}
            >
              <Icon color={color} />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? "#047857" : "#6B7280" },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 11,
  },
});
