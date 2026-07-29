import React, { useState } from "react";
import { Eye, Clock, MoreVertical } from "lucide-react-native";
import { Product } from "@/types/product";
import { Pressable } from "react-native";
import { ButtonText, Button } from "./ui/button";
import { Divider } from "./ui/divider";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Box } from "./ui/box";
import { Image } from "./ui/image";
import { Text } from "./ui/text";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { AuctionCountdown } from "@/utils/auctionCountdown";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  getAuctionEnhancedInfo,
  getWatchlistCardStatus,
  WATCHLIST_ACTION_LABEL,
  WATCHLIST_ICONS,
  WatchlistProductAction,
} from "@/utils/watchlistCardUtils";
import { formatBRL } from "@/utils/formatCurrency";

interface WatchlistCardProps {
  product: Product;
  currentUserId: string;
  onPress: (id: string) => void;
  onAction: (action: WatchlistProductAction, productId: string) => void;
}

export default function WatchlistCard({
  product,
  currentUserId,
  onPress,
  onAction,
}: WatchlistCardProps) {
  const [open, setOpen] = useState(false);

  // ✅ Depois vem a lógica e computações
  const { id, title, images, watchListCount } = product;
  const listing = product.listing;
  const auctionInfo = getAuctionEnhancedInfo(product, currentUserId);
  const status = getWatchlistCardStatus(product, currentUserId);

  // Calcula as ações disponíveis
  let actions: WatchlistProductAction[] = [];
  switch (status) {
    case "PURCHASED":
      actions = ["chat", "track"];
      break;
    case "BID_WINNING":
      actions = ["increaseBid", "remove"];
      break;
    case "BID_OUTBID":
      actions = ["bid", "remove"];
      break;
    case "AUCTION_ACTIVE":
      actions = ["bid", "remove"];
      break;
    case "NO_AUCTION":
    default:
      actions = ["remove"];
      break;
  }

  const primary = actions.slice(0, 2);
  const secondary = actions.slice(2);

  // Calcula info do card
  const getCardInfo = () => {
    switch (status) {
      case "PURCHASED":
        return { label: "Você comprou este item", value: null };
      case "NO_AUCTION":
      default:
        return {
          label: "Compre já por",
          value: formatBRL(listing?.buyPrice || 0),
        };
    }
  };

  const cardInfo = getCardInfo();

  // Renderiza informações do leilão
  const renderAuctionInfo = () => {
    if (!auctionInfo) return null;

    const {
      myBidValue,
      highestBidValue,
      isOutbid,
      isWinning,
      scheduled,
      startDate,
      endDate,
      bidCount,
    } = auctionInfo;

    if (scheduled) {
      return (
        <VStack className="mt-1 gap-1">
          <HStack className="items-center gap-1">
            <Clock size={12} color="#D97706" />
            <Text className="text-xs text-amber-700 font-medium">
              {`Leilão agendado · Início: ${formatDateTime(startDate)}`}
            </Text>
          </HStack>
          <HStack className="items-center gap-1">
            <Clock size={12} color="#6B7280" />
            <Text className="text-xs text-gray-600 font-medium">
              {`Termina em ${AuctionCountdown({ endDate })}`}
            </Text>
          </HStack>
        </VStack>
      );
    }

    return (
      <VStack className="mt-1 gap-4">
        <HStack className="items-center justify-start gap-4">
          <VStack>
            <Text className="text-xs text-gray-500">Seu lance</Text>
            <Text className="text-sm font-semibold text-emerald-700">
              {myBidValue ? `${myBidValue}` : "--"}
            </Text>
          </VStack>

          <VStack>
            <Text className="text-xs text-gray-500">Lance atual</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {`${highestBidValue}`}
            </Text>
          </VStack>

          <VStack>
            <Text className="text-xs text-gray-500">Lances</Text>
            <Text className="text-sm font-medium text-gray-800">
              {bidCount}
            </Text>
          </VStack>
        </HStack>

        <HStack className="items-center gap-1 flex-wrap">
          <Clock size={12} color="#6B7280" />
          <Text className="text-xs text-gray-600 font-medium">
            {AuctionCountdown({ endDate })}
          </Text>

          {isWinning && (
            <Text className="text-xs text-emerald-700 font-medium">
              · Você está vencendo
            </Text>
          )}

          {isOutbid && (
            <Text className="text-xs text-red-600 font-medium">
              · Você foi superado
            </Text>
          )}
        </HStack>
      </VStack>
    );
  };

  return (
    <Box className="w-full mb-3 bg-white">
      <Pressable
        onPress={() => onPress(id)}
        className="flex-row p-4"
        accessibilityLabel={`Ver detalhes de ${title}`}
      >
        <Image
          source={
            images && images.length > 0
              ? { uri: images[0] }
              : require("@/assets/placeholders/product_placeholder.png")
          }
          alt={title}
          className="w-28 h-28 rounded-lg mr-3 bg-gray-100"
          resizeMode="cover"
        />

        <VStack className="flex-1 gap-2">
          <Text
            className="text-base font-semibold text-gray-800"
            numberOfLines={2}
          >
            {title}
          </Text>

          {cardInfo.value ? (
            <VStack className="gap-0 my-2">
              <Text className="text-sm text-gray-600">{cardInfo.label}</Text>
              <Text className="text-2xl text-emerald-700 font-normal">
                {cardInfo.value}
              </Text>
            </VStack>
          ) : (
            <Text className="text-md text-emerald-700 font-medium">
              {cardInfo.label}
            </Text>
          )}

          {(status === "AUCTION_ACTIVE" ||
            status === "BID_WINNING" ||
            status === "BID_OUTBID") &&
          auctionInfo ? (
            renderAuctionInfo()
          ) : status === "PURCHASED" ? (
            <Text className="text-sm text-gray-600">
              Entre em contato com o vendedor para mais detalhes.
            </Text>
          ) : (
            <Text className="text-sm text-gray-600">Sem leilão ativo</Text>
          )}

          <HStack className="items-center gap-1 mt-2">
            <Eye size={12} color="#6B7280" />
            <Text className="text-sm text-gray-500">{watchListCount}</Text>
          </HStack>

          {/* Actions */}
          <HStack className="items-center justify-between flex-1 mt-2">
            <HStack className="gap-3 flex-wrap">
              {primary.map((actionKey) => {
                const label = WATCHLIST_ACTION_LABEL[actionKey];
                return (
                  <Button
                    key={actionKey}
                    size="sm"
                    variant="link"
                    onPress={() => onAction(actionKey, id)}
                    className="p-0"
                  >
                    <ButtonText className="text-emerald-700 text-sm font-semibold">
                      {label}
                    </ButtonText>
                  </Button>
                );
              })}
            </HStack>

            {secondary.length > 0 && (
              <Pressable onPress={() => setOpen(true)} hitSlop={10}>
                <MoreVertical size={20} color="#6B7280" />
              </Pressable>
            )}
          </HStack>
        </VStack>
      </Pressable>

      <Divider className="bg-gray-200" />

      {/* Actionsheet para ações secundárias */}
      <Actionsheet isOpen={open} onClose={() => setOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {secondary.map((actionKey) => {
            const label = WATCHLIST_ACTION_LABEL[actionKey];
            const Icon = WATCHLIST_ICONS[actionKey];
            return (
              <ActionsheetItem
                key={actionKey}
                onPress={() => {
                  onAction(actionKey, id);
                  setOpen(false);
                }}
              >
                <Icon size={18} color="#374151" style={{ marginRight: 12 }} />
                <ActionsheetItemText className="text-gray-800 text-base">
                  {label}
                </ActionsheetItemText>
              </ActionsheetItem>
            );
          })}
        </ActionsheetContent>
      </Actionsheet>
    </Box>
  );
}
