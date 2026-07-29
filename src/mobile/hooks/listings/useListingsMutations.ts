import { listingsApi, type CreateListingParams } from '@/api/listings/listings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { listingKeys } from './useListingsQueries';
import { notificationKeys } from '../notifications/useNotificationsQueries';
import { productKeys } from '../products/useProductsQueries';
import { saleKeys } from '../sales/useSalesQueries';
import Toast from 'react-native-toast-message';

export const useCreateListingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateListingParams) => listingsApi.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Anúncio criado com sucesso!',
                text2: 'Seu produto está disponível para compra',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao criar anúncio',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useToggleListingAvailabilityMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (listingId: string) => listingsApi.toggleAvailability(listingId),
        onSuccess: (data, listingId) => {
            queryClient.invalidateQueries({ queryKey: listingKeys.detail(listingId) });
            queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            const isAvailable = data.status === 'Available';
            Toast.show({
                type: 'success',
                text1: isAvailable ? 'Anúncio ativado!' : 'Anúncio pausado',
                text2: isAvailable
                    ? 'Seu produto está visível para compradores'
                    : 'Seu produto foi ocultado temporariamente',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao alterar disponibilidade',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useBuyNowMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listingId, paymentMethodId }: {
            listingId: string;
            paymentMethodId: string
        }) => listingsApi.buyNow(listingId, paymentMethodId),
        onSuccess: (_, { listingId }) => {
            queryClient.invalidateQueries({ queryKey: listingKeys.detail(listingId) });
            queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            queryClient.invalidateQueries({ queryKey: saleKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Compra realizada com sucesso!',
                text2: 'Acompanhe o status na sua área de compras',
            });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message;

            if (message?.includes('indisponível')) {
                Toast.show({
                    type: 'error',
                    text1: 'Produto indisponível',
                    text2: 'Este produto já foi vendido ou está pausado',
                });
            } else if (message?.includes('pagamento')) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro no pagamento',
                    text2: 'Verifique seu método de pagamento e tente novamente',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao finalizar compra',
                    text2: 'Tente novamente ou entre em contato com o suporte',
                });
            }
        },
    });
};

export const useUpdateListingPriceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listingId, newBuyPrice }: {
            listingId: string;
            newBuyPrice: number
        }) => listingsApi.updatePrice(listingId, newBuyPrice),
        onSuccess: (_, { listingId }) => {
            queryClient.invalidateQueries({ queryKey: listingKeys.detail(listingId) });
            queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Preço atualizado!',
                text2: 'O novo valor já está visível',
            });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message;

            if (message?.includes('mínimo')) {
                Toast.show({
                    type: 'error',
                    text1: 'Preço inválido',
                    text2: 'O preço deve ser maior que o valor mínimo',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao atualizar preço',
                    text2: 'Tente novamente',
                });
            }
        },
    });
};
