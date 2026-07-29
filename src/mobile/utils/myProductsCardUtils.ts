import { Product } from "@/types/product";
import {
  LucideIcon,
  Megaphone,
  Pause,
  Pencil,
  Play,
  Rocket,
  Truck,
  Wallet,
  XCircle,
  History,
} from "lucide-react-native";

export type CardStatus =
  | "DRAFT"
  | "PAUSED"
  | "SOLD"
  | "EXPIRED"
  | "SCHEDULED"
  | "ACTIVE_NO_AUCTION"
  | "ACTIVE_AUCTION_NO_BIDS"
  | "ACTIVE_AUCTION_WITH_BIDS"
  | "UNLISTED";

export type ProductAction =
  | "edit"
  | "pause"
  | "boost"
  | "announce"
  | "startAuction"
  | "cancelAuction"
  | "history"
  | "payment"
  | "track";

export const ACTION_LABEL: Record<ProductAction, string> = {
  edit: "Editar",
  pause: "Pausar",
  boost: "Impulsionar",
  announce: "Anunciar",
  startAuction: "Iniciar Leilão",
  cancelAuction: "Cancelar Leilão",
  history: "Histórico de Lances",
  payment: "Receber",
  track: "Acompanhar Entrega",
};

export const ICONS: Record<ProductAction, LucideIcon> = {
  edit: Pencil,
  pause: Pause,
  boost: Rocket,
  announce: Megaphone,
  startAuction: Play,
  cancelAuction: XCircle,
  history: History,
  payment: Wallet,
  track: Truck,
};

export const getCardStatus = (product: Product): CardStatus => {
  const listing = product.listing;
  const auction = listing?.auction;
  if (!listing) return "DRAFT";
  if (listing.status === "Paused") return "PAUSED";
  if (listing.status === "Sold" || listing.status === "SoldByAuction")
    return "SOLD";
  if (auction?.status === "Failed" || auction?.status === "Cancelled")
    return "EXPIRED";
  if (auction?.status === "Awaiting") return "SCHEDULED";
  if (auction && (auction.status === "Active" || auction.status === "Ending")) {
    return auction.bids && auction.bids.length > 0
      ? "ACTIVE_AUCTION_WITH_BIDS"
      : "ACTIVE_AUCTION_NO_BIDS";
  }
  return "ACTIVE_NO_AUCTION";
};

export const STATUS_DISPLAY: Record<CardStatus, string> = {
  DRAFT: "Rascunho",
  PAUSED: "Pausado",
  SOLD: "Vendido",
  EXPIRED: "Expirado",
  SCHEDULED: "Agendado",
  ACTIVE_NO_AUCTION: "Ativo",
  ACTIVE_AUCTION_NO_BIDS: "Leilão Ativo",
  ACTIVE_AUCTION_WITH_BIDS: "Leilão Ativo",
  UNLISTED: "Não Listado",
};
