// @/components/BannerCarousel.tsx
import React from "react";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    source: require("@/assets/banners/banner_comply_auction.png"),
  },
  {
    id: "2",
    source: require("@/assets/banners//banner_comply_seller.png"),
  },
  {
    id: "3",
    source: require("@/assets/banners/banner_comply_auction2.png"),
  },
  {
    id: "4",
    source: require("@/assets/banners/banner_comply_auction3.png"),
  },
  {
    id: "5",
    source: require("@/assets/banners/banner_comply_auction4.png"),
  },
  {
    id: "6",
    source: require("@/assets/banners/banner_comply_seller2.png"),
  },
];

export function BannerCarousel() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      // igual à doc: calcula diferença pro índice alvo
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        width={width}
        height={width * 0.57}
        data={banners}
        loop
        autoPlay
        autoPlayInterval={4000}
        onProgressChange={progress}
        pagingEnabled
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.source} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  slide: {
    flex: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
