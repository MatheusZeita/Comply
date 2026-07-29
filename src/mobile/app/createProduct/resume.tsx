import { View, Text, Image, ScrollView } from "react-native";
import { Pressable } from "@/components/ui/pressable/index";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Edit, Dot, Star } from "lucide-react-native";
import { useCreationStore, ImageItem } from "../../hooks/useCreationStore";
interface ProductCreationPayload {
  title: string;
  description: string;
  condition: string;
  category: string;
  characteristics: { [key: string]: string };
  saleType: SaleType;
  normalPrice: number;
  imageUrls: string[];
  locale: string;

  startBidValue?: number;
  startDate?: string;
  endDate?: string;
}

type SaleType = "Normal" | "Auction";

const conditionMap: { [key: string]: string } = {
  New: "Novo",
  Used: "Usado",
  NotWorking: "Com Defeito",
  Refurbished: "Restaurado",
};

const categoryMap: { [key: string]: string } = {
  Electronics: "Eletrônicos",
  HomeAppliances: "Eletrodomésticos",
  FurnitureDecor: "Decoração de móveis",
  FashionBeauty: "Beleza e moda",
  Sports: "Esportes",
  Collectibles: "Colecionáveis",
  Tools: "Ferramentas",
  Games: "Jogos",
  Services: "Serviços",
  Others: "Outro",
};

