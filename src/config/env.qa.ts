import { EnvironmentConfig } from '../utils/env';

export const qaConfig: EnvironmentConfig = {
  name: 'qa',
  baseUrl: 'https://www.saucedemo.com',
  apiBaseUrl: 'https://reqres.in/api',
  maxResponseTimeMs: 5000,
  retryCount: 3,
  retryDelayMs: 1000,
  headless: true,
};
