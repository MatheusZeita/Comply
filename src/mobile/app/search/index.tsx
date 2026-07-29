import React, { useState } from "react";
import { router } from "expo-router";
import { SearchIcon, X, Clock, TrendingUp } from "lucide-react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/store/features/searchSlice";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const { history, addSearchTerm, removeSearchTerm } = useSearchHistory();

  const dispatch = useDispatch();

  const trendingSearches = [
    "iPhone 13",
    "PlayStation 5",
    "Smart TV 55",
    "Cadeira Gamer",
    "Notebook Dell",
  ];

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      addSearchTerm(trimmedQuery);
      dispatch(setSearchQuery(trimmedQuery));
      router.push({
        pathname: "/(tabs)/search",
        params: { q: trimmedQuery },
      });
    }
  };

  return (
    <ScreenWrapper excludeEdges={["top"]}>
      <Box className="flex-1 bg-white">
        <Box className="p-4 border-b border-gray-200">
          <HStack className="items-center gap-2">
            <Pressable onPress={() => router.back()}>
              <Text className="text-emerald-700 text-base">Cancelar</Text>
            </Pressable>

            <Box className="flex-1">
              <Input
                className="bg-neutral-100 border-0"
                size="md"
                variant="rounded"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                  placeholder="Busque por um produto..."
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={() => handleSearch(searchText)}
                  autoFocus
                  returnKeyType="search"
                />
              </Input>
            </Box>
          </HStack>
        </Box>

        <ScrollView className="flex-1">
          <Box className="px-4 py-2">
            {history.length > 0 && (
              <VStack className="gap-1">
                {history.map((item, index) => (
                  <HStack
                    key={index}
                    className="items-center justify-between py-3"
                  >
                    <Pressable
                      onPress={() => handleSearch(item)}
                      className="flex-1"
                    >
                      <HStack className="items-center gap-3">
                        <Clock size={18} color="#6B7280" />
                        <Text className="text-gray-700 flex-1">{item}</Text>
                      </HStack>
                    </Pressable>

                    <Pressable onPress={() => removeSearchTerm(item)}>
                      <X size={16} color="#9CA3AF" />
                    </Pressable>
                  </HStack>
                ))}
              </VStack>
            )}
            <VStack className="gap-1">
              {trendingSearches.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearch(item)}
                  className="py-3"
                >
                  <HStack className="items-center gap-3">
                    <TrendingUp size={18} color="#6B7280" />
                    <Text className="text-gray-700">{item}</Text>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </Box>
        </ScrollView>
      </Box>
    </ScreenWrapper>
  );
}
