import { useState, useCallback, useEffect } from "react";

type SaleType = "Normal" | "Auction";

export interface ProductDetails {
  title: string;
  description: string;
  condition: string;
  category: string;
  features: string[];
  images: ImageItem[];
}

export interface ImageItem {
  id: string;
  fileName: string;
  imageUrl: string;
  isPrincipal: boolean;
}

export interface AuctionSettings {
  startBidValue: number;
  winBidValue: number;
  startDate: string;
  endDate: string;
}

export interface Pricing {
  saleType: SaleType;
  normalPrice: number;
  auctionSettings: AuctionSettings;
}

export interface CreationStoreState {
  listingId: string;
  productDetails: ProductDetails;
  pricing: Pricing;
}

export const initialProductData: CreationStoreState = {
  listingId: "00000000-0000-0000-0000-000000000001",
  productDetails: {
    title: "",
    description: "",
    condition: "Novo",
    category: "Eletrônicos",
    features: ["Garantia de 1 ano", "Frete Grátis"],
    images: [
      {
        id: "placeholder-1",
        fileName: "placeholder-1.png",
        imageUrl: "../../assets/placeholders/product_placeholder.png",
        isPrincipal: true,
      },
      {
        id: "placeholder-2",
        fileName: "placeholder-2.png",
        imageUrl: "../../assets/placeholders/product_placeholder.png",
        isPrincipal: false,
      },
    ],
  },
  pricing: {
    saleType: "Auction",
    normalPrice: 5000.0,
    auctionSettings: {
      startBidValue: 1000.0,
      winBidValue: 1200.0,
      startDate: new Date().toISOString(),
      endDate: new Date(
        new Date().getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  },
};

let store: CreationStoreState = initialProductData;

const listeners = new Set<(state: CreationStoreState) => void>();

const dispatch = (newStore: Partial<CreationStoreState>) => {
  let nextStore: CreationStoreState = {
    ...store,
    ...newStore,
  } as CreationStoreState;

  if (newStore.productDetails) {
    nextStore.productDetails = {
      ...store.productDetails,
      ...newStore.productDetails,
    };
  }
  if (newStore.pricing) {
    nextStore.pricing = {
      ...store.pricing,
      ...newStore.pricing,
    };
  }
  store = nextStore;

  listeners.forEach((listener) => listener(store));
};

export const setProductDetails = (details: Partial<ProductDetails>) =>
  dispatch({
    productDetails: {
      ...store.productDetails,
      ...details,
    },
  });

export const setProductImages = (images: ImageItem[]) =>
  dispatch({
    productDetails: {
      ...store.productDetails,
      images: images,
    },
  });

export const setPricing = (pricing: Partial<Pricing>) =>
  dispatch({
    pricing: {
      ...store.pricing,
      ...pricing,
    },
  });

export const useCreationStore = () => {
  const [state, setState] = useState(store);

  const listener = useCallback((newStore: CreationStoreState) => {
    setState(newStore);
  }, []);

  useEffect(() => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [listener]);
  return {
    state,
    dispatch,
    setProductDetails,
    setProductImages,
    setPricing,
  };
};
