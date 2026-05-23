import { AxiosResponse } from 'axios';
import { httpClient } from '../clients/httpClient';

export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
  support: { url: string; text: string };
}

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  name: string;
  job: string;
}

export class UserService {
  async listUsers(page = 1): Promise<AxiosResponse<UserListResponse>> {
    return httpClient.get<UserListResponse>('/users', { params: { page } });
  }

  async getUser(id: number): Promise<AxiosResponse<{ data: ReqResUser }>> {
    return httpClient.get<{ data: ReqResUser }>(`/users/${id}`);
  }

  async createUser(payload: CreateUserPayload): Promise<AxiosResponse<CreateUserResponse>> {
    return httpClient.post<CreateUserResponse>('/users', payload);
  }

  async updateUser(
    id: number,
    payload: UpdateUserPayload
  ): Promise<AxiosResponse<CreateUserResponse>> {
    return httpClient.put<CreateUserResponse>(`/users/${id}`, payload);
  }

  async patchUser(
    id: number,
    payload: Partial<UpdateUserPayload>
  ): Promise<AxiosResponse<CreateUserResponse>> {
    return httpClient.patch<CreateUserResponse>(`/users/${id}`, payload);
  }

  async deleteUser(id: number): Promise<AxiosResponse<void>> {
    return httpClient.delete<void>(`/users/${id}`);
  }

  async getUserNotFound(id: number): Promise<AxiosResponse<unknown>> {
    return httpClient.get(`/users/${id}`);
  }
}

export const userService = new UserService();
