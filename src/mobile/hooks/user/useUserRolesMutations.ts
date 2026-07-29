import { usersRolesApi, type ChangeRoleRequest, type Role } from '@/api/user/userRoles';
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

export const useChangeUserRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, request }: { userId: string; request: ChangeRoleRequest }) =>
            usersRolesApi.changeUserRole(userId, request),
        onSuccess: (_, { userId, request }) => {
            queryClient.invalidateQueries({ queryKey: userKeys.role(userId) });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });

            const roleNames: Record<Role, string> = {
                User: 'Usuário',
                Moderator: 'Moderador',
                Admin: 'Administrador',
            };

            Toast.show({
                type: 'success',
                text1: 'Permissão atualizada!',
                text2: `Novo cargo: ${roleNames[request.NewRole]}`
            });
        },
        onError: (error: any) => {
            console.error('Erro ao alterar a role do usuário:', error);

            const errorMessage = parseApiError(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao alterar permissão',
                text2: errorMessage
            });
        },
    });
};
