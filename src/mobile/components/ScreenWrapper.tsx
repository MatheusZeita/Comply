import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  bg?: string;
  className?: string;
  excludeEdges?: ("top" | "right" | "bottom" | "left")[];
}

export const ScreenWrapper = ({
  children,
  scrollable = false,
  bg = "bg-background-0",
  className = "",
  excludeEdges = [],
}: ScreenWrapperProps) => {
  const allEdges: ("top" | "right" | "bottom" | "left")[] = [
    "top",
    "right",
    "bottom",
    "left",
  ];
  const edges = allEdges.filter((edge) => !excludeEdges.includes(edge));

  if (scrollable)
    return (
      <SafeAreaView className={`${bg} flex-1`} edges={edges}>
        <ScrollView
          className={`flex-1 ${className}`}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className={`${bg} flex-1`} edges={edges}>
      <View className={`flex-1 ${className}`}>{children}</View>
    </SafeAreaView>
  );
};
