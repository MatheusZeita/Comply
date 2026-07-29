import { Product } from "@/types/product";

interface ProductCardListingData {
  title: string;
  image?: string;
  currentBid?: number;
  buyNowPrice?: number;
  endsIn?: string | null;
  hasAuction: boolean;
  auctionScheduled: boolean;
}

export function adaptProductToCardListing(
  product: Product
): ProductCardListingData {
  const listing = product.listing;
  const auction = listing?.auction;
  const auctionStatus = auction?.status;

  const hasAuction = auctionStatus === "Active" || auctionStatus === "Ending";

  const auctionScheduled = auctionStatus === "Awaiting";

  let currentBid: number | undefined;
  if (hasAuction && auction) {
    const winningBid = auction?.bids?.find(
      (bid) => bid.status === "Winning"
    )?.value;
    currentBid = winningBid ?? auction.settings.startBidValue;
  }

  const buyNowPrice = listing?.buyPrice ?? undefined;

  let endsIn: string | null = null;
  if (hasAuction && auction?.settings.endDate) {
    endsIn = auction.settings.endDate;
  } else if (auctionScheduled && auction?.settings.startDate) {
    endsIn = auction.settings.startDate;
  }

  return {
    title: product.title,
    image:
      product.images && product.images.length > 0
        ? product.images[0]
        : undefined,
    currentBid,
    buyNowPrice,
    endsIn,
    hasAuction,
    auctionScheduled,
  };
}
