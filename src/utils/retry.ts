import { env } from './env';
import { logger } from './logger';

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  retryOn?: (error: unknown) => boolean;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? env.retryCount();
  const delayMs = options.delayMs ?? env.retryDelayMs();
  const backoffMultiplier = options.backoffMultiplier ?? 1.5;
  const retryOn = options.retryOn ?? (() => true);

  let lastError: unknown;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts || !retryOn(error)) {
        throw error;
      }
      logger.warn(`Retry attempt ${attempt}/${maxAttempts} failed`, {
        error: error instanceof Error ? error.message : String(error),
      });
      await sleep(currentDelay);
      currentDelay = Math.floor(currentDelay * backoffMultiplier);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
