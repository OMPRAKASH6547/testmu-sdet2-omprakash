import { expect } from '@playwright/test';
import { AxiosResponse } from 'axios';
import { env } from './env';

export function assertStatusCode(
  response: AxiosResponse,
  expected: number | number[]
): void {
  const codes = Array.isArray(expected) ? expected : [expected];
  expect(codes).toContain(response.status);
}

export function assertResponseTime(
  response: AxiosResponse,
  maxMs: number = env.maxResponseTimeMs()
): void {
  const duration = response.headers['x-response-time-ms'];
  if (duration) {
    expect(Number(duration)).toBeLessThanOrEqual(maxMs);
    return;
  }
  const requestDuration = (response.config as { metadata?: { duration?: number } })
    .metadata?.duration;
  if (requestDuration !== undefined) {
    expect(requestDuration).toBeLessThanOrEqual(maxMs);
  }
}

export function assertResponseBodyContains(
  body: Record<string, unknown>,
  key: string,
  expectedValue?: unknown
): void {
  expect(body).toHaveProperty(key);
  if (expectedValue !== undefined) {
    expect(body[key]).toBe(expectedValue);
  }
}

export function assertArrayMinLength<T>(arr: T[], minLength: number): void {
  expect(arr.length).toBeGreaterThanOrEqual(minLength);
}

export async function assertLocatorText(
  locator: { textContent: () => Promise<string | null> },
  expected: string | RegExp
): Promise<void> {
  const text = await locator.textContent();
  if (typeof expected === 'string') {
    expect(text?.trim()).toBe(expected);
  } else {
    expect(text?.trim() ?? '').toMatch(expected);
  }
}
