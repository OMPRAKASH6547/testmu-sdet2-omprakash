import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class CartPage extends BasePage {
  private readonly cartList: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = this.getByTestId('cart-list');
    this.checkoutButton = this.getByTestId('checkout');
    this.continueShoppingButton = this.getByTestId('continue-shopping');
  }

  async isDisplayed(): Promise<boolean> {
    return this.cartList.isVisible();
  }

  async getCartItemCount(): Promise<number> {
    return this.page.locator('[data-test="inventory-item"]').count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
