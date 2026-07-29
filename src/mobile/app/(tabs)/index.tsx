import { Banner } from "@/components/Banner";
import { BannerCarousel } from "@/components/BannerCarousel";
import Header from "@/components/Header";
import ProductGridSection from "@/components/ProductGridSection";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProductsQuery } from "@/hooks/products/useProductsQueries";
import { AuctionStatus } from "@/types/auction";
import { ListingStatus } from "@/types/listing";
import { ScrollView } from "react-native";

export default function Index() {
  const {
    data: productsAvailableData,
    isLoading: isLoadingProductsAvailable,
    isError: isErrorProductsAvailable,
  } = useProductsQuery({
    ListingStatus: ListingStatus.Available,
    PageSize: 4,
  });

  const {
    data: auctionsProductsData,
    isLoading: isLoadingAuctionsProducts,
    isError: isErrorAuctionsProducts,
  } = useProductsQuery({
    AuctionStatus: AuctionStatus.Active,
    PageSize: 4,
  });

  const productsAvailable = productsAvailableData?.items;
  const auctionsProducts = auctionsProductsData?.items;

  return (
    <ScreenWrapper excludeEdges={["bottom", "top"]}>
      <Header />
      <ScrollView>
        <BannerCarousel />
        <ProductGridSection
          title="Ofertas em destaque"
          products={productsAvailable}
          isLoading={isLoadingProductsAvailable}
          isError={isErrorProductsAvailable}
        />
        <Banner />
        <ProductGridSection
          title="Leilão ativo"
          products={auctionsProducts}
          isLoading={isLoadingAuctionsProducts}
          isError={isErrorAuctionsProducts}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
