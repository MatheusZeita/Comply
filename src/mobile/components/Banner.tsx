// src/components/Banner.tsx
import React from "react";
import { Dimensions, Image, View } from "react-native";

const { width } = Dimensions.get("window");

export function Banner() {
  const height = width * 0.35;

  return (
    <View
      style={{
        width,
        height,
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <Image
        source={require("../assets/banners/s_banner_comply_blackfriday.png")}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
        }}
        resizeMode="cover"
      />
    </View>
  );
}
