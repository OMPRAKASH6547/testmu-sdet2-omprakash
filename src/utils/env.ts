import * as dotenv from 'dotenv';
import * as path from 'path';
import { devConfig } from '../config/env.dev';
import { qaConfig } from '../config/env.qa';
import { prodConfig } from '../config/env.prod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  maxResponseTimeMs: number;
  retryCount: number;
  retryDelayMs: number;
  headless: boolean;
}

const configs: Record<string, EnvironmentConfig> = {
  dev: devConfig,
  qa: qaConfig,
  prod: prodConfig,
};

export function getEnvironment(): EnvironmentConfig {
  const envName = (process.env.ENV || 'qa').toLowerCase();
  return configs[envName] ?? qaConfig;
}

export function getEnvVar(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  get current() {
    return getEnvironment();
  },
  baseUrl: () => process.env.BASE_URL || getEnvironment().baseUrl,
  apiBaseUrl: () => process.env.API_BASE_URL || getEnvironment().apiBaseUrl,
  standardUser: () => getEnvVar('STANDARD_USER', 'standard_user'),
  standardPassword: () => getEnvVar('STANDARD_PASSWORD', 'secret_sauce'),
  lockedOutUser: () => getEnvVar('LOCKED_OUT_USER', 'locked_out_user'),
  invalidUser: () => getEnvVar('INVALID_USER', 'invalid_user'),
  invalidPassword: () => getEnvVar('INVALID_PASSWORD', 'wrong_password'),
  maxResponseTimeMs: () =>
    Number(getEnvVar('MAX_RESPONSE_TIME_MS', String(getEnvironment().maxResponseTimeMs))),
  retryCount: () => Number(getEnvVar('RETRY_COUNT', String(getEnvironment().retryCount))),
  retryDelayMs: () => Number(getEnvVar('RETRY_DELAY_MS', String(getEnvironment().retryDelayMs))),
};
