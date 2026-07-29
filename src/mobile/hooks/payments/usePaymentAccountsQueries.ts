import { paymentAccountsApi } from '@/api/payments/paymentAccounts';
import type { PaymentAccountStatus, PaymentMethod } from '@/types/paymentAccount';
import { useQuery } from '@tanstack/react-query';

export const paymentAccountKeys = {
    all: ['payment-accounts'] as const,
    paymentMethods: () => [...paymentAccountKeys.all, 'payment-methods'] as const,
    balance: () => [...paymentAccountKeys.all, 'balance'] as const,
    status: () => [...paymentAccountKeys.all, 'status'] as const,
    onboardingLink: () => [...paymentAccountKeys.all, 'onboarding-link'] as const,
    dashboardLink: () => [...paymentAccountKeys.all, 'dashboard-link'] as const,
};

export const usePaymentMethodsQuery = () => {
    return useQuery<PaymentMethod[]>({
        queryKey: paymentAccountKeys.paymentMethods(),
        queryFn: () => paymentAccountsApi.getPaymentMethods(),
        staleTime: 24 * 60 * 60 * 1000,
        refetchOnMount: 'always',
    });
};

export const useCashBalanceQuery = () => {
    return useQuery<number>({
        queryKey: paymentAccountKeys.balance(),
        queryFn: () => paymentAccountsApi.getCashBalance(),
        staleTime: 12 * 60 * 60 * 1000,
        placeholderData: 0,
        refetchInterval: 5 * 60 * 1000,
    });
};

export const useSellerAccountStatusQuery = (enabled: boolean = true) => {
    return useQuery<PaymentAccountStatus>({
        queryKey: paymentAccountKeys.status(),
        queryFn: () => paymentAccountsApi.getSellerAccountStatus(),
        enabled,
        refetchOnMount: 'always',
    });
};

export const useOnboardingLinkQuery = (enabled: boolean = false) => {
    return useQuery<string>({
        queryKey: paymentAccountKeys.onboardingLink(),
        queryFn: () => paymentAccountsApi.getOnboardingLink(),
        enabled,
        refetchOnMount: 'always',
        staleTime: 0,
    });
};

export const useDashboardLinkQuery = (enabled: boolean = false) => {
    return useQuery<string>({
        queryKey: paymentAccountKeys.dashboardLink(),
        queryFn: () => paymentAccountsApi.getDashboardLink(),
        enabled,
        refetchOnMount: 'always',
        staleTime: 0,
    });
};
