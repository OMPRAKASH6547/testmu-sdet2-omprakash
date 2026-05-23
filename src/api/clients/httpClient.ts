import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../../utils/env';
import { logger } from '../../utils/logger';
import { setupReqresMocks, shouldUseApiMock } from '../mocks/setupReqresMocks';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: { startTime: number };
  }
}

export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL ?? env.apiBaseUrl(),
      timeout: 30_000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(process.env.API_KEY?.trim() ? { 'x-api-key': process.env.API_KEY.trim() } : {}),
      },
      validateStatus: () => true,
    });

    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.metadata = { startTime: Date.now() };
      logger.debug(`API ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
      });
      return config;
    });

    this.client.interceptors.response.use((response: AxiosResponse) => {
      const start = response.config.metadata?.startTime ?? Date.now();
      const duration = Date.now() - start;
      if (response.config.metadata) {
        (response.config.metadata as { startTime: number; duration?: number }).duration = duration;
      }
      response.headers['x-response-time-ms'] = String(duration);
      logger.debug(`API Response ${response.status}`, { duration, url: response.config.url });
      return response;
    });

    if (shouldUseApiMock()) {
      setupReqresMocks(this.client);
      logger.info('ReqRes API mock mode enabled (set API_KEY + USE_API_MOCK=false for live API)');
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const httpClient = new HttpClient();
