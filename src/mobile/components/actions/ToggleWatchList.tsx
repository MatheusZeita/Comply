import React from "react";
import { ActivityIndicator } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useWatchlistQuery } from "@/hooks/notifications/useWatchListQueries";
import {
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "@/hooks/notifications/useWatchListMutations";

interface ToggleWatchListProps {
  productId: string;
  listingId: string;
  showLabel?: boolean;
}

export default function ToggleWatchList({
  productId,
  listingId,
  showLabel = true,
}: ToggleWatchListProps) {
  const { data: myWatchlist, isFetching } = useWatchlistQuery();

  const addToWatchlist = useAddToWatchlistMutation();
  const removeFromWatchlist = useRemoveFromWatchlistMutation();

  const isWatching = myWatchlist?.includes(productId) ?? false;

  const isLoading =
    addToWatchlist.isPending || removeFromWatchlist.isPending || isFetching;

  const handleToggle = () => {
    if (isLoading) return;

    if (isWatching) {
      removeFromWatchlist.mutate({ ProductId: productId });
    } else {
      addToWatchlist.mutate({ ProductId: productId, ListingId: listingId });
    }
  };

  const Icon = isWatching ? Eye : EyeOff;
  const iconColor = isWatching ? "#059669" : "#6B7280";

  return (
    <Pressable
      disabled={isLoading}
      onPress={handleToggle}
      className={`flex justify-center items-center rounded-full p-2.5 bg-white ${
        isLoading ? "opacity-50" : "active:bg-white"
      }`}
    >
      <HStack className="items-center">
        {isLoading ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <Icon size={20} color={iconColor} />
        )}

        {showLabel && (
          <Text className="text-sm text-gray-700">
            {isWatching ? "Deixar de observar" : "Ficar de olho"}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}
