import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class CheckoutOverviewPage extends BasePage {
  private readonly overviewContainer: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.overviewContainer = this.getByTestId('checkout-summary-container');
    this.finishButton = this.getByTestId('finish');
    this.cancelButton = this.getByTestId('cancel');
  }

  async isDisplayed(): Promise<boolean> {
    return this.overviewContainer.isVisible();
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }
}
