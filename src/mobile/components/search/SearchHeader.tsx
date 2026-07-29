import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, SearchIcon, SlidersHorizontal } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import { ProductSortBy } from "@/types/product";

interface SearchHeaderProps {
  currentQuery: string;
  resultsCount: number;
  activeFiltersCount: number;
  onFilterPress: () => void;
  onClearSearch?: () => void;
  productSortBy: ProductSortBy | null;
  auctionSortBy: ProductSortBy | null;
  onProductSortChange: (sort: ProductSortBy | null) => void;
  onAuctionSortChange: (sort: ProductSortBy | null) => void;
  onlyAuction: boolean;
}

interface SortFilter {
  id: ProductSortBy;
  label: string;
  type: "product" | "auction" | "both";
}

const sortFilters: SortFilter[] = [
  { id: "Newest", label: "Mais recentes", type: "both" },
  { id: "Oldest", label: "Mais antigos", type: "product" },
  { id: "AuctionEndingSoon", label: "Encerrando", type: "auction" },
  { id: "AuctionStartingSoon", label: "Iniciando", type: "auction" },
  { id: "MostBids", label: "Mais lances", type: "auction" },
  { id: "PriceAsc", label: "Menor preço", type: "both" },
  { id: "PriceDesc", label: "Maior preço", type: "both" },
];

export const SearchHeader = ({
  currentQuery,
  resultsCount,
  activeFiltersCount,
  onFilterPress,
  productSortBy,
  auctionSortBy,
  onProductSortChange,
  onAuctionSortChange,
  onlyAuction,
}: SearchHeaderProps) => {
  const visibleFilters = useMemo(() => {
    if (onlyAuction) {
      return sortFilters.filter(
        (f) => f.type === "auction" || f.type === "both"
      );
    }
    return sortFilters.filter((f) => f.type === "product" || f.type === "both");
  }, [onlyAuction]);

  const activeSort = onlyAuction ? auctionSortBy : productSortBy;

  const handleSortChange = (sortId: ProductSortBy) => {
    const isSelected = activeSort === sortId;
    const newValue = isSelected ? null : sortId;

    if (onlyAuction) {
      onAuctionSortChange(newValue);
    } else {
      onProductSortChange(newValue);
    }
  };

  return (
    <Box className="bg-emerald-600 border-b border-gray-200">
      <Box className="p-4 pb-3">
        <HStack className="items-center gap-3 mb-3">
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="#F0F0F0" />
          </Pressable>

          <Pressable onPress={() => router.push("/search")} className="flex-1">
            <Box pointerEvents="none">
              <Input
                className="bg-neutral-100 border-0"
                size="sm"
                variant="rounded"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                  placeholder={currentQuery || "Buscar..."}
                  editable={false}
                />
              </Input>
            </Box>
          </Pressable>

          <Pressable onPress={onFilterPress} className="relative">
            <SlidersHorizontal size={24} color="#F0F0F0" />
            {activeFiltersCount > 0 && (
              <Box className="absolute -top-1 -right-1 bg-emerald-700 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {activeFiltersCount}
                </Text>
              </Box>
            )}
          </Pressable>
        </HStack>
      </Box>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 pb-3"
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      >
        {visibleFilters.map((filter) => {
          const isSelected = activeSort === filter.id;
          return (
            <Pressable
              key={filter.id}
              onPress={() => handleSortChange(filter.id)}
            >
              <Badge
                className={`px-4 py-2 rounded-full ${
                  isSelected ? "bg-emerald-700" : "bg-emerald-400"
                }`}
              >
                <BadgeText
                  className={isSelected ? "text-white" : "text-gray-700"}
                >
                  {filter.label}
                </BadgeText>
              </Badge>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
};
