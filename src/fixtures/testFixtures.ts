import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { InventoryPage } from '../pages/dashboard/InventoryPage';
import { CartPage } from '../pages/dashboard/CartPage';
import { CheckoutPage } from '../pages/forms/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/forms/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/forms/CheckoutCompletePage';
import { env } from '../utils/env';

type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  authenticatedPage: { loginPage: LoginPage; inventoryPage: InventoryPage };
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.open();
    await loginPage.login(env.standardUser(), env.standardPassword());
    await use({ loginPage, inventoryPage });
  },
});

export { expect } from '@playwright/test';