const getLabelFromValue = (
  value: string | undefined,
  map: { [key: string]: string }
): string => {
  if (!value) return "Não informado";
  return map[value] || value;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

interface ResumeItemProps {
  title: string;
  value?: string;
  valueChildren?: React.ReactNode;
  onEdit: () => void;
}

const ResumeItem: React.FC<ResumeItemProps> = ({
  title,
  value,
  valueChildren,
  onEdit,
}) => (
  <View className="gap-2">
    <View className=" flex-row gap-4 items-center">
      <Text className="text-white font-semibold text-2xl">{title}</Text>
      <Pressable onPress={onEdit}>
        <Edit size={20} color="#FFFFFF" />
      </Pressable>
    </View>
    {value ? (
      <Text className="text-white font-semibold text-base">{value}</Text>
    ) : (
      <View>{valueChildren}</View>
    )}
  </View>
);

export default function Resume() {
  const { state } = useCreationStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { productDetails, pricing } = state;
  const { title, description, images, condition, category, features } =
    productDetails;
  const { saleType, normalPrice, auctionSettings } = pricing;
  const { startBidValue, startDate, endDate } = auctionSettings;
  const translatedCondition = getLabelFromValue(condition, conditionMap);
  const translatedCategory = getLabelFromValue(category, categoryMap);

  // const createProductMutation = useCreateProductMutation();
  // const createListingMutation = useCreateListingMutation();
  // const createAuctionMutation = useCreateAuctionMutation();

  // const handleProductCreation = async () => {
  //   if (!isFormValid()) {
  //     alert(
  //       "Por favor, preencha todas as informações obrigatórias para finalizar."
  //     );
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     const characteristicPayload = features.reduce(
  //       (acc: { [key: string]: string }, feature, index) => {
  //         acc[`C${index + 1}`] = feature;
  //         return acc;
  //       },
  //       {}
  //     );

  //     const imageUrls = images.map((img: ImageItem) => img.imageUrl);

  //     const productPayload = {
  //       title: title!,
  //       description: description!,
  //       characteristics: JSON.stringify(characteristicPayload),
  //       imageUrls: images.map((img: ImageItem) => img.imageUrl),
  //       condition: condition!,
  //       category: category!,
  //       locale: "pt-BR",
  //       saleType: saleType,
  //       normalPrice: normalPrice,

  //       ...(saleType === "Auction"
  //         ? {
  //             startBidValue: startBidValue,
  //             startDate: new Date(startDate!).toISOString(),
  //             endDate: new Date(endDate!).toISOString(),
  //           }
  //         : {}),
  //     };
  //     const formData = new FormData();

  //     formData.append("Title", title!);
  //     formData.append("Description", description!);
  //     formData.append("Locale", "pt-BR");
  //     formData.append("DeliveryPreference", "PickupPoint");
  //     formData.append("Characteristics", JSON.stringify(characteristicPayload));
  //     formData.append("Condition", condition!);
  //     formData.append("Category", category!);
  //     formData.append("SaleType", saleType);
  //     formData.append("NormalPrice", String(normalPrice));

  //     images.forEach((imageItem, index) => {
  //       const localUri = imageItem.imageUrl;
  //       const filename = localUri.split("/").pop();
  //       const match = /\.(\w+)$/.exec(filename || "");
  //       const type = match
  //         ? `image/${match[1] === "jpg" ? "jpeg" : match[1]}`
  //         : `image`;
  //       formData.append("ImageUrls", {
  //         uri:
  //           Platform.OS === "android"
  //             ? localUri
  //             : localUri.replace("file://", ""),
  //         name: filename,
  //         type: type,
  //       } as any);
  //     });

  //     console.log("BASE_URL sendo usada:", api.defaults.baseURL);

  //     console.log(
  //       "FULL URL sendo tentada:",
  //       api.defaults.baseURL + "/products"
  //     );

  //     const productResponse = await createProductMutation.mutateAsync({
  //       product: formData,
  //       isTest: false,
  //     });

  //     const newProductId = productResponse?.productId;

  //     if (!newProductId) {
  //       throw new Error(
  //         "Produto criado, mas ID não retornado. Verifique o ProductService."
  //       );
  //     }
  //     if (saleType === "Normal") {
  //       const listingPayload = {
  //         productId: newProductId,
  //         buyPrice: normalPrice,
  //       };
  //       await createListingMutation.mutateAsync(listingPayload as any);

  //       console.log("Listagem Normal criada com sucesso no ListingService.");
  //     } else if (saleType === "Auction") {
  //       const initialListingPayload = {
  //         productId: newProductId,
  //         buyPrice: normalPrice,
  //       };
  //       const listingResponse = await createListingMutation.mutateAsync(
  //         initialListingPayload as any
  //       );
  //       const newListingId = (listingResponse as any)?.id;

  //       if (!newListingId) {
  //         throw new Error(
  //           "Listagem criada, mas ID não retornado. Não foi possível criar o leilão."
  //         );
  //       }
  //       console.log(
  //         "Listagem Inicial criada com sucesso. Listing ID:",
  //         newListingId
  //       );

  //       const auctionPayload = {
  //         listingId: newListingId,
  //         startBidValue: startBidValue,
  //         winBidValue: normalPrice,
  //         startDate: new Date(startDate!).toISOString(),
  //         endDate: new Date(endDate!).toISOString(),
  //       };

  //       await createAuctionMutation.mutateAsync(auctionPayload as any);

  //       console.log("Leilão criado com sucesso no ListingService/Auction.");
  //     }

  //     console.log(
  //       "Produto criado com sucesso no ProductService! ID:",
  //       newProductId
  //     );

  //     console.log("Produto criado com sucesso!", productResponse);
  //     alert("Produto publicado com sucesso!");
  //     router.push("/(tabs)");
  //   } catch (error) {
  //     console.error("Erro ao criar o produto:", error);
  //     let errorMessage = "Erro desconhecido ao publicar o produto.";

  //     if (axios.isAxiosError(error) && error.response) {
  //       console.error(
  //         "Resposta de erro do servidor (400):",
  //         error.response.data
  //       );
  //       const validationErrors = error.response.data?.errors;
  //       if (validationErrors) {
  //         const firstErrorKey = Object.keys(validationErrors)[0];
  //         const firstErrorMessage = validationErrors[firstErrorKey][0];
  //         errorMessage = `Falha em ${firstErrorKey}: ${firstErrorMessage}`;
  //       } else {
  //         errorMessage =
  //           error.response.data?.title ||
  //           error.response.data?.message ||
  //           `Erro do servidor: ${error.response.status}`;
  //       }
  //     }

  //     alert(`Falha ao publicar: ${errorMessage}`);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const isFormValid = (): boolean => {
    const hasProductDetails =
      !!title &&
      !!description &&
      Array.isArray(images) &&
      images.length > 0 &&
      !!condition &&
      !!category;

    if (!hasProductDetails) {
      return false;
    }

    const hasValidPricing =
      saleType === "Normal"
        ? normalPrice > 0
        : normalPrice > 0 && startBidValue > 0 && !!startDate && !!endDate;

    return hasValidPricing;
  };

  const goToNextStep = () => {
    // handleProductCreation();
  };
  const goToPreviousStep = () => {
    router.push("/createProduct/pricing");
  };
  const goToIndex = () => {
    router.push("/createProduct");
  };
  const goToImages = () => {
    router.push("/createProduct/images");
  };
  const goToDetails = () => {
    router.push("/createProduct/details");
  };
  const goToPricing = () => {
    router.push("/createProduct/pricing");
  };

  return (
    <ScrollView
      className="bg-emerald-700"
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="bg-emerald-700 w-full p-5 gap-5">
        <View className="justify-center gap-2 mt-20 pb-5">
          <Text className="text-white font-bold text-3xl">Resumo da venda</Text>
          <Text className="text-white opacity-60 font-bold text-base">
            Confira se as informações estão corretas antes de publicar seu
            produto.
          </Text>
        </View>
        <View className="justify-center">
          <View className="gap-5">
            <ResumeItem
              title="Título do anúncio"
              value={title}
              onEdit={goToIndex}
            />
            <ResumeItem
              title="Descrição"
              value={description}
              onEdit={goToIndex}
            />
            <View className="gap-2">
              <View className=" flex-row gap-4 items-center">
                <Text className="text-white font-semibold text-2xl">
                  Imagens
                </Text>
                <Pressable onPress={goToImages}>
                  <Edit size={20} color="#FFFFFF" />
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row", gap: 8 }}
              >
                {Array.isArray(images) &&
                  images.map((item: ImageItem) => (
                    <View key={item.id} className="relative">
                      <Image
                        key={item.id}
                        source={{ uri: item.imageUrl }}
                        style={{ width: 100, height: 100, borderRadius: 8 }}
                      />
                      {item.isPrincipal && (
                        <View className="absolute bg-emerald-700/80 px-2 py-0.5 rounded-br-lg">
                          <Star size={16} color="white" fill="white" />
                        </View>
                      )}
                    </View>
                  ))}
              </ScrollView>
            </View>
            <ResumeItem
              title="Condição"
              value={translatedCondition}
              onEdit={goToDetails}
            />
            <ResumeItem
              title="Categoria"
              value={translatedCategory}
              onEdit={goToDetails}
            />
            <ResumeItem
              title="Características"
              onEdit={goToDetails}
              valueChildren={
                <>
                  {features.map((feature, index) => (
                    <View key={index} className="flex-row items-center">
                      <Dot size={50} color={"#FFFFFF"} />
                      <Text className="text-white font-semibold text-base">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </>
              }
            />
          </View>
          <View className="flex-row justify-end items-center mt-5">
            <Image
              source={require("../../assets/logo/comply-icon-white.png")}
              className="w-30 h-30"
            />
            <Text className="text-white font-bold text-base">Passo 5 de 5</Text>
          </View>
          <View className="justify-center border-t-2 border-white/10 mt-5">
            <View className="mt-10">
              <Text className="text-white font-semibold text-base">
                {saleType === "Auction"
                  ? "Valor de Venda Normal:"
                  : "Você venderá por:"}
              </Text>
              <View className=" flex-row gap-4 items-center">
                <Text className="text-white font-bold text-3xl">
                  {formatCurrency(normalPrice)}
                </Text>
                <Pressable onPress={goToPricing}>
                  <Edit size={20} color="#FFFFFF" />
                </Pressable>
              </View>
              {saleType === "Auction" && (
                <View className="mt-8 gap-4">
                  <View className="gap-2">
                    <Text className="text-white font-semibold text-base">
                      Valor Inicial do Leilão:
                    </Text>
                    <View className=" flex-row gap-4 items-center">
                      <Text className="text-white font-bold text-3xl">
                        {formatCurrency(startBidValue)}
                      </Text>
                    </View>
                  </View>
                  <View className="gap-2">
                    <Text className="text-white font-semibold text-2xl">
                      Período do Leilão:
                    </Text>
                    <Text className="text-white font-semibold text-base">
                      Duração de {formatDate(startDate)} até{" "}
                      {formatDate(endDate)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View className="flex-row w-full pb-10 mt-10 mr-10 justify-between">
              <Pressable
                onPress={goToPreviousStep}
                className="
          px-10 
          py-4 
          rounded-lg 
          items-center 
          border-2
          border-white
          shadow-md
          data-[hover=true]:bg-[#17855b]
        "
              >
                <Text className="text-white text-base font-medium">Voltar</Text>
              </Pressable>
              <Pressable
                // onPress={handleProductCreation}
                disabled={isSubmitting}
                className="
          bg-white
          px-10 
          py-4 
          rounded-lg 
          items-center 
          shadow-md
          data-[hover=true]:bg-[#17855b]
        "
              >
                <Text className="text-emerald-700 text-base font-medium">
                  {isSubmitting ? "Publicando..." : "Finalizar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
