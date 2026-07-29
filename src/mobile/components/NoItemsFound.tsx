import React from "react";
import { View, Text } from "react-native";

export type NoItemsFoundProps = {
  Icon: React.ElementType;
  title: string;
  description: string;
};

function NoItemsFound({ Icon, title, description }: NoItemsFoundProps) {
  return (
    <View className="flex flex-col items-center w-full justify-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 mx-auto">
      <Icon className="h-6 w-6 md:h-16 md:w-16 text-gray-400 mb-4" />

      <Text className="text-sm md:text-xl font-semibold text-gray-700 mb-2 text-center">
        {title}
      </Text>

      <Text className="text-gray-500 text-xs md:text-sm text-center">
        {description}
      </Text>
    </View>
  );
}

export default NoItemsFound;
