import { productSchema } from "@/schemas/ProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function EditProductLayout() {
  const { productId } = useLocalSearchParams();
  // Hook to get product

  const isLoading = false;
  const product = {
    title: "Produto de Exemplo",
    description: "Esta é uma descrição vinda da API.",
    locale: "Rio de Janeiro",
    images: [],
    condition: "used",
    category: "celulares",
    characteristics: [],
    deliveryPreference: "correios",
    saleType: "comply",
    buyPrice: "1500",
    startBidValue: "800",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  };

  const methods = useForm({
    // Resolver (productSchema)
    mode: "onBlur",
    defaultValues: product,
  });

  useEffect(() => {
    if (product) {
      methods.reset(product as any); // CreateProductFormData
    }
  }, [product, methods]);

  if (isLoading) {
    // return LoadingScreen
  }

  return (
    <FormProvider {...methods}>
      <Stack>
        <Stack.Screen name="[productId]" options={{ headerShown: false }} />
      </Stack>
    </FormProvider>
  );
}
