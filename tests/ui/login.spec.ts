import { test, expect } from '../../src/fixtures/testFixtures';
import users from '../../src/test-data/users.json';
import { env } from '../../src/utils/env';

test.describe('Login Flow @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('should login successfully with valid credentials', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = users.validUsers[0];
    await loginPage.login(user.username, user.password);
    await expect(inventoryPage.getInventoryItems().first()).toBeVisible();
    expect(await inventoryPage.getPageTitleText()).toBe('Products');
    expect(await inventoryPage.getProductCount()).toBeGreaterThan(0);
  });

  test('should display login page elements', async ({ loginPage }) => {
    expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    await expect(loginPage.getLoginButton()).toBeVisible();
  });

  users.invalidUsers.forEach((invalidUser) => {
    test(`should reject invalid login: ${invalidUser.username}`, async ({ loginPage }) => {
      await loginPage.login(invalidUser.username, invalidUser.password);
      expect(await loginPage.isErrorVisible()).toBe(true);
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(invalidUser.expectedError);
    });
  });

  test('should block locked out user', async ({ loginPage }) => {
    const locked = users.lockedOutUser;
    await loginPage.login(locked.username, locked.password);
    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(locked.expectedError);
  });

  test('should use environment credentials for standard user', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(env.standardUser(), env.standardPassword());
    expect(await inventoryPage.isDisplayed()).toBe(true);
  });
});
