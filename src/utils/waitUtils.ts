import { Page, Locator, expect } from '@playwright/test';
import { logger } from './logger';

export async function waitForNetworkIdle(page: Page, timeout = 15_000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    logger.debug('Network idle timeout — continuing');
  });
}

export async function waitForLocatorVisible(
  locator: Locator,
  timeout = 10_000
): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
}

export async function waitForLocatorHidden(
  locator: Locator,
  timeout = 10_000
): Promise<void> {
  await expect(locator).toBeHidden({ timeout });
}

export async function pollUntil<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 15_000;
  const intervalMs = options.intervalMs ?? 500;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const result = await fn();
    if (predicate(result)) return result;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`pollUntil timed out after ${timeoutMs}ms`);
}

export async function waitForUrlContains(page: Page, fragment: string): Promise<void> {
  await page.waitForURL((url) => url.href.includes(fragment));
}
