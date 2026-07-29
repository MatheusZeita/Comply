import { Product } from "@/types/product";
import { User } from "@/types/user";
import {
  LucideIcon,
  MessageSquare,
  ShieldQuestion,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
} from "lucide-react-native";
import { formatBRL } from "./formatCurrency";

export type WatchlistCardStatus =
  | "PURCHASED"
  | "BID_WINNING"
  | "BID_OUTBID"
  | "AUCTION_ACTIVE"
  | "NO_AUCTION";

export type WatchlistProductAction =
  | "remove"
  | "bid"
  | "increaseBid"
  | "chat"
  | "track"
  | "support";

export const WATCHLIST_ACTION_LABEL: Record<WatchlistProductAction, string> = {
  remove: "Remover",
  bid: "Dar Lance",
  increaseBid: "Aumentar Lance",
  chat: "Falar com vendedor",
  track: "Acompanhar Entrega",
  support: "Suporte",
};

export const WATCHLIST_ICONS: Record<WatchlistProductAction, LucideIcon> = {
  remove: Trash2,
  bid: Tag,
  increaseBid: TrendingUp,
  chat: MessageSquare,
  track: Truck,
  support: ShieldQuestion,
};

export const BID_STATUS_DISPLAY = {
  WINNING: {
    text: "Seu lance está vencendo",
    bg: "$green100",
    color: "$green700",
  },
  OUTBID: {
    text: "Seu lance foi superado!",
    bg: "$red100",
    color: "$red700",
  },
};

export const getWatchlistCardStatus = (
  product: Product,
  currentUserId: string
): WatchlistCardStatus => {
  const listing = product.listing;
  const auction = listing?.auction;

  if (
    listing?.buyerId === currentUserId ||
    listing?.status === "Sold" ||
    listing?.status === "SoldByAuction"
  ) {
    if (listing?.buyerId === currentUserId) {
      return "PURCHASED";
    }
  }

  if (auction && (auction.status === "Active" || auction.status === "Ending")) {
    const myBid = auction?.bids?.find((b) => b.bidderId === currentUserId);

    if (myBid) {
      if (myBid.status === "Winning") {
        return "BID_WINNING";
      }
      if (myBid.status === "Outbid") {
        return "BID_OUTBID";
      }
    }
    return "AUCTION_ACTIVE";
  }
  return "NO_AUCTION";
};

export const getAuctionEnhancedInfo = (
  product: Product,
  currentUserId: string
) => {
  const listing = product.listing;
  const auction = listing?.auction;
  if (!auction) return null;

  const myBid = auction?.bids?.find((b) => b.bidderId === currentUserId);
  const highestBid = auction?.bids?.find((b) => b.status === "Winning");

  return {
    myBidValue: formatBRL(myBid?.value) ?? null,
    highestBidValue:
      formatBRL(highestBid?.value) ?? formatBRL(auction.settings.startBidValue),
    isOutbid: myBid && myBid.status === "Outbid",
    isWinning: myBid && myBid.status === "Winning",
    scheduled: auction.status === "Awaiting",
    startDate:
      auction.status === "Awaiting" ? auction.settings.startDate : null,
    endDate: auction.settings.endDate,
    bidCount: auction?.bids?.length,
  };
};
