import { usersApi, type UpdateProfileRequest } from '@/api/user/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from './useUsersQueries';
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

export const useUpdateMyProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: UpdateProfileRequest) => usersApi.updateMyProfile(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });

            Toast.show({
                type: 'success',
                text1: 'Perfil atualizado com sucesso!'
            });
        },
        onError: (error: any) => {
            console.error('Erro ao atualizar perfil:', error);

            const errorMessage = parseApiError(error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar perfil',
                text2: errorMessage
            });
        },
    });
};