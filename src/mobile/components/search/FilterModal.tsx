import React, { useRef } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { Divider } from "@/components/ui/divider";
import { Input, InputField } from "@/components/ui/input";
import { Categories, ProductCondition, ProductSortBy } from "@/types/product";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    onlyAuction: boolean;
    noBidsOnly: boolean;
    selectedCategory: Categories | null;
    selectedCondition: ProductCondition | null;
    minPrice: string;
    maxPrice: string;
    productSortBy: string | null;
    auctionSortBy: string | null;
  };
  cities: string[];
  selectedCity: string;
  categories: string[];
  categoryMap: Record<string, Categories>;
  conditions: string[];
  conditionMap: Record<string, ProductCondition>;
  productSortOptions: Record<string, ProductSortBy>;
  auctionSortOptions: Record<string, ProductSortBy>;
  onAuctionChange: (value: boolean) => void;
  onNoBidsChange: (value: boolean) => void;
  onCategorySelect: (category: Categories | null) => void;
  onConditionSelect: (condition: ProductCondition | null) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onCitySelect: (city: string) => void;
  onProductSortChange: (value: ProductSortBy | null) => void;
  onAuctionSortChange: (value: ProductSortBy | null) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

export const FilterModal = ({
  isOpen,
  onClose,
  filters,
  categories,
  categoryMap,
  conditions,
  conditionMap,
  cities,
  selectedCity,
  productSortOptions,
  auctionSortOptions,
  onAuctionChange,
  onNoBidsChange,
  onCategorySelect,
  onConditionSelect,
  onMinPriceChange,
  onMaxPriceChange,
  onProductSortChange,
  onCitySelect,
  onAuctionSortChange,
  onClearFilters,
  resultsCount,
}: FilterModalProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const featuresRef = useRef<View | null>(null);
  const cityRef = useRef<View | null>(null);
  const categoriesRef = useRef<View | null>(null);
  const conditionRef = useRef<View | null>(null);
  const priceRef = useRef<View | null>(null);
  const productOrderRef = useRef<View | null>(null);
  const auctionOrderRef = useRef<View | null>(null);

  const scrollToSection = (ref: React.RefObject<View | null>) => {
    if (!ref.current || !scrollViewRef.current) return;

    ref.current.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
      },
      () => {}
    );
  };

  const handleProductSortChange = (value: ProductSortBy | null) => {
    onProductSortChange(value);
    if (value !== null) {
      onAuctionSortChange(null);
    }
  };

  const handleAuctionSortChange = (value: ProductSortBy | null) => {
    onAuctionSortChange(value);
    if (value !== null) {
      onProductSortChange(null);
    }
  };

  const sections = [
    { ref: featuresRef, label: "Destaques" },
    { ref: cityRef, label: "Cidade" }, // <- NOVO
    { ref: categoriesRef, label: "Categorias" },
    { ref: conditionRef, label: "Condição" },
    { ref: priceRef, label: "Preço" },
    { ref: productOrderRef, label: "Produtos" },
    { ref: auctionOrderRef, label: "Leilões" },
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[75]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="p-0 bg-white rounded-t-3xl border-0">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={0}
        >
          <View className="flex-1 mb-10">
            <View className="flex-1 flex-row w-full">
              <Box className="w-[30%] rounded-tl-3xl bg-gray-50 border-r border-gray-200 pt-4">
                <ScrollView showsVerticalScrollIndicator={false}>
                  <VStack className="gap-0 pb-20">
                    {sections.map((section) => (
                      <Pressable
                        key={section.label}
                        className="p-4 py-5 border-b border-gray-100 active:bg-gray-200"
                        onPress={() => scrollToSection(section.ref)}
                      >
                        <Text className="text-sm font-medium text-gray-600">
                          {section.label}
                        </Text>
                      </Pressable>
                    ))}
                  </VStack>
                </ScrollView>
              </Box>

              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                className="bg-white w-[70%] pt-4"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                <Box className="px-4 pt-2">
                  {/* Destaques */}
                  <View ref={featuresRef} className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Destaques
                    </Text>
                    <VStack className="gap-4">
                      <HStack className="items-center justify-between">
                        <Text className="text-gray-700">Apenas Leilões</Text>
                        <Switch
                          value={filters.onlyAuction}
                          onValueChange={onAuctionChange}
                          trackColor={{ false: "#e5e7eb", true: "#047857" }}
                        />
                      </HStack>
                      <Divider />
                      <HStack className="items-center justify-between">
                        <Text
                          className={
                            filters.onlyAuction
                              ? "text-gray-700"
                              : "text-gray-400"
                          }
                        >
                          Sem lances
                        </Text>
                        <Switch
                          value={filters.noBidsOnly}
                          onValueChange={onNoBidsChange}
                          disabled={!filters.onlyAuction}
                          trackColor={{ false: "#e5e7eb", true: "#047857" }}
                        />
                      </HStack>
                    </VStack>
                  </View>

                  {/* Região - NOVO */}
                  <View ref={cityRef} className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Filtrar por cidade
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {cities.map((city) => {
                        const isSelected = selectedCity === city;
                        return (
                          <Pressable
                            key={city}
                            onPress={() => onCitySelect(city)}
                            className={`px-3 py-2 rounded-lg border ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                isSelected
                                  ? "text-emerald-700 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {city}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* Categorias */}
                  <View ref={categoriesRef} className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Categorias
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {categories.map((category) => {
                        const categoryValue = categoryMap[category];
                        const isSelected =
                          filters.selectedCategory === categoryValue;
                        return (
                          <Pressable
                            key={category}
                            onPress={() =>
                              onCategorySelect(
                                isSelected ? null : categoryValue
                              )
                            }
                            className={`px-3 py-2 rounded-lg border ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                isSelected
                                  ? "text-emerald-700 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {category}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* Condição */}
                  <View ref={conditionRef} className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Condição
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {conditions.map((condition) => {
                        const conditionValue = conditionMap[condition];
                        const isSelected =
                          filters.selectedCondition === conditionValue;
                        return (
                          <Pressable
                            key={condition}
                            onPress={() =>
                              onConditionSelect(
                                isSelected ? null : conditionValue
                              )
                            }
                            className={`px-3 py-2 rounded-lg border ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                isSelected
                                  ? "text-emerald-700 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {condition}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* Faixa de Preço */}
                  <View ref={priceRef} className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Faixa de Preço
                    </Text>
                    <HStack className="gap-3">
                      <Box className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                          Min (R$)
                        </Text>
                        <Input
                          size="md"
                          variant="outline"
                          className="bg-gray-50"
                        >
                          <InputField
                            placeholder="0"
                            value={filters.minPrice}
                            onChangeText={onMinPriceChange}
                            keyboardType="numeric"
                            returnKeyType="next"
                          />
                        </Input>
                      </Box>
                      <Box className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                          Máx (R$)
                        </Text>
                        <Input
                          size="md"
                          variant="outline"
                          className="bg-gray-50"
                        >
                          <InputField
                            placeholder="9999"
                            value={filters.maxPrice}
                            onChangeText={onMaxPriceChange}
                            keyboardType="numeric"
                            returnKeyType="done"
                          />
                        </Input>
                      </Box>
                    </HStack>
                  </View>

                  {/* Ordenar Produtos */}
                  <View ref={productOrderRef} className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Ordenar produtos por
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {Object.entries(productSortOptions).map(
                        ([label, value]) => (
                          <Pressable
                            key={value}
                            onPress={() =>
                              handleProductSortChange(
                                filters.productSortBy === value ? null : value
                              )
                            }
                            className={`px-3 py-2 rounded-lg border ${
                              filters.productSortBy === value
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                filters.productSortBy === value
                                  ? "text-emerald-700 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        )
                      )}
                    </View>
                  </View>

                  {/* Ordenar Leilões */}
                  <View ref={auctionOrderRef} className="mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                      Ordenar leilões por
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {Object.entries(auctionSortOptions).map(
                        ([label, value]) => (
                          <Pressable
                            key={value}
                            onPress={() =>
                              handleAuctionSortChange(
                                filters.auctionSortBy === value ? null : value
                              )
                            }
                            className={`px-3 py-2 rounded-lg border ${
                              filters.auctionSortBy === value
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                filters.auctionSortBy === value
                                  ? "text-emerald-700 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        )
                      )}
                    </View>
                  </View>
                </Box>
              </ScrollView>
            </View>

            {/* Footer */}
            <Box className="bg-white border-t border-gray-200">
              <Box className="px-4 py-3">
                <HStack className="gap-3">
                  <Pressable
                    onPress={onClearFilters}
                    className="flex-1 py-3 rounded-lg border border-gray-300 active:bg-gray-100"
                  >
                    <Text className="text-center font-semibold text-gray-700">
                      Limpar
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={onClose}
                    className="flex-[2] py-3 rounded-lg bg-emerald-700 active:bg-emerald-800"
                  >
                    <Text className="text-center font-semibold text-white">
                      Ver {resultsCount} resultados
                    </Text>
                  </Pressable>
                </HStack>
              </Box>
            </Box>
          </View>
        </KeyboardAvoidingView>
      </ActionsheetContent>
    </Actionsheet>
  );
};
