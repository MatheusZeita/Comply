import { userAddressesApi, type DeliveryAddressParams } from '@/api/user/usersAdresses';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressKeys } from './useUserAdressesQueries';
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
        } else if (errorData.errors) {
            // Erros de validação do ASP.NET
            const validationErrors = Object.values(errorData.errors).flat();
            errorMessage = validationErrors.join(', ');
        }
    }

    return errorMessage;
}

export const useAddAddressMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (address: DeliveryAddressParams) => userAddressesApi.add(address),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Endereço adicionado!',
                text2: 'Você pode usá-lo em suas compras'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao adicionar endereço:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao adicionar endereço',
                text2: errorMessage,
            });
        },
    });
};

export const useUpdateAddressMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ addressId, address }: { addressId: string; address: DeliveryAddressParams }) =>
            userAddressesApi.update(addressId, address),
        onSuccess: (_, { addressId }) => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
            queryClient.invalidateQueries({ queryKey: addressKeys.detail(addressId) });

            Toast.show({
                type: 'success',
                text1: 'Endereço atualizado!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao atualizar endereço:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar endereço',
                text2: errorMessage,
            });
        },
    });
};

export const useDeleteAddressMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (addressId: string) => userAddressesApi.remove(addressId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });

            Toast.show({
                type: 'success',
                text1: 'Endereço removido!',
            });
        },
        onError: (error: any) => {
            console.error('Erro ao deletar endereço:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao remover endereço',
                text2: errorMessage,
            });
        },
    });
};
