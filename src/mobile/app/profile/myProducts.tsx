import React from "react";
import { Text } from "@/components/ui/text";
import { mockProducts } from "@/mocks/productMock";
import { FlatList } from "react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MyProductCard } from "@/components/MyProductCard";

export default function MyProductsScreen() {
  const myProducts = mockProducts;

  const handleCardAction = (action: string, productId: string) => {
    console.log(`[MyProductsScreen] Ação: ${action}, ID: ${productId}`);

    switch (action) {
      case "edit":
        console.log("Lógica para EDITAR:", productId);
        // Ex: router.push(`/my-products/edit/${productId}`);
        break;

      case "pause":
        console.log("Lógica para PAUSAR:", productId);
        // Ex: mutationPause.mutate(productId);
        break;

      case "announce":
        console.log("Lógica para ATIVAR/ANUNCIAR:", productId);
        // Ex: mutationActivate.mutate(productId);
        break;

      case "boost":
        console.log("Lógica para IMPULSIONAR:", productId);
        // Ex: router.push(`/boost/${productId}`);
        break;

      case "cancelAuction":
        console.log("Lógica para CANCELAR LEILÃO:", productId);
        // Ex: mutationCancelAuction.mutate(productId);
        break;

      case "history":
        console.log("Lógica para VER HISTÓRICO:", productId);
        // Ex: router.push(`/auctions/history/${productId}`);
        break;

      case "startAuction":
        console.log("Lógica para INICIAR LEILÃO:", productId);
        // Ex: router.push(`/auctions/create/${productId}`);
        break;

      case "payment":
        console.log("Lógica para VER PAGAMENTO:", productId);
        break;

      case "track":
        console.log("Lógica para RASTREAR ENTREGA:", productId);
        break;

      default:
        console.warn(`Ação não tratada: ${action}`);
    }
  };

  return (
    <ScreenWrapper>
      <FlatList
        data={myProducts}
        keyExtractor={(item) => item.productId}
        ListHeaderComponent={
          <Text className="text-2xl font-bold mb-4 px-4">Meus Anúncios</Text>
        }
        renderItem={({ item }) => (
          <MyProductCard
            product={item}
            onPress={
              () => console.log("Navegar para o produto:", item.productId)
              // Ex: router.push(`/product/${item.productId}`)
            }
            onAction={handleCardAction}
          />
        )}
      />
    </ScreenWrapper>
  );
}
