import { deliveriesApi } from '@/api/sales/deliveries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryKeys } from './useDeliveriesQueries';
import { saleKeys } from './useSalesQueries';
import Toast from 'react-native-toast-message';

function parseApiError(error: any): string {
    let errorMessage = 'Erro ao processar. Tente novamente.';

    if (error?.response?.data) {
        const errorData = error.response.data;

        if (typeof errorData === 'string') {
            errorMessage = errorData;
        } else if (errorData.message) {
            errorMessage = errorData.message;
        } else if (errorData.error) {
            errorMessage = errorData.error;
        } else if (errorData.title && errorData.detail) {
            errorMessage = `${errorData.title}: ${errorData.detail}`;
        }
    }

    return errorMessage;
}

export const useMarkAsShippedMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (saleId: string) => deliveriesApi.markAsShipped(saleId),
        onSuccess: (_, saleId) => {
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
            queryClient.invalidateQueries({ queryKey: deliveryKeys.code(saleId) });

            Toast.show({
                type: 'success',
                text1: 'Produto marcado como enviado!',
                text2: 'O comprador foi notificado'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao marcar como enviado:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao marcar como enviado',
                text2: errorMessage,
            });
        },
    });
};

export const useMarkAsDeliveredMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ saleId, code }: { saleId: string; code: string }) =>
            deliveriesApi.markAsDelivered(saleId, { Code: code }),
        onSuccess: (_, { saleId }) => {
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
            queryClient.invalidateQueries({ queryKey: deliveryKeys.code(saleId) });

            Toast.show({
                type: 'success',
                text1: 'Entrega confirmada com sucesso!',
                text2: 'O pagamento foi liberado para o vendedor'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao marcar como entregue:', error);

            const errorMessage = parseApiError(error);

            if (errorMessage.toLowerCase().includes('código') || errorMessage.toLowerCase().includes('inválido')) {
                Toast.show({
                    type: 'error',
                    text1: 'Código incorreto',
                    text2: 'Verifique o código de entrega e tente novamente',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao confirmar entrega',
                    text2: errorMessage,
                });
            }
        },
    });
};
