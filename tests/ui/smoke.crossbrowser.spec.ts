import { test, expect } from '../../src/fixtures/testFixtures';
import { env } from '../../src/utils/env';

test.describe('Cross-browser Smoke @smoke @ui', () => {
  test('should load login page and authenticate @smoke', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await expect(loginPage.getLoginButton()).toBeVisible();
    await loginPage.login(env.standardUser(), env.standardPassword());
    expect(await inventoryPage.isDisplayed()).toBe(true);
    expect(await inventoryPage.getPageTitleText()).toBe('Products');
  });

  test('should display product inventory @smoke', async ({ authenticatedPage }) => {
    const { inventoryPage } = authenticatedPage;
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(1);
    await expect(inventoryPage.getInventoryItems().first()).toBeVisible();
  });
});
