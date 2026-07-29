import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { MapPin, SearchIcon, Check } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "@/store/features/citySlice";
import { useRouter } from "expo-router";

export const CITIES = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Curitiba",
  "Salvador",
  "Fortaleza",
  "Recife",
  "Porto Alegre",
  "Goiânia",
];

export default function CitySelectorScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedCity = useSelector((state: any) => state.city.selectedCity);
  const [query, setQuery] = useState("");

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(city: string) {
    dispatch(setCity(city));
    router.back();
  }

  return (
    <Box className="flex-1 bg-gray-50 p-6">
      <Input
        className="mb-5 bg-neutral-100 border-0"
        size="md"
        variant="rounded"
      >
        <InputSlot>
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Buscar cidade..."
          value={query}
          onChangeText={setQuery}
        />
      </Input>

      <ScrollView>
        <VStack className="gap-2">
          {filteredCities.map((city) => (
            <Pressable
              key={city}
              className={`p-4 rounded-lg flex-row items-center justify-between ${
                selectedCity === city
                  ? "bg-emerald-50 border-2 border-emerald-700"
                  : "bg-white"
              }`}
              onPress={() => handleSelect(city)}
            >
              <HStack className="gap-2 items-center">
                <MapPin size={18} color="#059669" />
                <Text className="text-lg text-gray-800">{city}</Text>
              </HStack>
              {selectedCity === city && <Check size={20} color={"#059669"} />}
            </Pressable>
          ))}

          {filteredCities.length === 0 && (
            <Text className="text-center text-gray-500 py-8">
              Nenhuma cidade encontrada.
            </Text>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}
