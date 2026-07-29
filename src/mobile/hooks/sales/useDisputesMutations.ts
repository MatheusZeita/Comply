import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DisputeResolutionStatus } from '@/types/dispute';
import { disputesApi } from '@/api/sales/disputes';
import { disputeKeys } from './useDisputesQueries';
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

export const useOpenDisputeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ saleId, reason }: { saleId: string; reason: string }) =>
            disputesApi.open(saleId, { Reason: reason }),
        onSuccess: (_, { saleId }) => {
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
            queryClient.invalidateQueries({ queryKey: saleKeys.detail(saleId) });
            queryClient.invalidateQueries({ queryKey: disputeKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Disputa aberta com sucesso!',
                text2: 'Nossa equipe irá analisar o caso'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao abrir disputa:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao abrir disputa',
                text2: errorMessage,
            });
        },
    });
};

export const useCloseDisputeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            saleId,
            resolution,
            resolutionStatus
        }: {
            saleId: string;
            resolution: string;
            resolutionStatus: DisputeResolutionStatus
        }) => disputesApi.close(saleId, {
            Resolution: resolution,
            ResolutionStatus: resolutionStatus,
        }),
        onSuccess: (_, { saleId }) => {
            // Invalidar cache
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
            queryClient.invalidateQueries({ queryKey: saleKeys.detail(saleId) });
            queryClient.invalidateQueries({ queryKey: disputeKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Disputa encerrada com sucesso!',
                text2: 'As partes foram notificadas da decisão'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao encerrar disputa:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao encerrar disputa',
                text2: errorMessage,
            });
        },
    });
};

export const useAssignAdminToDisputeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (saleId: string) => disputesApi.assignAdmin(saleId),
        onSuccess: (_, saleId) => {
            queryClient.invalidateQueries({ queryKey: saleKeys.all });
            queryClient.invalidateQueries({ queryKey: saleKeys.detail(saleId) });
            queryClient.invalidateQueries({ queryKey: disputeKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Disputa atribuída com sucesso!',
                text2: 'Você agora é responsável por este caso'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao atribuir admin:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao atribuir admin',
                text2: errorMessage,
            });
        },
    });
};
