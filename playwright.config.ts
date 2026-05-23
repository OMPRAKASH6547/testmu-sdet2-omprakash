import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI = !!process.env.CI;
const envName = process.env.ENV || 'qa';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: isCI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  globalSetup: undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
        environmentInfo: {
          ENV: envName,
          CI: String(isCI),
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    headless: process.env.HEADLESS !== 'false',
    testIdAttribute: 'data-test',
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'chromium',
      testIgnore: [/\.api\.spec\.ts/, /\.integration\.spec\.ts/],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: [/\.api\.spec\.ts/, /\.integration\.spec\.ts/],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: [/\.api\.spec\.ts/, /\.integration\.spec\.ts/],
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://reqres.in/api',
      },
    },
    {
      name: 'integration',
      testMatch: /.*\.integration\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  metadata: {
    environment: envName,
    framework: 'testmu-sdet2-omprakash',
  },
});
