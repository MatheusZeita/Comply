import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TicketStatus } from '@/types/ticket';
import { ticketsApi, type CreateTicketParams } from '@/api/notifications/tickets';
import { ticketKeys } from './useTicketsQueries';
import Toast from 'react-native-toast-message';

export const useCreateTicketMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateTicketParams) => ticketsApi.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.myTickets() });

            Toast.show({
                type: 'success',
                text1: 'Ticket criado com sucesso!',
                text2: 'Nossa equipe entrará em contato em breve'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao criar ticket:', error);

            let errorMessage = 'Erro ao criar ticket. Tente novamente.';

            if (error?.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            }

            Toast.show({
                type: 'error',
                text1: 'Erro ao criar ticket',
                text2: errorMessage
            });
        },
    });
};

export const useAddCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ticketId, content }: { ticketId: string; content: string }) =>
            ticketsApi.addComment(ticketId, { Content: content }),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.allTickets() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.myTickets() });

            Toast.show({
                type: 'success',
                text1: 'Comentário adicionado com sucesso!'
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao adicionar comentário',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useUpdateTicketStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ticketId, newStatus }: { ticketId: string; newStatus: TicketStatus }) =>
            ticketsApi.updateStatus(ticketId, newStatus),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.allTickets() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.myTickets() });
            Toast.show({
                type: 'success',
                text1: 'Status atualizado com sucesso!'
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar status',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
