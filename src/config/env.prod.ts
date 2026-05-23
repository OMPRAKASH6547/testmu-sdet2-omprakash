import { EnvironmentConfig } from '../utils/env';

export const prodConfig: EnvironmentConfig = {
  name: 'prod',
  baseUrl: 'https://www.saucedemo.com',
  apiBaseUrl: 'https://reqres.in/api',
  maxResponseTimeMs: 3000,
  retryCount: 2,
  retryDelayMs: 1500,
  headless: true,
};
