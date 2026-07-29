import React from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { WatchlistProductAction } from "@/utils/watchlistCardUtils";
import WatchlistHeader from "@/components/WatchlistHeader";
import { router } from "expo-router";
import { useWatchlistQuery } from "@/hooks/notifications/useWatchListQueries";
import { useProductsByIdsQuery } from "@/hooks/products/useProductsQueries";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfileQuery } from "@/hooks/user/useUsersQueries";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import WatchlistCard from "@/components/watchlistCard";

export default function Search() {
  const { isLoggedIn } = useAuth();
  const { data: userData } = useMyProfileQuery(isLoggedIn);
  const { data: allMyWatchListIds, isLoading: isLoadingWatchlist } =
    useWatchlistQuery();
  const { data: allProductsData, isLoading: isLoadingProducts } =
    useProductsByIdsQuery(allMyWatchListIds || []);

  const CURRENT_USER_ID = userData?.id || "";

  const handleAction = (action: WatchlistProductAction, productId: string) => {
    console.log(`[Watchlist] Ação: ${action}, ID: ${productId}`);

    switch (action) {
      case "remove":
        // Lógica para remover da lista
        break;
      case "bid":
      case "increaseBid":
        break;
    }
  };

  const handlePress = (productId: string) => {
    router.replace(`/product/${productId}`);
  };

  const isLoading = isLoadingWatchlist || isLoadingProducts;
  const products = allProductsData?.items || [];

  return (
    <ScreenWrapper excludeEdges={["bottom", "top"]}>
      <WatchlistHeader />

      {isLoading ? (
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-4">Carregando...</Text>
        </Box>
      ) : products.length === 0 ? (
        <Box className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-500 text-center">
            Você ainda não tem produtos favoritos
          </Text>
        </Box>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WatchlistCard
              product={item}
              currentUserId={CURRENT_USER_ID}
              onPress={() => handlePress(item.id)}
              onAction={handleAction}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}
