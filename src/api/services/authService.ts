import { AxiosResponse } from 'axios';
import { httpClient } from '../clients/httpClient';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  token: string;
}

export class AuthService {
  async login(payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> {
    return httpClient.post<LoginResponse>('/login', payload);
  }

  async register(payload: RegisterPayload): Promise<AxiosResponse<RegisterResponse>> {
    return httpClient.post<RegisterResponse>('/register', payload);
  }
}

export const authService = new AuthService();
