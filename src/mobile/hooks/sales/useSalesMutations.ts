import { salesApi } from '@/api/sales/sales';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useCancelSaleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (saleId: string) => salesApi.cancel(saleId),
        onSuccess: (_, saleId) => {
            queryClient.invalidateQueries({ queryKey: saleKeys.detail(saleId) });
            queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: saleKeys.allSales() });

            Toast.show({
                type: 'success',
                text1: 'Venda cancelada com sucesso!',
                text2: 'O valor será estornado para o comprador'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao cancelar venda:', error);

            const errorMessage = parseApiError(error);

            if (errorMessage.toLowerCase().includes('já foi entregue')) {
                Toast.show({
                    type: 'error',
                    text1: 'Não é possível cancelar',
                    text2: 'Vendas já entregues não podem ser canceladas',
                });
            } else if (errorMessage.toLowerCase().includes('prazo')) {
                Toast.show({
                    type: 'error',
                    text1: 'Prazo expirado',
                    text2: 'O prazo para cancelamento já passou',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao cancelar venda',
                    text2: errorMessage,
                });
            }
        },
    });
};
