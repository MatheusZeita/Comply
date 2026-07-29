import React from "react";
import { Box } from "./ui/box";
import { Image } from "./ui/image";
import { Text } from "./ui/text";
import { Pressable } from "./ui/pressable";
import { HStack } from "./ui/hstack";
import { Timer, Zap } from "lucide-react-native";
import { VStack } from "./ui/vstack";
import { AuctionCountdown } from "@/utils/auctionCountdown";

interface ProductCardListingsProps {
  title: string;
  image?: string;
  currentBid?: number;
  buyNowPrice?: number;
  endsIn?: string | undefined | null;
  onPress?: () => void;
  hasAuction: boolean;
  auctionScheduled: boolean;
}

export const ProductCardListing = ({
  title,
  image,
  currentBid,
  buyNowPrice,
  endsIn,
  onPress,
  hasAuction,
  auctionScheduled,
}: ProductCardListingsProps) => {
  const isAuctionActive = hasAuction;
  const isAuctionScheduled = auctionScheduled;

  return (
    <Pressable onPress={onPress} className="bg-white overflow-hidden w-full">
      <Box className="w-full bg-gray-50 items-center justify-center">
        <Image
          source={
            image
              ? { uri: image }
              : require("@/assets/placeholders/product_placeholder.png")
          }
          alt={title}
          className="w-full h-40"
          resizeMode="cover"
        />
      </Box>

      <Box className="px-3 py-2">
        <Text numberOfLines={2} className="text-[13px] font-semibold">
          {title}
        </Text>

        <Box className="mt-2">
          {isAuctionActive ? (
            <>
              <VStack className="gap-0">
                <Text className="text-[11px] text-gray-500">Último lance</Text>
                <HStack className="items-center gap-1">
                  <Image
                    source={require("@/assets/logo/comply-icon.png")}
                    className="w-4 h-4"
                    alt="Comply"
                    resizeMode="cover"
                  />
                  <Text className="text-emerald-700 font-bold text-lg">
                    R${" "}
                    {currentBid?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </HStack>
              </VStack>
              {buyNowPrice && (
                <HStack className="items-center gap-1 mt-1">
                  <Zap size={13} color="#047857" />
                  <Text className="text-[12px] text-emerald-700">
                    Compra rápida disponível
                  </Text>
                </HStack>
              )}
            </>
          ) : isAuctionScheduled ? (
            <>
              {buyNowPrice ? (
                <VStack className="gap-0">
                  <Text className="text-[11px] text-gray-500">
                    Compra rápida
                  </Text>
                  <HStack className="items-center gap-1">
                    <Zap size={13} color="#047857" />
                    <Text className="text-emerald-700 font-bold text-lg">
                      R${" "}
                      {buyNowPrice?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </HStack>
                </VStack>
              ) : (
                <HStack className="items-center gap-1 mt-1" />
              )}
            </>
          ) : (
            <>
              <VStack className="gap-0">
                <Text className="text-[11px] text-gray-500">Compra rápida</Text>
                <HStack className="items-center gap-1">
                  <Zap size={13} color="#047857" />
                  <Text className="text-emerald-700 font-bold text-lg">
                    R${" "}
                    {buyNowPrice?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </HStack>
              </VStack>
              <HStack className="items-center mt-1 mb-4">
                <Timer size={13} color="#9ca3af" />
                <Text className="text-[12px] text-gray-500 ml-1">
                  Sem leilão ativo
                </Text>
              </HStack>
            </>
          )}
        </Box>

        {(isAuctionActive || isAuctionScheduled) && endsIn && (
          <HStack className="mb-4 mt-3 items-center gap-1">
            <Timer size={13} color="#9ca3af" />
            <VStack>
              <Text className="text-[12px] text-gray-600">
                {isAuctionActive ? "Leilão acaba em:" : "Leilão começa em:"}
              </Text>
              <Text
                className={`text-[12px] text-gray-800 font-semibold ${
                  isAuctionActive
                    ? "text-emerald-700 font-bold"
                    : "text-orange-500 font-bold"
                }`}
              >
                <AuctionCountdown endDate={endsIn} />
              </Text>
            </VStack>
          </HStack>
        )}
      </Box>
    </Pressable>
  );
};
