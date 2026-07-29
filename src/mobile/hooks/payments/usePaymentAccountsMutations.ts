import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentAccountKeys } from './usePaymentAccountsQueries';
import { paymentAccountsApi } from '@/api/payments/paymentAccounts';
import Toast from 'react-native-toast-message';

export const useCreatePaymentMethodMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => paymentAccountsApi.createPaymentMethod(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: paymentAccountKeys.paymentMethods() });
        },
    });
};

export const useGetOnboardingLinkMutation = () => {
    return useMutation({
        mutationFn: () => paymentAccountsApi.getOnboardingLink(),
        onSuccess: (data) => {
            window.location.href = data.url;
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao gerar link de cadastro',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useGetDashboardLinkMutation = () => {
    return useMutation({
        mutationFn: () => paymentAccountsApi.getDashboardLink(),
        onSuccess: (data) => {
            window.open(data.url, '_blank', 'noopener,noreferrer');
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao abrir dashboard',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
