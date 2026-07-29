import { watchlistApi, type AddToWatchlistParams, type RemoveFromWatchlistParams } from '@/api/notifications/watchLists';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistKeys } from './useWatchListQueries';
import { productKeys } from '../products/useProductsQueries';
import Toast from 'react-native-toast-message';

export const useAddToWatchlistMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: AddToWatchlistParams) => watchlistApi.add(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            Toast.show({
                type: 'success',
                text1: 'Adicionado aos favoritos!',
                text2: 'Você pode acessar na sua lista de favoritos'
            });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message;

            if (message?.includes('já existe')) {
                Toast.show({
                    type: 'error',
                    text1: 'Já está nos favoritos',
                    text2: 'Este produto já está na sua lista'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao adicionar aos favoritos',
                    text2: message || 'Tente novamente',
                });
            }
        },
    });
};

export const useRemoveFromWatchlistMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: RemoveFromWatchlistParams) => watchlistApi.remove(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            Toast.show({
                type: 'success',
                text1: 'Removido dos favoritos',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao remover dos favoritos',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useToggleWatchlistMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            productId,
            listingId,
            isCurrentlyInWatchlist
        }: {
            productId: string;
            listingId: string;
            isCurrentlyInWatchlist: boolean;
        }) => {
            if (isCurrentlyInWatchlist) {
                return watchlistApi.remove({ ProductId: productId });
            } else {
                return watchlistApi.add({ ProductId: productId, ListingId: listingId });
            }
        },
        onSuccess: (_, { isCurrentlyInWatchlist }) => {
            queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            Toast.show({
                type: 'success',
                text1: isCurrentlyInWatchlist ? 'Removido dos favoritos' : 'Adicionado aos favoritos!',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar favoritos',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
