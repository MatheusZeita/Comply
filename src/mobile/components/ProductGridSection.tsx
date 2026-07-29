import React from "react";
import { ProductCardListing } from "@/components/ProductCardListing";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Link, router } from "expo-router";
import { ArrowRight, BoxIcon } from "lucide-react-native";
import { adaptProductToCardListing } from "@/utils/productCardUtils";
import { Product } from "@/types/product";
import NoItemsFound from "./NoItemsFound";

interface ProductGridSectionProps {
  title: string;
  products?: Product[];
  isLoading: boolean;
  isError: boolean;
}

export default function ProductGridSection({
  title,
  products,
  isLoading,
  isError,
}: ProductGridSectionProps) {
  if (isLoading) {
    return (
      <Box className="bg-white border border-gray-200">
        <Text className="text-lg p-4 font-semibold text-gray-800">{title}</Text>
        <Text className="p-4 text-gray-500">Carregando produtos...</Text>
      </Box>
    );
  }
  if (isError || !products) {
    return (
      <Box className="bg-white border border-gray-200">
        <Text className="text-lg p-4 font-semibold text-gray-800">{title}</Text>
        <Text className="p-4 text-red-500">Erro ao carregar produtos.</Text>
      </Box>
    );
  }

  return (
    <Box className="bg-white border border-gray-200">
      <Text className="text-lg p-4 font-semibold text-gray-800">{title}</Text>

      <Box className="flex-row flex-wrap px-1">
        {products.map((item) => {
          const cardData = adaptProductToCardListing(item);

          return (
            <Box key={item.id} className="w-[50%]">
              <ProductCardListing
                {...cardData}
                onPress={() => router.replace(`/product/${item.id}`)}
              />
            </Box>
          );
        })}
        {products.length === 0 && (
          <NoItemsFound
            Icon={BoxIcon}
            description="Não foi dessa vez, que tal anunciar um produto agora?"
            title="Nenhum produto encontrado.."
          />
        )}
      </Box>

      <Link href="/(tabs)/search" asChild>
        <Button
          size="xl"
          variant="link"
          action="secondary"
          className="flex-row items-center gap-2"
        >
          <ButtonText size="sm">Ver todas as ofertas</ButtonText>
          <ArrowRight size={16} color="#6b7280" />
        </Button>
      </Link>
    </Box>
  );
}
