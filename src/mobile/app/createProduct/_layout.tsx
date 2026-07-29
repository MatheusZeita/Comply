import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { productSchema } from "@/schemas/ProductSchema";
import { ProductCondition } from "@/constants/enums/createProduct";
import { ProductCategories, SaleType } from "@/constants/enums/createProduct";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const defaultValues = {
  title: "",
  description: "",
  locale: "",
  images: [],
  condition: ProductCondition[0],
  category: ProductCategories[0],
  characteristics: [],
  deliveryPreference: "",
  saleType: SaleType[0],
  buyPrice: 0,
  startBidValue: 0,
  startDate: new Date(),
  endDate: new Date(),
};

export default function CreateProductLayout() {
  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FormProvider {...methods}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="images" />
          <Stack.Screen name="details" />
          <Stack.Screen name="pricing" />
          <Stack.Screen name="resume" />
        </Stack>
      </FormProvider>
    </GestureHandlerRootView>
  );
}
