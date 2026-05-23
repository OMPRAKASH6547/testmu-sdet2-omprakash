import { Page, Locator } from '@playwright/test';
import { logger } from '../../utils/logger';
import { waitForNetworkIdle } from '../../utils/waitUtils';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  async navigate(path = ''): Promise<void> {
    const url = path.startsWith('http') ? path : path || '/';
    logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
    await waitForNetworkIdle(this.page);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}
