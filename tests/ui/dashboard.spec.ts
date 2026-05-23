import { test, expect } from '../../src/fixtures/testFixtures';
import forms from '../../src/test-data/forms.json';

test.describe('Dashboard / Inventory @ui', () => {
  test('should display inventory after login', async ({ authenticatedPage }) => {
    const { inventoryPage } = authenticatedPage;
    expect(await inventoryPage.isDisplayed()).toBe(true);
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should add product to cart and update badge', async ({
    authenticatedPage,
    page,
  }) => {
    const { inventoryPage } = authenticatedPage;
    await inventoryPage.addProductToCartByIndex(0);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('should navigate to cart with items', async ({
    authenticatedPage,
    cartPage,
  }) => {
    const { inventoryPage } = authenticatedPage;
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.addProductToCartByIndex(1);
    await inventoryPage.goToCart();
    expect(await cartPage.isDisplayed()).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  forms.sortOptions.forEach((sortOption) => {
    test(`should sort products by ${sortOption}`, async ({ authenticatedPage }) => {
      const { inventoryPage } = authenticatedPage;
      await inventoryPage.sortProducts(sortOption);
      const count = await inventoryPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });
});
