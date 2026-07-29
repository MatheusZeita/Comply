import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { SearchIcon, Clock, Zap, TrendingUp, Heart } from "lucide-react-native";

const QUICK_FILTERS = [
  { id: "all", label: "Todos", icon: Heart },
  { id: "auction", label: "Leilões ativos", icon: Clock },
  { id: "ending", label: "Terminando", icon: TrendingUp },
  { id: "buy-now", label: "Compre já", icon: Zap },
];

export default function WatchlistHeader() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box className="bg-white border-b border-gray-200 pb-3">
      {/* Título da página */}
      <Box className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900 mb-3">
          Lista de Olho
        </Text>
      </Box>

      {/* Barra de pesquisa */}
      <Box className="px-4 mb-3">
        <Input
          size="md"
          variant="outline"
          className="bg-gray-50 border-gray-200"
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} className="text-gray-400" />
          </InputSlot>
          <InputField
            placeholder="Buscar em meus favoritos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </Box>

      {/* Filtros rápidos - ScrollView horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {QUICK_FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedFilter === filter.id;

          return (
            <Pressable
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${
                isSelected
                  ? "bg-emerald-700 border-emerald-700"
                  : "bg-white border-gray-300"
              }`}
            >
              <Icon size={16} color={isSelected ? "#ffffff" : "#047857"} />
              <Text
                className={`text-sm font-semibold ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
}
