import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Badge, BadgeText } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Heart,
  Share2,
  Gavel,
  Send,
  PackageX,
  AlertCircle,
  ShieldCheck,
  CircleCheck,
  Repeat,
  Bomb,
  Wrench,
  Eye,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useProductQuery } from "@/hooks/products/useProductsQueries";
import { useAddQuestionMutation } from "@/hooks/products/useProductsQnaMutations";
import { formatBRL } from "@/utils/formatCurrency";
import { CategoriesLabels, ProductConditionLabels } from "@/types/product";
import Header from "@/components/Header";
import Toast from "react-native-toast-message";
import { AuctionChecker } from "@/utils/checkers/AuctionStatsChecker";
import { ListingChecker } from "@/utils/checkers/ListingStatsChecker";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfileQuery } from "@/hooks/user/useUsersQueries";
import { useCountdown } from "@/hooks/useCountdownHook";
import { Divider } from "@/components/ui/divider";
import ToggleWatchList from "@/components/actions/ToggleWatchList";
import ShareProduct from "@/components/actions/ShareProduct";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { isLoggedIn } = useAuth();
  const { data: user } = useMyProfileQuery(isLoggedIn);
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProductQuery(productId);
  const addQuestionMutation = useAddQuestionMutation();
  const auctionEndDate = useCountdown(
    product?.listing.auction?.settings.endDate
  );

  const [openShare, setOpenShare] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [question, setQuestion] = useState("");

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-4">Carregando produto...</Text>
        </Box>
      </ScreenWrapper>
    );
  }

  if (isError || !product) {
    return (
      <ScreenWrapper>
        <Box className="flex-1 items-center justify-center p-4">
          <PackageX size={64} color="#EF4444" />
          <Text className="text-red-500 text-center text-lg mt-4">
            Produto não encontrado
          </Text>
          <Button
            className="bg-emerald-600 rounded-lg mt-4"
            onPress={() => refetch()}
          >
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
          <Pressable onPress={() => router.back()} className="mt-2">
            <Text className="text-gray-500">Voltar</Text>
          </Pressable>
        </Box>
      </ScreenWrapper>
    );
  }

  const isOwner = user?.id === product.sellerId;
  const isSold = ListingChecker.isSold(product);
  const isPaused = ListingChecker.isPaused(product);
  const isAuctionFailed = AuctionChecker.isFailed(product);

  const isProductUnavailable = isSold || isPaused || isAuctionFailed;
  const canInteract = !isOwner && !isProductUnavailable;

  const hasAuction = product.listing?.auction;
  const isAuctionInProgress = AuctionChecker.isInProgress(product);
  const hasBuyNow = product.listing?.buyPrice;
  const currentBid = product.listing?.auction?.bids?.[0]?.value;
  const bidCount = product.listing?.auction?.bids?.length || 0;

  // ===== HANDLER PERGUNTAS =====
  const handleAddQuestion = () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login necessário",
        text2: "Você precisa estar logado para fazer perguntas",
      });
      return;
    }

    if (isOwner) {
      Toast.show({
        type: "error",
        text1: "Ação não permitida",
        text2: "Você não pode fazer perguntas no seu próprio produto",
      });
      return;
    }

    if (!question.trim()) {
      Toast.show({
        type: "error",
        text1: "Pergunta inválida",
        text2: "Digite uma pergunta válida",
      });
      return;
    }

    addQuestionMutation.mutate(
      {
        productId: product.id,
        params: { QuestionText: question },
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Pergunta enviada!",
            text2: "Notificaremos quando houver resposta",
          });
          setQuestion("");
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: "Erro ao enviar",
            text2: "Não foi possível enviar sua pergunta",
          });
        },
      }
    );
  };

  // ===== BADGE DE CONDIÇÃO =====
  const renderConditionBadge = () => {
    const badges = {
      New: { icon: CircleCheck, label: "Novo", color: "text-emerald-700" },
      Used: { icon: Repeat, label: "Usado", color: "text-gray-700" },
      NotWorking: { icon: Bomb, label: "Não funciona", color: "text-red-700" },
      Refurbished: {
        icon: Wrench,
        label: "Recondicionado",
        color: "text-blue-700",
      },
    };
    const conditionMap = ["New", "Used", "NotWorking", "Refurbished"] as const;

    const key = conditionMap[product.condition];
    const badge = badges[key];
    if (!badge) return null;

    const Icon = badge.icon;
    return (
      <Badge className="bg-gray-100 rounded-md self-start">
        <HStack className="items-center gap-1">
          <Icon size={16} color={badge.color} />
          <BadgeText className={badge.color}>{badge.label}</BadgeText>
        </HStack>
      </Badge>
    );
  };

  // ===== BADGE DE STATUS DO PRODUTO =====
  const renderProductStatusBadge = () => {
    if (isOwner) {
      return (
        <Box className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <HStack className="items-start gap-3">
            <ShieldCheck size={20} color="#2563EB" />
            <VStack className="flex-1 gap-1">
              <Text className="text-blue-800 font-semibold">
                Você é o proprietário deste produto
              </Text>
              <Pressable onPress={() => router.push("/watchList")}>
                <Text className="text-blue-600 text-xs">
                  Gerenciar em Meus Anúncios
                </Text>
              </Pressable>
            </VStack>
          </HStack>
        </Box>
      );
    }

    if (isSold) {
      return (
        <Box className="bg-gray-50 rounded-xl p-4 mb-4">
          <HStack className="items-start gap-3">
            <PackageX size={20} color="#4B5563" />
            <VStack className="flex-1 gap-1">
              <Text className="text-gray-800 font-semibold">
                Este produto foi vendido
              </Text>
              <Text className="text-gray-600 text-xs">
                {product.listing.status === "SoldByAuction"
                  ? "Leilão encerrado com sucesso"
                  : "Comprado por outro usuário"}
              </Text>
            </VStack>
          </HStack>
        </Box>
      );
    }

    if (isPaused) {
      return (
        <Box className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <HStack className="items-start gap-3">
            <AlertCircle size={20} color="#D97706" />
            <VStack className="flex-1 gap-1">
              <Text className="text-amber-800 font-semibold">
                Este produto está pausado
              </Text>
              <Text className="text-amber-600 text-xs">
                O vendedor pausou temporariamente este anúncio
              </Text>
            </VStack>
          </HStack>
        </Box>
      );
    }

    if (isAuctionFailed) {
      return (
        <Box className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <HStack className="items-start gap-3">
            <AlertCircle size={20} color="#DC2626" />
            <VStack className="flex-1 gap-1">
              <Text className="text-red-800 font-semibold">
                Leilão encerrado
              </Text>
              <Text className="text-red-600 text-xs">
                Este leilão encerrou sem lances vencedores
              </Text>
            </VStack>
          </HStack>
        </Box>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper scrollable excludeEdges={["bottom", "top"]}>
      <Header />
      <VStack className="flex-1">
        {/* ===== BADGE DE STATUS ===== */}
        <Box className="p-2">{renderProductStatusBadge()}</Box>
        {/* ===== GALERIA ===== */}
        <Box className="relative bg-white">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setCurrentImageIndex(Math.round(x / width));
            }}
            scrollEventThrottle={16}
          >
            {product.images?.map((imageUrl, index) => (
              <View
                key={index}
                className="bg-gray-200 items-center justify-center"
                style={{ width, height: width }}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          <View className="absolute bottom-3 right-3 bg-black/60 px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-medium">
              {currentImageIndex + 1}/{product.images?.length || 1}
            </Text>
          </View>

          <HStack className="absolute top-3 right-3 gap-2">
            <Pressable
              onPress={() => {
                setOpenShare(true);
              }}
              className="bg-white p-2.5 rounded-full shadow-sm"
            >
              <Share2 size={20} color="#374151" />
            </Pressable>
            <ShareProduct
              open={openShare}
              productId={product.id}
              onOpenChange={setOpenShare}
            />
            <ToggleWatchList
              listingId={product.listing.id}
              productId={product.id}
              showLabel={false}
            />
          </HStack>
        </Box>

        {/* ===== TÍTULO ===== */}
        <Box className="bg-white rounded-xl px-4 py-4">
          <Text className="text-xl font-bold text-gray-900 leading-6">
            {product.title}
          </Text>
        </Box>

        {/* ===== CONTEÚDO ===== */}
        <VStack className="bg-white px-3 py-4 gap-4">
          {/* Badge de condição */}
          {renderConditionBadge()}

          {/* ===== LEILÃO ===== */}
          {isAuctionInProgress && hasAuction && (
            <Box className=" rounded-xl">
              <VStack className="gap-3">
                <HStack className="items-center justify-between">
                  <HStack className="items-center gap-2">
                    <Gavel size={18} color="#059669" />
                    <Text className="text-emerald-700 font-semibold text-sm">
                      {currentBid ? "Lance atual" : "Faça o primeiro lance!"}
                    </Text>
                  </HStack>
                  <HStack className="items-center gap-1">
                    <Text className="text-emerald-700 text-sm  font-medium">
                      {bidCount} lance{bidCount !== 1 ? "s" : ""}
                    </Text>
                  </HStack>
                </HStack>

                <VStack className="gap-1">
                  <Text className="text-3xl font-bold text-emerald-900">
                    {currentBid
                      ? formatBRL(currentBid || 0)
                      : formatBRL(
                          product.listing.auction?.settings.startBidValue
                        )}
                  </Text>

                  <Text className="text-emerald-700 text-xs">
                    <Clock size={14} color="#059669" />
                    {"  "}
                    {auctionEndDate}
                  </Text>
                </VStack>

                <Button
                  className="bg-emerald-600 rounded-lg shadow-sm"
                  disabled={!canInteract}
                >
                  <ButtonText className="font-semibold text-white">
                    {isOwner ? "Seu produto" : "Dar Lance"}
                  </ButtonText>
                </Button>

                <Text className="text-emerald-700 text-xs text-center">
                  {product.watchListCount} pessoas estão de olho neste produto
                </Text>
              </VStack>
              <Divider className="mt-5" />
            </Box>
          )}

          {/* ===== COMPRE AGORA ===== */}
          {hasBuyNow && (
            <Box className="bg-white rounded-xl">
              <VStack className="gap-3">
                <Text>Compre agora por:</Text>
                <HStack className="items-end gap-2">
                  <Text className="text-3xl font-bold text-gray-900">
                    {formatBRL(product.listing.buyPrice)}
                  </Text>
                </HStack>

                <Button
                  className={`rounded-lg border bg-transparent shadow-none ${
                    !canInteract || isProductUnavailable
                      ? "border-gray-400"
                      : "border-emerald-600"
                  }`}
                  disabled={!canInteract}
                  variant="outline"
                >
                  <ButtonText className="text-emerald-700 font-semibold">
                    {isOwner
                      ? "Seu produto"
                      : isProductUnavailable
                      ? "Indisponível"
                      : "Comprar agora"}
                  </ButtonText>
                </Button>
              </VStack>
            </Box>
          )}

          {/* ===== DETALHES ===== */}
          <Box className="bg-white rounded-xl py-2">
            <VStack className="gap-3">
              <Text className="text-base font-bold text-gray-900">
                Detalhes:
              </Text>

              <VStack className="gap-2">
                <HStack className="justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 text-sm">Categoria</Text>
                  <Text className="text-gray-900 text-sm font-medium">
                    {CategoriesLabels[product.category] || product.category}
                  </Text>
                </HStack>

                <HStack className="justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 text-sm">Condição</Text>
                  <Text className="text-gray-900 text-sm font-medium">
                    {ProductConditionLabels[product.condition]}
                  </Text>
                </HStack>

                {product.characteristics &&
                  Object.entries(product.characteristics).map(
                    ([key, value]) => (
                      <HStack
                        key={key}
                        className="justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <Text className="text-gray-600 text-sm">{key}</Text>
                        <Text className="text-gray-900 text-sm font-medium">
                          {value as string}
                        </Text>
                      </HStack>
                    )
                  )}
              </VStack>
            </VStack>
          </Box>

          {/* ===== DESCRIÇÃO ===== */}
          <Box className="bg-white rounded-xl  py-2">
            <VStack className="gap-3">
              <Text className="text-base font-bold text-gray-900">
                Descrição
              </Text>
              <Text className="text-gray-700 text-sm leading-6">
                {product.description}
              </Text>
            </VStack>
          </Box>

          {/* ===== LOCALIDADE ===== */}
          <Box className="bg-white rounded-xl  py-2">
            <VStack className="gap-2">
              <Text className="text-base font-bold text-gray-900">
                Localidade:
              </Text>
              <HStack className="items-center gap-2">
                <MapPin size={18} color="#6B7280" />
                <Text className="text-gray-700 text-sm font-medium">
                  {product.locale}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* ===== DÚVIDAS ===== */}
          <Box className="bg-white rounded-xl  py-2">
            <VStack className="gap-4">
              <Text className="text-base font-bold text-gray-900">
                Dúvidas:
              </Text>

              {isOwner ? (
                <Box className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <HStack className="items-start gap-2">
                    <AlertCircle size={18} color="#2563EB" />
                    <Text className="text-blue-800 text-sm flex-1">
                      Você não pode fazer perguntas no seu próprio produto
                    </Text>
                  </HStack>
                </Box>
              ) : isProductUnavailable ? (
                <Box className="bg-gray-50 rounded-lg p-3">
                  <HStack className="items-start gap-2">
                    <AlertCircle size={18} color="#6B7280" />
                    <Text className="text-gray-700 text-sm flex-1">
                      Este produto não está mais disponível para perguntas
                    </Text>
                  </HStack>
                </Box>
              ) : (
                <HStack className="gap-2 flex justify-center items-center">
                  <Input className="flex-1 border-gray-300" size="sm">
                    <InputField
                      placeholder={
                        product.qna.totalQuestions > 0
                          ? "Escreva suas dúvidas..."
                          : "Seja o primeiro a perguntar..."
                      }
                      value={question}
                      onChangeText={setQuestion}
                      editable={!!user}
                      maxLength={500}
                    />
                  </Input>
                  <Button
                    className="bg-emerald-600 rounded-lg px-4"
                    onPress={handleAddQuestion}
                    disabled={
                      !user || addQuestionMutation.isPending || !question.trim()
                    }
                  >
                    {addQuestionMutation.isPending ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Send size={18} color="white" />
                    )}
                  </Button>
                </HStack>
              )}

              {product.qna.totalQuestions > 0 && (
                <Pressable
                  onPress={() =>
                    router.push(`/product/${product.id}/questions`)
                  }
                >
                  <HStack className="items-center justify-between py-2">
                    <Text className="text-emerald-700 text-sm font-medium">
                      Ver todas as perguntas
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      Total de {product.qna.totalQuestions} perguntas
                    </Text>
                  </HStack>
                </Pressable>
              )}
            </VStack>
          </Box>

          <Box className="h-6" />
        </VStack>
      </VStack>
    </ScreenWrapper>
  );
}
