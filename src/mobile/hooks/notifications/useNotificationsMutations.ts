import { notificationsApi } from '@/api/notifications/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './useNotificationsQueries';
import Toast from 'react-native-toast-message';

export const useMarkNotificationAsReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            notificationsApi.markAsRead(notificationId),
        onSuccess: (_) => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao marcar como lida',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useMarkAllNotificationsAsReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationsApi.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Todas as notificações foram marcadas como lidas',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao marcar todas como lidas',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
