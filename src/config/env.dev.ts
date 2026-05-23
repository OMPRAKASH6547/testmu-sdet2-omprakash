import { EnvironmentConfig } from '../utils/env';

export const devConfig: EnvironmentConfig = {
  name: 'dev',
  baseUrl: 'https://www.saucedemo.com',
  apiBaseUrl: 'https://reqres.in/api',
  maxResponseTimeMs: 8000,
  retryCount: 2,
  retryDelayMs: 500,
  headless: false,
};
