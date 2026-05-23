import { test, expect } from '../../src/fixtures/testFixtures';
import { userService } from '../../src/api/services/userService';
import { assertStatusCode } from '../../src/utils/assertions';
import apiPayloads from '../../src/test-data/apiPayloads.json';
import { logger } from '../../src/utils/logger';
import { retry } from '../../src/utils/retry';

test.describe('API + UI Integration @integration', () => {
  test('should create user via API and verify UI session with correlated test context', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    const createResponse = await retry(() =>
      userService.createUser(apiPayloads.createUser)
    );
    assertStatusCode(createResponse, 201);
    const createdUser = createResponse.data;
    logger.info('API user created', { id: createdUser.id, name: createdUser.name });

    const listResponse = await retry(() => userService.listUsers(1));
    assertStatusCode(listResponse, 200);
    expect(listResponse.data.data.length).toBeGreaterThan(0);

    await loginPage.open();
    await loginPage.login(
      process.env.STANDARD_USER || 'standard_user',
      process.env.STANDARD_PASSWORD || 'secret_sauce'
    );

    expect(await inventoryPage.isDisplayed()).toBe(true);
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);

    await inventoryPage.addProductToCartByIndex(0);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.evaluate(
      (ctx) => sessionStorage.setItem('integration-api-user', JSON.stringify(ctx)),
      { apiUserId: createdUser.id, apiUserName: createdUser.name, job: createdUser.job }
    );

    const stored = await page.evaluate(() =>
      sessionStorage.getItem('integration-api-user')
    );
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored as string);
    expect(parsed.apiUserName).toBe(createdUser.name);
    expect(parsed.job).toBe(createdUser.job);
  });

  test('should verify API user exists in list after creation', async () => {
    const uniqueName = `Integration-${Date.now()}`;
    const createResponse = await userService.createUser({
      name: uniqueName,
      job: 'Integration Tester',
    });
    assertStatusCode(createResponse, 201);
    expect(createResponse.data.name).toBe(uniqueName);

    const usersResponse = await userService.listUsers(1);
    assertStatusCode(usersResponse, 200);
    expect(usersResponse.data.data[0].email).toMatch(/@/);
  });
});
