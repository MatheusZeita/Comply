import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import { ProductCardListing } from "@/components/ProductCardListing";
import { FlatList, View, ActivityIndicator } from "react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { useDispatch, useSelector } from "react-redux";
import { SearchHeader } from "@/components/search/SearchHeader";
import { FilterModal } from "@/components/search/FilterModal";
import { Categories, ProductCondition, ProductSortBy } from "@/types/product";
import { HStack } from "@/components/ui/hstack";
import { CITIES } from "../citySelector";
import { setCity } from "@/store/features/citySlice";
import { adaptProductToCardListing } from "@/utils/productCardUtils";
import { useProductsQuery } from "@/hooks/products/useProductsQueries";
import { GetFilteredProductsParams } from "@/api/products/products";
import { clearSearch } from "@/store/features/searchSlice";
import { ListingChecker } from "@/utils/checkers/ListingStatsChecker";

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const selectedCity = useSelector((state: any) => state.city.selectedCity);
  const [filters, setFilters] = useState<{
    onlyAuction: boolean;
    noBidsOnly: boolean;
    selectedCategory: Categories | null;
    selectedCondition: ProductCondition | null;
    minPrice: string;
    maxPrice: string;
    productSortBy: ProductSortBy | null;
    auctionSortBy: ProductSortBy | null;
  }>({
    onlyAuction: false,
    noBidsOnly: false,
    selectedCategory: null,
    selectedCondition: null,
    minPrice: "",
    maxPrice: "",
    productSortBy: null,
    auctionSortBy: null,
  });

  const storedQuery = useSelector((state: any) => state.search.currentQuery);
  const currentQuery = q ?? storedQuery ?? "";
  const queryParams = useMemo<GetFilteredProductsParams>(() => {
    const params: GetFilteredProductsParams = {
      PageNumber: 1,
      PageSize: 50,
    };

    // Search term
    if (currentQuery) {
      params.SearchTerm = currentQuery;
    }
    // Category
    if (filters.selectedCategory) {
      params.Category = filters.selectedCategory;
    }
    // Condition
    if (filters.selectedCondition) {
      params.Condition = filters.selectedCondition;
    }
    // Price range
    if (filters.minPrice) {
      params.MinPrice = parseFloat(filters.minPrice);
    }
    if (filters.maxPrice) {
      params.MaxPrice = parseFloat(filters.maxPrice);
    }
    // Auction filters
    if (filters.noBidsOnly) {
      params.OnlyAuctionWithoutBids = true;
    }
    // Sorting
    if (filters.onlyAuction && filters.auctionSortBy) {
      params.SortBy = filters.auctionSortBy;
    } else if (filters.productSortBy) {
      params.SortBy = filters.productSortBy;
    }
    // Se filtrar apenas leilões, pode adicionar status
    if (filters.onlyAuction) {
      params.AuctionStatus = "Active";
    }

    return params;
  }, [currentQuery, filters]);

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery(queryParams);

  const products = productsData?.items.filter(
    (p) => p && ListingChecker.isAvailable(p)
  );

  const totalCount = products?.length || 0;

  const categoryMap: Record<string, Categories> = {
    Eletrônicos: "Electronics",
    Computadores: "Computers",
    Eletrodomésticos: "HomeAppliances",
    "Móveis e Decoração": "FurnitureDecor",
    "Moda e Beleza": "FashionBeauty",
    Esportes: "Sports",
    Colecionáveis: "Collectibles",
    Ferramentas: "Tools",
    Jogos: "Games",
    Serviços: "Services",
    Outros: "Others",
  };
  const conditionMap: Record<string, ProductCondition> = {
    Novo: "New",
    Usado: "Used",
    "Não Funciona": "NotWorking",
    Recondicionado: "Refurbished",
  };
  const productSortOptions: Record<string, ProductSortBy> = {
    "Mais recentes": "Newest",
    "Mais antigos": "Oldest",
    "Menor preço": "PriceAsc",
    "Maior preço": "PriceDesc",
  };
  const auctionSortOptions: Record<string, ProductSortBy> = {
    "Encerrando em breve": "AuctionEndingSoon",
    "Iniciando em breve": "AuctionStartingSoon",
    "Mais lances": "MostBids",
    "Menos lances": "LessBids",
    "Menor lance": "PriceAsc",
    "Maior lance": "PriceDesc",
  };

  const categories = Object.keys(categoryMap);
  const conditions = Object.keys(conditionMap);

  const activeFiltersCount =
    (filters.selectedCategory ? 1 : 0) +
    (filters.selectedCondition ? 1 : 0) +
    (filters.onlyAuction ? 1 : 0) +
    (filters.noBidsOnly ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.productSortBy ? 1 : 0) +
    (filters.auctionSortBy ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      onlyAuction: false,
      noBidsOnly: false,
      selectedCategory: null,
      selectedCondition: null,
      minPrice: "",
      maxPrice: "",
      productSortBy: null,
      auctionSortBy: null,
    });
    router.setParams({ q: undefined });
    dispatch(clearSearch());
  };

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCityChange = (city: string) => {
    dispatch(setCity(city));
  };

  return (
    <ScreenWrapper excludeEdges={["bottom", "top"]}>
      <SearchHeader
        currentQuery={currentQuery}
        resultsCount={totalCount}
        activeFiltersCount={activeFiltersCount}
        onFilterPress={() => setShowFilters(true)}
        productSortBy={filters.productSortBy}
        auctionSortBy={filters.auctionSortBy}
        onProductSortChange={(value) => updateFilter("productSortBy", value)}
        onAuctionSortChange={(value) => updateFilter("auctionSortBy", value)}
        onlyAuction={filters.onlyAuction}
      />

      <HStack className="px-4 pt-4 pb-2 items-center gap-2">
        <Text className="text-base text-gray-800 font-semibold">
          {totalCount} produto{totalCount === 1 ? "" : "s"} encontrado
          {totalCount === 1 ? "" : "s"}
        </Text>
        <Text className="text-base text-gray-500">em {selectedCity}</Text>
      </HStack>

      {isLoading && (
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-500 mt-4">Carregando produtos...</Text>
        </Box>
      )}

      {isError && (
        <Box className="flex-1 items-center justify-center p-4">
          <Text className="text-red-500 text-center text-lg">
            Erro ao carregar produtos
          </Text>
          <Pressable onPress={() => refetch()} className="mt-4">
            <Text className="text-emerald-600 font-medium">
              Tentar novamente
            </Text>
          </Pressable>
        </Box>
      )}

      {!isError && !isLoading && (
        <FlatList
          data={products}
          numColumns={2}
          key={2}
          className="flex-1"
          keyExtractor={(item) => item.id}
          initialNumToRender={6}
          windowSize={5}
          renderItem={({ item }) => {
            const cardData = adaptProductToCardListing(item);

            return (
              <View className="flex-1 max-w-[50%] p-1">
                <ProductCardListing
                  {...cardData}
                  onPress={() => router.replace(`/product/${item.id}`)}
                />
              </View>
            );
          }}
          ListEmptyComponent={
            <Box className="p-8 items-center justify-center h-[300px]">
              <SearchIcon size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-center mt-4 text-lg">
                Nenhum produto encontrado
                {currentQuery && ` para "${currentQuery}"`}
              </Text>
              <Pressable onPress={clearFilters} className="mt-4">
                <Text className="text-emerald-600 font-medium">
                  Limpar filtros
                </Text>
              </Pressable>
            </Box>
          }
        />
      )}

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        categories={categories}
        categoryMap={categoryMap}
        conditions={conditions}
        conditionMap={conditionMap}
        cities={CITIES}
        selectedCity={selectedCity}
        productSortOptions={productSortOptions}
        auctionSortOptions={auctionSortOptions}
        onAuctionChange={(value) => updateFilter("onlyAuction", value)}
        onNoBidsChange={(value) => updateFilter("noBidsOnly", value)}
        onCategorySelect={(value) => updateFilter("selectedCategory", value)}
        onConditionSelect={(value) => updateFilter("selectedCondition", value)}
        onCitySelect={handleCityChange}
        onMinPriceChange={(value) => updateFilter("minPrice", value)}
        onMaxPriceChange={(value) => updateFilter("maxPrice", value)}
        onProductSortChange={(value) => updateFilter("productSortBy", value)}
        onAuctionSortChange={(value) => updateFilter("auctionSortBy", value)}
        onClearFilters={clearFilters}
        resultsCount={totalCount}
      />
    </ScreenWrapper>
  );
}
