import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class CheckoutCompletePage extends BasePage {
  private readonly completeContainer: Locator;
  private readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.completeContainer = this.getByTestId('checkout-complete-container');
    this.completeHeader = this.getByTestId('complete-header');
  }

  async isDisplayed(): Promise<boolean> {
    return this.completeContainer.isVisible();
  }

  async getHeaderText(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }
}
