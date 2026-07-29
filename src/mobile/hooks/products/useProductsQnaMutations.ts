import { productQnaApi, type AnswerRequest, type QuestionRequest } from '@/api/products/productsQnA';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productKeys } from './useProductsQueries';
import Toast from 'react-native-toast-message';

export const useAddQuestionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, params }: { productId: string; params: QuestionRequest }) =>
            productQnaApi.addQuestion(productId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Pergunta enviada!',
                text2: 'O vendedor será notificado'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao adicionar pergunta:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao enviar pergunta',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useUpdateQuestionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            questionId,
            params
        }: {
            productId: string;
            questionId: string;
            params: QuestionRequest
        }) => productQnaApi.updateQuestion(productId, questionId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Pergunta atualizada!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao atualizar pergunta:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar pergunta',
                text2: 'Tente novamente',
            });
        },
    });
};

export const useRemoveQuestionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, questionId }: { productId: string; questionId: string }) =>
            productQnaApi.removeQuestion(productId, questionId),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Pergunta removida',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao remover pergunta:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao remover pergunta',
                text2: 'Tente novamente',
            });
        },
    });
};

export const useAnswerQuestionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            questionId,
            params
        }: {
            productId: string;
            questionId: string;
            params: AnswerRequest
        }) => productQnaApi.answerQuestion(productId, questionId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Resposta enviada!',
                text2: 'O comprador será notificado'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao responder pergunta:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao enviar resposta',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useUpdateAnswerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            questionId,
            params
        }: {
            productId: string;
            questionId: string;
            params: AnswerRequest
        }) => productQnaApi.updateAnswer(productId, questionId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Resposta atualizada!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao atualizar resposta:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar resposta',
                text2: 'Tente novamente',
            });
        },
    });
};

export const useRemoveAnswerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, questionId }: { productId: string; questionId: string }) =>
            productQnaApi.removeAnswer(productId, questionId),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Resposta removida',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao remover resposta:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao remover resposta',
                text2: 'Tente novamente',
            });
        },
    });
};
