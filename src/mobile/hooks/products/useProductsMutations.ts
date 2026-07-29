
import { productsApi, type AddImagesParams, type CreateProductParams, type ImageUrlsParams, type UpdateProductParams } from '@/api/products/products';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productKeys } from './useProductsQueries';
import { notificationKeys } from '../notifications/useNotificationsQueries';
import Toast from 'react-native-toast-message';

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ params, isTest }: { params: CreateProductParams; isTest?: boolean }) =>
            productsApi.create(params, isTest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Produto criado com sucesso!',
                text2: 'Agora você pode criar um anúncio ou leilão',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao criar produto:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao criar produto',
                text2: error.response?.data?.message || 'Verifique os dados e tente novamente',
            });
        },
    });
};

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, params }: { productId: string; params: UpdateProductParams }) =>
            productsApi.update(productId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Produto atualizado com sucesso!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao atualizar produto:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar produto',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useAddImagesMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, params }: { productId: string; params: AddImagesParams }) =>
            productsApi.addImages(productId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Imagens adicionadas com sucesso!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao adicionar imagens:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao adicionar imagens',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};

export const useReorderImagesMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, params }: { productId: string; params: ImageUrlsParams }) =>
            productsApi.reorderImages(productId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Ordem das imagens atualizada!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao reordenar imagens:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao reordenar imagens',
                text2: 'Tente novamente',
            });
        },
    });
};

export const useRemoveImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, params }: { productId: string; params: ImageUrlsParams }) =>
            productsApi.removeImage(productId, params),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

            Toast.show({
                type: 'success',
                text1: 'Imagem removida!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao remover imagem:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao remover imagem',
                text2: 'Tente novamente',
            });
        },
    });
};

export const useAddFeatureMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, durationInDays }: { productId: string; durationInDays: number }) =>
            productsApi.addFeature(productId, durationInDays),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Produto destacado com sucesso!',
                text2: 'Seu produto terá maior visibilidade',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao destacar produto:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao destacar produto',
                text2: error.response?.data?.message || 'Tente novamente',
            });
        },
    });
};
