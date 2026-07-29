import { auctionsApi, type CreateAuctionParams, type NewAuctionSettingsParams, type PlaceNewBidParams } from '@/api/listings/auctions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionKeys } from './useAuctionsQueries';
import { notificationKeys } from '../notifications/useNotificationsQueries';
import { productKeys } from '../products/useProductsQueries';
import { saleKeys } from '../sales/useSalesQueries';
import Toast from 'react-native-toast-message';

export const useCreateAuctionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateAuctionParams) => auctionsApi.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            Toast.show({
                type: 'success',
                text1: 'Leilão criado com sucesso!',
                text2: 'Seu produto está disponível para lances',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao criar leilão',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const usePlaceBidMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ auctionId, params }: {
            auctionId: string;
            params: PlaceNewBidParams
        }) => auctionsApi.placeBid(auctionId, params),
        onSuccess: (_, { auctionId }) => {
            queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
            queryClient.invalidateQueries({ queryKey: auctionKeys.bids(auctionId) });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(auctionId) });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
            Toast.show({
                type: 'success',
                text1: 'Lance realizado com sucesso!',
            });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message;

            if (message?.includes('valor mínimo')) {
                Toast.show({
                    type: 'error',
                    text1: 'Lance muito baixo',
                    text2: message,
                });
            } else if (message?.includes('encerrado')) {
                Toast.show({
                    type: 'error',
                    text1: 'Leilão encerrado',
                    text2: 'Este leilão já foi finalizado',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao dar lance',
                    text2: 'Tente novamente',
                });
            }
        },
    });
};

export const useCancelAuctionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (auctionId: string) => auctionsApi.cancel(auctionId),
        onSuccess: (_, auctionId) => {
            queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
            queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            Toast.show({
                type: 'success',
                text1: 'Leilão cancelado',
                text2: 'Os participantes foram notificados',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao cancelar leilão',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useUpdateAuctionSettingsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ auctionId, params }: {
            auctionId: string;
            params: NewAuctionSettingsParams
        }) => auctionsApi.updateSettings(auctionId, params),
        onSuccess: (_, { auctionId }) => {
            queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Configurações atualizadas!',
                text2: 'As alterações já estão visíveis',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar configurações',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
