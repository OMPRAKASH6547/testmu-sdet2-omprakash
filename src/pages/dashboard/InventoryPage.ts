import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryContainer: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = this.getByTestId('inventory-container');
    this.inventoryItems = this.page.locator('[data-test="inventory-item"]');
    this.sortDropdown = this.getByTestId('product-sort-container');
    this.shoppingCartBadge = this.getByTestId('shopping-cart-badge');
    this.shoppingCartLink = this.getByTestId('shopping-cart-link');
    this.pageTitle = this.getByTestId('title');
  }

  async isDisplayed(): Promise<boolean> {
    return this.inventoryContainer.isVisible();
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getPageTitleText(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async sortProducts(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const addButton = this.inventoryItems
      .nth(index)
      .getByRole('button', { name: 'Add to cart' });
    await addButton.click();
  }

  async getCartBadgeCount(): Promise<string | null> {
    if (await this.shoppingCartBadge.isVisible()) {
      return this.shoppingCartBadge.textContent();
    }
    return null;
  }

  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  getInventoryItems(): Locator {
    return this.inventoryItems;
  }
}
