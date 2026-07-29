import { authApi, type AuthenticationResponse, type LoginParams, type RegisterParams } from '@/api/user/auth';
import { setToken } from '@/store/features/authSlice';
import { AppDispatch } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

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
            // Tratamento para erros de validação do ASP.NET
            const validationErrors = Object.values(errorData.errors).flat();
            errorMessage = validationErrors.join(', ');
        }
    }

    return errorMessage;
}

export const useRegisterMutation = () => {
    const dispatch = useDispatch<AppDispatch>();
    return useMutation<AuthenticationResponse, Error, RegisterParams>({
        mutationFn: (params) => authApi.register(params),
        onSuccess: (data) => {
            dispatch(setToken(data.Token));
            Toast.show({
                type: 'success',
                text1: 'Conta criada com sucesso!',
                text2: 'Bem-vindo! Você já pode começar a usar'
            });
        },
        onError: (error: any) => {
            console.error('Erro no registro:', error);

            const errorMessage = parseApiError(error);

            if (errorMessage.toLowerCase().includes('já existe') ||
                errorMessage.toLowerCase().includes('already exists')) {
                Toast.show({
                    type: 'error',
                    text1: 'Email já cadastrado',
                    text2: 'Este email já está em uso. Faça login ou use outro email'
                });
            } else if (errorMessage.toLowerCase().includes('senha') ||
                errorMessage.toLowerCase().includes('password')) {
                Toast.show({
                    type: 'error',
                    text1: 'Senha inválida',
                    text2: errorMessage
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao criar conta',
                    text2: errorMessage,
                });
            }
        },
    });
};

export const useLoginMutation = () => {
    const dispatch = useDispatch<AppDispatch>();
    return useMutation<AuthenticationResponse, Error, LoginParams>({
        mutationFn: (params) => authApi.login(params),
        onSuccess: (data) => {
            dispatch(setToken(data.Token));
            Toast.show({
                type: 'success',
                text1: 'Login realizado com sucesso!',
            });
        },
        onError: (error: any) => {
            console.error('Erro no login:', error);

            const errorMessage = parseApiError(error);

            // Mensagens específicas para erros comuns
            if (errorMessage.toLowerCase().includes('credenciais') ||
                errorMessage.toLowerCase().includes('inválido') ||
                errorMessage.toLowerCase().includes('incorrect') ||
                errorMessage.toLowerCase().includes('invalid')) {
                Toast.show({
                    type: 'error',
                    text1: 'Credenciais incorretas',
                    text2: 'Email ou senha incorretos. Tente novamente',
                });
            } else if (errorMessage.toLowerCase().includes('não encontrado') ||
                errorMessage.toLowerCase().includes('not found')) {
                Toast.show({
                    type: 'error',
                    text1: 'Usuário não encontrado',
                    text2: 'Esta conta não existe. Faça o cadastro primeiro',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao fazer login',
                    text2: errorMessage,
                });
            }
        },
    });
};