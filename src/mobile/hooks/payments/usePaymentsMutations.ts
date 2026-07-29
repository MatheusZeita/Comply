import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentKeys } from './usePaymentsQueries';
import { paymentsApi } from '@/api/payments/payments';
import { paymentAccountKeys } from './usePaymentAccountsQueries';
import { notificationKeys } from '../notifications/useNotificationsQueries';
import Toast from 'react-native-toast-message';

export const useWithdrawAllPaymentsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => paymentsApi.withdrawAll(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: paymentKeys.all });
            queryClient.invalidateQueries({ queryKey: paymentAccountKeys.balance() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Saque realizado com sucesso!',
                text2: 'O valor será transferido para sua conta bancária',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao retirar todos os pagamentos:', error);

            const message = error.response?.data?.message;

            if (message?.includes('saldo insuficiente')) {
                Toast.show({
                    type: 'error',
                    text1: 'Saldo insuficiente',
                    text2: 'Você não possui saldo disponível para saque',
                });
            } else if (message?.includes('conta bancária')) {
                Toast.show({
                    type: 'error',
                    text1: 'Conta bancária não cadastrada',
                    text2: 'Configure sua conta bancária no Stripe primeiro',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao processar saque',
                    text2: message || 'Tente novamente em alguns instantes',
                });
            }
        },
    });
};

export const useWithdrawPaymentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentId: string) => paymentsApi.withdraw(paymentId),
        onSuccess: (_, paymentId) => {
            queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) });
            queryClient.invalidateQueries({ queryKey: paymentKeys.all });
            queryClient.invalidateQueries({ queryKey: paymentAccountKeys.balance() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Pagamento sacado com sucesso!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao retirar o pagamento:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao processar saque',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
