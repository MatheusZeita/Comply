import api from "../axios";

export interface RegisterParams {
    Name: string;
    Email: string;
    Password: string;
}
export interface LoginParams {
    Email: string;
    Password: string;
}
export interface AuthenticationResponse {
    Token: string;
}

export class AuthApi {
    private readonly baseUrl = "auth";

    async register(params: RegisterParams): Promise<AuthenticationResponse> {
        const { data } = await api.post(`${this.baseUrl}/register`, params);
        return { Token: data.token };
    }

    async login(params: LoginParams): Promise<AuthenticationResponse> {
        const { data } = await api.post(`${this.baseUrl}/login`, params);
        return { Token: data.token };
    }
}

export const authApi = new AuthApi();