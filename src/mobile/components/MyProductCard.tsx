import React, { useState } from "react";
import { Eye, Rocket, MoreVertical, Clock } from "lucide-react-native";
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
import {
  ProductAction,
  ACTION_LABEL,
  getCardStatus,
  ICONS,
  STATUS_DISPLAY,
} from "@/utils/myProductsCardUtils";
import { AuctionCountdown } from "@/utils/auctionCountdown";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatBRL } from "@/utils/formatCurrency";

interface MyProductCardProps {
  product: Product;
  onPress: (id: string) => void;
  onAction: (action: ProductAction, productId: string) => void;
}

export const MyProductCard = ({
  product,
  onPress,
  onAction,
}: MyProductCardProps) => {
  const [openActionsheet, setOpenActionsheet] = useState(false);
  const { id, title, images, watchListCount, createdAt, featured } = product;
  const listing = product.listing;
  const auction = listing?.auction;

  const status = getCardStatus(product);
  const isFeatured = featured;
  const statusDisplay = STATUS_DISPLAY[status] || STATUS_DISPLAY.UNLISTED;

  const renderCardInfo = () => {
    switch (status) {
      case "SOLD":
        if (listing?.status === "SoldByAuction") {
          const winnerBid = auction?.bids?.find(
            (b) => b.status === "Winner"
          )?.value;

          return {
            label: "Arrematado por",
            value:
              winnerBid != null
                ? formatBRL(winnerBid)
                : listing?.buyPrice != null
                ? formatBRL(listing.buyPrice)
                : "N/A",
          };
        }
        return {
          label: "Vendido por",
          value:
            listing?.buyPrice != null ? formatBRL(listing.buyPrice) : "N/A",
        };

      case "SCHEDULED":
        return {
          label: "Leilão inicia em",
          value: formatDateTime(auction!.settings.startDate),
        };

      case "EXPIRED":
        return {
          label: "Preço",
          value:
            listing?.buyPrice != null ? formatBRL(listing.buyPrice) : "N/A",
        };

      case "ACTIVE_AUCTION_WITH_BIDS": {
        const winningBid = auction?.bids?.find(
          (b) => b.status === "Winning"
        )?.value;

        const currentValue =
          winningBid != null ? winningBid : auction!.settings.startBidValue;

        return {
          label: "Lance atual",
          value: formatBRL(currentValue),
        };
      }

      case "ACTIVE_AUCTION_NO_BIDS": {
        const buyNow = listing?.buyPrice;

        if (buyNow != null) {
          return {
            label: "Compre já",
            value: formatBRL(buyNow),
          };
        }

        return {
          label: "Lance inicial",
          value: formatBRL(auction!.settings.startBidValue),
        };
      }

      case "DRAFT":
        return { label: "Rascunho (Não listado)", value: null };

      case "PAUSED":
        return { label: "Anúncio Pausado", value: null };

      default: // ACTIVE_NO_AUCTION
        return {
          label: "Preço",
          value:
            listing?.buyPrice != null ? formatBRL(listing.buyPrice) : "N/A",
        };
    }
  };

  const renderAuctionInfo = () => {
    if (!auction) return null;

    const { status: auctionStatus, settings, bids } = auction;
    const { endDate, startBidValue } = settings;

    const bidCount = bids?.length || 0;
    const winningBid = bids?.find((b) => b.status === "Winning")?.value;
    const currentBidValue =
      winningBid != null ? winningBid : startBidValue ?? 0;

    if (auctionStatus === "Awaiting") {
      return (
        <VStack className="mt-1 gap-1">
          <HStack className="items-center gap-1">
            <Clock size={12} className="text-amber-500" />
            <Text className="text-xs text-amber-700 font-medium">
              Leilão agendado
            </Text>
          </HStack>
        </VStack>
      );
    }

    // Leilão ativo (Active / Ending)
    if (auctionStatus === "Active" || auctionStatus === "Ending") {
      const hasBids = bidCount > 0;

      return (
        <VStack className="mt-1 gap-4">
          <HStack className="items-center justify-start gap-4">
            {hasBids && (
              <VStack>
                <Text className="text-xs text-gray-500">Lance atual</Text>
                <Text className="text-sm font-semibold text-emerald-700">
                  {formatBRL(currentBidValue)}
                </Text>
              </VStack>
            )}

            <VStack>
              <Text className="text-xs text-gray-500">Lance inicial</Text>
              <Text className="text-sm font-semibold text-gray-800">
                {formatBRL(startBidValue)}
              </Text>
            </VStack>

            <VStack>
              <Text className="text-xs text-gray-500">Lances</Text>
              <Text className="text-sm font-medium text-gray-800">
                {bidCount}
              </Text>
            </VStack>
          </HStack>

          <HStack className="items-center gap-1">
            <Clock size={12} className="text-gray-500" />
            <Text className="text-xs text-gray-600 font-medium">
              {AuctionCountdown({ endDate })}
            </Text>
          </HStack>
        </VStack>
      );
    }

    return null;
  };

  const renderCardActions = () => {
    let actions: ProductAction[] = [];
    let announceLabel = ACTION_LABEL.announce;

    switch (status) {
      case "DRAFT":
        actions = ["announce"];
        break;
      case "PAUSED":
        announceLabel = "Ativar";
        actions = ["edit", "announce"];
        break;
      case "SOLD":
        actions = ["payment", "track"];
        break;
      case "EXPIRED":
        actions = isFeatured
          ? ["edit", "startAuction"]
          : ["edit", "startAuction", "boost"];
        break;
      case "SCHEDULED":
        actions = isFeatured
          ? ["edit", "cancelAuction"]
          : ["edit", "cancelAuction", "boost"];
        break;
      case "ACTIVE_NO_AUCTION":
        actions = isFeatured
          ? ["edit", "startAuction", "pause"]
          : ["edit", "startAuction", "pause", "boost"];
        break;
      case "ACTIVE_AUCTION_NO_BIDS":
        actions = isFeatured
          ? ["cancelAuction", "history"]
          : ["cancelAuction", "boost"];
        break;
      case "ACTIVE_AUCTION_WITH_BIDS":
        actions = isFeatured ? ["history"] : ["history", "boost"];
        break;
    }

    const primary = actions.slice(0, 2);
    const secondary = actions.slice(2);
    return (
      <>
        <HStack className="items-center justify-between flex-1">
          <Box className="flex-row gap-4 flex-1">
            {primary.map((actionKey) => {
              const label =
                actionKey === "announce"
                  ? announceLabel
                  : ACTION_LABEL[actionKey];

              return (
                <Button
                  key={actionKey}
                  size="sm"
                  variant="link"
                  onPress={() => onAction(actionKey, id)}
                  className="flex-row items-center"
                >
                  <ButtonText className="text-info-500 text-md">
                    {label}
                  </ButtonText>
                </Button>
              );
            })}
          </Box>

          {secondary.length > 0 && (
            <Pressable
              onPress={() => setOpenActionsheet(true)}
              className="p-2 rounded-lg"
            >
              <MoreVertical size={20} className="text-gray-700" />
            </Pressable>
          )}
        </HStack>

        <Actionsheet
          isOpen={openActionsheet}
          onClose={() => setOpenActionsheet(false)}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            {secondary.map((actionKey) => {
              const label =
                actionKey === "announce"
                  ? announceLabel
                  : ACTION_LABEL[actionKey];
              const Icon = ICONS[actionKey];
              return (
                <ActionsheetItem
                  key={actionKey}
                  onPress={() => {
                    onAction(actionKey, id);
                    setOpenActionsheet(false);
                  }}
                >
                  <Icon size={18} className="mr-3 text-gray-700" />
                  <ActionsheetItemText className="text-base text-gray-800">
                    {label}
                  </ActionsheetItemText>
                </ActionsheetItem>
              );
            })}
          </ActionsheetContent>
        </Actionsheet>
      </>
    );
  };

  const cardInfo = renderCardInfo();

  return (
    <Box className="w-full mb-3">
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
          className="w-40 h-full rounded-lg mr-3 bg-gray-100"
          resizeMode="cover"
        />

        <VStack className="flex-1 gap-2">
          <Text
            className="text-base font-semibold text-gray-800 flex-shrink"
            numberOfLines={2}
          >
            {title}
          </Text>

          <HStack className="items-center gap-2">
            {isFeatured && (
              <Box className="rounded-md px-2 py-1 self-start bg-emerald-700 flex-row items-center gap-1">
                <Text className="text-xs text-white font-medium">Destaque</Text>
                <Rocket size={12} color="white" />
              </Box>
            )}
            <Box className="rounded-md px-2 py-1 self-start bg-neutral-500">
              <Text className="text-xs text-white font-medium">
                {statusDisplay}
              </Text>
            </Box>
          </HStack>

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

          {(status === "ACTIVE_AUCTION_NO_BIDS" ||
            status === "ACTIVE_AUCTION_WITH_BIDS" ||
            status === "SCHEDULED") &&
            auction &&
            renderAuctionInfo()}

          <HStack className="items-center gap-1">
            <Eye size={12} className="text-gray-500" />
            <Text className="text-sm text-gray-500">{watchListCount}</Text>
          </HStack>

          <Text className="text-xs text-gray-400">
            Criado em: {new Date(createdAt).toLocaleDateString("pt-BR")}
          </Text>

          <HStack className="items-center">{renderCardActions()}</HStack>
        </VStack>
      </Pressable>
      <Divider />
    </Box>
  );
};
